import type { PalsonaEntry } from "./types";

class MinasonaFrankerFaceZAddonHelper extends Object {
  /**
   * Checks if FrankerFaceZ is ready
   */
  get isFrankerFaceZReady(): boolean {
    return this._isFrankerFaceZReady;
  }

  private _isFrankerFaceZReady: boolean = false;
  private _callbacks: Map<string, ((...args) => void)[]> = new Map<string, ((...args) => void)[]>();

  constructor(...args: any[]) {
    super(...args);
    this.frankerFaceZListener();
  }

  /**
   * Loads badges from storage
   */
  loadBadgesFromStorage() {
    if (!this.isFrankerFaceZReady) return;
    const ffzCommunities: string[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities")) ?? [];
    this.emit('loading-local-badges', ffzCommunities);
    for (const community of ffzCommunities)
      this.postCommunityBadge(community);
  }

  /**
   * Posts a refresh message to FFZ
   */
  postRefresh() {
    if (!this.isFrankerFaceZReady) return;
    this.emit('refresh', this);
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_REFRESH: true });
  }

  /**
   * Sets the addon icon in FFZ
   */
  postAddonMetadata(metadata: any) {
    this.emit('posting-metadata', metadata);
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_SETMETADATA: { ...metadata } });// pushes the ffz addon icon
  }

  /**
   * Listens for messages from FrankerFaceZ.
   */
  frankerFaceZListener() {
    window.addEventListener('message', async (event) => {
      if (event.source !== window) return;
      if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_SETUP !== "boolean") return;
      this.emit('setup', this);
    });

    window.addEventListener('message', async (event) => {
      if (event.source !== window) return;
      if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_READY !== "boolean") return;
      this._isFrankerFaceZReady = event.data?.FFZ_MINASONATWITCHEXTENSION_READY;
      this.on('ready', this.loadBadgesFromStorage.bind(this));
      this.emit('ready', this);
    });
  }

  /**
   * Registers a community badge in FFZ
   * @param community Name of the community
   * @param iconUrl URL of the community icon
   * @param genericBadges List of generic badge URLs
   */
  postCommunityBadge(community: string, iconUrl?: string, genericBadges?: string[]) {
    if (!this.isFrankerFaceZReady) return;
    this.emit('posting-community-badge', { community: community, icon: iconUrl, generics: genericBadges });
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY: { community: community, icon: iconUrl, generics: genericBadges } });
  }

  /**
   * Post badge blueprint to FFZ
   */
  postBadgeBlueprint(node: HTMLElement, ps: PalsonaEntry, index: number, username: string, iconSize: number, isGeneric: boolean) {
    if (!this.isFrankerFaceZReady) return;
    
    this.emit('posting-badge-blueprint', { node: node, ps: ps, index: index, username: username, iconSize: iconSize, isGeneric: isGeneric });
    const community = /(\w+)\/((\w+)(-backfill)?)\/((\w+)\/)?(\w+)_(\d+)x(\d+)\.(\w+)/i.exec(ps.iconUrl ?? ps.imageUrl)?.[3] ?? "minawan";// backfill counts

    let ffzCommunities: string[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities")) ?? [];
    if (!ffzCommunities.includes(community)) {
      ffzCommunities.push(community);
      localStorage.setItem("FFZ:minasona-twitch-icons.communities", JSON.stringify(ffzCommunities));
    }

    // add click listener for popover
    node.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset?.badge !== `addon.minasona_twitch_extension.badge_${community}`) return;
      e.preventDefault();
      e.stopPropagation();
      this.emit('show-minasona-popover', target, ps.imageUrl, ps.fallbackImageUrl);
    });

    // send badge blueprint to FFZ if available
    window.postMessage({
      FFZ_MINASONATWITCHEXTENSION_BADGE: {
        index: index,
        userId: node.querySelector<HTMLElement>("[data-user-id]")?.dataset?.userId ?? 0,
        iconUrl: ps.iconUrl,
        imageUrl: ps.imageUrl,
        username: username,
        isGeneric: isGeneric,
        iconSize: iconSize,
        community: community
      }
    });
  }

  /**
   * Registers a callback
   */
  on(event: string, callback: (...args) => void) {
    const callbacks = this._callbacks[event]?.filter(cb => cb !== callback) ?? [];
    callbacks.push(callback);
    this._callbacks[event] = callbacks;
  }

  /**
   * Removes a callback
   */
  off(event: string, callback: (...args) => void) {
    const callbacks = this._callbacks[event]?.filter(cb => cb !== callback) ?? [];
    this._callbacks[event] = callbacks;
  }

  /**
   * Emits an event
   */
  emit(event: string, ...args) {
    for (const cb of this._callbacks[event] ?? [])
      cb?.(...args);
  }
}

export { MinasonaFrankerFaceZAddonHelper };