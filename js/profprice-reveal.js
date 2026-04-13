(function () {
    const MIN_WIDTH = 801;
    const STAGGER_MS = 55;
    const MOTION_MS = 750;

    function isDesktopRevealEnabled() {
        return (
            window.matchMedia(`(min-width: ${MIN_WIDTH}px)`).matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }

    function sectionsWithCardGrids() {
        const list = [];
        document.querySelectorAll('.cyber-zone__section').forEach((section) => {
            if (section.querySelector('.specs-grid, .tariffs-grid')) {
                list.push(section);
            }
        });
        return list;
    }

    function revealCardsInSection(section) {
        const grid = section.querySelector('.specs-grid, .tariffs-grid');
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll('.spec-card, .tariff-card'));
        if (!cards.length) return;

        cards.forEach((card) => card.classList.add('card-reveal--prep'));

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cards.forEach((card, index) => {
                    window.setTimeout(() => {
                        card.classList.add('card-reveal--show');
                    }, index * STAGGER_MS);
                });

                const cleanupDelay = (cards.length - 1) * STAGGER_MS + MOTION_MS;
                window.setTimeout(() => {
                    cards.forEach((card) => {
                        card.classList.remove('card-reveal--prep', 'card-reveal--show');
                    });
                }, cleanupDelay);
            });
        });
    }

    function init() {
        if (!isDesktopRevealEnabled()) return;

        const revealed = new WeakSet();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || revealed.has(entry.target)) return;
                    revealed.add(entry.target);
                    revealCardsInSection(entry.target);
                });
            },
            {
                root: null,
                rootMargin: '-5% 0px -12% 0px',
                threshold: 0.08,
            }
        );

        sectionsWithCardGrids().forEach((section) => observer.observe(section));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
