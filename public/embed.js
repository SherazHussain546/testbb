
(function () {
  // Check if the script has already been injected
  if (window.hasBlogifyEmbed) {
    return;
  }
  window.hasBlogifyEmbed = true;

  // --- 1. Create the Styles ---
  const styles = `
    #blogify-embed-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #5A67D8; /* A nice purple-blue */
      color: white;
      border: none;
      border-radius: 50px; /* Pill shape */
      padding: 12px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 9998;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s ease-in-out;
    }
    #blogify-embed-button:hover {
      transform: scale(1.05);
      background-color: #434190;
    }
    #blogify-embed-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 9999;
      display: none; /* Hidden by default */
      justify-content: center;
      align-items: center;
    }
    #blogify-embed-iframe {
      width: 90%;
      max-width: 600px;
      height: 80%;
      max-height: 700px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      background-color: white; /* Fallback for iframe content */
    }
    .blogify-plus-icon {
        font-size: 20px;
        line-height: 1;
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // --- 2. Create the Button ---
  const button = document.createElement("button");
  button.id = "blogify-embed-button";
  button.innerHTML = '<span class="blogify-plus-icon">+</span> <span>Post to blogify.blog</span>';
  document.body.appendChild(button);

  // --- 3. Create the Modal and Iframe ---
  const modal = document.createElement("div");
  modal.id = "blogify-embed-modal";
  const iframe = document.createElement("iframe");
  iframe.id = "blogify-embed-iframe";
  modal.appendChild(iframe);
  document.body.appendChild(modal);

  // --- 4. Add Event Listeners ---
  // Show the modal when the button is clicked
  button.addEventListener("click", () => {
    // Pass the origin URL to the iframe
    const originUrl = encodeURIComponent(window.location.origin + window.location.pathname);
    iframe.src = `https://embedblogify.netlify.app/embed/create?originUrl=${originUrl}`;
    modal.style.display = "flex";
  });

  // Hide the modal if the user clicks the background
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      iframe.src = ""; // Clear src to stop loading/video playback etc.
    }
  });

  // Listen for success message from the iframe to close the modal
  window.addEventListener("message", (event) => {
    // IMPORTANT: Add a security check for the origin of the message
    if (event.origin !== "https://embedblogify.netlify.app") {
        return;
    }
    
    if (event.data === "blogify-post-success") {
      setTimeout(() => {
        modal.style.display = "none";
        iframe.src = "";
      }, 1000); // Give user a moment to see success message
    }
  });
})();
