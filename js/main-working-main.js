document.addEventListener('DOMContentLoaded', () => {

    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');


    const getLocalStorage = key => {
        const data = localStorage.getItem(key);
    
        if (data !== null) {
            return JSON.parse(data);
        }
    
        return {};
    }
    
    const setLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function toggleSlide(container) {
        if (!container.classList.contains("active")) {
            container.classList.add("active");
            container.style.height = "auto";

            var height = container.clientHeight + "px";

            container.style.height = "0px";

            setTimeout(function() {
            container.style.height = height;
            }, 0);
        } else {
            container.style.height = "0px";

            container.addEventListener(
            "transitionend",
                function() {
                    container.classList.remove("active");
                }, {
                    once: true
                }
            );
        }
    }

    // var linkToggle = document.querySelectorAll(".js-toggle");

    // for (i = 0; i < linkToggle.length; i++) {
    //   linkToggle[i].addEventListener("click", function(event) {
    //     event.preventDefault();
    
    //     var container = document.getElementById(this.dataset.container);
    //     this.innerText = "Close";
    //     toggleSlide(container);
    //   });
    // }
    
    // function toggleSlide(container) {
    //   for (i = 0; i < linkToggle.length; i++) {
    //     let el = document.getElementById(linkToggle[i].dataset.container);
    //     if (el != container && el.classList.contains("active")) {
    //       el.style.height = "0px";
    //       linkToggle[i].innerText = "Click";
    //       el.addEventListener(
    //         "transitionend",
    //         function() {
    //           el.classList.remove("active");
    //         }, {
    //           once: true
    //         }
    //       );
    //     }
    //   }
    //   if (!container.classList.contains("active")) {
    //     container.classList.add("active");
    //     container.style.height = "auto";
    
    //     var height = container.clientHeight + "px";
    
    //     container.style.height = "0px";
    
    //     setTimeout(function() {
    //       container.style.height = height;
    //     }, 0);
    //   } else {
    //     container.style.height = "0px";
    
    //     container.addEventListener(
    //       "transitionend",
    //       function() {
    //         container.classList.remove("active");
    //       }, {
    //         once: true
    //       }
    //     );
    //   }
    // }

    const getCoords = (elem) => { // crossbrowser version
        let box = elem.getBoundingClientRect();
    
        let body = document.body;
        let docEl = document.documentElement;
    
        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    
        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;
    
        let top  = box.top +  scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
    
        return { top: Math.round(top), left: Math.round(left) };
    }

    function getParents(el, parentSelector) {
        if (parentSelector === undefined) {
            parentSelector = document;
        }
        var parents = [];
        var p = el.parentNode;
        while (p !== parentSelector) {
            var o = p;
            parents.push(o);
            p = o.parentNode;
        }
        parents.push(parentSelector);
        return parents;
    }

    const toggle = () => {
        let jsToggles = document.querySelectorAll('[data-js-toggle-target]');
        let container = null;

        jsToggles.forEach((jsToggle) => {

            const jsToggleListener = (event) => {
                event.preventDefault();
                event.stopPropagation();
                const target = event.target;
                let currentTarget = event.currentTarget;

                const animate = currentTarget.dataset.jsToggleAnimate;
                const siblings = currentTarget.dataset.jsToggleSiblings;
                const toggleSelectorText = currentTarget.dataset.jsToggleTarget;
                const toggleParent = currentTarget.dataset.jsToggleParent;
                const outsideClose = jsToggle.getAttribute('data-js-toggle-target-outside-close');

                siblings === 'true'
                    ? container = currentTarget.parentNode.querySelector(toggleSelectorText)
                    : container = document.querySelector(`${toggleSelectorText}`);

                if (toggleParent && currentTarget.closest(`${toggleParent}`).classList.contains('active')) {
                    currentTarget.closest(`${toggleParent}`).classList.remove('active')
                } else {
                    toggleParent && currentTarget.closest(`${toggleParent}`).classList.add('active')
                }

                if (animate === 'true') {
                    toggleSlide(container);
                } else {
                    container.classList.contains('active')
                        ? container.classList.remove('active')
                        : container.classList.add('active');
                }

                if (outsideClose === 'true') {
                    window.addEventListener('mouseup', function(event){
                        let isClickInside = container.contains(event.target);

                        console.log('currentTarget.contains(event.target)', currentTarget.contains(event.target));

                        if (!isClickInside && !currentTarget.contains(event.target)) {
                            currentTarget.classList.remove('active');
                            container.classList.remove('active');
                        }
                    }, { once: true });
                }
            }

            jsToggle.addEventListener('click', jsToggleListener);
        });
    }

    toggle();

    const dropdownPosition = () => {
        const nav = document.getElementById('nav');
        const dropdowns = nav.querySelectorAll('.nav__dropdown');
        const displayHeight = window.innerHeight;
        let offsetY = 10;

        dropdowns.forEach((dropdown) => {
            let { top } = getCoords(dropdown.parentNode);
            let offsetTop = top <= offsetY ? top = offsetY : top
            let res = displayHeight - top;
            let dropdownMaxHeight = res > 600 ? res = 600 : res;

            if (nav.classList.contains('closed')) {
                dropdown.style.top = `${offsetTop}px`;
                dropdown.querySelector('.nav__dropdown-block').style.maxHeight = `${dropdownMaxHeight - offsetY}px`;
            } else {
                dropdown.style.top = '0';
                dropdown.querySelector('.nav__dropdown-block').style.maxHeight = 'none';
            }
        });
    }

    const toggleSidebar = () => {
        const nav = document.getElementById('nav');
        const navbar = document.getElementById('navbar');

        navbar.classList.add('hidden');

        setTimeout(() => {
            dropdownPosition();
            nav.classList.toggle('closed');
            nav.classList.toggle('opened');
        }, 200);

        setTimeout(() => {
            dropdownPosition();
            navbar.classList.remove('hidden');
        }, 450);
    }

    toggleSidebarBtn.addEventListener('click', toggleSidebar);

    dropdownPosition();
    document.getElementById('navbar').addEventListener('scroll', dropdownPosition);
    window.addEventListener('resize', dropdownPosition);

    const logo = document.querySelector('.nav__logo');
    console.log('logo', logo.closest('.nav'));
});
