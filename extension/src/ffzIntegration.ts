const metadata = {
  name: 'Minasona Twitch Icons',
  short_name: 'Minasona Twitch Icons',
  author: 'HellPingwan',
  maintainer: 'rosrwan',
  description: 'See cute Minawan not only in the stream but in the chat as well! Displays Minasonas as a badge right next to a username in the chat.',
  version: '1.4',
  website: 'https://github.com/minasona-extension/twitch',
  enabled: true,
  requires: [],
};

const defaultMinasonaMap = new Map<string, { name: string; url: string; }>();
const handleDefaultMinasonaMapMessage = (event) => {
  // Parse the generic minawan map.
  if (event.source !== window) return;
  if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_ADDDEFAULTMINASONA !== 'string') return

  const hash = getGenericHashCode(event.data?.FFZ_MINASONATWITCHEXTENSION_ADDDEFAULTMINASONA);
  const name = {
    '2083528344': 'green',
    '565463058': 'red',
    '1392454998': 'purple',
    '1607130226': 'yellow',
    '-549969585': 'blue',
  }[hash];
  if (!name) return;

  defaultMinasonaMap.set(hash, { name, url: event.data?.FFZ_MINASONATWITCHEXTENSION_ADDDEFAULTMINASONA });

  if (defaultMinasonaMap.size < 5) return;
  window.removeEventListener('message', handleDefaultMinasonaMapMessage);
};
window.addEventListener('message', handleDefaultMinasonaMapMessage);

let attempts = 0;
let current_callback = function (mutationsList: MutationRecord[], observer: MutationObserver) {
  attempts++;
  if (attempts % 10 === 0) {
    observer.disconnect();
    console.log(`Failed to initialize Minasona FFZ addon after ${attempts} attempts`);
    return;
  }
  if (!document.head.querySelector('#ffz_script, #ffz-script')) return;// find the FFZ script before deciding to wait (script | extension)
  current_callback = ffzObserver_callback;
  observer.observe(document.body, { childList: true, subtree: true });
  console.log(`Minasona FFZ addon initialized after ${attempts} attempts`);
};

new MutationObserver((mutationsList: MutationRecord[], observer: MutationObserver) => {
  current_callback?.(mutationsList, observer);
}).observe(document.head, { childList: true, subtree: true });

/**
 * Called when the FrankerFaceZ addon is ready.
 * @param {Event} event - The event that triggered the callback.
 * @property {boolean} FFZ_MINASONATWITCHEXTENSION_READY - Whether the addon is ready.
 */
