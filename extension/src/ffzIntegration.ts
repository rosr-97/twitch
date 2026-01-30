let metadata: {} = undefined;
window.addEventListener('message', addOnMetadata_callBack);

let attempts = 0;
let current_callback = ffzScriptObserver_callback;
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

        if (!this.communities.includes(community))// register community if missing
          this.registerTemplate(community, iconUrl ?? imageUrl);

        if (this.style.has(`--ffz-minasona-badge-undefined-${community}`) && !this.style.has(`--ffz-minasona-badge-undefined-${community}-image`))
          this.style.set(`--ffz-minasona-badge-undefined-${community}-image`, `:root { --ffz-minasona-badge-undefined-${community}-image: url("${iconUrl ?? imageUrl}"); }`);

        this.registerUserBadge(community, userId, username, imageUrl, iconUrl, isGeneric);
      }).bind(this));

      window.addEventListener('message', ((event) => {
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_REFRESH !== 'boolean') return;
        if (!event.data.FFZ_MINASONATWITCHEXTENSION_REFRESH) return;
        this.updateBadges();
      }).bind(this));

      window.addEventListener('message', ((event) => {
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_BADGE !== 'object') return;
        const iconSize = event.data.FFZ_MINASONATWITCHEXTENSION_BADGE.iconSize;
        this.style.set('size', `.ffz-badge[data-badge^="addon.minasona_twitch_extension.badge"] { min-width: ${iconSize}px; height: ${iconSize}px; }`);
      }).bind(this));

      window.addEventListener('message', ((event) => {
        if (event.source !== window) return;
        if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY !== 'object') return;

        const community = event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.community;
        if (this.communities.includes(community)) return;

        if (event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.generics) {// define generics
          const defaultMap = Object.values(event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.generics);
          this.registerTemplate(`base ${community}`, defaultMap[0] as string);

          for (const url of defaultMap) {
            const hash = getGenericHashCode(`${url}`);
            this.registerGeneric(hash, `base ${community}`, `${url}`);
          }
        }

        const imageUrl = event.data.FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY.icon;
        this.registerTemplate(community, imageUrl);
      }).bind(this));

      this.router.on(':route', this.updateBadges.bind(this));
    }

    /**
     * Registers a new template for a community icon.
     * @param index The index of the palsona template to register.
     */
    registerTemplate(community: string, imageUrl: string) {
      const communityId = community.replace(/\s+/i, '_');
      const badgeId = `addon.${metadata.addon}.badge_${communityId}`;

      imageUrl || this.style.set(`--ffz-minasona-badge-undefined-${community}`, `
        img[src^="--ffz-minasona-badge-undefined-${community}"], 
        .ffz-badge.preview-image[style*="--ffz-minasona-badge-undefined-${community}"]
        {
          background-image: var(--ffz-minasona-badge-undefined-${community}-image) !important;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          content-visibility: hidden;
        }
      `);// process image later

      this.style.set(`template_${communityId}`, `
        .ffz--tab-container .ffz--menu-container [for^="addon.minasona_twitch_extension.badge"] .ffz-badge.ffz-tooltip[title="${toTitleCase(community)}"]:first-child { display: none; }
      `);

      this.badges.loadBadgeData(badgeId, {
        base_id: badgeId,
        addon: metadata.addon,
        title: toTitleCase(community),
        image: imageUrl ?? `--ffz-minasona-badge-undefined-${community}`,
        css: 'background-size: contain;background-repeat: no-repeat;',
      });

      this.communities.push(community);
    }

    /**
     * Registers a new generic for a community icon.
     * @param index The index of the palsona template to register.
     */
    registerGeneric(hash: string, community: string, imageUrl: string) {
      const baseId = `addon.${metadata.addon}.badge_${community.replace(/\s+/i, '_')}`;
      const badgeId = `${baseId}-${hash}_undefined`;// protects them from deletion
      this.badges.loadBadgeData(badgeId, {
        base_id: baseId,
        addon: metadata.addon,
        title: toTitleCase(`${community}`),
        image: imageUrl,
        css: 'background-size: contain;background-repeat: no-repeat;',
      });
    }

    /**
     * Registers a new badge for a specific user.
     */
    async registerUserBadge(community: string, userId: string, username: string, imageUrl: string, iconUrl: string, isGeneric: boolean) {
      const baseId = `addon.${metadata.addon}.badge_${(isGeneric ? 'base_' : '')}${community}`;
      const user = this.chat.getUser(userId);
      if (user.getBadge(baseId) !== null) return;

      const _userId = isGeneric ? getGenericHashCode(iconUrl) : `${userId}`;
      if (_userId === undefined || _userId === null || _userId === "0") return;

      const badgeId = `${baseId}-${_userId}`;
      if (this.users.get(badgeId) && !isGeneric) return;

      const minawan = /^([\d_]+)?([A-Za-z_]+?(wan))([\d_-]+)?$/i.exec(username)?.[2]?.replace(/[\d_-]+/i, '')
        ?? /([\w.-]+\/)(\w+)_(\d+)x(\d+)\.(\w+)/i.exec((imageUrl ?? iconUrl))?.[2]?.replace(/minasona/i, username);// guessing minawan name
      const name = community === 'minawan' ? `${minawan ?? username}` : `${username}`;

      if (!isGeneric) {
        this.badges.loadBadgeData(badgeId, {// visual dummy
          base_id: baseId,
          addon: metadata.addon,
          title: toTitleCase(`${community}`),
          image: iconUrl ?? imageUrl,
          tooltipExtra: () => `\n(${name})`,
        });
      }

      const options = {
        addon: metadata.addon,
        badge_id: badgeId,
        base_id: baseId,
        title: isGeneric ? toTitleCase(`${community}`) : name,
        slot: 99 + this.communities.indexOf(community),
        image: iconUrl ?? imageUrl,
        urls: {
          1: iconUrl,
          2: iconUrl,
          4: imageUrl,
        }
      };

      this.users.set(badgeId, options);

      user.addBadge(`addon.${metadata.addon}`, baseId, options);
      this.emit('chat:update-lines-by-user', userId);
    }

    /**
     * Refreshes the addon badge configuration.
     */
    async updateBadges() {
      for (const user of this.chat.iterateUsers())
        user.removeAllBadges(`addon.${metadata.addon}`);

      for (const [badgeId, { badge_id }] of this.users)
        this.badges.removeBadge(badge_id);

      this.users.clear();
      this.emit('chat:update-lines');
    }
  }

  (MinasonaTwitchExtension as any).register(metadata.addon, metadata);
}

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 */
function toTitleCase(text: string) {
  return `${text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())}`;
}

