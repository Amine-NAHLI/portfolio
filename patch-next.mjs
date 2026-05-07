import { readFileSync, writeFileSync } from 'fs';

const MOCK_CONTEXT_CJS = `var _MOCK_HTML_CONTEXT = {
    inAmpMode: false,
    docComponentsRendered: {},
    scriptLoader: { beforeInteractive: [], afterInteractive: [], lazyOnload: [], worker: [] },
    locale: '',
    __NEXT_DATA__: {},
    canonicalBase: '',
    assetPrefix: '',
    assetQueryString: '',
    crossOrigin: undefined,
    optimizeFonts: false,
    optimizeCss: false,
    nextScriptWorkers: false,
    nextFontManifest: null,
    largePageDataBytes: 0,
    disableOptimizedLoading: false,
    headTags: [],
    dynamicImportsIds: [],
    dynamicImports: [],
    ampPath: '',
    initted: true,
    buildId: '',
    devFiles: [],
    ampDevFiles: [],
    polyfillFiles: [],
    sharedFiles: [],
    pageFiles: [],
    reactLoadableManifest: {}
};
function useHtmlContext() {
    const context = (0, _react.useContext)(HtmlContext);
    if (!context) {
        return Object.assign({}, _MOCK_HTML_CONTEXT, { docComponentsRendered: {}, __NEXT_DATA__: {}, scriptLoader: { beforeInteractive: [], afterInteractive: [], lazyOnload: [], worker: [] } });
    }
    return context;
}`;

const MOCK_CONTEXT_ESM = `var _MOCK_HTML_CONTEXT = {
    inAmpMode: false,
    docComponentsRendered: {},
    scriptLoader: { beforeInteractive: [], afterInteractive: [], lazyOnload: [], worker: [] },
    locale: '',
    __NEXT_DATA__: {},
    canonicalBase: '',
    assetPrefix: '',
    assetQueryString: '',
    crossOrigin: undefined,
    optimizeFonts: false,
    optimizeCss: false,
    nextScriptWorkers: false,
    nextFontManifest: null,
    largePageDataBytes: 0,
    disableOptimizedLoading: false,
    headTags: [],
    dynamicImportsIds: [],
    dynamicImports: [],
    ampPath: '',
    initted: true,
    buildId: '',
    devFiles: [],
    ampDevFiles: [],
    polyfillFiles: [],
    sharedFiles: [],
    pageFiles: [],
    reactLoadableManifest: {}
};
export function useHtmlContext() {
    const context = useContext(HtmlContext);
    if (!context) {
        return Object.assign({}, _MOCK_HTML_CONTEXT, { docComponentsRendered: {}, __NEXT_DATA__: {}, scriptLoader: { beforeInteractive: [], afterInteractive: [], lazyOnload: [], worker: [] } });
    }
    return context;
}`;

function patchFile(filePath, oldStr, newStr, label) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    if (content.includes(oldStr)) {
      writeFileSync(filePath, content.replace(oldStr, newStr), 'utf-8');
      console.log('✓ Patched:', label);
    } else if (content.includes('_MOCK_HTML_CONTEXT')) {
      console.log('✓ Already patched:', label);
    } else {
      console.warn('⚠ Pattern not found in:', label);
    }
  } catch (e) {
    console.warn('⚠ Could not patch', label, ':', e.message);
  }
}

const CJS_OLD = `function useHtmlContext() {
    const context = (0, _react.useContext)(HtmlContext);
    if (!context) {
        console.warn(Object.defineProperty(new Error("<Html> is used in this project.\\n" + 'Read more: https://nextjs.org/docs/messages/no-document-import-in-page'), "__NEXT_ERROR_CODE", {
            value: "E67",
            enumerable: false,
            configurable: true
        });
    }
    return context;
}`;

const ESM_OLD = `export function useHtmlContext() {
    const context = useContext(HtmlContext);
    if (!context) {
        console.warn(Object.defineProperty(new Error("<Html> is used in this project.\\n" + 'Read more: https://nextjs.org/docs/messages/no-document-import-in-page'), "__NEXT_ERROR_CODE", {
            value: "E67",
            enumerable: false,
            configurable: true
        });
    }
    return context;
}`;

patchFile(
  'node_modules/next/dist/shared/lib/html-context.shared-runtime.js',
  CJS_OLD,
  MOCK_CONTEXT_CJS,
  'html-context.shared-runtime.js (CJS)'
);

patchFile(
  'node_modules/next/dist/esm/shared/lib/html-context.shared-runtime.js',
  ESM_OLD,
  MOCK_CONTEXT_ESM,
  'html-context.shared-runtime.js (ESM)'
);
