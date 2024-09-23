type Changes = {
  filename: string;
  patch: string;
};

type Advice = {
  filename: string;
  lines: string;
  advice: string;
};

type DiffData = {
  filename: string;
  patch: string;
};

async function analysePRWithLLM(diffData: DiffData[]): Promise<Advice[]> {
  const changes = diffData
    .map(({ filename, patch }) => `${filename}:\n${patch}`)
    .join("\n\n");

  const prompt = `
    You are an expert software engineer helping to review a GitHub pull request. Below are the changes made to the code. Identify any low-hanging fruit, such as:

    1. Poorly named variables or functions.
    2. Overly complex or nested logic.
    3. Redundant or inefficient code.
    4. Code that violates common coding practices or style guidelines.

    For each issue, provide a brief explanation and a suggestion for improvement. 

    Format your response as a JSON array, where each element is an object with the following structure:
    {
      "filename": "string",
      "lines": "string",
      "advice": "string"
    }

    Ensure that your entire response is a valid JSON array.

    Changes:
    ${changes}
  `;

  // Retrieve the API key from storage
  const apiKeyFromStorage = await new Promise<string>((resolve) => {
    chrome.storage.sync.get(["apiKey"], (result) => {
      resolve(result.apiKey || "");
    });
  });

  if (!apiKeyFromStorage) {
    throw new Error("OpenAI API key not found in storage");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKeyFromStorage}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed: ${response.status}`);
  }

  const data = await response.json();
  const parsedData: Advice[] = JSON.parse(
    data.choices[0].message.content.trim()
  );
  return parsedData;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analysePR") {
    analysePRWithLLM(request.prData)
      .then((advice: Advice[]) => {
        sendResponse({ advice });
      })
      .catch((error: Error) => {
        console.error("Error analyzing PR:", error);
        sendResponse({ error: error.message });
      });
    return true; // Indicates that the response is asynchronous
  }
});
