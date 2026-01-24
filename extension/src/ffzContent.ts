const styleNode = document.createElement("style");
styleNode.setAttribute("type", "text/css");
styleNode.id = "ffz-minasona-styles-badges";

const badgeCSSRules = new Map<string, string>();

// Starts listening for FFZ setting changes.
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (typeof event.data !== 'object' || event.data === null) return;

  document.head.contains(styleNode) || document.head.appendChild(styleNode);

  if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_READY === 'boolean') {// 🍚
    switchCSSRule(true, `/*0*/.ffz-badge[data-badge^="addon.minasona_twitch_extension.badge"] ~ .minasona-icon-container`, `display: none;`);
    switchCSSRule(true, `/*0*/.chat-line__username  .minasona-icon-container`, `display: none;`);
    switchCSSRule(true, `/*0*/.minasona-icon-container:has(+ .ffz-badge[data-badge^="addon.minasona_twitch_extension.badge"])`, `display: none;`);
    switchCSSRule(true, `/*0*/.minasona-icon-container`, `display: none;`);
    switchCSSRule(true, `/*0*/.ffz--tab-container .ffz--menu-container [for^="addon.minasona_twitch_extension.badge"] .ffz-badge.ffz-tooltip`, `
      background-size: contain; 
      background-repeat: no-repeat;
    `);
  }

  if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_ISCURRENTCHANNELALLOWED === 'boolean'
    && typeof event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWINOTHERCHATS === 'boolean') {
    const isCurrentChannelAllowed = event.data?.FFZ_MINASONATWITCHEXTENSION_ISCURRENTCHANNELALLOWED;
    const showInOtherChats = event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWINOTHERCHATS;
    switchCSSRule(!showInOtherChats && !isCurrentChannelAllowed, `/*1*/.ffz-badge[data-badge^="addon.minasona_twitch_extension.badge"]`, `display: none;`);
  }

  if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWFOREVERYONE === 'boolean')
    switchCSSRule(!event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWFOREVERYONE, `/*2*/.ffz-badge[data-badge^="addon.minasona_twitch_extension.badge_generic"]`, `display: none;`);

  if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_ICONSIZE === 'string') {
    switchCSSRule(true, '/*3*/.ffz-badge[data-badge^="addon.minasona_twitch_extension.badge"]', `
      min-width: ${event.data.FFZ_MINASONATWITCHEXTENSION_ICONSIZE}px; 
      height: ${event.data.FFZ_MINASONATWITCHEXTENSION_ICONSIZE}px; 
    `);
  }
});

/**
 * Enables or disables a CSS rule by adding or removing it from the style node.
 * @param enable whether to enable or disable the rule
 * @param rule the CSS rule to add or remove
 */
function switchCSSRule(enable: boolean, match: string, css: string) {
  badgeCSSRules.delete(match);
  if (enable)
    badgeCSSRules.set(match, css);
  const cssText = Array.from(badgeCSSRules.entries()).map(([m, c]) => `${m} { ${c} }`).join('\n');
  styleNode.innerHTML = cssText;
}