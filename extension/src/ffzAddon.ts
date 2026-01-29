import type { PalsonaEntry } from "./types";

class MinasonaFrankerFaceZAddonHelper extends Object {
  /**
   * Checks if FrankerFaceZ is ready
   */
  get isFrankerFaceZReady(): boolean {
    return this._isFrankerFaceZReady;
  }
  private _isFrankerFaceZReady: boolean = false;

  public showMinasonaPopoverCallback: (target: HTMLElement, imageUrl: string, fallbackImageUrl: string) => void = null;
  public defaultCommunityMap: Map<string, string[]> = new Map();

  constructor(...args: any[]) {
    super(...args);
    this.frankerFaceZListener();
  }

  /**
   * Posts a refresh message to FFZ
   */
  refresh() {
    if (!this.isFrankerFaceZReady) return;
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_REFRESH: true });
  }

  /**
   * Sets the addon icon in FFZ
   */
  setAddonMetadata(metadata: any) {
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

      this.registerCommunityBadge("minawan", this.defaultCommunityMap.get("minawan")?.[4], this.defaultCommunityMap.get("minawan")?.filter((_, index) => index % 2 === 0));// adds the community

      const ffzCommunities: { community: string, iconUrl: string }[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities"));
      for (const { community, iconUrl } of ffzCommunities)
        this.registerCommunityBadge(community, iconUrl);
    });
  }

  /**
   * Registers a community badge in FFZ
   * @param community Name of the community
   * @param iconUrl URL of the community icon
   * @param genericBadges List of generic badge URLs
   */
  registerCommunityBadge(community: string, iconUrl?: string, genericBadges?: string[]) {
    if (!this.isFrankerFaceZReady) return;
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY: { community: community, icon: iconUrl, generics: genericBadges } });
  }

  /**
   * Post badge blueprint to FFZ
   */
  postBadgeBlueprintToFFZ(node: HTMLElement, ps: PalsonaEntry, username: string, iconSize: number) {
    if (!this.isFrankerFaceZReady) return;
    const community = /(\w+)\/((\w+)(-backfill)?)\/((\w+)\/)?(\w+)_(\d+)x(\d+)\.(\w+)/i.exec(ps.iconUrl ?? ps.imageUrl)?.[3] ?? "minawan";// backfill counts

    clearInterval(this.storageInterval);// spam prevention
    this.storageInterval = setTimeout(() => {
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
      this.showMinasonaPopoverCallback?.(target, ps.imageUrl, ps.fallbackImageUrl);
    });

    const isGeneric = this.defaultCommunityMap?.get(community)?.includes(ps.iconUrl)
      || this.defaultCommunityMap?.get(community)?.includes(ps.imageUrl);

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
}

export { MinasonaFrankerFaceZAddonHelper };