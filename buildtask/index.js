"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Create the folders for the file
 * @param {string} filePath
 */
function ensureDirectoryExistence(filePath) {
    var dirname = path_1.default.dirname(filePath);
    // console.log(`Creating dir: ${dirname}`);
    if (fs_1.default.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs_1.default.mkdirSync(dirname);
}
// Set the source path
// tl.setResourcePath(path.join(__dirname, 'task.json'));
/**
 * Task function
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            }
            else {
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
                        }
                        else {
                            tl.setResult(tl.TaskResult.Failed, 'File not created / overwritten');
                        }
                    }
                    else {
                        tl.setResult(tl.TaskResult.Failed, 'File already exists');
                    }
                }
            }
            else {
                if (verbose) {
                    console.log(`Skipped file creation.`);
                    console.log(`----------------`);
                }
            }
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
