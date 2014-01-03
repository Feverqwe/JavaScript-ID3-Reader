var StringUtils={readUTF16String:function(d,f,c){var b=0,e=1,a=0;c=Math.min(c||d.length,d.length);254===d[0]&&255===d[1]?(f=!0,b=2):255===d[0]&&254===d[1]&&(f=!1,b=2);f&&(e=0,a=1);f=Array(c);for(var k=0;b<c;k++){var g=d[b+e],l=(g<<8)+d[b+a],b=b+2;if(0===l)break;else 216>g||224<=g?f[k]=String.fromCharCode(l):(g=(d[b+e]<<8)+d[b+a],b+=2,f[k]=String.fromCharCode(l,g))}d=new String(f.join(""));d.bytesReadCount=b;return d},readUTF8String:function(d,f){var c=0;f=Math.min(f||d.length,d.length);239===d[0]&&
187===d[1]&&191===d[2]&&(c=3);for(var b=Array(f),e=0;c<f;e++){var a=d[c++];if(0===a)break;else if(128>a)b[e]=String.fromCharCode(a);else if(194<=a&&224>a){var k=d[c++];b[e]=String.fromCharCode(((a&31)<<6)+(k&63))}else if(224<=a&&240>a){var k=d[c++],g=d[c++];b[e]=String.fromCharCode(((a&255)<<12)+((k&63)<<6)+(g&63))}else if(240<=a&&245>a){var k=d[c++],g=d[c++],l=d[c++],a=((a&7)<<18)+((k&63)<<12)+((g&63)<<6)+(l&63)-65536;b[e]=String.fromCharCode((a>>10)+55296,(a&1023)+56320)}}b=new String(b.join(""));
b.bytesReadCount=c;return b},readISO_8859_1String:function(d,f){var c=unescape(NaN);f=f||d.length;for(var b=Array(f),e=0;e<f;){var a=d[e++];if(0===a)break;var k=b,g=e-1;a=192<=a&&255>=a?String.fromCharCode(a-192+1040):128<=a&&191>=a?c.charAt(a-128):String.fromCharCode(a);k[g]=a}c=new String(b.join(""));c.bytesReadCount=e;return c},readNullTerminatedString:function(d,f){f=f||d.length;for(var c=Array(f),b=0;b<f;){var e=d[b++];if(0===e)break;c[b-1]=String.fromCharCode(e)}c=new String(c.join(""));c.bytesReadCount=
b;return c}};function BinaryFile(d,f,c){var b=d,e=f||0,a=0;this.getRawData=function(){return b};"string"===typeof d?(a=c||b.length,this.getByteAt=function(a){return b.charCodeAt(a+e)&255}):"unknown"==typeof d&&(a=c||IEBinary_getLength(b),this.getByteAt=function(a){return IEBinary_getByteAt(b,a+e)});this.getBytesAt=function(a,c){for(var b=Array(c),e=0;e<c;e++)b[e]=this.getByteAt(a+e);return b};this.getLength=function(){return a};this.isBitSetAt=function(a,c){return 0!=(this.getByteAt(a)&1<<c)};this.getSByteAt=
function(a){a=this.getByteAt(a);return 127<a?a-256:a};this.getShortAt=function(a,c){var b=c?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);0>b&&(b+=65536);return b};this.getSShortAt=function(a,c){var b=this.getShortAt(a,c);return 32767<b?b-65536:b};this.getLongAt=function(a,c){var b=this.getBytesAt(a,4),e=b[0]&255,d=b[1]&255,f=b[2]&255,b=b[3]&255,e=c?(((e<<8)+d<<8)+f<<8)+b:(((b<<8)+f<<8)+d<<8)+e;0>e&&(e+=4294967296);return e};this.getSLongAt=function(a,b){var c=
this.getLongAt(a,b);return 2147483647<c?c-4294967296:c};this.getInteger24At=function(a,b){var c=this.getBytesAt(a,3),e=c[0]&255,d=c[1]&255,c=c[2]&255,e=b?((e<<8)+d<<8)+c:((c<<8)+d<<8)+e;0>e&&(e+=16777216);return e};this.getStringAt=function(a,c){for(var b=Array(c),e=this.getBytesAt(a,c),d=0;d<c;d++)b[d]=String.fromCharCode(e[d]&255);return b.join("")};this.getStringWithCharsetAt=function(a,c,b){a=this.getBytesAt(a,c);switch(b.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":b=StringUtils.readUTF16String(a,
b);break;case "utf-8":b=StringUtils.readUTF8String(a);break;case "iso-8859-1":b=StringUtils.readISO_8859_1String(a);break;default:b=StringUtils.readNullTerminatedString(a)}return b};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};this.toBase64=function(){return window.btoa(b)};this.fromBase64=function(a){b=window.atob(a)};this.loadRange=function(a,b){b()}}document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n\x3c/script>\r\n");var BufferedBinaryAjax=function(d,f,c){function b(a,b,c,d,k,f,u){var h=e();h?("undefined"===typeof u&&(u=!0),b&&("undefined"!=typeof h.onload?h.onload=function(){"200"==h.status||"206"==h.status?(h.fileSize=f||h.getResponseHeader("Content-Length"),b(h)):c&&c();h=null}:h.onreadystatechange=function(){4==h.readyState&&("200"==h.status||"206"==h.status?(h.fileSize=f||h.getResponseHeader("Content-Length"),b(h)):c&&c(),h=null)}),h.open("GET",a,u),h.overrideMimeType&&h.overrideMimeType("text/plain; charset=x-user-defined"),
d&&k&&h.setRequestHeader("Range","bytes="+d[0]+"-"+d[1]),h.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),h.send(null)):c&&c()}function e(){var a=null;window.XMLHttpRequest?a=new XMLHttpRequest:window.ActiveXObject&&(a=new ActiveXObject("Microsoft.XMLHTTP"));return a}function a(a,c,b){var d=e();d?(c&&("undefined"!=typeof d.onload?d.onload=function(){"200"==d.status?c(this):b&&b();d=null}:d.onreadystatechange=function(){4==d.readyState&&("200"==d.status?c(this):b&&b(),d=null)}),
d.open("HEAD",a,!0),d.send(null)):b&&b()}function k(a,e,d,k){function f(a){var b=~~(a[0]/d)-k;a=~~(a[1]/d)+1+k;0>b&&(b=0);a>=blockTotal&&(a=blockTotal-1);return[b,a]}function p(k,f){for(;s[k[0]];)if(k[0]++,k[0]>k[1])return f?f():u;for(;s[k[1]];)if(k[1]--,k[0]>k[1])return f?f():u;var m=[k[0]*d,(k[1]+1)*d-1];b(a,function(a){parseInt(a.getResponseHeader("Content-Length"),10)==e&&(k[0]=0,k[1]=blockTotal-1,m[0]=0,m[1]=e-1);a={data:a.responseBody||a.responseText,offset:m[0]};for(var b=k[0];b<=k[1];b++)s[b]=
a;h+=m[1]-m[0]+1;f&&f()},c,m,"bytes",u,!!f)}var u,h=0,m=new BinaryFile("",0,e),s=[];d=d||2048;k="undefined"===typeof k?0:k;blockTotal=~~((e-1)/d)+1;for(var q in m)m.hasOwnProperty(q)&&"function"===typeof m[q]&&(this[q]=m[q]);this.getByteAt=function(a){var b;b=f([a,a]);p(b);b=s[~~(a/d)];if("string"==typeof b.data)return b.data.charCodeAt(a-b.offset)&255;if("unknown"==typeof b.data)return IEBinary_getByteAt(b.data,a-b.offset)};this.getDownloadedBytesCount=function(){return h};this.loadRange=function(a,
b){var c=f(a);p(c,b)}}(function(){a(d,function(a){a=parseInt(a.getResponseHeader("Content-Length"),10)||-1;f(new k(d,a))})})()};(function(d){d.FileAPIReader=function(d,c){return function(b,e,a){b=c||new FileReader;b.onload=function(a){e(new BinaryFile(a.target.result))};b.readAsBinaryString(d)}}})(this);var BufferedBinaryFileReader=function(d,f,c){f(new function(b,c,a,d){var g=0;a=new BinaryFile("",0,c);var f=new Uint8Array(c),n=[],t=function(a){var b=0;n.forEach(function(c){if(a>=c[0]&&a<c[1])return b=1,0});return b},r=function(a,c){for(;0!==t(a[0]);)if(a[0]++,a[0]>a[1])return c?c():void 0;for(;0!==t(a[1]);)if(a[1]--,a[0]>a[1])return c?c():void 0;var e=new FileReader;e.onload=function(b){n.push(a);b=new Uint8Array(b.target.result);f.set(b,a[0]);g+=a[1]-a[0]+1;c&&c()};e.readAsArrayBuffer(b.slice(a[0],
a[1]))},p;for(p in a)a.hasOwnProperty(p)&&"function"===typeof a[p]&&(this[p]=a[p]);this.getByteAt=function(a){return f[a]};this.getBytesAt=function(a,b){return f.subarray(a,a+b)};this.getDownloadedBytesCount=function(){return g};this.loadRange=function(a,b){r(a,b)}}(d,d.size))};(function(d){function f(a){return"ftypM4A"==a.getStringAt(4,7)?ID4:"ID3"==a.getStringAt(0,3)?ID3v2:ID3v1}var c=d.ID3={},b={},e=[0,11];c.clearTags=function(a){delete b[a]};c.clearAll=function(){b={}};c.loadTags=function(a,c,d){d=d||{};(d.file?BufferedBinaryFileReader:d.dataReader||BufferedBinaryAjax)(d.file||a,function(l){l.loadRange(e,function(){var e=f(l);e.loadData(l,function(){var f=d.tags,r=e.readTagsFromData(l,f),f=b[a]||{},p;for(p in r)r.hasOwnProperty(p)&&(f[p]=r[p]);b[a]=f;c&&c()})})})};c.getAllTags=
function(a){if(!b[a])return null;var c={},e;for(e in b[a])b[a].hasOwnProperty(e)&&(c[e]=b[a][e]);return c};c.getTag=function(a,c){return b[a]?b[a][c]:null};d.ID3=d.ID3;c.loadTags=c.loadTags;c.getAllTags=c.getAllTags;c.getTag=c.getTag;c.clearTags=c.clearTags;c.clearAll=c.clearAll})(this);(function(d){var f=d.ID3v1={},c="Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";");
f.loadData=function(b,c){var a=b.getLength();b.loadRange([a-128-1,a],c)};f.readTagsFromData=function(b){var e=b.getLength()-128;if("TAG"==b.getStringAt(e,3)){var a=b.getStringAt(e+3,30).replace(/\0/g,""),d=b.getStringAt(e+33,30).replace(/\0/g,""),f=b.getStringAt(e+63,30).replace(/\0/g,""),l=b.getStringAt(e+93,4).replace(/\0/g,"");if(0==b.getByteAt(e+97+28))var n=b.getStringAt(e+97,28).replace(/\0/g,""),t=b.getByteAt(e+97+29);else n="",t=0;b=b.getByteAt(e+97+30);return{version:"1.1",title:a,artist:d,
album:f,year:l,comment:n,track:t,genre:255>b?c[b]:""}}return{}};d.ID3v1=d.ID3v1})(this);(function(d){function f(a,b){var c=b.getByteAt(a),e=b.getByteAt(a+1),d=b.getByteAt(a+2);return b.getByteAt(a+3)&127|(d&127)<<7|(e&127)<<14|(c&127)<<21}var c=d.ID3v2={};c.readFrameData={};c.frames={BUF:"Recommended buffer size",CNT:"Play counter",COM:"Comments",CRA:"Audio encryption",CRM:"Encrypted meta frame",ETC:"Event timing codes",EQU:"Equalization",GEO:"General encapsulated object",IPL:"Involved people list",LNK:"Linked information",MCI:"Music CD Identifier",MLL:"MPEG location lookup table",PIC:"Attached picture",
POP:"Popularimeter",REV:"Reverb",RVA:"Relative volume adjustment",SLT:"Synchronized lyric/text",STC:"Synced tempo codes",TAL:"Album/Movie/Show title",TBP:"BPM (Beats Per Minute)",TCM:"Composer",TCO:"Content type",TCR:"Copyright message",TDA:"Date",TDY:"Playlist delay",TEN:"Encoded by",TFT:"File type",TIM:"Time",TKE:"Initial key",TLA:"Language(s)",TLE:"Length",TMT:"Media type",TOA:"Original artist(s)/performer(s)",TOF:"Original filename",TOL:"Original Lyricist(s)/text writer(s)",TOR:"Original release year",
TOT:"Original album/Movie/Show title",TP1:"Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",TP2:"Band/Orchestra/Accompaniment",TP3:"Conductor/Performer refinement",TP4:"Interpreted, remixed, or otherwise modified by",TPA:"Part of a set",TPB:"Publisher",TRC:"ISRC (International Standard Recording Code)",TRD:"Recording dates",TRK:"Track number/Position in set",TSI:"Size",TSS:"Software/hardware and settings used for encoding",TT1:"Content group description",TT2:"Title/Songname/Content description",
TT3:"Subtitle/Description refinement",TXT:"Lyricist/text writer",TXX:"User defined text information frame",TYE:"Year",UFI:"Unique file identifier",ULT:"Unsychronized lyric/text transcription",WAF:"Official audio file webpage",WAR:"Official artist/performer webpage",WAS:"Official audio source webpage",WCM:"Commercial information",WCP:"Copyright/Legal information",WPB:"Publishers official webpage",WXX:"User defined URL link frame",AENC:"Audio encryption",APIC:"Attached picture",COMM:"Comments",COMR:"Commercial frame",
ENCR:"Encryption method registration",EQUA:"Equalization",ETCO:"Event timing codes",GEOB:"General encapsulated object",GRID:"Group identification registration",IPLS:"Involved people list",LINK:"Linked information",MCDI:"Music CD identifier",MLLT:"MPEG location lookup table",OWNE:"Ownership frame",PRIV:"Private frame",PCNT:"Play counter",POPM:"Popularimeter",POSS:"Position synchronisation frame",RBUF:"Recommended buffer size",RVAD:"Relative volume adjustment",RVRB:"Reverb",SYLT:"Synchronized lyric/text",
SYTC:"Synchronized tempo codes",TALB:"Album/Movie/Show title",TBPM:"BPM (beats per minute)",TCOM:"Composer",TCON:"Content type",TCOP:"Copyright message",TDAT:"Date",TDLY:"Playlist delay",TENC:"Encoded by",TEXT:"Lyricist/Text writer",TFLT:"File type",TIME:"Time",TIT1:"Content group description",TIT2:"Title/songname/content description",TIT3:"Subtitle/Description refinement",TKEY:"Initial key",TLAN:"Language(s)",TLEN:"Length",TMED:"Media type",TOAL:"Original album/movie/show title",TOFN:"Original filename",
TOLY:"Original lyricist(s)/text writer(s)",TOPE:"Original artist(s)/performer(s)",TORY:"Original release year",TOWN:"File owner/licensee",TPE1:"Lead performer(s)/Soloist(s)",TPE2:"Band/orchestra/accompaniment",TPE3:"Conductor/performer refinement",TPE4:"Interpreted, remixed, or otherwise modified by",TPOS:"Part of a set",TPUB:"Publisher",TRCK:"Track number/Position in set",TRDA:"Recording dates",TRSN:"Internet radio station name",TRSO:"Internet radio station owner",TSIZ:"Size",TSRC:"ISRC (international standard recording code)",
TSSE:"Software/Hardware and settings used for encoding",TYER:"Year",TXXX:"User defined text information frame",UFID:"Unique file identifier",USER:"Terms of use",USLT:"Unsychronized lyric/text transcription",WCOM:"Commercial information",WCOP:"Copyright/Legal information",WOAF:"Official audio file webpage",WOAR:"Official artist/performer webpage",WOAS:"Official audio source webpage",WORS:"Official internet radio station homepage",WPAY:"Payment",WPUB:"Publishers official webpage",WXXX:"User defined URL link frame"};
var b={title:["TIT2","TT2"],artist:["TPE1","TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON","TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},e=["title","artist","album","track"];c.loadData=function(a,b){a.loadRange([6,9],function(){a.loadRange([0,f(6,a)],b)})};c.readTagsFromData=function(a,d){var g=0,l=a.getByteAt(g+3);if(4<l)return{version:">2.4"};var n=a.getByteAt(g+4),t=a.isBitSetAt(g+5,7),r=a.isBitSetAt(g+5,6),p=a.isBitSetAt(g+5,5),
u=f(g+6,a),g=g+10;if(r)var h=a.getLongAt(g,!0),g=g+(h+4);var l={version:"2."+l+"."+n,major:l,revision:n,flags:{unsynchronisation:t,extended_header:r,experimental_indicator:p},size:u},m;if(t)m={};else{for(var u=u-10,t=a,n={},r=l.major,p=d||e,h=[],s=0,q;q=p[s];s++)h=h.concat(b[q]||[q]);for(p=h;g<u;){h=null;s=t;q=g;var v=null;switch(r){case 2:m=s.getStringAt(q,3);var w=s.getInteger24At(q+3,!0),y=6;break;case 3:m=s.getStringAt(q,4);w=s.getLongAt(q+4,!0);y=10;break;case 4:m=s.getStringAt(q,4),w=f(q+4,
s),y=10}if(""==m)break;g+=y+w;if(!(0>p.indexOf(m))){if(2<r)var v=s,x=q+8,v={message:{tag_alter_preservation:v.isBitSetAt(x,6),file_alter_preservation:v.isBitSetAt(x,5),read_only:v.isBitSetAt(x,4)},format:{grouping_identity:v.isBitSetAt(x+1,7),compression:v.isBitSetAt(x+1,3),encription:v.isBitSetAt(x+1,2),unsynchronisation:v.isBitSetAt(x+1,1),data_length_indicator:v.isBitSetAt(x+1,0)}};q+=y;v&&v.format.data_length_indicator&&(f(q,s),q+=4,w-=4);v&&v.format.unsynchronisation||(void 0!==c.readFrameData[m]?
h=c.readFrameData[m]:"T"==m[0]&&(h=c.readFrameData["T*"]),h=h?h(q,w,s,v):void 0,h={id:m,size:w,description:void 0!==c.frames[m]?c.frames[m]:"Unknown",data:h},void 0!==n[m]?(n[m].id&&(n[m]=[n[m]]),n[m].push(h)):n[m]=h)}}m=n}for(var z in b)if(b.hasOwnProperty(z)){a:{w=b[z];"string"===typeof w&&(w=[w]);y=0;for(g=void 0;g=w[y];y++)if(void 0!==m[g]){a=m[g].data;break a}a=void 0}a&&(l[z]=a)}for(var A in m)m.hasOwnProperty(A)&&(l[A]=m[A]);return l};d.ID3v2=c})(this);(function(){function d(c){var b;switch(c){case 0:b="iso-8859-1";break;case 1:b="utf-16";break;case 2:b="utf-16be";break;case 3:b="utf-8"}return b}var f="32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";");
ID3v2.readFrameData.APIC=function(c,b,e,a,k){k=k||"3";a=c;var g=d(e.getByteAt(c));switch(k){case "2":var l=e.getStringAt(c+1,3);c+=4;break;case "3":case "4":l=e.getStringWithCharsetAt(c+1,b-(c-a),g),c+=1+l.bytesReadCount}k=e.getByteAt(c,1);k=f[k];g=e.getStringWithCharsetAt(c+1,b-(c-a),g);c+=1+g.bytesReadCount;return{format:l.toString(),type:k,description:g.toString(),data:e.getBytesAt(c,a+b-c)}};ID3v2.readFrameData.COMM=function(c,b,e){var a=c,f=d(e.getByteAt(c)),g=e.getStringAt(c+1,3),l=e.getStringWithCharsetAt(c+
4,b-4,f);c+=4+l.bytesReadCount;c=e.getStringWithCharsetAt(c,a+b-c,f);return{language:g,short_description:l.toString(),text:c.toString()}};ID3v2.readFrameData.COM=ID3v2.readFrameData.COMM;ID3v2.readFrameData.PIC=function(c,b,e,a){return ID3v2.readFrameData.APIC(c,b,e,a,"2")};ID3v2.readFrameData.PCNT=function(c,b,e){return e.getInteger32At(c)};ID3v2.readFrameData.CNT=ID3v2.readFrameData.PCNT;ID3v2.readFrameData["T*"]=function(c,b,e){var a=d(e.getByteAt(c));return e.getStringWithCharsetAt(c+1,b-1,a).toString()};
ID3v2.readFrameData.TCON=function(c,b,e){return ID3v2.readFrameData["T*"].apply(this,arguments).replace(/^\(\d+\)/,"")};ID3v2.readFrameData.TCO=ID3v2.readFrameData.TCON;ID3v2.readFrameData.USLT=function(c,b,e){var a=c,f=d(e.getByteAt(c)),g=e.getStringAt(c+1,3),l=e.getStringWithCharsetAt(c+4,b-4,f);c+=4+l.bytesReadCount;c=e.getStringWithCharsetAt(c,a+b-c,f);return{language:g,descriptor:l.toString(),lyrics:c.toString()}};ID3v2.readFrameData.ULT=ID3v2.readFrameData.USLT})();(function(d){function f(c,a,d,g){var l=c.getLongAt(a,!0);if(0===l||isNaN(l))return g();var n=c.getStringAt(a+4,4);-1<["moov","udta","meta","ilst"].indexOf(n)?("meta"==n&&(a+=4),c.loadRange([a+8,a+8+8],function(){f(c,a+8,l-8,g)})):c.loadRange([a+(void 0!==b.atom[n]?0:l),a+l+8],function(){f(c,a+l,d,g)})}function c(d,a,f,g,l){l=void 0===l?"":l+"  ";for(var n=f;n<f+g;){var t=a.getLongAt(n,!0);if(0==t||isNaN(t))break;var r=a.getStringAt(n+4,4);if(-1<["moov","udta","meta","ilst"].indexOf(r)){"meta"==r&&
(n+=4);c(d,a,n+8,t-8,l);break}if(b.atom[r]){var p=a.getInteger24At(n+16+1,!0),u=b.atom[r],p=b.types[p];if("trkn"==r)d[u[0]]=a.getByteAt(n+16+11),d.count=a.getByteAt(n+16+13);else{var r=n+16+4+4,h=t-16-4-4,m;switch(p){case "text":m=a.getStringWithCharsetAt(r,h,"UTF-8");break;case "uint8":m=a.getShortAt(r);break;case "jpeg":case "png":m={format:"image/"+p,data:a.getBytesAt(r,h)}}d[u[0]]="comment"===u[0]?{text:m}:m}}n+=t}}var b=d.ID4={};b.types={0:"uint8",1:"text",13:"jpeg",14:"png",21:"uint8"};b.atom=
{"\u00a9alb":["album"],"\u00a9art":["artist"],"\u00a9ART":["artist"],aART:["artist"],"\u00a9day":["year"],"\u00a9nam":["title"],"\u00a9gen":["genre"],trkn:["track"],"\u00a9wrt":["composer"],"\u00a9too":["encoder"],cprt:["copyright"],covr:["picture"],"\u00a9grp":["grouping"],keyw:["keyword"],"\u00a9lyr":["lyrics"],"\u00a9cmt":["comment"],tmpo:["tempo"],cpil:["compilation"],disk:["disc"]};b.loadData=function(b,a){b.loadRange([0,8],function(){f(b,0,b.getLength(),a)})};b.readTagsFromData=function(b){var a=
{};c(a,b,0,b.getLength());return a};d.ID4=d.ID4})(this);
