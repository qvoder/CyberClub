(function () {
    'use strict';

    function init() {
        const burger  = document.querySelector('.burger');
        const overlay = document.querySelector('.burger-overlay');
        const drawer  = document.querySelector('.burger-drawer');
        const closeBtn = document.querySelector('.burger-drawer__close');

        if (!burger || !drawer) return;

        function open() {
            burger.classList.add('burger--open');
            burger.setAttribute('aria-expanded', 'true');
            drawer.classList.add('burger-drawer--open');
            if (overlay) overlay.classList.add('burger-overlay--open');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            burger.classList.remove('burger--open');
            burger.setAttribute('aria-expanded', 'false');
            drawer.classList.remove('burger-drawer--open');
            if (overlay) overlay.classList.remove('burger-overlay--open');
            document.body.style.overflow = '';
        }

        burger.addEventListener('click', function () {
            burger.classList.contains('burger--open') ? close() : open();
        });

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (overlay)  overlay.addEventListener('click', close);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });

        drawer.querySelectorAll('.burger-drawer__link').forEach(function (link) {
            link.addEventListener('click', function () {
                setTimeout(close, 120);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
