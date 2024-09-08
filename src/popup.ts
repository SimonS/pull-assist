document.addEventListener("DOMContentLoaded", () => {
  const analyseButton = document.getElementById("analyse") as HTMLButtonElement;
  analyseButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { action: "analysePR" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log("received response:", response);
          }
        }
      );
    });
  });
});
