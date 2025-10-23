
(function() {
  // --- Create the button ---
  const button = document.createElement('button');
  button.innerText = 'Post to blogify.blog';
  // Basic styling - can be customized
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '12px 24px',
    backgroundColor: '#6A7E9C', // accent color
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    zIndex: '9999',
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
  });

  // --- Create the modal container ---
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    zIndex: '10000',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  });

  // --- Create the modal content wrapper ---
  const modalContent = document.createElement('div');
   Object.assign(modalContent.style, {
    position: 'relative',
    backgroundColor: '#fefefe',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    height: '80%',
    maxHeight: '700px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  });

  // --- Create the close button ---
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
   Object.assign(closeButton.style, {
    position: 'absolute',
    top: '10px',
    right: '20px',
    color: '#aaa',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: '10002',
  });

  // --- Create the iframe ---
  const iframe = document.createElement('iframe');
  iframe.src = 'https://embedblogify.netlify.app/embed/create';
   Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    border: 'none',
  });

  // --- Assemble the modal ---
  modalContent.appendChild(closeButton);
  modalContent.appendChild(iframe);
  modal.appendChild(modalContent);
  
  // --- Add to the body ---
  document.body.appendChild(button);
  document.body.appendChild(modal);

  // --- Event Listeners ---
  button.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Listen for success message from the iframe
  window.addEventListener('message', (event) => {
    // IMPORTANT: Check the origin of the message for security
    if (event.origin !== 'https://embedblogify.netlify.app') {
      return;
    }

    if (event.data === 'blogify-success') {
      setTimeout(() => {
        modal.style.display = 'none';
      }, 1500); // Close modal after a short delay
    }
  });

})();
