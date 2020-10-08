import tl = require('azure-pipelines-task-lib/task');
import path from 'path';
import fs from 'fs';

/**
 * Create the folders for the file
 * @param {string} filePath 
 */
function ensureDirectoryExistence(filePath: string) {
  var dirname = path.dirname(filePath);
  // console.log(`Creating dir: ${dirname}`);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Set the source path
// tl.setResourcePath(path.join(__dirname, 'task.json'));

/**
 * Task function
 */
async function run() {
  try {

    // Get all string values
    const filepath = tl.getInput('filepath', true);
    let filecontent = tl.getInput('filecontent', false) || "";
    // Get all boolean values
    const fileoverwrite = tl.getInput('fileoverwrite', true) === "true";
    const skipempty = tl.getInput('skipempty', true) === "true";
    const endWithNewLine = tl.getInput('endWithNewLine', false) === "true";
    const verbose = tl.getInput('verbose', false) === "true";

    if (verbose) {
      console.log(`VERBOSE LOGGING`);
      console.log(`----------------`);
      console.log(`'filepath': ${filepath}`);
      console.log(`'fileoverwrite': ${fileoverwrite}`);
      console.log(`'skipempty': ${skipempty}`);
      console.log(`'endWithNewLine': ${endWithNewLine}`);
      console.log(`'filecontent': ${filecontent}`);
      console.log(`'filecontent.length': ${filecontent.length}`);
      console.log(``);
    } else {
      console.log(`File path: ${filepath}`);
    }

    /**
     * Check if file needs to be created
     */
    if (filecontent || (!filecontent && !skipempty)) {
      filecontent = filecontent || "";
      
      /**
       * Start processing the file
       */
      if (filepath) {
        // Check if file exists
        if (!tl.exist(filepath) || fileoverwrite) {
          // Create the folder, if needed
          ensureDirectoryExistence(filepath);
          // Check if new line needs to be added at the end of the file
          if (endWithNewLine) {
            filecontent = filecontent + "\n";
          }


          if (verbose) {
            console.log(`Writing file with the following contents:`);
            console.log(filecontent);
            console.log(`----------------`);
          }

          // Create the file
          tl.writeFile(filepath, filecontent, 'utf8');
          // Check if the file is created
          if (tl.exist(filepath)) {
            tl.setResult(tl.TaskResult.Succeeded, 'File created');
          } else {
            tl.setResult(tl.TaskResult.Failed, 'File not created / overwritten');
          }
        } else {
          tl.setResult(tl.TaskResult.Failed, 'File already exists');
        }
      }
    } else {
      if (verbose) {
        console.log(`Skipped file creation.`);
        console.log(`----------------`);
      }
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();