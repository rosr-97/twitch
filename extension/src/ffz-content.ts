const styleNode = document.createElement("style");
styleNode.setAttribute("type", "text/css");
styleNode.id = "ffz-minasona-styles-badges";
document.head.appendChild(styleNode);

let badgeCSSRules = [];

// Starts listening for FFZ setting changes.
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (typeof event.data !== 'object' || event.data === null) return;

  if (typeof event.data?.FFZ_BADGE_IMAGES_SETTING === 'boolean')
    switchCSSRule(!event.data.FFZ_BADGE_IMAGES_SETTING, `.minasona-icon-container .ffz-badge { display: none !important; }`);
});

/**
 * Enables or disables a CSS rule by adding or removing it from the style node.
 * @param enable whether to enable or disable the rule
 * @param rule the CSS rule to add or remove
 */
function switchCSSRule(enable: boolean, rule: string) {
  if (!enable)
    badgeCSSRules = badgeCSSRules.filter(r => !r.includes(rule));
  else if (!badgeCSSRules.some(r => r.includes(rule)))
    badgeCSSRules.push(rule)
  
  styleNode.textContent = badgeCSSRules.join('\n');
}