const topSlide = document.getElementById('topSlide');
        const indicators = document.querySelectorAll('.hero-slider-indicator');

        const syncIndicators = () => {
            const activeIndex = topSlide.classList.contains('show') ? 1 : 0;
            indicators.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIndex);
            });
        };

        syncIndicators();
        setInterval(() => {
            topSlide.classList.toggle('show');
            syncIndicators();
        }, 3000);