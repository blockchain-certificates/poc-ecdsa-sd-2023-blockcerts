import { preloadedContexts } from '@blockcerts/schemas';
interface DocumentsToPreloadMap {
  [url: string]: any; // any being a context document or did document
}

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
