set CLOSURE_COMPILER=..\3pm-player\compiler.jar
java -jar "%CLOSURE_COMPILER%"^
 --js src\stringutils.js^
 --js src\binaryfile.js^
 --js src\bufferedfilereader.js^
 --js src\id3.js^
 --js src\id3v1.js^
 --js src\id3v2.js^
 --js src\id3v2frames.js^
 --js src\id4.js^
 --js_output_file dist\id3-minimized.js

 :: --js src\bufferedbinaryajax.js^
:: --js src\filereader.js^
