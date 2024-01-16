import loadFileData from "./helpers/loadFileData";
import {EcdsaSd2023} from "./suite/ecdsa-sd-2023";
import writeFile from "./helpers/writeFile";

async function sign () {
  const unsignedDocument = loadFileData('./src/certs/unsigned/cert-no-did.json');
  const suite = new EcdsaSd2023();
  const signedCredential = await suite.sign(unsignedDocument);
  writeFile(
    signedCredential,
    'signed-credential.json',
    './src/certs/signed/');
}

sign();
