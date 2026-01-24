import browser from "webextension-polyfill";

document.addEventListener("DOMContentLoaded", async () => {
  // init states
  const showInOtherChatsCheckbox = document.getElementById("showInOtherChats");
  const showForEveryoneCheckbox = document.getElementById("showForEveryone");
  const showOtherPalsonasCheckbox = document.getElementById("showOtherPalsonas");
  const showAllPalsonasCheckbox = document.getElementById("showAllPalsonas");

  const iconSize = document.getElementById("iconSize");
  const labelText = document.getElementById("rangeLabel");
  const minasonaIcon = document.querySelector(".minasona-icon");

  const result = await browser.storage.sync.get(["showInOtherChats", "showForEveryone", "showOtherPalsonas", "showAllPalsonas", "iconSize"]);
  showInOtherChatsCheckbox.checked = result.showInOtherChats ?? true;
  showForEveryoneCheckbox.checked = result.showForEveryone ?? false;
  showOtherPalsonasCheckbox.checked = result.showOtherPalsonas ?? true;
  showAllPalsonasCheckbox.checked = result.showAllPalsonas ?? false;
  showAllPalsonasCheckbox.disabled = !showOtherPalsonasCheckbox.checked;

  iconSize.value = result.iconSize || 32;
  labelText.innerText = `${result.iconSize || 32} Pixels`;
  minasonaIcon.style.height = `${result.iconSize || 32}px`;

  // save new state when user toggles the checkbox
  showInOtherChatsCheckbox.addEventListener("change", () => {
    const isChecked = showInOtherChatsCheckbox.checked;
    // save to storage
    browser.storage.sync.set({ showInOtherChats: isChecked });
  });

  showForEveryoneCheckbox.addEventListener("change", () => {
    const isChecked = showForEveryoneCheckbox.checked;
    browser.storage.sync.set({ showForEveryone: isChecked });
  });

  showOtherPalsonasCheckbox.addEventListener("change", () => {
    const isChecked = showOtherPalsonasCheckbox.checked;
    browser.storage.sync.set({ showOtherPalsonas: isChecked, showAllPalsonas: false });
    showAllPalsonasCheckbox.disabled = !isChecked;
    showAllPalsonasCheckbox.checked = false;
  });

  showAllPalsonasCheckbox.addEventListener("change", () => {
    const isChecked = showAllPalsonasCheckbox.checked;
    browser.storage.sync.set({ showAllPalsonas: isChecked });
  });

  // icon size slider
  iconSize.addEventListener("input", () => {
    labelText.innerText = `${iconSize.value} Pixels`;
    minasonaIcon.style.height = `${iconSize.value}px`;
  });

  iconSize.addEventListener("change", () => {
    browser.storage.sync.set({ iconSize: iconSize.value });
  });
});
