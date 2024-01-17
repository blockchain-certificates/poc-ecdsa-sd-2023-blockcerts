import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import * as ecdsaSd2023Cryptosuite from '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import jsigs from 'jsonld-signatures';
import generateDocumentLoader from "../contexts/generateDocumentLoader";
import prettyFormat from "../helpers/prettyFormat";
import writeFile from "../helpers/writeFile";
import loadFileData from "../helpers/loadFileData";

const { createSignCryptosuite, createVerifyCryptosuite, createDiscloseCryptosuite } = ecdsaSd2023Cryptosuite;
const {purposes: {AssertionProofPurpose}} = jsigs;

async function getKeyPair () {
  const keyPair = await EcdsaMultikey.generate({curve: 'P-256'});
  const { publicKeyMultibase, secretKeyMultibase } = keyPair;

  const controller = `did:key:${publicKeyMultibase}`;
  const keyId = `${controller}#${publicKeyMultibase}`;
  const publicEcdsaMultikey = {
    '@context': 'https://w3id.org/security/multikey/v1',
    type: 'Multikey',
    controller: `did:key:${publicKeyMultibase}`,
    id: keyId,
    publicKeyMultibase,
    secretKeyMultibase
  };
  const keyPairFromMultibase = await EcdsaMultikey.from({...publicEcdsaMultikey});
  writeFile(keyPairFromMultibase, 'keyPair.json', '/src/certs/keys/');
  return keyPairFromMultibase;
}

export class EcdsaSd2023 {
  async sign (document) {
    const keyPair = await getKeyPair();
    // console.log(keyPair);

    const suite = new DataIntegrityProof({
      signer: keyPair.signer(),
      cryptosuite: createSignCryptosuite()
    });

    const signedCredential = await jsigs.sign(document, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: generateDocumentLoader()
    });

    return signedCredential;
  }

  async verify (document) {
    const suite = new DataIntegrityProof({
      cryptosuite: createVerifyCryptosuite()
    });
    const verificationMethod = document.proof.verificationMethod;
    const didURI = verificationMethod.split('#')[0];
    const didDocument = loadFileData(`/src/certs/keys/${didURI}.json`);

    const result = await jsigs.verify(document, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: generateDocumentLoader([{
        [didURI]: didDocument
      }, {
        [verificationMethod]: didDocument.verificationMethod[0]
      }])
    });

    console.log(prettyFormat(result));
  }

  async derive (document, options) {
    const suite = new DataIntegrityProof({
      // disclose only the `credentialSubject.id` and any IDs and types in its
      // JSON path
      cryptosuite: createDiscloseCryptosuite(options)
    });

    const derivedCredential = await jsigs.derive(document, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: generateDocumentLoader()
    });

    return derivedCredential;
  }
}
