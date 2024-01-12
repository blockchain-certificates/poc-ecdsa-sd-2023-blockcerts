import loadFileData from "./helpers/loadFileData";
import {EcdsaSd2023} from "./suite/ecdsa-sd-2023";

async function sign () {
  const unsignedDocument = loadFileData('./src/certs/unsigned/cert-no-did.json');
  const suite = new EcdsaSd2023();
  await suite.sign(unsignedDocument);
}

sign();
