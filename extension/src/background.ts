import browser from "webextension-polyfill";

// fetches the minasona list from the server and stores it into the local browser storage
async function updateMinasonaMap() {
  try {
    const response = await fetch(`https://us-central1-minasona-twitch-extension.cloudfunctions.net/getMinasonas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    browser.storage.local.set({ minasonaMap: data });
    console.log("Minasona map updated");
  } catch (error) {
    console.error("Failed to fetch minasonas: ", error);
  }
}

// update on install and then every 60 mins
browser.runtime.onInstalled.addListener(() => {
  updateMinasonaMap();
  browser.alarms.create("refreshMinasonas", { periodInMinutes: 60 });
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refreshMinasonas") {
    updateMinasonaMap();
  }
});
