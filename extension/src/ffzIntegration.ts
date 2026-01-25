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
  icon: 'data:image/avif;base64,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',
};

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

      this.communities = [];
      this.users = new Map<string, any>();
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

        const userId: string = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.userId;
        const isGeneric: boolean = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.isGeneric;
        const imageUrl: string = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.imageUrl;
        const iconUrl: string = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.iconUrl;
        const username: string = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.username;
        const community: string = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.community;

        this.registerUserBadge(community, userId, username, imageUrl, iconUrl, isGeneric);
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

      window.addEventListener('message', ((event) => {
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY !== 'object') return;

        const community = event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.community;
        if (this.communities.includes(community)) return;
        
        this.communities.push(community);
        if (event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.generics) {// define generics
          const baseId = `addon.minasona_twitch_extension.badge_${community}_generic`;
          this.badges.loadBadgeData(baseId, {
            base_id: baseId,
            addon: "minasona_twitch_extension",
            title: toTitleCase(`Base ${community}`),
            no_visibility: true,
            css: 'background-size: contain;background-repeat: no-repeat;',
          });// template

          const defaultMap = Object.values(event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.generics);
          for (const url of defaultMap) {
            const hash = getGenericHashCode(`${url}`);
            const name = {
              '2083528344': 'green',
              '565463058': 'red',
              '1392454998': 'purple',
              '1607130226': 'yellow',
              '-549969585': 'blue',
            }[hash] ?? null;
            if (community === 'minawan' && !name) continue;
            this.registerGeneric(hash, community, name, `${url}`);
          }
        }

        const imageUrl = event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.icon;
        this.registerTemplate(community, imageUrl);
      }))

      this.router.on(":route", this.updateBadges.bind(this));
    }

    /**
     * Registers a new template for a community icon.
     * @param index The index of the palsona template to register.
     */
    registerTemplate(community: string, imageUrl: string) {
      this.style.set(`template_${community}`, `
        .ffz--tab-container .ffz--menu-container [for^="addon.minasona_twitch_extension.badge"] .ffz-badge.ffz-tooltip[title="${toTitleCase(community)}"] {
          display: none;
        }
      `);
      
      const badgeId = `addon.minasona_twitch_extension.badge_${community}`;
      this.badges.loadBadgeData(badgeId, {
        base_id: badgeId,
        addon: "minasona_twitch_extension",
        title: toTitleCase(community),
        image: imageUrl,
        css: 'background-size: contain;background-repeat: no-repeat;',
      }, true);
    }

    /**
     * Registers a new generic for a community icon.
     * @param index The index of the palsona template to register.
     */
    registerGeneric(hash: string, community: string, name: string, imageUrl: string) {
      const badgeId = `addon.minasona_twitch_extension.badge_${community}_generic-${hash}_undefined`;
      this.badges.loadBadgeData(badgeId, {
        base_id: `addon.minasona_twitch_extension.badge_${community}_generic`,
        addon: "minasona_twitch_extension",
        title: toTitleCase(`Base ${community}`),
        image: imageUrl,
        css: 'background-size: contain;background-repeat: no-repeat;',
        tooltipExtra: () => `\n(${name})`,
      });
    }

    /**
     * Registers a new badge for a specific user.
     */
    async registerUserBadge(community: string, userId: string, username: string, imageUrl: string, iconUrl: string, isGeneric: boolean) {
      const baseId = `addon.minasona_twitch_extension.badge_${community}${(isGeneric ? '_generic' : ``)}`;
      const user = this.chat.getUser(userId);
      if (user.getBadge(baseId) !== null) return;

      const _userId = isGeneric ? getGenericHashCode(iconUrl) : `${userId}`;
      if (_userId === undefined || _userId === null || _userId === "0") return;

      const badgeId = `${baseId}-${_userId}`;
      if (this.users.get(badgeId) && !isGeneric) return;

      const wanEx = new RegExp(".*(wan)$", "i");
      const fileEx = new RegExp("([\\w.-]+\\/)(\\w+)_(\\d+)x(\\d+)\\.(\\w+)", "i");
      const minawan = wanEx.exec(username)?.[0] ?? fileEx.exec((imageUrl ?? iconUrl))?.[2]
        ?.replace(new RegExp("minasona", "i"), username);// guessing minawan name
      const name = community === "minawan" ? `${minawan ?? username}` : `${username}`;

      if (!isGeneric) {
        this.badges.loadBadgeData(badgeId, {// visual dummy
          base_id: baseId,
          addon: "minasona_twitch_extension",
          title: toTitleCase(`${community}`),
          image: iconUrl ?? imageUrl,
          tooltipExtra: () => `\n(${name})`,
        });
      }
      
      const genericName = {
        '2083528344': 'green',
        '565463058': 'red',
        '1392454998': 'purple',
        '1607130226': 'yellow',
        '-549969585': 'blue',
      }[_userId] ?? null;

      const options = {
        addon: "minasona_twitch_extension",
        badge_id: badgeId,
        base_id: baseId,
        title: isGeneric ? `Minawan\n(${genericName})` : name,
        slot: 99 + this.communities.indexOf(community),
        image: iconUrl ?? imageUrl,
        urls: {
          1: iconUrl,
          2: iconUrl,
          4: imageUrl,
        },
      };

      this.users.set(badgeId, options);

      user.addBadge(`addon.minasona_twitch_extension`, baseId, options);
      this.emit('chat:update-lines-by-user', userId);
    }

    /**
     * Refreshes the addon badge configuration.
     */
    async updateBadges() {
      for (const user of this.chat.iterateUsers())
        user.removeAllBadges('addon.minasona_twitch_extension');

      for (const [badgeId, { badge_id }] of this.users)
        this.badges.removeBadge(badge_id);

      this.users.clear();
      this.emit('chat:update-lines');
    }
  }

  (MinasonaTwitchExtension as any).register('minasona_twitch_extension', metadata);
}

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 */
function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
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