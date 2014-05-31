var BufferedFileReader = function(file, fncCallback, fncError) {
    /**
     * @class Reads a remote file without having to download it all.
     *
     * Creates a new BufferedBinaryFile that will download chunks of the file pointed by the URL given only on a per need basis.
     *
     * @param {string} strUrl The URL with the location of the file to be read.
     * @param {number} iLength The size of the file.
     * @param {number} [blockSize=2048] The size of the chunk that will be downloaded when data is read.
     * @param {number} [blockRadius=0] The number of chunks, immediately after and before the chunk needed, that will also be downloaded.
     *
     * @constructor
     * @augments BinaryFile
     */
    var BufferedBinaryFile = function(file, iLength, blockSize, blockRadius) {
        var undefined;
        var downloadedBytesCount = 0;
        var binaryFile = new BinaryFile("", 0, iLength);
        var dataFile = new Uint8Array(iLength);
        var gotDataRange = [];
        var inRange = function(value) {
            var ex = 0;
            gotDataRange.forEach(function(item) {
                if (value >= item[0] && value < item[1]) {
                    ex = 1;
                    return 0;
                }
            });
            return ex;
        };

        /**
         * @param {?function()} callback If a function is passed then this function will be asynchronous and the callback invoked when the blocks have been loaded, otherwise it blocks script execution until the request is completed.
         */
        var waitForBlocks = function(range, callback) {
            while (inRange(range[0]) !== 0) {
                range[0]++;
                if (range[0] > range[1])
                    return callback ? callback() : undefined;
            }
            while (inRange(range[1]) !== 0) {
                range[1]--;
                if (range[0] > range[1])
                    return callback ? callback() : undefined;
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                //console.log("Got range:", range);
                gotDataRange.push(range);
                var bytes = new Uint8Array(event.target.result);
                dataFile.set(bytes, range[0]);
                downloadedBytesCount += range[1] - range[0] + 1;
                if (callback)
                    callback();
            };
            reader.readAsArrayBuffer(file.slice(range[0], range[1]));
        };

        // Mixin all BinaryFile's methods.
        // Not using prototype linking since the constructor needs to know
        // the length of the file.
        for (var key in binaryFile) {
            if (binaryFile.hasOwnProperty(key) &&
                typeof binaryFile[key] === "function") {
                this[key] = binaryFile[key];
            }
        }

        /**
         * @override
         */
        this.getByteAt = function(offset) {
            var data = dataFile[offset];
            /*if (inRange(offset) === 0) {
             console.log("Data don't loaded:", offset, dataFile[offset]);
             }*/
            return data;
        };
        this.getBytesAt = function(iOffset, iLength) {
            return dataFile.subarray(iOffset, iOffset + iLength);
        };

        /**
         * Gets the number of total bytes that have been downloaded.
         *
         * @returns The number of total bytes that have been downloaded.
         */
        this.getDownloadedBytesCount = function() {
            return downloadedBytesCount;
        };

        /**
         * Downloads the byte range given. Useful for preloading.
         *
         * @param {Array} range Two element array that denotes the first byte to be read on the first position and the last byte to be read on the last position. A range of [2, 5] will download bytes 2,3,4 and 5.
         * @param {?function()} callback The function to invoke when the blocks have been downloaded, this makes this call asynchronous.
         */
        this.loadRange = function(range, callback) {
            waitForBlocks(range, callback);
        };
    };
    fncCallback(new BufferedBinaryFile(file, file.size));
};