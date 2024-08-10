import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: 'click-to-edit-initializer',
  initialize() {

    // disable preview scroll (the scrollmap simply isn't good enough; 
    // and we don't need it due to this plugin's clicking functionality)
    const composerComponent = require('discourse/components/composer-editor').default;
    composerComponent.reopen({
      _syncEditorAndPreviewScroll($input, $preview) {
        // enable again with:
        // this._super(...arguments);
      }
    });
  }
};