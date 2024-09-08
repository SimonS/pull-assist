chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analysePR") {
    extractPRData()
      .then((prData) => {
        sendResponse({ prData }); // Send the data after the async function completes
      })
      .catch((error) => {
        console.error("Error extracting PR data:", error);
        sendResponse({ error: "Failed to extract PR data" });
      });

    return true;
  }
});

async function extractPRData(): Promise<any> {
  const url = window.location.href;
  const prNumberMatch = url.match(/\/pull\/(\d+)/);
  const repoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);

  if (!prNumberMatch || !repoMatch) {
    throw new Error("Unable to extract PR number or repository info from URL");
  }

  const prNumber = prNumberMatch[1];
  const owner = repoMatch[1];
  const repo = repoMatch[2];

  const pat = await chrome.storage.sync.get("pat").then(({ pat }) => pat);

  if (!pat) {
    throw new Error("PAT not found. Please set it in the options page.");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    {
      headers: {
        Authorization: `token ${pat}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const files = await response.json();
  const diffData = files.map((file: any) => ({
    filename: file.filename,
    patch: file.patch,
  }));

  return diffData;
}
