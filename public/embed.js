
(function() {
  // The domain of your Next.js application hosting the embed form
  const EMBED_HOST_DOMAIN = 'https://embedblogify.netlify.app';

  // Create the "Post to blogify.blog" button
  const button = document.createElement('button');
  button.textContent = 'Post to blogify.blog';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.backgroundColor = '#6A7E9A'; // Accent color
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.padding = '12px 20px';
  button.style.fontSize = '16px';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
  button.style.fontFamily = 'sans-serif';
  button.style.transition = 'transform 0.2s ease';

  button.onmouseover = () => button.style.transform = 'scale(1.05)';
  button.onmouseout = () => button.style.transform = 'scale(1)';

  document.body.appendChild(button);

  // Modal elements
  let modalOverlay = null;
  let iframe = null;

  function openModal() {
    if (modalOverlay) return; // Modal is already open

    // Get the URL of the site embedding the script
    const originUrl = encodeURIComponent(window.location.origin);

    // Create modal overlay
    modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modalOverlay.style.zIndex = '10000';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'relative';
    iframeContainer.style.backgroundColor = 'white';
    iframeContainer.style.width = '90%';
    iframeContainer.style.maxWidth = '700px';
    iframeContainer.style.height = '90%';
    iframeContainer.style.maxHeight = '800px';
    iframeContainer.style.borderRadius = '12px';
    iframeContainer.style.overflow = 'hidden';
    iframeContainer.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25)';

    // Create iframe
    iframe = document.createElement('iframe');
    iframe.src = `${EMBED_HOST_DOMAIN}/embed/create?originUrl=${originUrl}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.zIndex = '10001';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '28px';
    closeButton.style.color = '#888';
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = closeModal;
    modalOverlay.onclick = function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    };
    
    iframeContainer.appendChild(iframe);
    iframeContainer.appendChild(closeButton);
    modalOverlay.appendChild(iframeContainer);
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeModal() {
    if (modalOverlay) {
      document.body.removeChild(modalOverlay);
      modalOverlay = null;
      iframe = null;
      document.body.style.overflow = 'auto'; // Restore scroll
    }
  }

  // Assign click event to the button
  button.onclick = openModal;

  // Listen for messages from the iframe (e.g., to close the modal on success)
  window.addEventListener('message', function(event) {
    // Security check: only accept messages from your app's domain
    if (event.origin !== EMBED_HOST_DOMAIN) {
      return;
    }

    if (event.data === 'blogify-post-success') {
      closeModal();
    }
  });

})();
