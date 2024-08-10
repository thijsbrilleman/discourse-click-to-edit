import { withPluginApi } from "discourse/lib/plugin-api";

function initializePlugin(api) {
  api.decorateCookedElement(decorator, { id: "code-block-lines-attribute-adder" });
}

export default {
  name: "code-block-lines",
  initialize: function () {
    withPluginApi("0.1", (api) => initializePlugin(api));
  },
};

// Highlight.js runs a decorator on the content of codeblocks (Markdownit leaves the inside)
// of codeblocks alone). So we add line data-ln line number attributes to inside the codeblocks
// after Highlight.js has processed it.
function decorator(elem) {

  // Select all the divs that wrap the highlighted code blocks
  elem.querySelectorAll('div > pre > code').forEach((code) => {
      let baseline = parseInt(code.parentNode.parentNode.getAttribute("data-ln"));
      // Assuming markdownit.js wraps code in <pre><code> elements
      let lines = code.innerHTML.split('\n');
      let numberedLines = lines.map((line, index) => {
          // Wrap each line in a span with a data-ln attribute; adjust as needed
          return `<span data-ln="${baseline + index + 1}">${line}</span>`;
      }).join('\n');
      code.innerHTML = numberedLines;
  });
}