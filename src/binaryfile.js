/**
 * @constructor
 */
function BinaryFile(strData, iDataOffset, iDataLength) {
	var data = strData;
	var dataOffset = iDataOffset || 0;
	var dataLength = 0;

	this.getRawData = function() {
		return data;
	};

	if (typeof strData === "string") {
		dataLength = iDataLength || data.length;

		this.getByteAt = function(iOffset) {
			return data.charCodeAt(iOffset + dataOffset) & 0xFF;
		};
	} else if (typeof strData === "unknown") {
		dataLength = iDataLength || IEBinary_getLength(data);

		this.getByteAt = function(iOffset) {
			return IEBinary_getByteAt(data, iOffset + dataOffset);
		};
	}
    // @aadsm
    this.getBytesAt = function(iOffset, iLength) {
        var bytes = new Array(iLength);
        for( var i = 0; i < iLength; i++ ) {
            bytes[i] = this.getByteAt(iOffset+i);
        }
        return bytes;
    };

	this.getLength = function() {
		return dataLength;
	};

    // @aadsm
    this.isBitSetAt = function(iOffset, iBit) {
        var iByte = this.getByteAt(iOffset);
        return (iByte & (1 << iBit)) != 0;
    };

	this.getSByteAt = function(iOffset) {
		var iByte = this.getByteAt(iOffset);
		if (iByte > 127)
			return iByte - 256;
		else
			return iByte;
	};

	this.getShortAt = function(iOffset, bBigEndian) {
		var iShort = bBigEndian ?
			(this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
			: (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
		if (iShort < 0) iShort += 65536;
		return iShort;
	};
	this.getSShortAt = function(iOffset, bBigEndian) {
		var iUShort = this.getShortAt(iOffset, bBigEndian);
		if (iUShort > 32767)
			return iUShort - 65536;
		else
			return iUShort;
	};
	this.getLongAt = function(iOffset, bBigEndian) {
        var byts = this.getBytesAt(iOffset, 4);
        var iByte1 = byts[0] & 0xff,
            iByte2 = byts[1] & 0xff,
            iByte3 = byts[2] & 0xff,
            iByte4 = byts[3] & 0xff;

		var iLong = bBigEndian ?
			(((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
			: (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
		if (iLong < 0) iLong += 4294967296;
		return iLong;
	};
	this.getSLongAt = function(iOffset, bBigEndian) {
		var iULong = this.getLongAt(iOffset, bBigEndian);
		if (iULong > 2147483647)
			return iULong - 4294967296;
		else
			return iULong;
	};
	// @aadsm
	this.getInteger24At = function(iOffset, bBigEndian) {
        var byts = this.getBytesAt(iOffset, 3);
        var iByte1 = byts[0] & 0xff,
            iByte2 = byts[1] & 0xff,
            iByte3 = byts[2] & 0xff;

		var iInteger = bBigEndian ?
			((((iByte1 << 8) + iByte2) << 8) + iByte3)
			: ((((iByte3 << 8) + iByte2) << 8) + iByte1);
		if (iInteger < 0) iInteger += 16777216;
		return iInteger;
    };
	this.getStringAt = function(iOffset, iLength) {
        var aStr = new Array(iLength);
        var byts = this.getBytesAt(iOffset, iLength);
        for (var j = 0; j < iLength; j++) {
            aStr[j] = String.fromCharCode(byts[j] & 0xff);
		}
		return aStr.join("");
	};
	// @aadsm
	this.getStringWithCharsetAt = function(iOffset, iLength, iCharset) {
		var bytes = this.getBytesAt(iOffset, iLength);
		var sString;

		switch( iCharset.toLowerCase() ) {
		    case 'utf-16':
		    case 'utf-16le':
		    case 'utf-16be':
		        sString = StringUtils.readUTF16String(bytes, iCharset);
		        break;

		    case 'utf-8':
		        sString = StringUtils.readUTF8String(bytes);
		        break;
            case 'iso-8859-1':
                sString = StringUtils.readISO_8859_1String(bytes);
                break;
		    default:
		        sString = StringUtils.readNullTerminatedString(bytes);
		        break;
		}

		return sString;
	};

    this.decodeString = function(offset, length, encoding, advance) {
        var b1, b2, b3, b4, bom, c, end, littleEndian, nullEnd, pt, result, w1, w2;
        encoding = encoding.toLowerCase();
        nullEnd = length === null ? 0 : -1;
        if (length == null) {
            length = Infinity;
        }
        end = offset + length;
        result = '';
        switch (encoding) {
            case 'iso-8859-1':
            case 'ascii':
            case 'latin1':
                while (offset < end && (c = this.getByteAt(offset++)) !== nullEnd) {
                    result += String.fromCharCode(c);
                }
                break;
            case 'utf8':
            case 'utf-8':
                while (offset < end && (b1 = this.getByteAt(offset++)) !== nullEnd) {
                    if ((b1 & 0x80) === 0) {
                        result += String.fromCharCode(b1);
                    } else if ((b1 & 0xe0) === 0xc0) {
                        b2 = this.getByteAt(offset++) & 0x3f;
                        result += String.fromCharCode(((b1 & 0x1f) << 6) | b2);
                    } else if ((b1 & 0xf0) === 0xe0) {
                        b2 = this.getByteAt(offset++) & 0x3f;
                        b3 = this.getByteAt(offset++) & 0x3f;
                        result += String.fromCharCode(((b1 & 0x0f) << 12) | (b2 << 6) | b3);
                    } else if ((b1 & 0xf8) === 0xf0) {
                        b2 = this.getByteAt(offset++) & 0x3f;
                        b3 = this.getByteAt(offset++) & 0x3f;
                        b4 = this.getByteAt(offset++) & 0x3f;
                        pt = (((b1 & 0x0f) << 18) | (b2 << 12) | (b3 << 6) | b4) - 0x10000;
                        result += String.fromCharCode(0xd800 + (pt >> 10), 0xdc00 + (pt & 0x3ff));
                    }
                }
                break;
            case 'utf16-be':
            case 'utf16be':
            case 'utf-16':
            case 'utf16le':
            case 'utf16-le':
            case 'utf16bom':
            case 'utf16-bom':
                switch (encoding) {
                    case 'utf16be':
                    case 'utf16-be':
                        littleEndian = false;
                        break;
                    case 'utf16le':
                    case 'utf16-le':
                        littleEndian = true;
                        break;
                    case 'utf16bom':
                    case 'utf16-bom':
                        if (length < 2 || (bom = this.getShortAt(offset)) === nullEnd) {
                            /*
                            if (advance) {
                                this.advance(offset += 2);
                            }
                            */
                            return result;
                        }
                        littleEndian = bom === 0xfffe;
                        offset += 2;
                }
                while (offset < end && (w1 = this.getShortAt(offset, littleEndian)) !== nullEnd) {
                    offset += 2;
                    if (w1 < 0xd800 || w1 > 0xdfff) {
                        result += String.fromCharCode(w1);
                    } else {
                        if (w1 > 0xdbff) {
                            throw new Error("Invalid utf16 sequence.");
                        }
                        w2 = this.getShortAt(offset, littleEndian);
                        if (w2 < 0xdc00 || w2 > 0xdfff) {
                            throw new Error("Invalid utf16 sequence.");
                        }
                        result += String.fromCharCode(w1, w2);
                        offset += 2;
                    }
                }
                if (w1 === nullEnd) {
                    offset += 2;
                }
                break;
            default:
                // throw new Error("Unknown encoding: " + encoding);
                result = this.getStringWithCharsetAt(offset, length, encoding);
                offset+= result.length;
        }
        /*
        if (advance) {
            this.advance(offset);
        }
        */
        return [result,offset];
    };

    this.readString = function(offset, length, encoding) {
        if (encoding == null) {
            encoding = 'ascii';
        }
        return this.decodeString(offset, length, encoding, true);
    };

	this.getCharAt = function(iOffset) {
		return String.fromCharCode(this.getByteAt(iOffset));
	};
	this.toBase64 = function() {
		return window.btoa(data);
	};
	this.fromBase64 = function(strBase64) {
		data = window.atob(strBase64);
	};

    this.loadRange = function(range, callback) {
        callback();
    };
}

var js = document.createElement('script');
js.type = 'text/vbscript';
js.textContent = "Function IEBinary_getByteAt(strBinary, iOffset)\r\n" +
    "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n" +
    "End Function\r\n" +
    "Function IEBinary_getLength(strBinary)\r\n" +
    "	IEBinary_getLength = LenB(strBinary)\r\n" +
    "End Function\r\n";
document.getElementsByTagName('head')[0].appendChild(js);