import loadFileData from "./helpers/loadFileData";
import {EcdsaSd2023} from "./suite/ecdsa-sd-2023";
import getProcessArgValue from "./helpers/getProcessArgValue";

async function verify () {
  const filePath = getProcessArgValue('--path');
  if (!filePath) {
    console.error('specify the file to verify by specifying `--path=[file path]` to your CLI instruction');
    return;
  }
  const signedDocument = loadFileData(filePath);
  const suite = new EcdsaSd2023();
  await suite.verify(signedDocument);
}

verify();
