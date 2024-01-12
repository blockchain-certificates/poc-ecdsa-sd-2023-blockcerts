import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';

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
    console.log(keyPair);
  }
}
