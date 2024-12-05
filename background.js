chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("https://app.getsequence.io/account-list")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    console.log("Content script injected.");
  } else {
    console.log("This extension works only on https://app.getsequence.io/account-list.");
  }
});

