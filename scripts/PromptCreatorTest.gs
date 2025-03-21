// Word Bomb Prompt Creator
// Creates prompts for word bomb
// Average time: 3-6 minutes

function runPromptCreator() {
  console.log("Loading script...");
  console.time("prompt-test");

  // Stats
  var promptsFound = 0;
  var promptsGenerated = 0;
  var leastSolutionsPrompt = "";
  var leastSolutions = Infinity;
  var mostSolutionsPrompt = "";
  var mostSolutions = 0;

  const blobUrl = "https://example.org";
  const minByte = 97;
  const maxByte = 122;
  const minSolutions = 40;
  const dictUrl = "https://github.com/RanxwareSoftworks/word-bomb-dictionary/raw/refs/heads/main/truewordbomblist.txt";

  console.log("Fetching blob placeholder...");
  const preresult = UrlFetchApp.fetch(blobUrl);
  var blob = preresult.getBlob();

  console.log("Fetching dictionary...");
  var dictSource = UrlFetchApp.fetch(dictUrl);
  var wordContents = dictSource.getContentText();
  var dictionary = wordContents.split("\n");

  console.log("Generating prompts...");
  var prompts = new Array();

  var p = "";
  for (var char = minByte; char <= maxByte; char++) {
    var p = String.fromCharCode(char);
    prompts.push(p)
    for (var char2 = minByte; char2 <= maxByte; char2++) {
      var p2 = p + String.fromCharCode(char2);
      prompts.push(p2);
      for (var char3 = minByte; char3 <= maxByte; char3++) {
        var p3 = p2 + String.fromCharCode(char3);
        prompts.push(p3);
      };
    };
  };
  promptsGenerated = prompts.length;

  console.log(`All prompts: ${promptsGenerated}`);

  var totalPrompts = new Array();
  var commonPrompts = new Array();
  var threePrompts = new Array();
  var rarePrompts = new Array();
  var veryRarePrompts = new Array();
  var commonThreePrompts = new Array();
  var miscPrompts = new Array();
  console.log("Fetching solutions to prompts...");
  prompts.forEach((p) => {
    var prompt = p.toUpperCase();
    var solutions = 0;
    dictionary.forEach((word) => {
      if (word.includes(prompt)) {
        solutions += 1;
      };
    });
    if (solutions >= minSolutions) {
      var assigned = false;
      totalPrompts.push(prompt);
      if (prompt.length >= 3) {
        threePrompts.push(prompt);
        assigned = true;
      };
      if (solutions < leastSolutions) {
        leastSolutions = solutions;
        leastSolutionsPrompt = prompt;
      };
      if (solutions > mostSolutions) {
        mostSolutions = solutions;
        mostSolutionsPrompt = prompt;
      };
      if (solutions <= 500 && solutions > 100) { // differentiates rare and very rare prompts
        rarePrompts.push(prompt);
        assigned = true;
      };
      if (solutions <= 100) {
        veryRarePrompts.push(prompt);
        assigned = true;
      };
      if (solutions >= 4000) {
        if (prompt.length >= 3) {
          commonThreePrompts.push(prompt);
        } else {
          commonPrompts.push(prompt);
        };
        assigned = true;
      };
      if (!assigned) {
        miscPrompts.push(prompt);
      };
      console.log(`Found ${solutions} solutions for ${prompt}!`);
    } else {
      //console.warn(`Found ${solutions} solutions for ${prompt}; under the minimum limit!`);
    };
  });

  promptsFound = totalPrompts.length;
  
  console.log("Creating folder...");
  var promptFolder = DriveApp.createFolder("PromptTestFilesP2");
  var basemimetype = "text/plain"

  // total prompts file
  console.log("Creating total prompts file...");
  var totalPromptsContent = "";
  totalPrompts.forEach((p) => {
    if (totalPrompts[totalPrompts.length - 1] == p) {
      totalPromptsContent += p;
    } else {
      totalPromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(totalPromptsContent);
  var file1 = Drive.Files.create({
    name: "totalPrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file1alt = DriveApp.getFileById(file1.id);
  file1alt.moveTo(promptFolder);

  // common prompts file
  console.log("Creating common prompts file...");
  var commonPromptsContent = "";
  commonPrompts.forEach((p) => {
    if (commonPrompts[commonPrompts.length - 1] == p) {
      commonPromptsContent += p;
    } else {
      commonPromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(commonPromptsContent);
  var file2 = Drive.Files.create({
    name: "commonPrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file2alt = DriveApp.getFileById(file2.id);
  file2alt.moveTo(promptFolder);

  // rare prompts file
  console.log("Creating rare prompts file...");
  var rarePromptsContent = "";
  rarePrompts.forEach((p) => {
    if (rarePrompts[rarePrompts.length - 1] == p) {
      rarePromptsContent += p;
    } else {
      rarePromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(rarePromptsContent);
  var file3 = Drive.Files.create({
    name: "rarePrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file3alt = DriveApp.getFileById(file3.id);
  file3alt.moveTo(promptFolder);

  // three prompts file
  console.log("Creating three prompts file...");
  var threePromptsContent = "";
  threePrompts.forEach((p) => {
    if (threePrompts[threePrompts.length - 1] == p) {
      threePromptsContent += p;
    } else {
      threePromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(threePromptsContent);
  var file4 = Drive.Files.create({
    name: "threePrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file4alt = DriveApp.getFileById(file4.id);
  file4alt.moveTo(promptFolder);

  // very rare prompts file
  console.log("Creating very rare prompts file...");
  var veryRarePromptsContent = "";
  veryRarePrompts.forEach((p) => {
    if (veryRarePrompts[veryRarePrompts.length - 1] == p) {
      veryRarePromptsContent += p;
    } else {
      veryRarePromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(veryRarePromptsContent);
  var file5 = Drive.Files.create({
    name: "veryRarePrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file5alt = DriveApp.getFileById(file5.id);
  file5alt.moveTo(promptFolder);

  // common three prompts file
  console.log("Creating common three prompts file...");
  var commonThreePromptsContent = "";
  commonThreePrompts.forEach((p) => {
    if (commonThreePrompts[commonThreePrompts.length - 1] == p) {
      commonThreePromptsContent += p;
    } else {
      commonThreePromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(commonThreePromptsContent);
  var file6 = Drive.Files.create({
    name: "commonThreePrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file6alt = DriveApp.getFileById(file6.id);
  file6alt.moveTo(promptFolder);

  // misc prompts file
  console.log("Creating misc prompts file...");
  var miscPromptsContent = "";
  miscPrompts.forEach((p) => {
    if (miscPrompts[miscPrompts.length - 1] == p) {
      miscPromptsContent += p;
    } else {
      miscPromptsContent += p + "\n";
    };
  });
  blob.setDataFromString(miscPromptsContent);
  var file7 = Drive.Files.create({
    name: "miscPrompts.txt",
    mimeType: basemimetype
  }, blob);
  var file7alt = DriveApp.getFileById(file7.id);
  file7alt.moveTo(promptFolder);

  console.log(`Created 7 files! Go to folder: https://drive.google.com/drive/folders/${promptFolder.getId()}`);
  console.log(`Total prompts compatible: ${promptsFound}`);
  console.log(`Prompt with most solutions: ${mostSolutionsPrompt} / ${mostSolutions}`);
  console.log(`Prompt with least solutions: ${leastSolutionsPrompt} / ${leastSolutions}`);
  console.timeEnd("prompt-test");
};
