// Word Bomb Prompt Solver

var config = {
  prompt: "-or",
  descending: true,
  alphabetical: true,
  fileName: "PromptWordListForWordBomb"
};

function runPromptSolver() {
  console.time("PromptSolver");
  console.log("Starting script...");
  const dictFilePath = "https://github.com/RanxwareSoftworks/word-bomb-dictionary/raw/refs/heads/main/truewordbomblist.txt";
  const placeholderUrl = "https://example.org";
  const realFileName = `${config.fileName}.txt`;
  const resultDriveFilePath = "https://drive.google.com/file/d/";

  var fileConfig = {
    name: realFileName,
    mimeType: "text/plain"
  }
  var wordList = new Array();
  var text = "";

  const preresult = UrlFetchApp.fetch(placeholderUrl);
  var blob = preresult.getBlob();

  var newPrompt = config.prompt.toUpperCase();

  const result = UrlFetchApp.fetch(dictFilePath);
  var content = result.getContentText();
  var listed = content.split("\n");
  listed.forEach((word) => {
    if (word.includes(newPrompt)) {
      wordList.push(word);
    };
  });

  console.log("Sorting word list...");
  if (config.alphabetical) {
    wordList.sort();
  };
  wordList.sort((w1, w2) => {
    var len1 = w1.length;
    var len2 = w2.length;
    if (config.descending) {
      return len2 - len1;
    } else {
      return len1 - len2;
    };
  });

  console.log("Finished sorting!");

  wordList.forEach((word) => {
    if (wordList[wordList.length - 1] == word) {
      text += word
    } else {
      text += word + "\n"
    };
  });
  blob.setDataFromString(text);
  
  console.log("File doesn't exist. Creating new file...");
  var newFile = Drive.Files.create(fileConfig, blob);
  console.log(`Finished! There are ${wordList.length} words containing ${config.prompt}`);
  console.log(`Text file: ${resultDriveFilePath + newFile.id}`)
  console.timeEnd("PromptSolver");
}
