(function () {
  const metadata = {
    name: 'Minasona Twitch Extension',
    short_name: 'Minasona Twitch Extension',
    author: 'HellPingwan',
    maintainer: 'rosrwan',
    description: 'See cute Minawan not only in the stream but in the chat as well! Displays Minasonas as a badge right next to a username in the chat.',
    version: '1.3',
    website: 'https://github.com/minasona-extension/twitch',
    enabled: true,
    requires: [],
    settings: 'add_ons.minasona_twitch_extension',
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
  new MutationObserver((mutationsList, observer) => {
    attempts++;

    if (attempts % 40 === 0) {
      observer.disconnect();
      console.log(`Failed to initialize Minasona FFZ addon after ${attempts} attempts`);
      return;
    }

    if (typeof window.FrankerFaceZ === 'undefined') return;
    if (!window.FrankerFaceZ.instance?.addons) return;

    window.FrankerFaceZ.instance.addons.on(':ready', addons_ready);
    console.log(`Minasona FFZ addon initialized after ${attempts} attempts`);
    observer.disconnect();
  }).observe(document.body, { childList: true, subtree: true });

  /**
   * Called when the FrankerFaceZ addon is ready.
   * @param {Event} event - The event that triggered the callback.
   * @property {boolean} FFZ_MINASONATWITCHEXTENSION_READY - Whether the addon is ready.
   */
  function addons_ready(event) {
    class MinasonaTwitchExtension extends window.FrankerFaceZ.utilities.addon.Addon {
      /**
       * Returns whether the addon is enabled.
       * @returns {boolean} Whether the addon is enabled.
       */
      get isEnabled() {
        return this.settings.get('addon.minasona_twitch_extension.badges');
      }

      constructor(...args) {
        super(...args);

        this.inject('chat');
        this.inject('chat.badges');
        this.inject('settings');
        this.inject('site.router');

        this.users = new Map();

        this.settings.add('addon.minasona_twitch_extension.badges', {
          default: true,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General',
            title: 'Enable Badges',
            description: 'Show all available Minasona user badges.',
            component: 'setting-check-box',
          },
        });
        this.settings.getChanges('addon.minasona_twitch_extension.badges', 
          (val) => this.updateBadges());

        this.settings.add('addon.minasona_twitch_extension.everywhere', {
          default: false,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General > Minasona Settings',
            title: 'Enable Everywhere',
            description: 'Show Minasonas in other chats.',
            component: 'setting-check-box',
          },
        });
        this.settings.getChanges('addon.minasona_twitch_extension.everywhere', 
          (val) => window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWHERE: val }));

        this.settings.add('addon.minasona_twitch_extension.everywan', {
          default: false,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General > Minasona Settings',
            title: 'Enable For Everywan',
            description: 'Show Minasonas for everywan.',
            component: 'setting-check-box',
          },
        });
        this.settings.getChanges('addon.minasona_twitch_extension.everywan',
          (val) => window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWAN: val }));

        this.settings.add("addon.minasona_twitch_extension.iconsize", {
          default: '32',
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General > Minasona Settings',
            title: 'Badge Size',
            description: 'Size of the Minasona badge between `21 to 64`.',
            component: 'setting-text-box',
            process: (newVal, _oldVal) => {
              const number = Number(newVal) || Number(_oldVal) || 32;
              const iconSize = number <= 21 ? 21 : number >= 64 ? 64 : number;
              return `${iconSize}`;
            },
          },
        });
        this.settings.getChanges("addon.minasona_twitch_extension.iconsize", 
          (val) => window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETTING_SIZE: val }));

        this.enable();
        window.postMessage({ FFZ_MINASONATWITCHEXTENSION_READY: true });
      }

      onEnable() {
        window.addEventListener('message', ((event) => {
          // Creates a new badge
          if (event.source !== window) return;
          if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_BADGE !== 'object') return;
          if (!this.isEnabled) return;

          const userId = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.userId;
          const isGeneric = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.isGeneric;
          const imageUrl = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.imageUrl;
          const iconUrl = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.iconUrl;
          const username = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.username;

          this.registerUserBadge(userId, username, imageUrl, iconUrl, isGeneric);
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
       * Registers a new badge for a specific user.
       */
      async registerUserBadge(userId: string, username: string, imageUrl: string, iconUrl: string, isGeneric: boolean) {
        if (this.users.get(userId)) return;

        const baseId = `addon.minasona_twitch_extension.badge${(isGeneric ? '_generic' : '')}`;
        const user = this.chat.getUser(userId);
        if (user.getBadge(baseId) !== null) return;

        const _userId = isGeneric ? getGenericHashCode(iconUrl) : `${userId}`;
        if (_userId === undefined || _userId === null || _userId === "0") return;

        const badgeId = `${baseId}-${_userId}`;
        const wanEx = new RegExp(".*(wan)$", "i");
        const fileEx = new RegExp("([\\w.-]+\\/)(\\w+)_(\\d+)x(\\d+)\\.(\\w+)", "i");
        const minawan = wanEx.exec(username)?.[0] ?? fileEx.exec((imageUrl ?? iconUrl))?.[2]
          ?.replace(new RegExp("minasona", "i"), username);// guessing minawan name
        const title = isGeneric ? `Minawan\n(${defaultMinasonaMap.get(_userId)?.name})` : `${minawan ?? username}`;

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
        for (const [userId, { badge_id }] of this.users)
          this.badges.removeBadge(badge_id);

        this.users.clear();

        for (const user of this.chat.iterateUsers())
          user.removeAllBadges('addon.minasona_twitch_extension');

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
})();