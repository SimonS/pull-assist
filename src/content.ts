chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analysePR") {
    const prData = extractPRData();
    sendResponse({ data: prData });
  }
  return true;
});

function extractPRData(): string {
  // Your logic to extract PR data from the page
  return "PR Data";
}
