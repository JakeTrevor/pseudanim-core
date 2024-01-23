import path from "node:path";
import fs from "node:fs";
import { services } from ".";

export function validateFile(file: string) {
  if (!fs.existsSync(file)) {
    console.error(`File ${file} does not exist.`);
    process.exit(1);
  }

  const extensions = services.LanguageMetaData.fileExtensions;

  if (!extensions.includes(path.extname(file))) {
    console.error(
      `Please choose a file with one of these extensions: ${extensions}.`
    );
    process.exit(1);
  }

  return file;
}