/**
 * Creates a hash code from a string.
 */
function getGenericHashCode(chain: string) {
  let hash = 0;
  for (let index = 0; index < chain.length; index++) {
    hash = (hash << 5) - hash + chain.charCodeAt(index);
    hash = hash | 0;
  }
  return `${hash}`;
}

/**
 * Called when the FrankerFaceZ addon is ready to be used.
 * @param {MutationRecord[]} mutationsList - A list of mutations that triggered this callback.
 * @param {MutationObserver} observer - The MutationObserver that triggered this callback.
 */
function ffzObserver_callback(mutationsList: MutationRecord[], observer: MutationObserver) {
  if (typeof FrankerFaceZ === 'undefined') return;
  if (!FrankerFaceZ.instance?.addons) return;
  FrankerFaceZ.instance.addons.on(':ready', addons_ready);
  observer.disconnect();
}

/**
 * Called to search for the FrankerFaceZ script.
 * @param {MutationRecord[]} mutationsList - A list of mutations that triggered this callback.
 * @param {MutationObserver} observer - The MutationObserver that triggered this callback.
 */
function ffzScriptObserver_callback(mutationsList: MutationRecord[], observer: MutationObserver) {
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
}

/**
 * Outpost to parse the icon for the addon.
 */
function addOnMetadata_callBack(event) {
  if (event.source !== window) return;
  if (typeof event.data.FFZ_MINASONATWITCHEXTENSION_SETMETADATA !== 'object') return;
  metadata = event.data.FFZ_MINASONATWITCHEXTENSION_SETMETADATA;
  metadata = {
    ...metadata,
    short_name: metadata.name,
    addon: 'minasona_twitch_extension',
    enabled: true,
    requires: []
  };
  window.removeEventListener('message', addOnMetadata_callBack);
}