# gamedev-learnjs

Sourcefiles als getrennte Dateien:
http://forums.rpgmakerweb.com/index.php?/topic/47361-rmmv-split-source-files-for-plugin-development

Zusammenführen der getrennten Datein:
Zalerinian gibt eine index Datei mit, in der alle 151 Sourcen aufgelistet sind.
Diese nutzen wir um Infos für den Grunt Task zu erstellen.
Dafür baut man in die index.html im Kopf jquery ein und führt dann folgendes Script aus

```

var startIndex = 4; // All Scripts before are jquery pixi etc.

var srcs = [];
var folderSrcPrefix = "src/main/";
var folderDestPrefix = "js/";

var foldersWithFiles = {};

$("script").each(function() {
   srcs.push($(this).attr("src")); 
});

for(var i=startIndex; i < srcs.length; i++) {
 splitAndAddToFolder(srcs[i]);
}




console.debug(JSON.stringify({"files" : foldersWithFiles}));



function buildDestName(folder) {
  return folderDestPrefix+folder+".js";  
}

function buildSrcName(folder,file) {
  return folderSrcPrefix+folder+"/"+file;  
}





function splitAndAddToFolder(src) {
    var folderAndFile = src.split("/").splice(2,2);
    var folderName = buildDestName(folderAndFile[0]);
    if(folderAndFile[0] == "main.js" || folderAndFile[0] == "plugins.js") {
        return false;
    }
    var fileName = buildSrcName(folderAndFile[0], folderAndFile[1]);

    if(typeof foldersWithFiles[folderName] == "undefined") {
      foldersWithFiles[folderName] = [];  
    }

    foldersWithFiles[folderName].push(fileName);
}

```
