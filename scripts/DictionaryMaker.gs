// Word Bomb Dictionary Maker (DictionaryMaker.gs)
// Info: Gathers all of the word list files from github repository and makes into one large text file
// NOTE: This can only run with Google Apps Script (and with the Drive API Installed)!
// Average time (for all words): 20-40 minutes

function createDictionaryFile() {
  var scriptConfig = {
    fileName: "thewordbombdictionary", // Google drive file name
    minWordLength: 0, // Minimum char length for each word (set to null or 0 for no limit)
    maxWordLength: 3, // Maxmimum char length for each word (set to null or Infinity for no limit)
    sorting: {
      enabled: true,
      lengthOrdering: true, // Sorts words by char length
      descending: true, // Sorts words by descending/ascending length (if above if enabled)
      alphabetical: true, // Sorts words alphabetically
    }
  }

  console.log("Loaded script!");
  var timer1 = new Date();
  var startingTime = timer1.getUTCSeconds();

  const rawUrl = "https://github.com/RanxwareSoftworks/word-bomb-dictionary/raw/refs/heads/main/";
  const baseFilePath1 = "lists/";
  const baseFilePath2 = "-list.txt";
  const placeholderUrl = "https://example.org";

  const minCharCode = 97;
  const maxCharCode = 122;

  // Will automatically set to 0 if value is null
  if (scriptConfig.minWordLength === null) {
    scriptConfig.minWordLength = 0;
  };
  // Will automatically set to Infinity if value is null
  if (scriptConfig.maxWordLength === null) {
    scriptConfig.maxWordLength = Infinity;
  };

  if (scriptConfig.minWordLength > scriptConfig.maxWordLength) {
    scriptConfig.minWordLength = scriptConfig.maxWordLength;
  };

  function createDriveFile(metadata, blob) {
    return Drive.Files.create(metadata, blob);
  };

  function convertDuration(dur) {
    var sec = dur % 60;
    var min = Math.round(dur / 60);
    var min2 = min % 60;
    var hr = Math.round(min / 60);

    var data = {
      hours: hr,
      mins: min2,
      secs: sec,
    };
    return data;
  };

  var dictionary = new Array(); // will be used to store every word later on
  var letters = new Array();
  var index = 0;

  for (var i = minCharCode; i <= maxCharCode; i++) {
    letters[index] = String.fromCharCode(i);
    index = index + 1;
  };
  
  var fileConfig = {
    name: `${scriptConfig.fileName}.txt`,
    mimeType: "text/plain"
  };

  // Creates placeholder blob
  const preresult = UrlFetchApp.fetch(placeholderUrl);
  var blob = preresult.getBlob(); // blob will be used for replacing data later on

  // fyi: There are at least 280,000 words in the dictionary, so this action will take long...
  // Gets all word list files and stores them into the "dictionary" string
  letters.forEach((x) => {
    console.log(`Loading word list ${x}`);
    const finalUrl = rawUrl + baseFilePath1 + x + baseFilePath2;
    const result = UrlFetchApp.fetch(finalUrl);
    
    var contentText = result.getContentText();
    var wordList = contentText.split("\n");
    wordList.forEach((word) => {
      if (!dictionary.includes(word) && word.length >= scriptConfig.minWordLength && word.length <= scriptConfig.maxWordLength) {
        dictionary.push(word);
      };
    });
    console.log(`Finished word list ${x}!`);
  });

  // Sorts the words (if enabled)
  if (scriptConfig.sorting.enabled) {
    console.log("Sorting dictionary...");
    if (scriptConfig.sorting.alphabetical) {
      dictionary.sort();
    };
    if (scriptConfig.sorting.lengthOrdering) {
      dictionary.sort((w1, w2) => {
        var len1 = w1.length;
        var len2 = w2.length;
        if (scriptConfig.sorting.descending) {
          return len2 - len1;
        } else {
          return len1 - len2;
        };
      })
    };
    console.log("Dictionary is now sorted!");
  };

  // Collects all words and writes them into the "concatenated" variable
  console.log("Concatenating dictionary...");
  var concatenated = "";
  dictionary.forEach((word) => {
    if (dictionary[dictionary.length - 1] == word) {
      concatenated += word; // ignores adding another line
    } else {
      concatenated += word + "\n";
    };
  });
  console.log("Finished concatenation!");

  // Sets the blob data to the string and creates a text file with every word
  blob.setDataFromString(concatenated);
  var textfile = createDriveFile(fileConfig, blob);

  var timer2 = new Date();
  var finalTime = timer2.getUTCSeconds();
  var durationTime = finalTime - startingTime;

  var durationData = convertDuration(durationTime);

  console.log(`File finished! File link here -> https://drive.google.com/file/d/${textfile.id}`);
  console.warn(`Final script time: ${durationData.hours}h ${durationData.mins}m ${durationData.secs}s`)
  console.log(`Total words compiled: ${dictionary.length}`);
};
