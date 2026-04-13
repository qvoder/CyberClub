document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.gallery-slider', {
        slidesPerView: 'auto',
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: true,
        speed: 800,
        spaceBetween: 40, 
        updateOnWindowResize: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        watchSlidesProgress: true,
    });
});