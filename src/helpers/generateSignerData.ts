import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';
import * as didKeyBls12381 from '@transmute/did-key-bls12381';
import crypto from 'crypto';
import writeFile from './writeFile';

export enum SupportedSuites {
  ed25519 = 'ed25519',
  secp256k1 = 'secp256k1',
  bbsPlus = 'bbs+'
}

export default async function generateSignerData (type: SupportedSuites) {
  let keyPair;
  let didKey;
  let didDocument;

  if (type === SupportedSuites.bbsPlus) {
    const seed = crypto.randomBytes(32);
    keyPair = await Bls12381G2KeyPair.generate({
      seed
    });
    didKey = await didKeyBls12381.generate({
      secureRandom: () => seed
    })
    didDocument = didKey.didDocument;
    keyPair.controller = didDocument.id;
    keyPair.id = didDocument.verificationMethod[1].id;
  }

  await writeFile(keyPair, `keyPair-${type}.json`, 'identity/');
  console.log('key pair generated:', keyPair);
  await writeFile(didDocument, `did-${type}.json`, 'identity/');
  console.log('did document generated:', JSON.stringify(didDocument, null, 2));
  return { keyPair, didDocument };
}
