import type { PalsonaEntry } from "./types";

class MinasonaFrankerFaceZAddonHelper extends Object {
  /**
   * Checks if FrankerFaceZ is ready
   */
  get isFrankerFaceZReady(): boolean {
    return this._isFrankerFaceZReady;
  }

  private _storageInterval: NodeJS.Timeout = null;
  private _isFrankerFaceZReady: boolean = false;
  private _onShowMinasonaPopoverCallback: ((target: HTMLElement, imageUrl: string, fallbackImageUrl: string) => void)[] = [];
  private _onReadyCallbacks: ((self: MinasonaFrankerFaceZAddonHelper) => void)[] = [];

  constructor(...args: any[]) {
    super(...args);
    this.frankerFaceZListener();
  }

  /**
   * Loads badges from storage
   */
  loadBadgesFromStorage() {
    if (!this.isFrankerFaceZReady) return;
    const ffzCommunities: { community: string, iconUrl: string }[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities")) ?? [];
    for (const { community, iconUrl } of ffzCommunities)
      this.postCommunityBadge(community, iconUrl);
  }

  /**
   * Posts a refresh message to FFZ
   */
  postRefresh() {
    if (!this.isFrankerFaceZReady) return;
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_REFRESH: true });
  }

  /**
   * Sets the addon icon in FFZ
   */
  postAddonMetadata(metadata: any) {
    window.postMessage({
      FFZ_MINASONATWITCHEXTENSION_SETMETADATA: {
        ...metadata,
        author: 'HellPingwan',
        maintainer: 'rosrwan',
        website: 'https://github.com/minasona-extension/twitch',
      }
    });// pushes the ffz addon icon
  }

  /**
   * Listens for messages from FrankerFaceZ.
   */
  frankerFaceZListener() {
    window.addEventListener('message', async (event) => {
      if (event.source !== window) return;
      if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_READY !== "boolean") return;
      this._isFrankerFaceZReady = event.data?.FFZ_MINASONATWITCHEXTENSION_READY;
      if (!this.isFrankerFaceZReady) return;
      this.onReady(this.loadBadgesFromStorage.bind(this));
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
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY: { community: community, icon: iconUrl, generics: genericBadges } });
  }

  /**
   * Post badge blueprint to FFZ
   */
  postBadgeBlueprintToFFZ(node: HTMLElement, ps: PalsonaEntry, username: string, iconSize: number, isGeneric: boolean) {
    if (!this.isFrankerFaceZReady) return;
    const community = /(\w+)\/((\w+)(-backfill)?)\/((\w+)\/)?(\w+)_(\d+)x(\d+)\.(\w+)/i.exec(ps.iconUrl ?? ps.imageUrl)?.[3] ?? "minawan";// backfill counts

    clearInterval(this._storageInterval);// spam prevention
    this._storageInterval = setTimeout(() => {
      let ffzCommunities: { community: string, iconUrl: string }[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities")) ?? [];
      ffzCommunities = ffzCommunities.filter(item => item.community !== community);// remove existing
      ffzCommunities.push({ community: community, iconUrl: ps.iconUrl });// add new
      localStorage.setItem("FFZ:minasona-twitch-icons.communities", JSON.stringify(ffzCommunities));
    }, 800);

    // add click listener for popover
    node.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset?.badge !== `addon.minasona_twitch_extension.badge_${community}`) return;
      e.preventDefault();
      e.stopPropagation();
      this.onShowMinasonaPopover(target, ps.imageUrl, ps.fallbackImageUrl);
    });

    // send badge blueprint to FFZ if available
    window.postMessage({
      FFZ_MINASONATWITCHEXTENSION_BADGE: {
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
   * Called when FFZ addon is ready.
   */
  onReady(callback?: (self: MinasonaFrankerFaceZAddonHelper) => void) {
    callback && this._onReadyCallbacks.push(callback);
    if (!this.isFrankerFaceZReady) return;
    for (const cb of this._onReadyCallbacks)
      cb?.(this);
  }

  /**
   * Registers a callback function for showing the minasona popover.
   */
  onShowMinasonaPopover(callback: (target: HTMLElement, imageUrl: string, fallbackImageUrl: string) => void): void;

  /**
   * Triggers the onshowminasonapopover event.
   */
  onShowMinasonaPopover(target: HTMLElement, imageUrl: string, fallbackImageUrl: string): void;

  /**
   * Registers a callback function for showing the minasona popover or triggers the onshowminasonapopover event.
   */
  onShowMinasonaPopover(...args): void {
    if (args.length === 1 && typeof args[0] === "function") {
      this._onShowMinasonaPopoverCallback.push(args[0]);
    } 
    else if (args.length === 3 && args[0] instanceof HTMLElement && typeof args[1] === "string" && typeof args[2] === "string") {
      const [target, imageUrl, fallbackImageUrl] = args;
      if (!this.isFrankerFaceZReady) return;
      for (const cb of this._onShowMinasonaPopoverCallback)
        cb?.(target, imageUrl, fallbackImageUrl);
    }
  }
}

export { MinasonaFrankerFaceZAddonHelper };