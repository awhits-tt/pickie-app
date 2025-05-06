/**
 * Sends user text or transcribed text to the backend for feature extraction,
 * then redirects to the visualization page.
 */
async function processInput(text) {
  if (!text) {
    alert("Please provide some input before sending.");
    return;
  }
  try {
    const response = await fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      // proceed to visualization placeholder
      window.location.href = "/visualization";
    }
  } catch (err) {
    console.error("Processing error:", err);
    alert("An error occurred while processing your input.");
  }
}

// Bind text-send button
document.getElementById("send-text").addEventListener("click", () => {
  const text = document.getElementById("text-input").value.trim();
  processInput(text);
});
