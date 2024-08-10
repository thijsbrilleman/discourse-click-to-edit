export function setup(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["click-to-edit"] =
      window.markdownitLineNumbers && !!siteSettings.enable_discourse_click_to_edit;
  });

  helper.allowList({
    custom(tag, name, value) {
      // Allow elements with a data-ln attribute that contains a number
      if (name === "data-ln") {
        return !!value.match(/^\d+$/);
      }
    },
  });

  if (window.markdownitLineNumbers) {
    helper.registerPlugin(window.markdownitLineNumbers);
  }
}
