chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analysePR") {
    extractPRData()
      .then((prData: DiffData[]) => {
        sendResponse({ prData });
      })
      .catch((error) => {
        console.error("Error extracting PR data:", error);
        sendResponse({ error: "Failed to extract PR data" });
      });

    return true;
  }
  if (request.action === "displayResults") {
    console.log("displayResults");
    console.log(request.advice);
    displayResults(request.advice);
  }
});

type DiffData = {
  filename: string;
  patch: string;
};

async function extractPRData(): Promise<DiffData[]> {
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
  const diffData: DiffData[] = files.map((file: any) => ({
    filename: file.filename,
    patch: file.patch,
  }));

  return diffData;
}

function displayResults(advice: Advice[]) {
  advice.forEach((item) => {
    const fileElement = document.querySelector(
      `[data-path="${item.filename}"]`
    );
    if (!fileElement) return;

    const diffTable =
      fileElement.nextElementSibling?.querySelector(".diff-table");
    if (!diffTable) return;

    const adviceElement = document.createElement("tr");
    adviceElement.className = "pr-suggestion";
    adviceElement.innerHTML = `
      <td colspan="4" class="pr-suggestion-content">
        <div class="pr-suggestion-text">${item.advice}</div>
      </td>
    `;

    // Add click event listener to toggle expansion
    const contentElement = adviceElement.querySelector(
      ".pr-suggestion-content"
    );
    if (contentElement) {
      contentElement.addEventListener("click", () => {
        contentElement.classList.toggle("expanded");
      });
    }

    // Insert the advice after the relevant lines
    const lineElements = diffTable.querySelectorAll(
      ".js-file-line[data-split-side='right']"
    );
    let inserted = false;
    for (let i = 0; i < lineElements.length; i++) {
      // const lineNumber = lineElements[i].getAttribute("data-line-number");
      const lineNumber = lineElements[i]
        ?.querySelector("[data-line]")
        ?.getAttribute("data-line");
      if (
        lineNumber &&
        parseInt(lineNumber) > parseInt(item.lines.split("-")[0])
      ) {
        lineElements[i]
          ?.closest("tbody")
          ?.insertBefore(adviceElement, lineElements[i].closest("tr"));
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      diffTable.appendChild(adviceElement);
    }
  });
}
