let mediaRecorder;
let audioChunks = [];
const micButton = document.getElementById("mic-toggle");

micButton.addEventListener("click", async () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", async () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData
          });
          const data = await response.json();
          if (data.text) {
            // Append transcribed text to existing textarea content
            const textarea = document.getElementById("text-input");
            textarea.value += data.text;
          } else {
            alert(data.error || "Transcription failed.");
          }
        } catch (err) {
          console.error("Transcription error:", err);
          alert("Error during transcription.");
        }
      });

      mediaRecorder.start();
      micButton.innerHTML = '<i class="fa-solid fa-stop"></i>';
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone.");
    }
  } else {
      mediaRecorder.stop();
      micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
  }
});
