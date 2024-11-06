document.getElementById("submitBtn").addEventListener("click", () => {
  const selectedRating = document.querySelector('input[name="rating"]:checked').value;
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: automateFeedback,
      args: [selectedRating]
    });
  });
});

function automateFeedback(selectedRating) {
  // Check for an iframe, but operate at the top level if it's blocked
  const iframe = document.querySelector("iframe");

  // Access iframe if allowed, or assume elements are in the top document if blocked
  const documentContext = iframe ? iframe.contentWindow.document : document;
  
  const radioButtons = documentContext.querySelectorAll('input[type="radio"]');
  for (let radioButton of radioButtons) {
    if (radioButton.value === selectedRating) {
      radioButton.checked = true;
    }
  }

  const textarea = documentContext.querySelector("textarea");
  if (textarea) {
    textarea.value = "This is a very useful course";
  } else {
    alert("Feedback textarea not found!");
  }
}
