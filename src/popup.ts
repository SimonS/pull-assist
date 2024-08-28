document.addEventListener("DOMContentLoaded", () => {
  const analyseButton = document.getElementById("analyse") as HTMLButtonElement;
  analyseButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { action: "analysePR" },
        (response) => {
          console.log(response.data);
        }
      );
    });
  });
});
