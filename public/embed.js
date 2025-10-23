
(function () {
  // Config
  const IFRAME_URL = 'http://localhost:9002/embed/create'; // In production, this should be your app's domain
  const BUTTON_TEXT = 'Post to blogify.blog';

  // State
  let iframeVisible = false;

  // Create button
  const button = document.createElement('button');
  button.textContent = BUTTON_TEXT;
  
  // Style button
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '12px 24px',
    backgroundColor: '#77B6BA', // Accent color
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    zIndex: '9998',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease',
  });
  
  document.body.appendChild(button);

  // Create iframe container
  const iframeContainer = document.createElement('div');
  Object.assign(iframeContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '9999',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    transition: 'opacity 0.3s ease-in-out',
  });

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = IFRAME_URL;
  Object.assign(iframe.style, {
    width: '90%',
    maxWidth: '600px',
    height: '90%',
    maxHeight: '800px',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  });

  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);
  
  // Create close button for the modal
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  Object.assign(closeButton.style, {
      position: 'absolute',
      top: '15px',
      right: '25px',
      background: 'transparent',
      border: 'none',
      fontSize: '32px',
      lineHeight: '1',
      color: '#fff',
      cursor: 'pointer',
      opacity: '0.8',
  });
  closeButton.onmouseover = () => closeButton.style.opacity = '1';
  closeButton.onmouseout = () => closeButton.style.opacity = '0.8';
  
  iframeContainer.appendChild(closeButton);

  // Toggle iframe visibility
  function toggleIframe() {
    iframeVisible = !iframeVisible;
    if (iframeVisible) {
      iframeContainer.style.display = 'flex';
      setTimeout(() => {
        iframeContainer.style.opacity = '1';
      }, 10);
    } else {
      iframeContainer.style.opacity = '0';
      setTimeout(() => {
        iframeContainer.style.display = 'none';
        // Reload iframe to reset its state when closed, good for UX
        iframe.src = IFRAME_URL;
      }, 300);
    }
  }

  button.addEventListener('click', toggleIframe);
  closeButton.addEventListener('click', toggleIframe);
  iframeContainer.addEventListener('click', (e) => {
    // Close if backdrop is clicked
    if (e.target === iframeContainer) {
      toggleIframe();
    }
  });


  // Listen for success message from iframe
  window.addEventListener('message', function (event) {
    // Basic security check for origin in a real-world scenario
    // const appOrigin = new URL(IFRAME_URL).origin;
    // if (event.origin !== appOrigin) {
    //   return;
    // }
    
    if (event.data === 'blogify-success') {
      if (iframeVisible) {
        toggleIframe();
      }
    }
  });

})();
