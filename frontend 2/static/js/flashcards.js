document.getElementById("confirm-btn").addEventListener("click", async () => {
  const sentiment = document.getElementById("feature-sentiment").value;
  const genre = document.getElementById("feature-genre").value.trim();
  const mood = document.getElementById("feature-mood").value.trim();
  const length = document.getElementById("feature-length").value;

  const features = { sentiment, genre, mood, length };
  try {
    const response = await fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features })
    });
    const data = await response.json();
    if (data.status === "ok") {
      window.location.href = "/results";
    } else {
      alert("Failed to confirm features.");
    }
  } catch (err) {
    console.error("Confirmation error:", err);
    alert("Error sending features to server.");
  }
});
