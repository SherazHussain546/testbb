
(function() {
    'use strict';

    function init() {
        const embedContainer = document.querySelector('.blogify-posts-embed');
        if (!embedContainer) {
            console.warn('Blogify embed container not found. Please add a div with the class "blogify-posts-embed" and a "data-author-id" attribute.');
            return;
        }

        const authorId = embedContainer.dataset.authorId;
        if (!authorId) {
            console.warn('Blogify embed container is missing the "data-author-id" attribute.');
            return;
        }

        // Use the live domain
        const baseUrl = 'https://premium.blogify.blog';
        const iframeSrc = `${baseUrl}/embed/display?authorId=${encodeURIComponent(authorId)}`;

        const iframe = document.createElement('iframe');
        iframe.src = iframeSrc;
        iframe.style.width = '100%';
        iframe.style.height = '100%'; // The parent container should have a defined height
        iframe.style.border = 'none';
        iframe.setAttribute('title', 'Blogify Posts');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowtransparency', 'true');
        
        embedContainer.innerHTML = ''; // Clear the container
        embedContainer.appendChild(iframe);
        
        // Let the iframe control its own height if needed
        embedContainer.style.height = '600px'; // Default height, can be overridden by CSS

        window.addEventListener('message', (event) => {
            if (event.origin !== baseUrl) {
                return;
            }
            if (event.data && event.data.type === 'blogify-resize' && event.data.height) {
                embedContainer.style.height = `${event.data.height}px`;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
