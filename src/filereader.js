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
            var check_id3v2 = function(file, cb) {
                var id3v2_reader = new FileReader();
                id3v2_reader.onload = function(event) {
                    var data = event.target.result;
                    if (data.substr(0, 3) === "ID3") {
                        data = new BinaryFile(data);
                        var size = ns.ID3v2.readSynchsafeInteger32At(6, data);
                        var tags_body = file.slice(0, size);
                        cb(tags_body);
                    } else
                    if (data.substr(4, 7) === "ftypM4A") {
                        cb(file);
                    } else {
                        cb(file.slice(file.size - 1 - 128, file.size));
                    }
                };
                id3v2_reader.readAsBinaryString(file.slice(0, 28));
            };
            check_id3v2(file, function(result) {
                reader.readAsBinaryString(result);
            });
        }
    };
})(this);
