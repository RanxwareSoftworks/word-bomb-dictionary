// Word Bomb - Letter Length Finder
// Finds words with a certain amount of letters

function runFinder() {
  var letterLengthConfig = {
    minLength: 4,
    maxLength: 4,
    fileName: "WordBomb-LLF-Results",
    alphabetical: true,
    descending: true,
  };

  console.log("Loading script...");
  console.time("LetterLengthFinder");

  const placeholderUrl = "https://example.org";
  const drivefilepath = "https://drive.google.com/file/d/";

  var fileConfig = {
    name: `${letterLengthConfig.fileName}.txt`,
    mimeType: "text/plain"
  };

  var resultTable = new Array();

  console.log("Fetching dictionary...");

  const dictFile = "https://github.com/RanxwareSoftworks/word-bomb-dictionary/raw/refs/heads/main/truewordbomblist.txt";
  var dictSource = UrlFetchApp.fetch(dictFile);
  var dictionary = dictSource.getContentText().split("\n");
  dictionary.forEach((word) => {
    if (word.length >= letterLengthConfig.minLength && word.length <= letterLengthConfig.maxLength) {
      if (!resultTable.includes(word)) {
        resultTable.push(word);
      };
    };
  });

  console.log("Sorting dictionary...");
  if (letterLengthConfig.alphabetical) {
    resultTable.sort();
  };

  resultTable.sort((w1, w2) => {
    var len1 = w1.length;
    var len2 = w2.length;
    if (letterLengthConfig.descending) {
      return len2 - len1;
    } else {
      return len1 - len2;
    };
  });
  
  console.log("Concatenating dictionary...");
  var results = "";
  resultTable.forEach((word) => {
    if (resultTable[resultTable.length - 1] == word) {
      results += word
    } else {
      results += word + "\n"
    };
  });

  console.log("Creating text file...")
  var preresults = UrlFetchApp.fetch(placeholderUrl);
  var blob = preresults.getBlob();
  blob.setDataFromString(results);

  var file = Drive.Files.create(fileConfig, blob);
  console.log(`Finished! Your file: ${drivefilepath + file.id}`);
  console.log(`Total words compiled: ${resultTable.length}`);

  console.timeEnd("LetterLengthFinder")
};
