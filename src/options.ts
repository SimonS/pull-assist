document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("api-key-form") as HTMLFormElement;
  const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
  const patInput = document.getElementById("pat") as HTMLInputElement;
  const status = document.getElementById("status") as HTMLParagraphElement;

  chrome.storage.sync.get(["apiKey", "pat"], (data) => {
    apiKeyInput.value = data.apiKey ?? "";
    patInput.value = data.pat ?? "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const apiKey = apiKeyInput.value;
    const pat = patInput.value;
    chrome.storage.sync.set({ apiKey, pat }, () => {
      status.textContent = "Options saved!";
      setTimeout(() => {
        status.textContent = "";
      }, 2000);
    });
  });
});
