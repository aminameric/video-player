const videoElement = document.createElement("video");
videoElement.src = "video.mp4"; // Replace with your real video
videoElement.controls = true;
videoElement.autoplay = true;
videoElement.muted = true;

// Add styles to restrict its size and make it responsive
videoElement.style.width = "100%";
videoElement.style.height = "auto";
videoElement.style.display = "block";
videoElement.style.borderRadius = "8px"; //rounded corners

// Create and style the container
const container = document.createElement("div");
container.style.position = "fixed";
container.style.bottom = "20px";
container.style.right = "20px";
container.style.zIndex = "1000";
container.style.width = "360px";
container.style.height = "auto";
container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
container.style.backgroundColor = "#000"; // fallback behind video
container.style.overflow = "hidden"; // video doesn’t overflow

// Close button
const closeButton = document.createElement("span");
closeButton.innerHTML = "&times;"; // ✖️ symbol
closeButton.style.position = "absolute";
closeButton.style.top = "5px";
closeButton.style.right = "8px";
closeButton.style.color = "#fff";
closeButton.style.fontSize = "20px";
closeButton.style.cursor = "pointer";
closeButton.style.zIndex = "1001";
closeButton.style.background = "rgba(0, 0, 0, 0.6)";
closeButton.style.borderRadius = "12px";
closeButton.style.padding = "2px 6px";
closeButton.style.lineHeight = "1";

// Handle click to remove the whole player
closeButton.onclick = () => {
  container.remove();
};

//adding to HTML
container.appendChild(videoElement);
document.body.appendChild(container);
container.appendChild(closeButton);
