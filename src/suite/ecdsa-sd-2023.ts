import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import * as ecdsaSd2023Cryptosuite from '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import jsigs from 'jsonld-signatures';
import generateDocumentLoader from "../contexts/generateDocumentLoader";
import prettyFormat from "../helpers/prettyFormat";

const { createSignCryptosuite, createVerifyCryptosuite, createDiscloseCryptosuite } = ecdsaSd2023Cryptosuite;
const {purposes: {AssertionProofPurpose}} = jsigs;

async function getKeyPair () {
  const publicKeyMultibase = 'zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9';
  const secretKeyMultibase = 'z42tqZ5smVag3DtDhjY9YfVwTMyVHW6SCHJi2ZMrD23DGYS3';
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
  const keyPair = await EcdsaMultikey.from({...publicEcdsaMultikey});
  return keyPair;
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

    const result = await jsigs.verify(document, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: generateDocumentLoader()
    });

    console.log(prettyFormat(result));
  }

  async derive (document) {
    const suite = new DataIntegrityProof({
      // disclose only the `credentialSubject.id` and any IDs and types in its
      // JSON path
      cryptosuite: createDiscloseCryptosuite(/* nothing selectively disclosed */)
    });

    const derivedCredential = await jsigs.derive(document, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: generateDocumentLoader()
    });

    return derivedCredential;
  }
}
