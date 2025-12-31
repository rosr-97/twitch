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
    
    if (attempts % 40 === 0) {// 10 attempts or give up
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
    icon: 'https://raw.githubusercontent.com/minasona-extension/twitch/refs/heads/main/extension/assets/Minawan_Purple.webp'
  };
  
  function addons_ready(event) {
    class MinasonaTwitchExtension extends window.FrankerFaceZ.utilities.addon.Addon {
      get isEnabled() {
        return this.settings.get('addon.minasona_twitch_extension.badges');
      }
      
      constructor(...args) {
        super(...args);
        
        this.inject('chat');
        this.inject('chat.badges');
        this.inject('settings');
        this.inject("site.router");
        
        this.users = new Map();
        this.localBadges = new Map();
        
        this.settings.add('addon.minasona_twitch_extension.badges', {
          default: true,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General',
            title: 'Enable Badges',
            description: 'Show all available Minasona user badges.',
            component: 'setting-check-box',
          },
          changed: (val) => this.updateBadges()
        });
        
        this.settings.add('addon.minasona_twitch_extension.everywhere', {
          default: false,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General > Minasona Settings',
            title: 'Enable Everywhere',
            description: 'Show Minasonas in other chats.',
            component: 'setting-check-box',
          },
          changed: (val) => this.postSettings()
        });
        
        this.settings.add('addon.minasona_twitch_extension.everywan', {
          default: false,
          ui: {
            path: 'Add-Ons > Minasona Twitch Extension >> General > Minasona Settings',
            title: 'Enable For Everywan',
            description: 'Show Minasonas for everywan.',
            component: 'setting-check-box',
          },
          changed: (val) => this.postSettings()
        });
        
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
          changed: (val) => this.postSettings()
        });
        
        this.enable();
        
        this.postSettings();
        window.postMessage({ FFZ_MINASONATWITCHEXTENSION_READY: true });
      }
      
      /**
      * Posts the current settings of the addon to the content script.
      * @param {Object} options - An object containing the current settings of the addon.
      * @property {string} FFZ_MINASONATWITCHEXTENSION_SETTING_SIZE - The size of the Minasona badge.
      * @property {boolean} FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWHERE - Whether to show Minasona badges in other chats.
      * @property {boolean} FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWAN - Whether to show Minasona badges for everywan.
      */
      postSettings() {
        // probs fixes invalidated context
        const options = {
          FFZ_MINASONATWITCHEXTENSION_SETTING_SIZE: this.settings.get('addon.minasona_twitch_extension.iconsize'),
          FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWHERE: this.settings.get('addon.minasona_twitch_extension.everywhere'),
          FFZ_MINASONATWITCHEXTENSION_SETTING_EVERYWAN: this.settings.get('addon.minasona_twitch_extension.everywan'),
        };
        
        window.postMessage(options);
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
        
        this.router.on(":route", this.router_route.bind(this));
        
        this.updateBadges();
      }
      
      /**
      * Creates a hash code from a string.
      */
      getGenericHashCode(chain: string) {
        let hash = 0;
        for (let i = 0; i < chain.length; i++) {
          hash = (hash << 5) - hash + chain.charCodeAt(i);
          hash = hash | 0;
        }
        return `${hash}`;
      }
      
      /**
       * Refreshes the addon badge configuration on location change.
       */
      router_route(event) {
        // some form of memory cleaning
        this.users.clear();
        this.localBadges.clear();
        this.updateBadges();
      }
      
      /**
      * Registers a new badge for a specific user.
      */
      async registerUserBadge(userId: string, username: string, imageUrl: string, iconUrl: string, isGeneric: boolean) {
        const _userId = isGeneric ? this.getGenericHashCode(iconUrl) : userId;
        const badgeId = this.getBadgeID(_userId, isGeneric);
        const user = this.chat.getUser(userId);
        const hasBadge = user.getBadge(badgeId) !== null;
        if (hasBadge) return;
        
        if (!this.localBadges.get(badgeId)) {
          // Loads badge data and reduce requests
          const data = {
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
          };
          
          this.localBadges.set(badgeId, true);
          this.badges.loadBadgeData(badgeId, data);
        }
        
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
      getBadgeID(userId: string, isGeneric: boolean) {
        return `addon.minasona_twitch_extension.badge${isGeneric ? '_generic' : ''}-${userId}`;
      }
    }
    
    (MinasonaTwitchExtension as any).register('addon.minasona_twitch_extension', metadata);
  }
})();