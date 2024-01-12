import fs from 'fs';
import getDefaultFilePath from "./getDefaultFilePath";

export default function loadFileData<T> (filePath: string): T {
  const fileData = fs.readFileSync(getDefaultFilePath(filePath), 'utf8');
  return JSON.parse(fileData);
}
