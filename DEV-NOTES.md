# Challenge: scrolling to the right position in the composer textarea

Two methods:

- **Safari**
  get text-area content, split at cursor position; put first half in clone of textarea, determine scroll height in that clone, scroll to that position in the textarea

- **All other browsers**
  no workarounds needed. Behavior differs over browsers a bit, some center cursor position in vertical middle, others don't, but it's always visible. It's a bit beter performance this way. If I want to control it more I can always switch to Safari's method.

# Challenge: scrolling to the right position in the composer preview

Situation:

- In **Safari**, in many cases the preview-wrapper increases in height _after_ the event handler has already scrolled to the correct position. This means that towards the second half of the preview misalignments starts increasing to the level of falling out of the wrapper. This can be 'fixed' by having delaying some input onInput/onKeyup bventHandlers, but this introduces flicker every so many characters typed.

You can fully fix the problem by enabling the `enable_diffhtml_preview` sitesetting. This gives an (acceptably) slower preview performance in Safari.

- However, in **all other browsers** enabling this `diffhtml` setting leads to an unacceptably decreased rendering performance, and extreme increase in latency between textarea character input and the appearance of the character in the textarea itself. This can be mitigated by introducing a debounce increase by overriding [the function that contains line](https://github.com/discourse/discourse/blob/6f3c498b83169928aba316246ddc9b5d584c5a0d/app/assets/javascripts/discourse/app/components/d-editor.js#L505), but you have to accept that the preview updates with a considerable lag in that case.

So we're in a bind here. Enable diff_html for Safari at the expence of all other browser performance, or disable it and accept terrible flicker in Safari.

Possible solution:

- Disable `diffhtml` and use the browser's native `ResizeObserver` function. This function can trigger my own eventHandler on resize of the `preview` element, but before the paint action. This will allow scroll to be set. This should combine the best of both worlds.

Outcome:

x ResizeObserver doesn't trigger, so it's definitely not that.

Other option:

- Use Ember's schedule({afteradopt: ...}) >> doesn't work either

Found solution:

- Make sure the `.d-editor-preview` element's height cannot become smaller when updating it's contents due to editing! You can do this setting the `min-height` on the element to the current height of the element (or a bit bigger?) before discourse updates the contents of the element. Then it will never collapse and you won't have any trouble! I think it has something to do with the way the browser.
