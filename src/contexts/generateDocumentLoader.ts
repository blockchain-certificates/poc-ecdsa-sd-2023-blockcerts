import blockcertsSchemas from '@blockcerts/schemas';
import dataIntegrityV2Context from './data-integrity-v2-context.json';

const { preloadedContexts } = blockcertsSchemas;
interface DocumentsToPreloadMap {
  [url: string]: any; // any being a context document or did document
}

preloadedContexts['https://w3id.org/security/data-integrity/v2'] = dataIntegrityV2Context;

export default function generateDocumentLoader (documentsToPreload: DocumentsToPreloadMap[] = []) {
  documentsToPreload.forEach(document => {
    const key = Object.keys(document)[0];
    preloadedContexts[key] = document[key];
  })
  const customLoader = function (url): any {
    if (url in preloadedContexts) {
      return {
        contextUrl: null,
        document: preloadedContexts[url],
        documentUrl: url
      };
    }
  };

  return customLoader;
}
