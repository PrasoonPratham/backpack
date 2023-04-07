chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle the message from the background script
  console.log(request);
});
