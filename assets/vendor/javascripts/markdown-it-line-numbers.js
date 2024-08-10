/* eslint-disable */
(function(f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.markdownitLineNumbers = f() } })(function() { var define, module, exports; return (function() { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function(r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]); return o } return r })()({ 1: [function(require, module, exports) {

// add data-ln=<markdown line number> to every DOM element.
'use strict';

module.exports = function line_numbers_plugin(md) {

    // NOTE: Line numbers within codeblocks are added as a normal discourse decorator in another file.

    // Store the original fence renderer for later use
    const defaultRender = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    // Override the fence renderer to wrap the content in a div with class and data-ln attribute
    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
        // Get the current token and its line number
        const token = tokens[idx];
        const tokenLine = token.map ? token.map[0] : '';

        // Wrap the default fence rendering in a div with class and data-ln attribute
        return `<div data-ln="${tokenLine}">` + defaultRender(tokens, idx, options, env, self) + '</div>';
    };

    function markdownItLineNumber(md) {
        // Function to recursively add line numbers to tokens
        function addLineNumberToTokens(tokens, lastKnownLine) {
            tokens.forEach(token => {
                let tokenLine = lastKnownLine;

                // Update the line number if the token has its own line mapping
                if (token.map) {
                    tokenLine = token.map[0];
                    lastKnownLine = tokenLine;
                }

                // Add line number to opening tags, self-closing tags, and fences
                if (token.type.endsWith('_open') || token.type === 'inline' || token.type.endsWith('_self') || token.type === 'fence') {
                    token.attrSet('data-ln', tokenLine.toString());
                }

                // If the token has children, recursively process them
                if (token.children && token.children.length) {
                    addLineNumberToTokens(token.children, lastKnownLine);
                }
            });
        }

        // Hook into the 'render' rule
        md.core.ruler.push('add_line_numbers', state => {
            addLineNumberToTokens(state.tokens, 0); // Start with line number 0
        });
    }

    md.use(markdownItLineNumber);

    // // FOR DEBUGGING: render final html to console
    // const originalRender = md.render.bind(md);
    // md.render = (...args) => {
    //     const result = originalRender(...args);
    //     console.log(result); // Print the final HTML to the console
    //     return result;
    // };

};

        }, {}]
    }, {}, [1])(1)
});