/**
 * Copyright (c) 2010 António Afonso, antonio.afonso gmail, http://www.aadsm.net/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 */

(function(ns) {
    ns["FileAPIReader"] = function(file, opt_reader) {
        return function(url, fncCallback, fncError) {
            var reader = opt_reader || new FileReader();

            reader.onload = function(event) {
                var result = event.target.result;
                fncCallback(new BinaryFile(result));
            };
            var isID3v2 = null;
            var size = null;
            reader.onprogress = function(event) {
                if (isID3v2 === false || event.target.result.length < 28) {
                    return;
                }
                if (isID3v2 === null) {
                    isID3v2 = (event.target.result.substr(0, 3) === "ID3");
                }
                var data = null;
                if (isID3v2) {
                    if (size === null) {
                        data = new BinaryFile(event.target.result);
                        size = parseInt(ns.ID3v2.readSynchsafeInteger32At(6, data));
                        if (isNaN(size)) {
                            size = null;
                        }
                    }
                    if (event.loaded >= size) {
                        if (data === null) {
                            data = new BinaryFile(event.target.result);
                        }
                        event.target.abort();
                        isID3v2 = false;
                        reader.onload = undefined;
                        reader.onprogress = undefined;
                        fncCallback(data);
                    }
                }
            };
            reader.readAsBinaryString(file);
        }
    };
})(this);
