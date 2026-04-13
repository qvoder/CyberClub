(function () {
    function init() {
        document.querySelectorAll('.zones.zones--price-nav').forEach(function (zone) {
            var href = zone.getAttribute('data-price-href');
            if (!href) return;

            zone.setAttribute('tabindex', '0');
            zone.setAttribute('role', 'link');

            var label = zone.getAttribute('data-price-label') || 'Перейти к тарифам';
            zone.setAttribute('aria-label', label);

            function go() {
                window.location.href = href;
            }

            zone.addEventListener('click', go);
            zone.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    go();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
