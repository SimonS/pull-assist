document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("api-key-form") as HTMLFormElement;
  const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
  const status = document.getElementById("status") as HTMLParagraphElement;

  // Load and display the saved API key when the options page is loaded
  chrome.storage.sync.get("apiKey", (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ apiKey }, () => {
      status.textContent = "API Key saved!";
      setTimeout(() => {
        status.textContent = "";
      }, 2000);
    });
  });
});
