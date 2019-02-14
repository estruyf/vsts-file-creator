const path = require('path');
const tl = require('vsts-task-lib/task');
const fs = require('fs');

// Set the source path
tl.setResourcePath(path.join(__dirname, 'task.json'));

// Get the two property values
const filepath = tl.getInput('filepath', true, true);
const filecontent = tl.getInput('filecontent', true);
const fileoverwrite = tl.getInput('fileoverwrite', true);
const endWithNewLine = tl.getInput('endWithNewLine', false);

console.log(`File path: ${filepath}`);
// console.log(`File content: ${filecontent}`);

/**
 * Create the folders for the file
 * @param {*} filePath 
 */
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  // console.log(`Creating dir: ${dirname}`);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

/**
 * Start processing the file
 */
if (filepath && filecontent) {
  // Check if file exists
  if (!tl.exist(filepath) || fileoverwrite) {
    // Create the folder, if needed
    ensureDirectoryExistence(filepath);
    // Check if new line needs to be added at the end of the file
    if (endWithNewLine) {
      filecontent = filecontent + "\n";
    }
    // Create the file
    tl.writeFile(filepath, filecontent, 'utf8');
    // Check if the file is created
    if (tl.exist(filepath)) {
      console.log('File created');
    } else {
      tl.error('File not created / overwritten');
    }
  } else {
    tl.error('File already exists');
  }
}