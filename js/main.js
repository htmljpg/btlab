document.addEventListener('DOMContentLoaded', () => {

    function calcScroll() {
        let div = document.createElement('div');

        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();

        return scrollWidth;
    }


    Element.prototype.nthParent = function(index) {
        let count = 1;

        const nthParentRecursion = (parent, index, count) => {
            if (index < 1) return null;
            
            if(count != index && parent && parent.parentElement) {
                return nthParentRecursion(parent.parentElement, index, count = count + 1);
            }
    
            return parent;
        }

        return nthParentRecursion(this.parentElement, index, count);
    }

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

            let height = container.clientHeight + "px";

            container.style.height = "0px";

            setTimeout(function() {
                container.style.height = height;
            }, 20);
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

    const toggle = () => {
        let jsToggles = document.querySelectorAll('[data-js-toggle-target]');
        let container = null;
        let outsideClose = null;

        jsToggles.forEach((jsToggle) => {
            const jsToggleListener = (event) => {
                event.preventDefault();
                event.stopPropagation();
                const target = event.target;
                const currentTarget = event.currentTarget;
                jsToggle.classList.toggle('active');

                const animate = currentTarget.getAttribute('data-js-toggle-animate');
                const siblings = currentTarget.getAttribute('data-js-toggle-siblings');
                const toggleSelectorText = currentTarget.getAttribute('data-js-toggle-target');
                const toggleParent = currentTarget.getAttribute('data-js-toggle-parent');
                outsideClose = currentTarget.getAttribute('data-js-toggle-target-outside-close');
                const overlayCheck = currentTarget.getAttribute('data-js-toggle-target-overlay');
                
                if (toggleParent && currentTarget.closest(`${toggleParent}`).classList.contains('active')) {
                    currentTarget.closest(`${toggleParent}`).classList.remove('active')
                } else {
                    toggleParent && currentTarget.closest(`${toggleParent}`).classList.add('active')
                }

                siblings === 'true'
                    ? container = jsToggle.parentNode.querySelector(toggleSelectorText)
                    : container = document.querySelector(`${toggleSelectorText}`);

                if (animate === 'true') {
                    container && toggleSlide(container);
                } else {
                    container ? container.classList.contains('active') ? container.classList.remove('active') : container.classList.add('active') : '';
                }

                if (overlayCheck === 'true') {
                    overlay && overlay.classList.toggle('active');
                }

                if (outsideClose === 'true') {

                    const outsideCloseHandler = (event) => {
                        let isClickInside = container && container.contains(event.target);

                        console.log(event.currentTarget, currentTarget);

                        if (!isClickInside && !currentTarget.contains(event.target)) {
                            outsideClose = null;
                            currentTarget.classList.remove('active');
                            container && container.classList.remove('active');
                            overlay.classList.remove('active');
                            
                            if (overlayCheck === 'true') {
                                overlay && overlay.classList.remove('active');
                            }
                            
                            window.removeEventListener('mouseup', outsideCloseHandler);
                        }
                    }

                    window.addEventListener('click', outsideCloseHandler);
                }
            }

            jsToggle.addEventListener('click', jsToggleListener);
        });
    }

    toggle();

    const sidebar = () => {
        const nav = document.getElementById('nav');
        const navbar = document.getElementById('navbar');
        const dropdowns = nav.querySelectorAll('.nav__dropdown');
        const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
        const overlay = document.getElementById('overlay');

        const dropdownPosition = () => {
            const displayHeight = window.innerHeight;
            let offsetY = 10;
    
            dropdowns.forEach((dropdown) => {
    
                let { top } = getCoords(dropdown.closest('li'));
                let offsetTop = top <= offsetY ? top = offsetY : top
                let res = displayHeight - top;
                let dropdownMaxHeight = res > 600 ? res = 600 : res;
    
                if (nav.classList.contains('closed')) {
                    dropdown.style.top = `${offsetTop}px`;
                    dropdown.style.maxHeight = `${dropdownMaxHeight - offsetY}px`;
                    dropdown.style.height = 'auto';
                } else {
                    dropdown.style.top = '0';
                    dropdown.style.maxHeight = 'none';
                    dropdown.style.height = dropdown.scrollHeight + 'px';
                }
            });
        }
    
        const checkNavLinkActive = () => {
            const navDropdownLinks = document.querySelectorAll('.nav__dropdown-link');
    
            const checkNavLinkActiveRecursion = (item)=>{
                item.classList.add('active');
    
    
                if(item.previousElementSibling && item.previousElementSibling.classList.contains('nav__link')){
                    item.previousElementSibling.classList.add('active-link');
                    item.style.height = item.scrollHeight + 'px';
    
                    return true;
                }
        
                if(item.nthParent(5)){
                    checkNavLinkActiveRecursion(item.nthParent(5));
                }
            }
    
            const navLinkActive = (navLink) => {
                if(navLink.classList.contains('active-link')){
                    checkNavLinkActiveRecursion(navLink.nthParent(5));
                }
            }
    
            navDropdownLinks.forEach(navLinkActive);
            dropdownPosition();
        }
    
        checkNavLinkActive();
    
        const toggleSidebar = () => {
    
            navbar.classList.add('hidden');
    
            setTimeout(() => {
                nav.classList.toggle('closed');
                nav.classList.toggle('opened');
            }, 200);
    
            setTimeout(() => {
                navbar.classList.remove('hidden');
                dropdownPosition();
            }, 450);
        }
    
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    
        document.getElementById('navbar').addEventListener('scroll', dropdownPosition);
        window.addEventListener('resize', dropdownPosition);
        dropdownPosition();
    }
    // sidebar();

    const modal = () => {
        const modalTriggers = document.querySelectorAll('.jsModalTrigger');
        const scroll = calcScroll();

        modalTriggers.forEach((modalTrigger) => {
            const openModal = (modalWindow) => {
                if (modalWindow) {
                    modalWindow.classList.add('show');
                    document.body.style.overflow = "hidden";
                    document.body.style.marginRight = `${scroll}px`;
                }
            }

            const closeModal = (modalWindow) => {
                if (modalWindow) {
                    modalWindow.classList.remove('show');
                    document.body.style.overflow = "auto";
                    document.body.style.marginRight = 0;
                }
            }

            modalTrigger.addEventListener('click', () => {
                const target = modalTrigger.getAttribute('href').slice(1);
                const modalWindow = document.getElementById(target);

                openModal(modalWindow);

                modalWindow.addEventListener('click', (event) => {
                    (
                        event.target === modalWindow
                        || event.target.classList.contains('modal__dialog')
                        || event.target.classList.contains('jsModalClose')
                    )
                        && closeModal(modalWindow);
                });
            });
        });

        
    }
    modal();

    function switchVisibility() {
        const passwordSwitch = document.querySelectorAll('.switch-password');

        passwordSwitch.forEach((password) => {
            password.addEventListener('click', () => {
                const passwordField = password.parentNode.querySelector('input');

                if (passwordField.getAttribute('type') === 'password') {
                    passwordField.setAttribute('type', 'text');
                    password.classList.add('icon-password-slash');
                    password.classList.remove('icon-password');
                } else {
                    passwordField.setAttribute('type', 'password');
                    password.classList.remove('icon-password-slash');
                    password.classList.add('icon-password');
                }
            });
        });
    };
    switchVisibility();


    // initMultiStepForm();

    function initMultiStepForm() {
        const progressNumber = document.querySelectorAll(".step").length;
        const slidePage = document.querySelector(".slide-page");
        const submitBtn = document.querySelector(".submit");
        const progressText = document.querySelectorAll(".step p");
        const progressCheck = document.querySelectorAll(".step .check");
        const bullet = document.querySelectorAll(".step .bullet");
        const pages = document.querySelectorAll(".page");
        const nextButtons = document.querySelectorAll(".next");
        const prevButtons = document.querySelectorAll(".prev");
        const stepsNumber = pages.length;

        if (progressNumber !== stepsNumber) {
            console.warn(
                "Error, number of steps in progress bar do not match number of pages"
            );
        }

        document.documentElement.style.setProperty("--stepNumber", stepsNumber);

        let current = 1;

        for (let i = 0; i < nextButtons.length; i++) {
            nextButtons[i].addEventListener("click", function (event) {
                event.preventDefault();

                inputsValid = validateInputs(this);
                // inputsValid = true;

                if (inputsValid) {
                    slidePage.style.marginLeft = `-${
                        (100 / stepsNumber) * current
                    }%`;
                    bullet[current - 1].classList.add("active");
                    progressCheck[current - 1].classList.add("active");
                    progressText[current - 1].classList.add("active");
                    current += 1;
                }
            });
        }

        for (let i = 0; i < prevButtons.length; i++) {
            prevButtons[i].addEventListener("click", function (event) {
                event.preventDefault();
                slidePage.style.marginLeft = `-${
                    (100 / stepsNumber) * (current - 2)
                }%`;
                bullet[current - 2].classList.remove("active");
                progressCheck[current - 2].classList.remove("active");
                progressText[current - 2].classList.remove("active");
                current -= 1;
            });
        }
        submitBtn.addEventListener("click", function () {
            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");
            current += 1;
            setTimeout(function () {
                alert("Your Form Successfully Signed up");
                location.reload();
            }, 800);
        });

        function validateInputs(ths) {
            let inputsValid = true;

            const inputs =
                ths.parentElement.parentElement.querySelectorAll("input");
            for (let i = 0; i < inputs.length; i++) {
                const valid = inputs[i].checkValidity();
                if (!valid) {
                    inputsValid = false;
                    inputs[i].classList.add("invalid-input");
                } else {
                    inputs[i].classList.remove("invalid-input");
                }
            }
            return inputsValid;
        }
    }

    document.querySelectorAll('.progress-bar__button').forEach((item) => {
        item.addEventListener('click', () => {
            item.parentNode.classList.toggle('active');
        });
    });

});
