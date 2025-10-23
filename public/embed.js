
(function() {
    // Inject CSS for the button and modal
    const styles = `
        #blogify-embed-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #A999FE; /* Accent color from your theme */
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9998;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            height: 56px;
            overflow: hidden;
            width: 56px;
        }

        #blogify-embed-btn:hover {
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            width: 200px;
        }

        #blogify-embed-btn svg {
            flex-shrink: 0;
            transition: transform 0.3s ease;
        }
        
        #blogify-embed-btn:hover svg {
            transform: rotate(90deg);
        }

        #blogify-embed-btn .blogify-btn-text {
            white-space: nowrap;
            padding-left: 10px;
            font-family: sans-serif;
            font-weight: 500;
            font-size: 14px;
        }

        #blogify-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0s 0.3s;
        }

        #blogify-modal-overlay.visible {
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s ease;
        }

        #blogify-modal-content {
            background-color: #f7f7f7; /* Matching your app's background */
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            height: 90%;
            max-height: 700px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }

        #blogify-modal-overlay.visible #blogify-modal-content {
            transform: scale(1);
        }

        #blogify-modal-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create the button
    const button = document.createElement("button");
    button.id = "blogify-embed-btn";
    button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span class="blogify-btn-text">Post to blogify.blog</span>
    `;
    document.body.appendChild(button);

    // Create the modal structure
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "blogify-modal-overlay";
    const modalContent = document.createElement("div");
    modalContent.id = "blogify-modal-content";
    const iframe = document.createElement("iframe");
    iframe.id = "blogify-modal-iframe";

    modalContent.appendChild(iframe);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Function to open the modal
    function openModal() {
        // Get the current page's URL and pass it to the iframe
        const originUrl = encodeURIComponent(window.location.href);
        const embedUrl = 'https://embedblogify.netlify.app/embed/create';
        iframe.src = `${embedUrl}?originUrl=${originUrl}`;
        modalOverlay.classList.add("visible");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Function to close the modal
    function closeModal() {
        modalOverlay.classList.remove("visible");
        iframe.src = "about:blank"; // Clear iframe content
        document.body.style.overflow = ""; // Restore background scrolling
    }

    // Add event listeners
    button.addEventListener("click", openModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Listen for messages from the iframe (e.g., on successful post)
    window.addEventListener("message", (event) => {
        // IMPORTANT: Add a check for the origin of the message for security
        if (event.origin !== "https://embedblogify.netlify.app") {
            return;
        }
        if (event.data === "blogify-post-success") {
            closeModal();
        }
    });

})();
