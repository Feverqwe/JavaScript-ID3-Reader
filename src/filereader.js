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
            var isID3v2 = true;
            reader.onprogress = function(event) {
                if (isID3v2 === false || event.target.result.length < 28) {
                    return;
                }
                isID3v2 = (event.target.result.substr(0, 3) === "ID3");
                if (isID3v2) {
                    var data = new BinaryFile(event.target.result);
                    var size = ns.ID3v2.readSynchsafeInteger32At(6, data);
                    if (size > 0) {
                        fncCallback(data);
                        event.target.abort();
                    }
                }
            };
            reader.readAsBinaryString(file);
        }
    };
})(this);
