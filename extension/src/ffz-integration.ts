(function () {
  let baseConfig: { showInOtherChats?: boolean; showForEveryone?: boolean; iconSize?: string } = {};
  function handleMessage(event) {
    if (event.source !== window) return;
    baseConfig = {
      showInOtherChats: baseConfig.showInOtherChats ?? event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWINOTHERCHATS as boolean,
      showForEveryone: baseConfig.showForEveryone ?? event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWFOREVERYONE as boolean,
      iconSize: baseConfig.iconSize ?? event.data?.FFZ_MINASONATWITCHEXTENSION_ICONSIZE as string
    };
    // Check if any property is not null
    if (baseConfig.showInOtherChats !== null ||
      baseConfig.showForEveryone !== null ||
      baseConfig.iconSize !== null
    )
      window.removeEventListener('message', handleMessage);
  }
  window.addEventListener('message', handleMessage);

  let attempts = 0;
  new MutationObserver((mutationsList, observer) => {
    attempts++;

    if (attempts % 10 === 0) {// 10 attempts or give up
      observer.disconnect();
      console.log("Minasona: FFZ addon observer disconnected after 10 attempts");
      return;
    }

    if (typeof window.FrankerFaceZ === 'undefined') return;
    if (!window.FrankerFaceZ.instance?.addons) return;

    window.FrankerFaceZ.instance.addons.on(':ready', addons_ready);
    console.log("Minasona FFZ addon initialized");
    observer.disconnect();
  }).observe(document.body, { childList: true, subtree: true });

  const metadata = {
    name: 'Minasona Twitch Extension',
    short_name: 'MinasonaTwitchExtension',
    author: 'HellPingwan',
    maintainer: 'rosrwan',
    description: 'Creates a minasona badge for minawan.',
    version: '1.3',
    website: 'https://github.com/minasona-extension/twitch',
    enabled: true,
    requires: [],
    settings: 'add_ons.minasona_twitch_extension',
    icon: 'data:image/avif;base64,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'
  };

  function addons_ready(event) {
    class MinasonaTwitchExtension extends window.FrankerFaceZ.utilities.addon.Addon {
      set showInOtherChats(val) {
        if (this._showInOtherChats === val) return;
        this._showInOtherChats = val;
      }

      get showInOtherChats() {
        return this._showInOtherChats ?? baseConfig.showInOtherChats;
      }

      get isSuspended() {
        const isNotSuspended = this.showInOtherChats
          || window.location.pathname.toLowerCase()
            .split("/").filter((seg) => seg.length > 0)[0] === 'cerbervt';

        return !isNotSuspended;
      }

      get isEnabled() {
        return this.settings.get('addon.minasona_twitch_extension.badges');
      }

      constructor(...args) {
        super(...args);

        this.inject('chat');
        this.inject('chat.badges');
        this.inject('settings');

        this.users = new Map();

        this.settings.add('addon.minasona_twitch_extension.badges', {
          default: true,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General',
            title: 'Enable badges',
            description: 'Show all available Minasona user badges',
            component: 'setting-check-box',
          },
          changed: (val) => this.updateBadges()
        });

        this.settings.add('addon.minasona_twitch_extension.everywhere', {
          default: false,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> Badges',
            title: 'Enable everywhere',
            description: 'Show Minasonas in other chats.',
            component: 'setting-check-box',
          },
          changed: (val) => window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWHERE: val })
        });

        this.settings.add('addon.minasona_twitch_extension.everywan', {
          default: false,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> Badges',
            title: 'Enable for everywan',
            description: 'Show Minasonas for everywan.',
            component: 'setting-check-box',
          },
          changed: (val) => window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWAN: val })
        });

        this.settings.add("addon.minasona_twitch_extension.iconsize", {
          default: '32',
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> Badges',
            title: 'Minasona size',
            description: 'Size of the Minasona badge between `(21 - 64)`.',
            component: 'setting-text-box',
            process: (newVal, _oldVal) => {
              const number = Number(newVal) || Number(_oldVal) || 32;
              const iconSize = number <= 21 ? 21 : number >= 64 ? 64 : number;
              return `${iconSize}`;
            },
          },
          changed: (val) => window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETTING_SIZE: val })
        });

        this.enable();

        const options = {
          FFZ_MINASONATWITCHEXTENSION_SETTING_SIZE: this.settings.get('addon.minasona_twitch_extension.iconsize'),
          FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWHERE: this.settings.get('addon.minasona_twitch_extension.everywhere'),
          FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWAN: this.settings.get('addon.minasona_twitch_extension.everywan'),
        };

        window.postMessage(options);
        window.postMessage({ FFZ_MINASONATWITCHEXTENSION_READY: true });
      }

      onEnable() {
        window.addEventListener('message', ((event) => {
          // Refresh badges upon changing the setting
          if (event.source !== window) return;
          if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWFOREVERYONE !== 'boolean') return;
          if (!this.isEnabled) return;
          this.updateBadges();
        }).bind(this));

        window.addEventListener('message', ((event) => {
          // Refresh badges upon changing the setting
          if (event.source !== window) return;
          if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWINOTHERCHATS !== 'boolean') return;
          if (!this.isEnabled) return;
          this.showInOtherChats = event.data?.FFZ_MINASONATWITCHEXTENSION_SHOWINOTHERCHATS;
          this.updateBadges();
        }).bind(this));

        window.addEventListener('message', ((event) => {
          // Creates a new badge
          if (event.source !== window) return;
          if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_BADGE !== 'object') return;
          if (!this.isEnabled) return;

          const userId = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.userId;
          if (this.users.has(userId)) return;

          const isGeneric = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.isGeneric;
          const imageUrl = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.imageUrl;
          const iconUrl = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.iconUrl;
          const username = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.username;
          this.users.set(userId, { username, imageUrl, iconUrl, isGeneric });

          this.registerUserBadge(userId, username, imageUrl, iconUrl, isGeneric);
        }).bind(this));

        this.updateBadges();
      }

      /**
       * Retrieves an string hash code equivalent.
       */
      hashCode(chain:string) {
        let hash = 0;
        for (let i = 0; i < chain.length; i++) {
          hash = (hash << 5) - hash + chain.charCodeAt(i);
          hash = hash | 0;
        }
        return `${hash}`;
      }

      /**
      * Registers a new badge for a specific user.
      */
      async registerUserBadge(userId: string, username: string, imageUrl: string, iconUrl: string, isGeneric: boolean) {
        if (this.isSuspended) return;

        const _userId = isGeneric ? this.hashCode(iconUrl) : userId;
        const badgeId = this.getBadgeID(_userId, isGeneric);
        const user = this.chat.getUser(userId);
        const hasBadge = user.getBadge(badgeId) !== null;
        if (hasBadge) return;

        this.badges.loadBadgeData(badgeId, {
          id: `minasona-preview`,
          title: isGeneric ? null : username,
          slot: 99,
          image: iconUrl ?? imageUrl,
          urls: {
            1: iconUrl,
            2: iconUrl,
            4: imageUrl,
          },
          click_url: null,
          svg: false,
        });

        user.addBadge('addon.minasona_twitch_extension', badgeId);
        this.emit('chat:update-lines-by-user', userId);
      }

      /**
      * Refreshes the addon badge configuration.
      */
      async updateBadges() {
        for (const user of this.chat.iterateUsers())
          user.removeAllBadges('addon.minasona_twitch_extension');

        if (this.isEnabled) {
          for (const [userId, { username, imageUrl, iconUrl, isGeneric }] of this.users.entries()) 
            this.registerUserBadge(userId, username, imageUrl, iconUrl, isGeneric);
        }

        this.emit('chat:update-lines');
      }

      /**
      * Recovers an identifier to be used by a badge.
      */
      getBadgeID(userId:string, isGeneric:boolean) {
        return `addon.minasona_twitch_extension.badge${isGeneric ? '_generic' : ''}-${userId}`;
      }
    }

    (MinasonaTwitchExtension as any).register('addon.minasona_twitch_extension', metadata);
  }
})();