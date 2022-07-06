const AssetCollectionTransformer = require('./asset-collection-transformer');

const JSAPP_WS_BASE_URL = 'generated/jsApp/';
const JS_WS_BASE_URL = 'generated/js/';

class ApplicationAssetTransformer {

  constructor(app, appName) {
    this.app = app;
    this.appName = appName;
  }

  type(assetType) {
    if (assetType === 'jsApp') {
      return new AssetCollectionTransformer(this.app.type('jsApp'), this.app.type('jsAppFullPath'), this.appName, JSAPP_WS_BASE_URL);
    } else if (assetType === 'js') {
      return new AssetCollectionTransformer(this.app.type('js'), this.app.type('jsFullPath'), this.appName, JS_WS_BASE_URL);
    }

    return this.app.type(assetType);
  }
}

module.exports = ApplicationAssetTransformer;
