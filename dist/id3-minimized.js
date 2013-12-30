var StringUtils={readUTF16String:function(d,f,b){var c=0,e=1,a=0;b=Math.min(b||d.length,d.length);254==d[0]&&255==d[1]?(f=!0,c=2):255==d[0]&&254==d[1]&&(f=!1,c=2);f&&(e=0,a=1);f=[];for(var m=0;c<b;m++){var g=d[c+e],l=(g<<8)+d[c+a],c=c+2;if(0==l)break;else 216>g||224<=g?f[m]=String.fromCharCode(l):(g=(d[c+e]<<8)+d[c+a],c+=2,f[m]=String.fromCharCode(l,g))}d=new String(f.join(""));d.bytesReadCount=c;return d},readUTF8String:function(d,f){var b=0;f=Math.min(f||d.length,d.length);239==d[0]&&187==d[1]&&
191==d[2]&&(b=3);for(var c=[],e=0;b<f;e++){var a=d[b++];if(0==a)break;else if(128>a)c[e]=String.fromCharCode(a);else if(194<=a&&224>a){var m=d[b++];c[e]=String.fromCharCode(((a&31)<<6)+(m&63))}else if(224<=a&&240>a){var m=d[b++],g=d[b++];c[e]=String.fromCharCode(((a&255)<<12)+((m&63)<<6)+(g&63))}else if(240<=a&&245>a){var m=d[b++],g=d[b++],l=d[b++],a=((a&7)<<18)+((m&63)<<12)+((g&63)<<6)+(l&63)-65536;c[e]=String.fromCharCode((a>>10)+55296,(a&1023)+56320)}}c=new String(c.join(""));c.bytesReadCount=
b;return c},readNullTerminatedString:function(d,f){var b=[];f=f||d.length;for(var c=0;c<f;){var e=d[c++];if(0==e)break;b[c-1]=String.fromCharCode(e)}b=new String(b.join(""));b.bytesReadCount=c;return b}};function BinaryFile(d,f,b){var c=d,e=f||0,a=0;this.getRawData=function(){return c};"string"===typeof d?(a=b||c.length,this.getByteAt=function(a){return c.charCodeAt(a+e)&255}):"unknown"==typeof d&&(a=b||IEBinary_getLength(c),this.getByteAt=function(a){return IEBinary_getByteAt(c,a+e)});this.getBytesAt=function(a,b){for(var c=Array(b),h=0;h<b;h++)c[h]=this.getByteAt(a+h);return c};this.getLength=function(){return a};this.isBitSetAt=function(a,b){return 0!=(this.getByteAt(a)&1<<b)};this.getSByteAt=
function(a){a=this.getByteAt(a);return 127<a?a-256:a};this.getShortAt=function(a,b){var c=b?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);0>c&&(c+=65536);return c};this.getSShortAt=function(a,b){var c=this.getShortAt(a,b);return 32767<c?c-65536:c};this.getLongAt=function(a,b){var c=this.getBytesAt(a,4),h=c[0]&255,e=c[1]&255,d=c[2]&255,c=c[3]&255,h=b?(((h<<8)+e<<8)+d<<8)+c:(((c<<8)+d<<8)+e<<8)+h;0>h&&(h+=4294967296);return h};this.getSLongAt=function(a,c){var b=
this.getLongAt(a,c);return 2147483647<b?b-4294967296:b};this.getInteger24At=function(a,c){var b=this.getBytesAt(a,3),e=b[0]&255,d=b[1]&255,b=b[2]&255,e=c?((e<<8)+d<<8)+b:((b<<8)+d<<8)+e;0>e&&(e+=16777216);return e};this.getStringAt=function(a,b){for(var c=Array(b),e=this.getBytesAt(a,b),d=0;d<b;d++)c[d]=String.fromCharCode(e[d]&255);return c.join("")};this.getStringWithCharsetAt=function(a,b,c){a=this.getBytesAt(a,b);switch(c.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":c=StringUtils.readUTF16String(a,
c);break;case "utf-8":c=StringUtils.readUTF8String(a);break;default:c=StringUtils.readNullTerminatedString(a)}return c};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};this.toBase64=function(){return window.btoa(c)};this.fromBase64=function(a){c=window.atob(a)};this.loadRange=function(a,c){c()}}document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n\x3c/script>\r\n");var BufferedBinaryAjax=function(d,f,b){function c(a,c,b,d,m,f,u){var k=e();k?("undefined"===typeof u&&(u=!0),c&&("undefined"!=typeof k.onload?k.onload=function(){"200"==k.status||"206"==k.status?(k.fileSize=f||k.getResponseHeader("Content-Length"),c(k)):b&&b();k=null}:k.onreadystatechange=function(){4==k.readyState&&("200"==k.status||"206"==k.status?(k.fileSize=f||k.getResponseHeader("Content-Length"),c(k)):b&&b(),k=null)}),k.open("GET",a,u),k.overrideMimeType&&k.overrideMimeType("text/plain; charset=x-user-defined"),
d&&m&&k.setRequestHeader("Range","bytes="+d[0]+"-"+d[1]),k.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),k.send(null)):b&&b()}function e(){var a=null;window.XMLHttpRequest?a=new XMLHttpRequest:window.ActiveXObject&&(a=new ActiveXObject("Microsoft.XMLHTTP"));return a}function a(a,c,b){var d=e();d?(c&&("undefined"!=typeof d.onload?d.onload=function(){"200"==d.status?c(this):b&&b();d=null}:d.onreadystatechange=function(){4==d.readyState&&("200"==d.status?c(this):b&&b(),d=null)}),
d.open("HEAD",a,!0),d.send(null)):b&&b()}function m(a,e,d,m){function f(a){var b=~~(a[0]/d)-m;a=~~(a[1]/d)+1+m;0>b&&(b=0);a>=blockTotal&&(a=blockTotal-1);return[b,a]}function p(m,f){for(;s[m[0]];)if(m[0]++,m[0]>m[1])return f?f():u;for(;s[m[1]];)if(m[1]--,m[0]>m[1])return f?f():u;var n=[m[0]*d,(m[1]+1)*d-1];c(a,function(a){parseInt(a.getResponseHeader("Content-Length"),10)==e&&(m[0]=0,m[1]=blockTotal-1,n[0]=0,n[1]=e-1);a={data:a.responseBody||a.responseText,offset:n[0]};for(var b=m[0];b<=m[1];b++)s[b]=
a;k+=n[1]-n[0]+1;f&&f()},b,n,"bytes",u,!!f)}var u,k=0,n=new BinaryFile("",0,e),s=[];d=d||2048;m="undefined"===typeof m?0:m;blockTotal=~~((e-1)/d)+1;for(var q in n)n.hasOwnProperty(q)&&"function"===typeof n[q]&&(this[q]=n[q]);this.getByteAt=function(a){var b;b=f([a,a]);p(b);b=s[~~(a/d)];if("string"==typeof b.data)return b.data.charCodeAt(a-b.offset)&255;if("unknown"==typeof b.data)return IEBinary_getByteAt(b.data,a-b.offset)};this.getDownloadedBytesCount=function(){return k};this.loadRange=function(a,
b){var c=f(a);p(c,b)}}(function(){a(d,function(a){a=parseInt(a.getResponseHeader("Content-Length"),10)||-1;f(new m(d,a))})})()};(function(d){d.FileAPIReader=function(d,b){return function(c,e,a){c=b||new FileReader;c.onload=function(a){e(new BinaryFile(a.target.result))};c.readAsBinaryString(d)}}})(this);var BufferedBinaryFileReader=function(d,f,b){f(new function(b,e,a,d){var g=0;a=new BinaryFile("",0,e);var f=new Uint8Array(e),h=[],t=function(a){var b=0;h.forEach(function(c){if(a>=c[0]&&a<c[1])return b=1,0});return b},r=function(a,e){for(;0!==t(a[0]);)if(a[0]++,a[0]>a[1])return e?e():void 0;for(;0!==t(a[1]);)if(a[1]--,a[0]>a[1])return e?e():void 0;var d=new FileReader;d.onload=function(b){h.push(a);b=new Uint8Array(b.target.result);f.set(b,a[0]);g+=a[1]-a[0]+1;e&&e()};d.readAsArrayBuffer(b.slice(a[0],
a[1]))},p;for(p in a)a.hasOwnProperty(p)&&"function"===typeof a[p]&&(this[p]=a[p]);this.getByteAt=function(a){return f[a]};this.getBytesAt=function(a,b){return f.subarray(a,a+b)};this.getDownloadedBytesCount=function(){return g};this.loadRange=function(a,b){r(a,b)}}(d,d.size))};(function(d){function f(a){return"ftypM4A"==a.getStringAt(4,7)?ID4:"ID3"==a.getStringAt(0,3)?ID3v2:ID3v1}var b=d.ID3={},c={},e=[0,11];b.clearTags=function(a){delete c[a]};b.clearAll=function(){c={}};b.loadTags=function(a,b,d){d=d||{};(d.file?BufferedBinaryFileReader:d.dataReader||BufferedBinaryAjax)(d.file||a,function(l){l.loadRange(e,function(){var e=f(l);e.loadData(l,function(){var f=d.tags,r=e.readTagsFromData(l,f),f=c[a]||{},p;for(p in r)r.hasOwnProperty(p)&&(f[p]=r[p]);c[a]=f;b&&b()})})})};b.getAllTags=
function(a){if(!c[a])return null;var b={},e;for(e in c[a])c[a].hasOwnProperty(e)&&(b[e]=c[a][e]);return b};b.getTag=function(a,b){return c[a]?c[a][b]:null};d.ID3=d.ID3;b.loadTags=b.loadTags;b.getAllTags=b.getAllTags;b.getTag=b.getTag;b.clearTags=b.clearTags;b.clearAll=b.clearAll})(this);(function(d){var f=d.ID3v1={},b="Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";");
f.loadData=function(b,e){var a=b.getLength();b.loadRange([a-128-1,a],e)};f.readTagsFromData=function(c){var e=c.getLength()-128;if("TAG"==c.getStringAt(e,3)){var a=c.getStringAt(e+3,30).replace(/\0/g,""),d=c.getStringAt(e+33,30).replace(/\0/g,""),f=c.getStringAt(e+63,30).replace(/\0/g,""),l=c.getStringAt(e+93,4).replace(/\0/g,"");if(0==c.getByteAt(e+97+28))var h=c.getStringAt(e+97,28).replace(/\0/g,""),t=c.getByteAt(e+97+29);else h="",t=0;c=c.getByteAt(e+97+30);return{version:"1.1",title:a,artist:d,
album:f,year:l,comment:h,track:t,genre:255>c?b[c]:""}}return{}};d.ID3v1=d.ID3v1})(this);(function(d){function f(a,b){var c=b.getByteAt(a),e=b.getByteAt(a+1),d=b.getByteAt(a+2);return b.getByteAt(a+3)&127|(d&127)<<7|(e&127)<<14|(c&127)<<21}var b=d.ID3v2={};b.readFrameData={};b.frames={BUF:"Recommended buffer size",CNT:"Play counter",COM:"Comments",CRA:"Audio encryption",CRM:"Encrypted meta frame",ETC:"Event timing codes",EQU:"Equalization",GEO:"General encapsulated object",IPL:"Involved people list",LNK:"Linked information",MCI:"Music CD Identifier",MLL:"MPEG location lookup table",PIC:"Attached picture",
POP:"Popularimeter",REV:"Reverb",RVA:"Relative volume adjustment",SLT:"Synchronized lyric/text",STC:"Synced tempo codes",TAL:"Album/Movie/Show title",TBP:"BPM (Beats Per Minute)",TCM:"Composer",TCO:"Content type",TCR:"Copyright message",TDA:"Date",TDY:"Playlist delay",TEN:"Encoded by",TFT:"File type",TIM:"Time",TKE:"Initial key",TLA:"Language(s)",TLE:"Length",TMT:"Media type",TOA:"Original artist(s)/performer(s)",TOF:"Original filename",TOL:"Original Lyricist(s)/text writer(s)",TOR:"Original release year",
TOT:"Original album/Movie/Show title",TP1:"Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",TP2:"Band/Orchestra/Accompaniment",TP3:"Conductor/Performer refinement",TP4:"Interpreted, remixed, or otherwise modified by",TPA:"Part of a set",TPB:"Publisher",TRC:"ISRC (International Standard Recording Code)",TRD:"Recording dates",TRK:"Track number/Position in set",TSI:"Size",TSS:"Software/hardware and settings used for encoding",TT1:"Content group description",TT2:"Title/Songname/Content description",
TT3:"Subtitle/Description refinement",TXT:"Lyricist/text writer",TXX:"User defined text information frame",TYE:"Year",UFI:"Unique file identifier",ULT:"Unsychronized lyric/text transcription",WAF:"Official audio file webpage",WAR:"Official artist/performer webpage",WAS:"Official audio source webpage",WCM:"Commercial information",WCP:"Copyright/Legal information",WPB:"Publishers official webpage",WXX:"User defined URL link frame",AENC:"Audio encryption",APIC:"Attached picture",COMM:"Comments",COMR:"Commercial frame",
ENCR:"Encryption method registration",EQUA:"Equalization",ETCO:"Event timing codes",GEOB:"General encapsulated object",GRID:"Group identification registration",IPLS:"Involved people list",LINK:"Linked information",MCDI:"Music CD identifier",MLLT:"MPEG location lookup table",OWNE:"Ownership frame",PRIV:"Private frame",PCNT:"Play counter",POPM:"Popularimeter",POSS:"Position synchronisation frame",RBUF:"Recommended buffer size",RVAD:"Relative volume adjustment",RVRB:"Reverb",SYLT:"Synchronized lyric/text",
SYTC:"Synchronized tempo codes",TALB:"Album/Movie/Show title",TBPM:"BPM (beats per minute)",TCOM:"Composer",TCON:"Content type",TCOP:"Copyright message",TDAT:"Date",TDLY:"Playlist delay",TENC:"Encoded by",TEXT:"Lyricist/Text writer",TFLT:"File type",TIME:"Time",TIT1:"Content group description",TIT2:"Title/songname/content description",TIT3:"Subtitle/Description refinement",TKEY:"Initial key",TLAN:"Language(s)",TLEN:"Length",TMED:"Media type",TOAL:"Original album/movie/show title",TOFN:"Original filename",
TOLY:"Original lyricist(s)/text writer(s)",TOPE:"Original artist(s)/performer(s)",TORY:"Original release year",TOWN:"File owner/licensee",TPE1:"Lead performer(s)/Soloist(s)",TPE2:"Band/orchestra/accompaniment",TPE3:"Conductor/performer refinement",TPE4:"Interpreted, remixed, or otherwise modified by",TPOS:"Part of a set",TPUB:"Publisher",TRCK:"Track number/Position in set",TRDA:"Recording dates",TRSN:"Internet radio station name",TRSO:"Internet radio station owner",TSIZ:"Size",TSRC:"ISRC (international standard recording code)",
TSSE:"Software/Hardware and settings used for encoding",TYER:"Year",TXXX:"User defined text information frame",UFID:"Unique file identifier",USER:"Terms of use",USLT:"Unsychronized lyric/text transcription",WCOM:"Commercial information",WCOP:"Copyright/Legal information",WOAF:"Official audio file webpage",WOAR:"Official artist/performer webpage",WOAS:"Official audio source webpage",WORS:"Official internet radio station homepage",WPAY:"Payment",WPUB:"Publishers official webpage",WXXX:"User defined URL link frame"};
var c={title:["TIT2","TT2"],artist:["TPE1","TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON","TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},e=["title","artist","album","track"];b.loadData=function(a,b){a.loadRange([6,9],function(){a.loadRange([0,f(6,a)],b)})};b.readTagsFromData=function(a,d){var g=0,l=a.getByteAt(g+3);if(4<l)return{version:">2.4"};var h=a.getByteAt(g+4),t=a.isBitSetAt(g+5,7),r=a.isBitSetAt(g+5,6),p=a.isBitSetAt(g+5,5),
u=f(g+6,a),g=g+10;if(r)var k=a.getLongAt(g,!0),g=g+(k+4);var l={version:"2."+l+"."+h,major:l,revision:h,flags:{unsynchronisation:t,extended_header:r,experimental_indicator:p},size:u},n;if(t)n={};else{for(var u=u-10,t=a,h={},r=l.major,p=d||e,k=[],s=0,q;q=p[s];s++)k=k.concat(c[q]||[q]);for(p=k;g<u;){k=null;s=t;q=g;var v=null;switch(r){case 2:n=s.getStringAt(q,3);var w=s.getInteger24At(q+3,!0),y=6;break;case 3:n=s.getStringAt(q,4);w=s.getLongAt(q+4,!0);y=10;break;case 4:n=s.getStringAt(q,4),w=f(q+4,
s),y=10}if(""==n)break;g+=y+w;if(!(0>p.indexOf(n))){if(2<r)var v=s,x=q+8,v={message:{tag_alter_preservation:v.isBitSetAt(x,6),file_alter_preservation:v.isBitSetAt(x,5),read_only:v.isBitSetAt(x,4)},format:{grouping_identity:v.isBitSetAt(x+1,7),compression:v.isBitSetAt(x+1,3),encription:v.isBitSetAt(x+1,2),unsynchronisation:v.isBitSetAt(x+1,1),data_length_indicator:v.isBitSetAt(x+1,0)}};q+=y;v&&v.format.data_length_indicator&&(f(q,s),q+=4,w-=4);v&&v.format.unsynchronisation||(n in b.readFrameData?k=
b.readFrameData[n]:"T"==n[0]&&(k=b.readFrameData["T*"]),k=k?k(q,w,s,v):void 0,k={id:n,size:w,description:n in b.frames?b.frames[n]:"Unknown",data:k},n in h?(h[n].id&&(h[n]=[h[n]]),h[n].push(k)):h[n]=k)}}n=h}for(var z in c)if(c.hasOwnProperty(z)){a:{w=c[z];"string"==typeof w&&(w=[w]);y=0;for(g=void 0;g=w[y];y++)if(g in n){a=n[g].data;break a}a=void 0}a&&(l[z]=a)}for(var A in n)n.hasOwnProperty(A)&&(l[A]=n[A]);return l};d.ID3v2=b})(this);(function(){function d(b){var c;switch(b){case 0:c="iso-8859-1";break;case 1:c="utf-16";break;case 2:c="utf-16be";break;case 3:c="utf-8"}return c}var f="32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";");
ID3v2.readFrameData.APIC=function(b,c,e,a,m){m=m||"3";a=b;var g=d(e.getByteAt(b));switch(m){case "2":var l=e.getStringAt(b+1,3);b+=4;break;case "3":case "4":l=e.getStringWithCharsetAt(b+1,c-(b-a),g),b+=1+l.bytesReadCount}m=e.getByteAt(b,1);m=f[m];g=e.getStringWithCharsetAt(b+1,c-(b-a),g);b+=1+g.bytesReadCount;return{format:l.toString(),type:m,description:g.toString(),data:e.getBytesAt(b,a+c-b)}};ID3v2.readFrameData.COMM=function(b,c,e){var a=b,f=d(e.getByteAt(b)),g=e.getStringAt(b+1,3),l=e.getStringWithCharsetAt(b+
4,c-4,f);b+=4+l.bytesReadCount;b=e.getStringWithCharsetAt(b,a+c-b,f);return{language:g,short_description:l.toString(),text:b.toString()}};ID3v2.readFrameData.COM=ID3v2.readFrameData.COMM;ID3v2.readFrameData.PIC=function(b,c,e,a){return ID3v2.readFrameData.APIC(b,c,e,a,"2")};ID3v2.readFrameData.PCNT=function(b,c,e){return e.getInteger32At(b)};ID3v2.readFrameData.CNT=ID3v2.readFrameData.PCNT;ID3v2.readFrameData["T*"]=function(b,c,e){var a=d(e.getByteAt(b));return e.getStringWithCharsetAt(b+1,c-1,a).toString()};
ID3v2.readFrameData.TCON=function(b,c,e){return ID3v2.readFrameData["T*"].apply(this,arguments).replace(/^\(\d+\)/,"")};ID3v2.readFrameData.TCO=ID3v2.readFrameData.TCON;ID3v2.readFrameData.USLT=function(b,c,e){var a=b,f=d(e.getByteAt(b)),g=e.getStringAt(b+1,3),l=e.getStringWithCharsetAt(b+4,c-4,f);b+=4+l.bytesReadCount;b=e.getStringWithCharsetAt(b,a+c-b,f);return{language:g,descriptor:l.toString(),lyrics:b.toString()}};ID3v2.readFrameData.ULT=ID3v2.readFrameData.USLT})();(function(d){function f(b,a,d,g){var l=b.getLongAt(a,!0);if(0===l||isNaN(l))return g();var h=b.getStringAt(a+4,4);-1<["moov","udta","meta","ilst"].indexOf(h)?("meta"==h&&(a+=4),b.loadRange([a+8,a+8+8],function(){f(b,a+8,l-8,g)})):b.loadRange([a+(h in c.atom?0:l),a+l+8],function(){f(b,a+l,d,g)})}function b(d,a,f,g,l){l=void 0===l?"":l+"  ";for(var h=f;h<f+g;){var t=a.getLongAt(h,!0);if(0==t||isNaN(t))break;var r=a.getStringAt(h+4,4);if(-1<["moov","udta","meta","ilst"].indexOf(r)){"meta"==r&&(h+=4);
b(d,a,h+8,t-8,l);break}if(c.atom[r]){var p=a.getInteger24At(h+16+1,!0),u=c.atom[r],p=c.types[p];if("trkn"==r)d[u[0]]=a.getByteAt(h+16+11),d.count=a.getByteAt(h+16+13);else{var r=h+16+4+4,k=t-16-4-4,n;switch(p){case "text":n=a.getStringWithCharsetAt(r,k,"UTF-8");break;case "uint8":n=a.getShortAt(r);break;case "jpeg":case "png":n={format:"image/"+p,data:a.getBytesAt(r,k)}}d[u[0]]="comment"===u[0]?{text:n}:n}}h+=t}}var c=d.ID4={};c.types={0:"uint8",1:"text",13:"jpeg",14:"png",21:"uint8"};c.atom={"\u00a9alb":["album"],
"\u00a9art":["artist"],"\u00a9ART":["artist"],aART:["artist"],"\u00a9day":["year"],"\u00a9nam":["title"],"\u00a9gen":["genre"],trkn:["track"],"\u00a9wrt":["composer"],"\u00a9too":["encoder"],cprt:["copyright"],covr:["picture"],"\u00a9grp":["grouping"],keyw:["keyword"],"\u00a9lyr":["lyrics"],"\u00a9cmt":["comment"],tmpo:["tempo"],cpil:["compilation"],disk:["disc"]};c.loadData=function(b,a){b.loadRange([0,8],function(){f(b,0,b.getLength(),a)})};c.readTagsFromData=function(c){var a={};b(a,c,0,c.getLength());
return a};d.ID4=d.ID4})(this);
