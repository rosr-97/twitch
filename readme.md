# Minasona Twitch Icons

See cute Minawan not only in the stream but in the chat as well!

This extension displays the Minasona of a Minawan as a badge right next to their username in Twitch chat. It's a neat addon to the chat and helps people get to know everyone's Minasonas better.
Additionally it can display other Palsonas from communities within the circle.

Settings:
- Location: Choose to show icons only in Cerber's chat or enable them globally across all of Twitch.
- Priority List: Rank the prioritiy of different Palsona categories and toggle them on or off.
  - Minasonas: Displays Minawans Minasonas.
  - Currently watched channel Palsonas: Displays the Palsona of the currently watched community.
  - Other channel Palsonas: Diplays other communities Palsonas.
  - Default Minasonas: Toggle "standard" Minasonas on or off for those who don't have a custom one yet.
- Limit Palsonas: Decide how many icons there should be for each user by limiting them.
- Size: Use the slider to make the chat icons smaller or larger.

## Out Now

### Chrome v1.3
https://chromewebstore.google.com/detail/minasona-twitch-icons/paoappdblefbmihfcjbmcebhdgabfkib

### Edge v1.3
https://microsoftedge.microsoft.com/addons/detail/minasona-twitch-icons/annkpdgajokhpgdncdcfjmadjpafbecp

### Opera v1.3
[Download from chrome store](https://chromewebstore.google.com/detail/minasona-twitch-icons/paoappdblefbmihfcjbmcebhdgabfkib)

### Firefox v1.3
https://addons.mozilla.org/firefox/addon/minasona-twitch-icons/

## Changelog

### 1.4
- Supports Palsonas from multiple communities
  - The display of Palsonas for a user is decided by the user selected priority list
- Fetches API updates more regularly

- Firefox: Fixed a bug where the extension didn't receive any updates after reopening the browser.

### 1.3
- You can now **set your own Minasona** on the website: https://minawan.me/ Login with Discord and make sure you have your Twitch account linked. Thanks Hoopywan!
- More robust username detection
  - hopefully pronouns extension and FFZ should work Prayge
- **VOD** support (enable 'Show Minasonas in other Chats')
- Larger onclick images

### 1.2
- Firefox support

### 1.1
- wan wan
- removed unused image in order to pass store requirements checks

### 1.0

- Extension working for chromium based browsers

## Docs

### Building the extension

_Use Node v22.14.0_

1. Install dependencies:
```console
cd extension
npm install
```

2. Build the extension (chromium):
```console
node build.js chrome
```
### or
2. Build the extension (firefox):
```console
node build.js firefox
```

3. You can find the files for the extension inside `dist/`.

### Structure of the project

- `background.ts` is the background script of the extension. It is used to fetch the user list from the API and store it in the local browser storage.
- `content.ts` is the frontend script. It can interact with the web page and is used to read the usernames in the chat and create and insert the corresponding icons.
- `popup.html` / `popup.js` is the popup displayed when opening the extension settings. The html handles the display of the popup while the js file stores the settings in the local browser storage.
