import path from 'path';

export default function getDefaultFilePath (fileName) {
  return path.join(process.cwd(), fileName);
}
