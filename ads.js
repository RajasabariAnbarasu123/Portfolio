// ========================================
// ADSENSE LOADER (load after script.js)
// ========================================
(function () {
    'use strict';

    window.adsbygoogle = window.adsbygoogle || [];

    function initAds() {
        const units = document.querySelectorAll('ins.adsbygoogle');

        units.forEach((ins) => {
            const section = ins.closest('.ad-section');
            const slot = (ins.getAttribute('data-ad-slot') || '').trim();

            // Only real numeric slot IDs from your AdSense dashboard are used.
            // Placeholder slots are removed so they don't create blank space or console errors.
            if (!/^\d+$/.test(slot)) {
                if (section) section.classList.add('ad-hidden');
                return;
            }

            // Don't push the same unit twice
            if (ins.getAttribute('data-adsbygoogle-status')) return;

            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.warn('AdSense push failed:', err);
                if (section) section.classList.add('ad-hidden');
                return;
            }

            // Collapse the box if Google has no ad to show
            const observer = new MutationObserver(() => {
                if (ins.getAttribute('data-ad-status') === 'unfilled' && section) {
                    section.classList.add('ad-hidden');
                    observer.disconnect();
                }
            });
            observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
        });
    }

    // Defer ad initialisation until the page has finished loading
    if (document.readyState === 'complete') {
        initAds();
    } else {
        window.addEventListener('load', initAds);
    }
})();
