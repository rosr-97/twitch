export interface PalsonaEntry {
  iconUrl: string;
  fallbackIconUrl: string;
  imageUrl: string;
  fallbackImageUrl: string;
}

export interface MinasonaStorage {
  [username: string]: { [communityName: string]: PalsonaEntry };
}
