import getProcessArgValue from "./helpers/getProcessArgValue";
import loadFileData from "./helpers/loadFileData";
import {EcdsaSd2023} from "./suite/ecdsa-sd-2023";
import writeFile from "./helpers/writeFile";

async function deriveProof () {
  const filePath = getProcessArgValue('--path');
  if (!filePath) {
    console.error('specify the file to verify by specifying `--path=[file path]` to your CLI instruction');
    return;
  }
  const signedDocument = loadFileData(filePath);

  const suite = new EcdsaSd2023();
  const derivedCredential = await suite.derive(signedDocument, {
    mandatoryPointers: [],
    selectivePointers: ['/credentialSubject/name']
  });
  console.log(JSON.stringify(derivedCredential, null, 2));
  writeFile(
    derivedCredential,
    'derived-credential.json',
    './src/certs/signed/');
}

deriveProof();