function addons_ready(event) {
  const { ManagedStyle } = FrankerFaceZ.utilities.dom;

  class MinasonaTwitchExtension extends FrankerFaceZ.utilities.addon.Addon {
    constructor(...args: any) {
      super(...args);

      this.inject('chat');
      this.inject('chat.badges');
      this.inject('site.router');

      this.users = new Map();
      this.style = new ManagedStyle();
      this.style.set('default', `
        .minasona-icon-container { 
          display: none; 
        }
        .ffz--tab-container .ffz--menu-container [for^="addon.minasona_twitch_extension.badge"] .ffz-badge.ffz-tooltip {
          background-size: contain; 
          background-repeat: no-repeat;
        }
      `);

      this.enable();
      window.postMessage({ FFZ_MINASONATWITCHEXTENSION_READY: true });
    }

    onEnable() {
      window.addEventListener('message', ((event) => {
        // Creates a new badge
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_BADGE !== 'object') return;

        const userId = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.userId;
        const isGeneric = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.isGeneric;
        const imageUrl = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.imageUrl;
        const iconUrl = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.iconUrl;
        const username = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.username;
        const index = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.index;

        this.registerPalsonaTemplate(index);
        this.registerUserBadge(index, userId, username, imageUrl, iconUrl, isGeneric);
      }).bind(this));

      window.addEventListener('message', ((event) => {
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_BADGE !== 'object') return;
        const iconSize = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.iconSize;

        this.style.set('size', `
          .ffz-badge[data-badge^="addon.minasona_twitch_extension.badge"] {
            min-width: ${iconSize}px;
            height: ${iconSize}px;
          }
        `);
      }).bind(this));

      window.addEventListener('message', ((event) => {
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_REFRESH !== 'boolean') return;
        if (!event.data.FFZ_MINASONATWITCHEXTENSION_REFRESH) return;
        this.updateBadges();
      }).bind(this));

      this.router.on(":route", this.updateBadges.bind(this));

      this.badges.loadBadgeData("addon.minasona_twitch_extension.badge_generic", {
        base_id: "addon.minasona_twitch_extension.badge_generic",
        addon: "minasona_twitch_extension",
        title: "Base Minawan",
        no_visibility: true,
        css: 'background-size: contain;background-repeat: no-repeat;',
      });

      this.badges.loadBadgeData("addon.minasona_twitch_extension.badge", {
        base_id: "addon.minasona_twitch_extension.badge",
        addon: "minasona_twitch_extension",
        title: "Minawan",
        image: defaultMinasonaMap.get('1392454998')?.url,
        css: 'background-size: contain;background-repeat: no-repeat;',
      });

      for (const [hash, { name, url }] of defaultMinasonaMap) {
        this.badges.loadBadgeData(`addon.minasona_twitch_extension.badge_generic-${hash}_undefined`, {
          base_id: "addon.minasona_twitch_extension.badge_generic",
          addon: "minasona_twitch_extension",
          title: "Base Minawan",
          image: url,
          tooltipExtra: () => `\n(${name})`,
        });
      }
    }

    /**
     * Registers a new template for a palsona icon.
     * @param index The index of the palsona template to register.
     */
    registerPalsonaTemplate(index: number) {// new template
      this.palsonaCounter ??= 0;
      if (this.palsonaCounter <= index) return;

      this.badges.loadBadgeData(`addon.minasona_twitch_extension.badge_palsona${index}`, {
        base_id: `addon.minasona_twitch_extension.badge_palsona${index}`,
        addon: "minasona_twitch_extension",
        title: "Palsona",
        no_visibility: true,
        css: 'background-size: contain;background-repeat: no-repeat;',
      });

      this.palsonaCounter++;
    }

    /**
     * Registers a new badge for a specific user.
     */
    async registerUserBadge(index: number, userId: string, username: string, imageUrl: string, iconUrl: string, isGeneric: boolean) {
      if (this.users.get(userId)) return;

      const baseId = `addon.minasona_twitch_extension.badge${index > 0 ? `_palsona${index}` : ''}${(isGeneric ? '_generic' : ``)}`;
      const user = this.chat.getUser(userId);
      if (user.getBadge(baseId) !== null) return;

      const _userId = isGeneric ? getGenericHashCode(iconUrl) : `${userId}`;
      if (_userId === undefined || _userId === null || _userId === "0") return;

      const badgeId = `${baseId}-${_userId}`;
      const wanEx = new RegExp(".*(wan)$", "i");
      const fileEx = new RegExp("([\\w.-]+\\/)(\\w+)_(\\d+)x(\\d+)\\.(\\w+)", "i");
      const minawan = wanEx.exec(username)?.[0] ?? fileEx.exec((imageUrl ?? iconUrl))?.[2]
        ?.replace(new RegExp("minasona", "i"), username);// guessing minawan name
      const title = index > 0 ? `${username}` : (isGeneric ? `Minawan\n(${defaultMinasonaMap.get(_userId)?.name})` : `${minawan ?? username}`);

      if (!isGeneric) {
        this.badges.loadBadgeData(badgeId, {// visual dummy
          base_id: baseId,
          addon: "minasona_twitch_extension",
          title: title,
          image: iconUrl ?? imageUrl,
        });
      }

      const options = {
        addon: "minasona_twitch_extension",
        badge_id: badgeId,
        base_id: baseId,
        title: title,
        slot: 99,
        image: iconUrl ?? imageUrl,
        urls: {
          1: iconUrl,
          2: iconUrl,
          4: imageUrl,
        },
      };

      this.users.set(userId, options);

      user.addBadge('addon.minasona_twitch_extension', baseId, options);
      this.emit('chat:update-lines-by-user', userId);
    }

    /**
     * Refreshes the addon badge configuration.
     */
    async updateBadges() {
      for (const user of this.chat.iterateUsers())
        user.removeAllBadges('addon.minasona_twitch_extension');

      for (const [userId, { badge_id }] of this.users)
        this.badges.removeBadge(badge_id);

      this.users.clear();
      this.emit('chat:update-lines');
    }
  }

  (MinasonaTwitchExtension as any).register('minasona_twitch_extension', { ...metadata, icon: defaultMinasonaMap.get('1392454998')?.url });
}

/**
 * Creates a hash code from a string.
 */
function getGenericHashCode(chain: string) {
  let hash = 0;
  for (let i = 0; i < chain.length; i++) {
    hash = (hash << 5) - hash + chain.charCodeAt(i);
    hash = hash | 0;
  }
  return `${hash}`;
}

/**
 * Called when the FrankerFaceZ addon is ready to be used.
 * This function is a callback for a MutationObserver that is listening for the
 * FrankerFaceZ script to be loaded into the page.
 * When the script is found, this function is called and it sets up the
 * FrankerFaceZ addon to listen for the ':ready' event.
 * When the ':ready' event is triggered, the addons_ready function is called.
 * @param {MutationRecord[]} mutationsList - A list of mutations that triggered this callback.
 * @param {MutationObserver} observer - The MutationObserver that triggered this callback.
 */
function ffzObserver_callback(mutationsList: MutationRecord[], observer: MutationObserver) {
  if (typeof FrankerFaceZ === 'undefined') return;
  if (!FrankerFaceZ.instance?.addons) return;
  FrankerFaceZ.instance.addons.on(':ready', addons_ready);
  observer.disconnect();
}