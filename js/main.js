document.addEventListener('DOMContentLoaded', () => {

    //Add event from js the keep the marup clean
    function init() {
        const open_menu = document.getElementById("open-menu");
        const close_menu = document.getElementById("close-menu");
        const body_overlay = document.getElementById("body-overlay");

        open_menu && open_menu.addEventListener("click", toggleMenu);
        close_menu && close_menu.addEventListener("click", toggleMenu);
        body_overlay && body_overlay.addEventListener("click", toggleMenu);
    }

    //The actual fuction
    function toggleMenu() {
        let element = document.getElementsByTagName('body')[0];
        if (!element.classList.contains('menu-open') || element.classList.contains('menu-close')) {
            element.classList.add('menu-open');
        } else {
            element.classList.remove('menu-open');
        }
    }

    //Prevent the function to run before the document is loaded
    document.addEventListener('readystatechange', function() {
        if (document.readyState === "complete") {
            init();
        }
    });

    let reviews_swiper2 = new Swiper('.swiper-reviews2', {
        slidesPerView: 1,
        simulateTouch: false,
        watchOverflow: false,
        watchSlidesVisibility: false,
        cssMode: false,
        loop: true,
        navigation: {
        nextEl: '.next',
        prevEl: '.prev',
        allowTouchMove: false,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
        },
    },
        pagination: {
        el: '.dots',
        clickable: true,
    },
        touchReleaseOnEdges: false,
        keyboard: false,
    });

    var reviews_swiper = new Swiper('.swiper-reviews', {
        watchOverflow: true,
        watchSlidesVisibility: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.dots',
          clickable: true,
        },
        navigation: {
          nextEl: '.next',
          prevEl: '.prev',
        },
      });

});