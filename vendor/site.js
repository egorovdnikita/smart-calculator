
; /* Start:"a:4:{s:4:"full";s:66:"/local/templates/turbolemons-template/js/header.js?178817203141295";s:6:"source";s:50:"/local/templates/turbolemons-template/js/header.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector(".header");

    if (!header) {
        return;
    }

    if (!header.classList.contains("header--hero")) {

        const updateFixedHeaderOffset = () => {
            document.body.style.paddingTop =
                header.getBoundingClientRect().height + "px";
        };

        updateFixedHeaderOffset();

        window.addEventListener(
            "resize",
            updateFixedHeaderOffset
        );

        window.addEventListener(
            "load",
            updateFixedHeaderOffset
        );

        return;
    }

    let ticking = false;

    const getTriggerOffset = () => {
        return window.innerHeight * 0.85;
    };

    const updateHeader = () => {

        ticking = false;

        if (window.tlMegaMenuOpen) {
            return;
        }

        const triggerOffset = getTriggerOffset();

        if (window.scrollY >= triggerOffset) {

            header.classList.add("is-scrolled");

        } else {

            header.classList.remove("is-scrolled");

        }

    };

    const requestUpdate = () => {

        if (ticking) {
            return;
        }

        ticking = true;

        window.requestAnimationFrame(
            updateHeader
        );

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        requestUpdate,
        {
            passive:true
        }
    );

    window.addEventListener(
        "resize",
        requestUpdate,
        {
            passive:true
        }
    );

});

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const form = document.getElementById("footer-callback-form");

    if (!form) {
        return;
    }

    const successStep = document.getElementById(
        "footer-callback-success"
    );

    const nameField = document.getElementById("footer-callback-name");
    const phoneField = document.getElementById("footer-callback-phone");
    const policyField = document.getElementById("footer-callback-policy");
    const submitButton = document.getElementById("footer-callback-submit");

    const formatPhoneDigits = (digits) => {
        digits = digits.slice(0, 10);

        let result = "";

        if (digits.length > 0) {
            result += "(" + digits.slice(0, 3);
        }

        if (digits.length >= 3) {
            result += ") ";
        }

        if (digits.length > 3) {
            result += digits.slice(3, 6);
        }

        if (digits.length > 6) {
            result += "-" + digits.slice(6, 8);
        }

        if (digits.length > 8) {
            result += "-" + digits.slice(8, 10);
        }

        return result;
    };

    const phonePlaceholder = document.getElementById(
        "footer-callback-phone-placeholder"
    );

    const updatePhonePlaceholder = () => {
        phonePlaceholder?.classList.toggle(
            "is-hidden",
            phoneField?.value !== ""
        );
    };

    phoneField?.addEventListener("input", () => {
        let digits = phoneField.value.replace(/\D/g, "");

        if (digits.length > 0 && ["7", "8"].includes(digits[0])) {
            digits = digits.slice(1);
        }

        phoneField.value = formatPhoneDigits(digits);

        updatePhonePlaceholder();
    });

    updatePhonePlaceholder();

    const clearErrors = () => {
        form.querySelectorAll(".pm-error-text").forEach((el) => {
            el.textContent = "";
        });

        form
            .querySelectorAll(".pm-cart-field-wrap.error, .pm-cart-policy.error")
            .forEach((el) => {
                el.classList.remove("error");
            });
    };

    const showFieldError = (field, message) => {
        const wrap = field.closest(".pm-cart-field-wrap");

        wrap?.classList.add("error");

        const errorEl = wrap?.querySelector(".pm-error-text");

        if (errorEl) {
            errorEl.textContent = message;
        }
    };

    const clearFieldError = (field) => {
        const wrap = field.closest(".pm-cart-field-wrap");

        wrap?.classList.remove("error");

        const errorEl = wrap?.querySelector(".pm-error-text");

        if (errorEl) {
            errorEl.textContent = "";
        }
    };

    nameField?.addEventListener("input", () => {
        clearFieldError(nameField);
    });

    phoneField?.addEventListener("input", () => {
        clearFieldError(phoneField);
    });

    policyField?.addEventListener("change", () => {
        if (policyField.checked) {
            const policyWrap = policyField.closest(".pm-cart-policy");

            policyWrap?.classList.remove("error");

            const errorEl = policyWrap?.querySelector(".pm-error-text");

            if (errorEl) {
                errorEl.textContent = "";
            }
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();

        let hasError = false;

        const requireField = (field, message) => {
            showFieldError(field, message);
            hasError = true;
        };

        const name = nameField?.value.trim() || "";

        if (!name) {
            requireField(nameField, "Заполните это поле");
        } else if (!/^[А-Яа-яA-Za-zЁё\s-]+$/.test(name)) {
            requireField(nameField, "Некорректный формат");
        }

        const phoneDigits =
            (phoneField?.value || "").replace(/\D/g, "");

        if (!phoneDigits.length) {
            requireField(phoneField, "Заполните это поле");
        } else if (phoneDigits.length !== 10) {
            requireField(phoneField, "Некорректный формат");
        }

        if (policyField && !policyField.checked) {
            const policyWrap = policyField.closest(".pm-cart-policy");

            policyWrap?.classList.add("error");

            const errorEl = policyWrap?.querySelector(".pm-error-text");

            if (errorEl) {
                errorEl.textContent = "Заполните это поле";
            }

            hasError = true;
        }

        if (hasError) {
            return;
        }

        submitButton.disabled = true;

        try {
            const body = new URLSearchParams();

            body.set("name", name);
            body.set("phone", phoneField.value.trim());

            const response = await fetch(
                "/local/cart/ajax/create_call_request.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: body.toString()
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.error || "Не удалось отправить заявку"
                );
            }

            form.hidden = true;

            if (successStep) {
                successStep.hidden = false;
            }

            /*
             * Через 10 секунд блок успеха сам уходит, форма
             * возвращается уже пустой (для повторной заявки).
             */
            setTimeout(() => {
                if (successStep) {
                    successStep.hidden = true;
                }

                form.hidden = false;
                form.reset();
                clearErrors();
                updatePhonePlaceholder();
            }, 10000);
        } catch (error) {
            console.error(
                "Ошибка отправки заявки:",
                error
            );

            showFieldError(
                phoneField,
                "Не удалось отправить, попробуйте ещё раз"
            );
        } finally {
            submitButton.disabled = false;
        }
    });
});


/* ==========================================================================
   MEGA MENU "КАТАЛОГ"
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const catalogBtn = document.getElementById("header-catalog-btn");
    const megaMenu = document.getElementById("mega-menu");
    const megaMenuOverlay = document.getElementById("mega-menu-overlay");
    const header = document.querySelector(".header");

    if (!catalogBtn || !megaMenu || !header) {
        return;
    }

    const megaMenuPanel = megaMenu.querySelector(".mega-menu__panel");

    const navLinks = Array.from(
        megaMenu.querySelectorAll(".mega-menu__nav-link")
    );

    const updateMegaMenuOffset = () => {
        const headerHeight = header.getBoundingClientRect().height;

        megaMenu.style.top = headerHeight + "px";
    };

    const openMegaMenu = () => {
        updateMegaMenuOffset();

        const scrollY = window.scrollY || window.pageYOffset || 0;

        window.tlMegaMenuOpen = true;

        document.body.dataset.megaMenuScrollY = String(scrollY);
        document.body.style.top = -scrollY + "px";

        window.clearTimeout(megaMenuCloseTimeoutId);

        megaMenu.hidden = false;

        void megaMenu.offsetHeight;

        window.setTimeout(() => {
            megaMenu.classList.add("is-open");
        }, 10);

        catalogBtn.classList.add("is-open");
        catalogBtn.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("mega-menu-open");
        document.body.classList.add("mega-menu-open");
    };

    let megaMenuCloseTimeoutId = null;

    const closeMegaMenu = () => {
        megaMenu.classList.remove("is-open");

        window.clearTimeout(megaMenuCloseTimeoutId);
        megaMenuCloseTimeoutId = window.setTimeout(() => {
            megaMenu.hidden = true;
        }, 300);

        catalogBtn.classList.remove("is-open");
        catalogBtn.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("mega-menu-open");
        document.body.classList.remove("mega-menu-open");

        const scrollY = parseInt(
            document.body.dataset.megaMenuScrollY || "0",
            10
        );

        document.body.style.top = "";
        delete document.body.dataset.megaMenuScrollY;

        const previousScrollBehavior =
            document.documentElement.style.scrollBehavior;

        document.documentElement.style.scrollBehavior = "auto";

        window.scrollTo(0, scrollY);

        document.documentElement.style.scrollBehavior =
            previousScrollBehavior;

        window.tlMegaMenuOpen = false;
        window.dispatchEvent(new Event("scroll"));
    };

    const isMobileMenuViewport = () =>
        window.matchMedia("(max-width: 991px)").matches;

    catalogBtn.addEventListener("click", () => {
        if (isMobileMenuViewport()) {
            window.tlMobileMenuToggle?.();
            return;
        }

        if (!megaMenu.classList.contains("is-open")) {
            openMegaMenu();
        } else {
            closeMegaMenu();
        }
    });

    megaMenuOverlay?.addEventListener("click", closeMegaMenu);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && megaMenu.classList.contains("is-open")) {
            closeMegaMenu();
        }
    });

    megaMenu.addEventListener("click", (event) => {
        if (
            megaMenuPanel
            && !megaMenuPanel.contains(event.target)
            && event.target !== megaMenuOverlay
        ) {
            return;
        }

        if (event.target === megaMenu) {
            closeMegaMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (!megaMenu.hidden) {
            updateMegaMenuOffset();
        }
    });


    /* ---- Переключение контента 2й секции в левом сайдбаре ---------- */

    const activateMegaMenuTarget = (navLink) => {

        const targetId = navLink.dataset.megaTarget;
        const targetPanel = targetId
            ? document.getElementById(targetId)
            : null;

        if (!targetPanel) {
            return;
        }

        navLinks.forEach((link) => {
            link.classList.remove("is-active");
        });

        megaMenu
            .querySelectorAll(".mega-menu__panel-body")
            .forEach((panelBody) => {
                panelBody.classList.remove("is-active");
            });

        navLink.classList.add("is-active");
        targetPanel.classList.add("is-active");

        if (megaMenuPanel) {
            megaMenuPanel.scrollTop = 0;
        }
    };

    navLinks.forEach((navLink) => {
        navLink.addEventListener("mouseenter", () => {
            activateMegaMenuTarget(navLink);
        });

        navLink.addEventListener("focus", () => {
            activateMegaMenuTarget(navLink);
        });
    });


    /* ---- "Ещё N" у подразделов -------------------------------------- */

    megaMenu
        .querySelectorAll(".mega-menu__group-toggle")
        .forEach((toggleBtn) => {

            const group = toggleBtn.closest(".mega-menu__group");

            if (!group) {
                return;
            }

            const extraCount = group.querySelectorAll(
                ".mega-menu__group-extra"
            ).length;

            const toggleText = toggleBtn.querySelector(
                ".mega-menu__group-toggle-text"
            );

            toggleBtn.addEventListener("click", () => {

                const isExpanded = group.classList.toggle("is-expanded");

                if (toggleText) {
                    toggleText.textContent = isExpanded
                        ? "Свернуть"
                        : ("Ещё " + extraCount);
                }
            });
        });
});


/* ==========================================================================
   ВЫПАДАШКА "УСЛУГИ" В НАВИГАЦИИ
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const servicesWrap = document.querySelector(".header__services");
    const servicesBtn = document.getElementById("header-services-btn");
    const servicesDropdown = document.getElementById(
        "header-services-dropdown"
    );

    if (!servicesWrap || !servicesBtn || !servicesDropdown) {
        return;
    }

    let servicesCloseTimeoutId = null;

    const openServicesDropdown = () => {
        window.clearTimeout(servicesCloseTimeoutId);

        servicesDropdown.hidden = false;

        void servicesDropdown.offsetHeight;

        window.setTimeout(() => {
            servicesWrap.classList.add("is-open");
        }, 10);

        servicesBtn.setAttribute("aria-expanded", "true");
    };

    const closeServicesDropdown = () => {
        servicesWrap.classList.remove("is-open");
        servicesBtn.setAttribute("aria-expanded", "false");

        window.clearTimeout(servicesCloseTimeoutId);
        servicesCloseTimeoutId = window.setTimeout(() => {
            servicesDropdown.hidden = true;
        }, 200);
    };

    servicesBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!servicesWrap.classList.contains("is-open")) {
            openServicesDropdown();
        } else {
            closeServicesDropdown();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            servicesWrap.classList.contains("is-open")
            && !servicesWrap.contains(event.target)
        ) {
            closeServicesDropdown();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && servicesWrap.classList.contains("is-open")) {
            closeServicesDropdown();
        }
    });
});


/* ==========================================================================
   МОБИЛЬНОЕ МЕНЮ (≤991px)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
    const catalogBtn = document.getElementById("header-catalog-btn");

    if (!mobileMenu || !catalogBtn) {
        return;
    }

    const getScreen = (id) =>
        mobileMenu.querySelector('[data-screen="' + id + '"]');

    let screenStack = ["root"];
    let mobileMenuCloseTimeoutId = null;

    const setActiveScreen = () => {
        mobileMenu.querySelectorAll(".mobile-menu__screen").forEach((el) => {
            el.classList.toggle(
                "is-active",
                screenStack.includes(el.dataset.screen)
            );
        });
    };

    const pushScreen = (id) => {
        const el = getScreen(id);

        if (!el || screenStack[screenStack.length - 1] === id) {
            return;
        }

        el.hidden = false;
        el.style.zIndex = String(screenStack.length + 1);

        void el.offsetHeight;

        screenStack.push(id);

        window.setTimeout(setActiveScreen, 10);
    };

    const popScreen = () => {
        if (screenStack.length <= 1) {
            return;
        }

        const topId = screenStack.pop();
        const topEl = getScreen(topId);

        setActiveScreen();

        if (topEl) {
            window.setTimeout(() => {
                topEl.hidden = true;
            }, 300);
        }
    };

    const resetToRoot = () => {
        while (screenStack.length > 1) {
            const topId = screenStack.pop();
            const topEl = getScreen(topId);

            if (topEl) {
                topEl.classList.remove("is-active");
                topEl.hidden = true;
            }
        }

        setActiveScreen();
    };

    const openMobileMenu = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;

        window.clearTimeout(mobileMenuCloseTimeoutId);

        window.tlMegaMenuOpen = true;

        document.body.dataset.megaMenuScrollY = String(scrollY);
        document.body.style.top = -scrollY + "px";

        mobileMenu.hidden = false;

        void mobileMenu.offsetHeight;

        window.setTimeout(() => {
            mobileMenu.classList.add("is-open");
        }, 10);

        catalogBtn.classList.add("is-open");
        catalogBtn.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("mega-menu-open");
        document.body.classList.add("mega-menu-open");
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.remove("is-open");

        window.clearTimeout(mobileMenuCloseTimeoutId);
        mobileMenuCloseTimeoutId = window.setTimeout(() => {
            mobileMenu.hidden = true;
            resetToRoot();
        }, 300);

        catalogBtn.classList.remove("is-open");
        catalogBtn.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("mega-menu-open");
        document.body.classList.remove("mega-menu-open");

        const scrollY = parseInt(
            document.body.dataset.megaMenuScrollY || "0",
            10
        );

        document.body.style.top = "";
        delete document.body.dataset.megaMenuScrollY;

        const previousScrollBehavior =
            document.documentElement.style.scrollBehavior;

        document.documentElement.style.scrollBehavior = "auto";

        window.scrollTo(0, scrollY);

        document.documentElement.style.scrollBehavior =
            previousScrollBehavior;

        window.tlMegaMenuOpen = false;
        window.dispatchEvent(new Event("scroll"));
    };

    window.tlMobileMenuToggle = () => {
        if (mobileMenu.classList.contains("is-open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    mobileMenuOverlay?.addEventListener("click", closeMobileMenu);

    mobileMenu.querySelectorAll("[data-mobile-menu-close]").forEach((btn) => {
        btn.addEventListener("click", closeMobileMenu);
    });

    mobileMenu.querySelectorAll("[data-back]").forEach((btn) => {
        btn.addEventListener("click", popScreen);
    });

    mobileMenu.querySelectorAll("[data-open-screen]").forEach((btn) => {
        btn.addEventListener("click", () => {
            pushScreen(btn.dataset.openScreen);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (!mobileMenu.classList.contains("is-open")) {
            return;
        }

        if (screenStack.length > 1) {
            popScreen();
        } else {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (
            mobileMenu.classList.contains("is-open")
            && !window.matchMedia("(max-width: 991px)").matches
        ) {
            closeMobileMenu();
        }
    });
});
/* ==========================================================================
   TURBOLEMONS LIVE SEARCH
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const header = document.querySelector(".header");

    const form =
        document.getElementById("header-search-form");

    const input =
        document.getElementById("header-search-input");

    const searchButton =
        document.getElementById("header-search-button");

    const clearButton =
        document.getElementById("header-search-clear");


    const modal =
        document.getElementById("header-search-live");

    const overlay =
        document.getElementById("header-search-overlay");

    const panel =
        modal?.querySelector(".header-search-live__panel");

    const closeButton =
        document.getElementById("header-search-close");


    const mobileForm =
        document.getElementById("header-search-mobile-form");

    const mobileInput =
        document.getElementById("header-search-mobile-input");

    const mobileClear =
        document.getElementById("header-search-mobile-clear");


    const hint =
        document.getElementById("header-search-hint");

    const loading =
        document.getElementById("header-search-loading");

    const empty =
        document.getElementById("header-search-empty");

    const resultsWrap =
        document.getElementById("header-search-results-wrap");

    const results =
        document.getElementById("header-search-results");

    const allLink =
        document.getElementById("header-search-all");


    if (
        !header
        || !form
        || !input
        || !modal
        || !panel
        || !results
    ) {
        return;
    }


    const MOBILE_QUERY =
        window.matchMedia("(max-width: 991px)");


    let debounceTimer = null;

    let abortController = null;

    let closeTimer = null;

    let lastQuery = "";

    let lastItems = [];


    /* ======================================================================
       HELPERS
       ====================================================================== */

    const escapeHtml = (value = "") => {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;
    };


    const isMobile = () =>
        MOBILE_QUERY.matches;


    const getQuery = () => {

        if (isMobile()) {
            return mobileInput?.value.trim() || "";
        }

        return input.value.trim();
    };


    const syncInputs = (value) => {

        if (input.value !== value) {
            input.value = value;
        }

        if (
            mobileInput
            && mobileInput.value !== value
        ) {
            mobileInput.value = value;
        }

        updateClearButtons();
    };


    const updateClearButtons = () => {

        const desktopHasValue =
            input.value.trim() !== "";

        clearButton.hidden =
            !desktopHasValue;


        if (mobileClear && mobileInput) {

            mobileClear.hidden =
                mobileInput.value.trim() === "";
        }
    };


    /* ======================================================================
       POSITION
       ====================================================================== */

    const updatePosition = () => {

        const headerRect =
            header.getBoundingClientRect();

        const searchRect =
            form.getBoundingClientRect();


        document.documentElement.style.setProperty(
            "--tl-search-header-bottom",
            Math.max(
                0,
                headerRect.bottom
            ) + "px"
        );


        document.documentElement.style.setProperty(
            "--tl-search-center",
            (
                searchRect.left
                + searchRect.width / 2
            ) + "px"
        );
    };


    /* ======================================================================
       OPEN / CLOSE
       ====================================================================== */

    const openSearch = () => {

        window.clearTimeout(closeTimer);

        updatePosition();

        modal.hidden = false;

        void modal.offsetHeight;

        requestAnimationFrame(() => {
            modal.classList.add("is-open");
        });


        input.setAttribute(
            "aria-expanded",
            "true"
        );


        document.documentElement.classList.add(
            "header-search-open"
        );


        document.body.classList.add(
            "header-search-open"
        );


        if (isMobile()) {

            syncInputs(input.value);

            window.setTimeout(() => {
                mobileInput?.focus();
            }, 100);
        }
    };


    const closeSearch = () => {

        modal.classList.remove("is-open");

        input.setAttribute(
            "aria-expanded",
            "false"
        );


        document.documentElement.classList.remove(
            "header-search-open"
        );

        document.body.classList.remove(
            "header-search-open"
        );


        window.clearTimeout(closeTimer);

        closeTimer =
            window.setTimeout(() => {

                modal.hidden = true;

            }, 220);
    };


    /* ======================================================================
       STATES
       ====================================================================== */

    const hideStates = () => {

        if (hint) {
            hint.hidden = true;
        }

        if (loading) {
            loading.hidden = true;
        }

        if (empty) {
            empty.hidden = true;
        }

        if (resultsWrap) {
            resultsWrap.hidden = true;
        }

        if (allLink) {
            allLink.hidden = true;
        }
    };


    const showHint = () => {

        hideStates();

        if (hint) {
            hint.hidden = false;
        }
    };


    const showLoading = () => {

        hideStates();

        if (loading) {
            loading.hidden = false;
        }
    };


    const showEmpty = () => {

        hideStates();

        if (empty) {
            empty.hidden = false;
        }
    };


    /* ======================================================================
       RENDER
       ====================================================================== */

    const renderResults = (data) => {

        lastItems =
            Array.isArray(data.items)
                ? data.items
                : [];


        if (!lastItems.length) {

            results.innerHTML = "";

            showEmpty();

            return;
        }


        results.innerHTML =
            lastItems.map((item) => {

                const image =
                    item.image
                        ? `
                            <img
                                src="${escapeHtml(item.image)}"
                                alt=""
                                loading="lazy">
                        `
                        : `
                            <span
                                class="header-search-live__image-placeholder">
                            </span>
                        `;


                const section =
                    item.section
                        ? `
                            <span
                                class="header-search-live__item-section">
                                ${escapeHtml(item.section)}
                            </span>
                        `
                        : "";


                const price =
                    item.price
                        ? `
                            <span
                                class="header-search-live__price">
                                ${escapeHtml(item.price)}
                            </span>
                        `
                        : `
                            <span
                                class="header-search-live__price header-search-live__price--request">
                                Цена по запросу
                            </span>
                        `;


                const oldPrice =
                    item.oldPrice
                        ? `
                            <span
                                class="header-search-live__old-price">
                                ${escapeHtml(item.oldPrice)}
                            </span>
                        `
                        : "";


                return `
                    <a
                        href="${escapeHtml(item.url)}"
                        class="header-search-live__item">

                        <span
                            class="header-search-live__image">
                            ${image}
                        </span>

                        <span
                            class="header-search-live__item-content">

                            ${section}

                            <span
                                class="header-search-live__item-name">
                                ${escapeHtml(item.name)}
                            </span>

                            <span
                                class="header-search-live__prices">

                                ${price}

                                ${oldPrice}

                            </span>

                        </span>

                        <span
                            class="header-search-live__item-arrow"
                            aria-hidden="true">
                            →
                        </span>

                    </a>
                `;

            }).join("");


        hideStates();

        resultsWrap.hidden = false;


        if (allLink) {

            const query =
                data.query || getQuery();

            allLink.href =
                "/search/?q="
                + encodeURIComponent(query);

            allLink.hidden = false;
        }
    };


    /* ======================================================================
       REQUEST
       ====================================================================== */

    const search = async (query) => {

        query =
            query.trim();


        if (query.length < 2) {

            lastQuery = "";

            lastItems = [];

            abortController?.abort();

            results.innerHTML = "";

            showHint();

            return;
        }


        if (query === lastQuery) {
            return;
        }


        lastQuery = query;


        abortController?.abort();

        abortController =
            new AbortController();


        showLoading();


        try {

            const response =
                await fetch(
                    "/local/ajax/header-search.php?q="
                    + encodeURIComponent(query),
                    {
                        method: "GET",
                        headers: {
                            "X-Requested-With":
                                "XMLHttpRequest"
                        },
                        signal:
                            abortController.signal
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "HTTP "
                    + response.status
                );
            }


            const data =
                await response.json();


            /*
             * Если пользователь уже успел
             * изменить строку поиска —
             * старый ответ игнорируем.
             */
            if (
                query !== getQuery()
            ) {
                return;
            }


            if (!data.success) {

                throw new Error(
                    data.error
                    || "Search error"
                );
            }


            renderResults(data);

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {
                return;
            }


            console.error(
                "Ошибка live search:",
                error
            );


            showEmpty();
        }
    };


    const scheduleSearch = (value) => {

        window.clearTimeout(
            debounceTimer
        );


        debounceTimer =
            window.setTimeout(() => {

                search(value);

            }, 250);
    };


    /* ======================================================================
       DESKTOP INPUT
       ====================================================================== */

    input.addEventListener(
        "focus",
        () => {

            if (isMobile()) {
                return;
            }

            openSearch();

            scheduleSearch(
                input.value
            );
        }
    );


    input.addEventListener(
        "input",
        () => {

            const value =
                input.value;

            syncInputs(value);

            openSearch();

            scheduleSearch(value);
        }
    );


    /* ======================================================================
       MOBILE BUTTON
       ====================================================================== */

    searchButton?.addEventListener(
        "click",
        (event) => {

            if (!isMobile()) {
                return;
            }

            event.preventDefault();

            openSearch();

            showHint();
        }
    );


    /* ======================================================================
       MOBILE INPUT
       ====================================================================== */

    mobileInput?.addEventListener(
        "input",
        () => {

            const value =
                mobileInput.value;

            syncInputs(value);

            scheduleSearch(value);
        }
    );


    /* ======================================================================
       CLEAR
       ====================================================================== */

    const clearSearch = () => {

        syncInputs("");

        lastQuery = "";

        lastItems = [];

        abortController?.abort();

        results.innerHTML = "";

        showHint();


        if (isMobile()) {
            mobileInput?.focus();
        } else {
            input.focus();
        }
    };


    clearButton?.addEventListener(
        "click",
        clearSearch
    );


    mobileClear?.addEventListener(
        "click",
        clearSearch
    );


    /* ======================================================================
       FORM SUBMIT
       ====================================================================== */

    form.addEventListener(
        "submit",
        (event) => {

            const query =
                input.value.trim();


            if (isMobile()) {

                event.preventDefault();

                openSearch();

                return;
            }


            if (query.length < 2) {

                event.preventDefault();

                openSearch();

                showHint();

                input.focus();
            }
        }
    );


    mobileForm?.addEventListener(
        "submit",
        (event) => {

            const query =
                mobileInput?.value.trim()
                || "";


            if (query.length < 2) {

                event.preventDefault();

                showHint();

                return;
            }


            syncInputs(query);
        }
    );


    /* ======================================================================
       CLOSE EVENTS
       ====================================================================== */

    overlay?.addEventListener(
        "click",
        closeSearch
    );


    closeButton?.addEventListener(
        "click",
        closeSearch
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
                && modal.classList.contains(
                    "is-open"
                )
            ) {
                closeSearch();
            }
        }
    );


    /*
     * Открываем повторно при клике
     * внутри формы.
     */
    form.addEventListener(
        "click",
        () => {

            if (
                !isMobile()
                && !modal.classList.contains(
                    "is-open"
                )
            ) {
                openSearch();

                scheduleSearch(
                    input.value
                );
            }
        }
    );


    /*
     * Если открыли каталог —
     * поиск закрываем.
     */
    document
        .getElementById(
            "header-catalog-btn"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    modal.classList.contains(
                        "is-open"
                    )
                ) {
                    closeSearch();
                }
            }
        );


    /* ======================================================================
       RESIZE / SCROLL
       ====================================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                modal.classList.contains(
                    "is-open"
                )
            ) {

                updatePosition();

                if (isMobile()) {
                    mobileInput?.focus();
                }
            }
        }
    );


    window.addEventListener(
        "scroll",
        () => {

            if (
                modal.classList.contains(
                    "is-open"
                )
            ) {
                updatePosition();
            }
        },
        {
            passive:true
        }
    );


    updateClearButtons();
});

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       КНОПКА "НАВЕРХ"
       ========================================================================== */

    const scrollTopButtons = document.querySelectorAll(".scroll-top-btn");

    if (scrollTopButtons.length) {

        scrollTopButtons.forEach((scrollTopBtn) => {
            scrollTopBtn.addEventListener("click", (event) => {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        });

        const fixedScrollTopBtn = document.querySelector(".scroll-top-btn--fixed");

        if (fixedScrollTopBtn) {

            const isHomeMode = fixedScrollTopBtn.dataset.scrollTopMode === "home";

            const homeCatalogBlock = isHomeMode
                ? document.querySelector(".home-catalog")
                : null;

            const toggleFixedScrollTopBtn = () => {

                let shouldShow;

                if (homeCatalogBlock) {
                    shouldShow = homeCatalogBlock.getBoundingClientRect().bottom <= window.innerHeight;

                } else {

                    shouldShow = window.scrollY > 1000;

                }

                fixedScrollTopBtn.classList.toggle("is-visible", shouldShow);
            };

            toggleFixedScrollTopBtn();

            window.addEventListener("scroll", toggleFixedScrollTopBtn, { passive: true });

        }

    }
});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:73:"/local/templates/turbolemons-template/js/metrika-goals.js?178826083445099";s:6:"source";s:57:"/local/templates/turbolemons-template/js/metrika-goals.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function () {
    "use strict";

    /*
    |--------------------------------------------------------------------------
    | TurboLemons — Yandex Metrica goals
    |--------------------------------------------------------------------------
    */

    const COUNTER_ID = 112043730;

const GOALS = {
    ORDER_SUBMIT: "order_submit",
    BUY_NOW_SUBMIT: "buy_now_submit",
    CALLBACK_SUBMIT: "callback_submit",
    PHONE_CLICK: "phone_click",
    ADD_TO_CART: "eCommerce add",
    CART_OPEN: "cart_open",
    SITE_SEARCH: "site_search",
    CATALOG_FILTER: "catalog_filter",
    HERO_CLICK: "hero_click",
    ENGAGED_PRODUCTS: "engaged_products",

    B24_CLIENT_INITIATE_CHAT: "B24_client_initiate_chat"
};
    /*
    |--------------------------------------------------------------------------
    | Debug
    |--------------------------------------------------------------------------
    |
    | В консоли можно выполнить:
    |
    | TurboLemonsMetrika.setDebug(true)
    |
    | После этого каждое срабатывание будет видно в Console.
    |
    */

    let DEBUG = false;

    const debug = (...args) => {
        if (DEBUG) {
            console.log(
                "%c[TurboLemons Metrika]",
                "font-weight:bold;color:#7a9400",
                ...args
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Защита от случайных дублей
    |--------------------------------------------------------------------------
    */

    const lastGoalTime = new Map();

    const sendGoal = (goalId, params = {}) => {

        if (!goalId) {
            return false;
        }

        const now = Date.now();
        const previous = lastGoalTime.get(goalId) || 0;

        /*
         * Защищаемся от двойных DOM-событий.
         */
        if (now - previous < 700) {
            debug("duplicate skipped:", goalId);
            return false;
        }

        if (typeof window.ym !== "function") {
            debug("ym() ещё не доступен:", goalId);
            return false;
        }

        lastGoalTime.set(goalId, now);

        try {

            window.ym(
                COUNTER_ID,
                "reachGoal",
                goalId,
                params
            );

            debug("GOAL:", goalId, params);

            return true;

        } catch (error) {

            console.error(
                "[TurboLemons Metrika] reachGoal error:",
                goalId,
                error
            );

            return false;
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Утилиты
    |--------------------------------------------------------------------------
    */

    const cleanText = (value) => {
        return String(value || "")
            .replace(/\s+/g, " ")
            .trim();
    };


    const parsePrice = (value) => {

        if (typeof value === "number") {
            return Number.isFinite(value)
                ? value
                : null;
        }

        let text = String(value || "")
            .replace(/\s+/g, "")
            .replace(",", ".")
            .replace(/[^\d.]/g, "");

        if (!text) {
            return null;
        }

        const number = parseFloat(text);

        return Number.isFinite(number)
            ? number
            : null;
    };


    const getUrlPath = (value) => {

        try {
            return new URL(
                value,
                window.location.href
            ).pathname;
        } catch (error) {
            return "";
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Получение Product из нашей Schema.org
    |--------------------------------------------------------------------------
    */

    const getSchemaProduct = () => {

        const scripts =
            document.querySelectorAll(
                'script[type="application/ld+json"]'
            );

        for (const script of scripts) {

            let data;

            try {
                data = JSON.parse(
                    script.textContent
                );
            } catch (error) {
                continue;
            }

            const graph =
                Array.isArray(data?.["@graph"])
                    ? data["@graph"]
                    : [data];

            for (const entity of graph) {

                if (!entity) {
                    continue;
                }

                const type =
                    entity["@type"];

                const isProduct =
                    type === "Product"
                    ||
                    (
                        Array.isArray(type)
                        && type.includes("Product")
                    );

                if (isProduct) {
                    return entity;
                }
            }
        }

        return null;
    };


    const getSchemaOffer = (schemaProduct) => {

        if (!schemaProduct?.offers) {
            return null;
        }

        if (Array.isArray(schemaProduct.offers)) {
            return schemaProduct.offers[0] || null;
        }

        return schemaProduct.offers;
    };


    /*
    |--------------------------------------------------------------------------
    | Данные товара
    |--------------------------------------------------------------------------
    */

    const getProductData = (element = null) => {

        const button =
            element?.closest?.(
                ".pm-add-cart,"
                + ".catalog-product-card__action[data-product-id],"
                + ".product-detail__cart[data-product-id],"
                + "[data-sticky-cart]"
            )
            || element;

        const card =
            button?.closest?.(
                ".catalog-product-card"
            )
            || null;

        /*
         * Schema текущей детальной страницы используем только
         * если пользователь добавляет именно текущий товар,
         * а не карточку "Покупают вместе".
         */
        const useSchema =
            !card
            && !!document.querySelector(
                ".product-detail"
            );

        const schema =
            useSchema
                ? getSchemaProduct()
                : null;

        const offer =
            getSchemaOffer(schema);

        let id =
            button?.dataset?.productId
            || button?.dataset?.offer
            || card?.dataset?.productId
            || schema?.sku
            || "";

        let name =
            cleanText(
                card
                    ?.querySelector(
                        ".catalog-product-card__title"
                    )
                    ?.textContent
            );

        if (!name && schema?.name) {
            name = cleanText(schema.name);
        }

        if (!name) {
            name = cleanText(
                document
                    .querySelector(
                        "#product-detail-title"
                    )
                    ?.textContent
            );
        }

        let price = null;

        if (card) {

            price = parsePrice(
                card
                    .querySelector(
                        ".catalog-product-card__price"
                    )
                    ?.textContent
            );

        } else if (offer) {

            price = parsePrice(
                offer.price
                ?? offer.lowPrice
            );
        }

        if (price === null && !card) {

            price = parsePrice(
                document
                    .querySelector(
                        ".product-detail__price"
                    )
                    ?.textContent
            );
        }

        let brand = "";

        if (schema?.brand) {

            brand =
                typeof schema.brand === "string"
                    ? schema.brand
                    : schema.brand.name || "";
        }

        let category =
            cleanText(
                schema?.category || ""
            );

        if (!id && useSchema) {
            id =
                schema?.sku
                || schema?.url
                || location.pathname;
        }

        return {
            id: String(id || ""),
            name: name,
            price: price,
            brand: cleanText(brand),
            category: category,
            currency:
                offer?.priceCurrency
                || "RUB",
            source:
                card
                    ? "product_card"
                    : "product_detail"
        };
    };


    /*
    |--------------------------------------------------------------------------
    | Yandex Ecommerce — ADD
    |--------------------------------------------------------------------------
    */

    const pushEcommerceAdd = (product) => {

        if (!product) {
            return;
        }

        window.dataLayer =
            window.dataLayer || [];

        const ecommerceProduct = {
            id:
                String(
                    product.id
                    || location.pathname
                ),

            name:
                product.name
                || "Товар",

            quantity: 1
        };

        if (
            product.price !== null
            && Number.isFinite(product.price)
        ) {
            ecommerceProduct.price =
                product.price;
        }

        if (product.brand) {
            ecommerceProduct.brand =
                product.brand;
        }

        if (product.category) {
            ecommerceProduct.category =
                product.category;
        }

        ecommerceProduct.list =
            product.source === "product_card"
                ? "Карточки товаров"
                : "Карточка товара";

        const ecommerceData = {
            ecommerce: {
                currencyCode:
                    product.currency || "RUB",

                add: {
                    products: [
                        ecommerceProduct
                    ]
                }
            }
        };

        window.dataLayer.push(
            ecommerceData
        );

        debug(
            "ECOMMERCE ADD:",
            ecommerceData
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Добавление товара в корзину
    |--------------------------------------------------------------------------
    |
    | ВАЖНО:
    |
    | Здесь мы НЕ считаем простое нажатие на кнопку.
    | Сначала запоминаем товар.
    |
    | Цель отправится только после успешного ответа add.php.
    |
    */

    const ADD_BUTTON_SELECTOR = [
        ".pm-add-cart",
        ".catalog-product-card__action[data-product-id]",
        ".product-detail__cart[data-product-id]",
        "[data-sticky-cart]"
    ].join(",");

    let pendingAdd = null;


    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ADD_BUTTON_SELECTOR
                );

            if (!button) {
                return;
            }

            pendingAdd = {
                product:
                    getProductData(button),

                timestamp:
                    Date.now()
            };

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Перехватываем только ОТВЕТЫ cart/add.php
    |--------------------------------------------------------------------------
    |
    | Оригинальный fetch не ломаем.
    | Response возвращается исходному JS как обычно.
    |
    */

    if (typeof window.fetch === "function") {

        const nativeFetch =
            window.fetch;

        window.fetch = function () {

            const args =
                Array.from(arguments);

            const input =
                args[0];

            let requestUrl = "";

            if (typeof input === "string") {
                requestUrl = input;
            } else if (
                input
                && typeof input.url === "string"
            ) {
                requestUrl = input.url;
            }

            const requestPath =
                getUrlPath(requestUrl);

            const isCartAddRequest =
                /\/(?:local|bitrix)\/cart\/ajax\/add\.php$/i
                    .test(requestPath);

            const requestPromise =
                nativeFetch.apply(
                    this,
                    args
                );

            if (!isCartAddRequest) {
                return requestPromise;
            }

            return requestPromise.then(
                (response) => {

                    const copy =
                        response.clone();

                    copy
                        .json()
                        .then((data) => {

                            const successful =
                                response.ok
                                && (
                                    data?.success === true
                                    || data?.status === "success"
                                    || data?.ok === true
                                );

                            if (!successful) {
                                debug(
                                    "ADD failed:",
                                    data
                                );

                                return;
                            }

                            let product = null;

                            if (
                                pendingAdd
                                && Date.now()
                                    - pendingAdd.timestamp
                                    < 10000
                            ) {
                                product =
                                    pendingAdd.product;
                            }

                            if (!product) {
                                product =
                                    getProductData();
                            }

                            /*
                             * Настоящий Ecommerce event.
                             */
                            pushEcommerceAdd(
                                product
                            );

                            /*
                             * И одновременно цель из ТЗ.
                             */
                            const goalProduct = {
                                id:
                                    product?.id || "",

                                name:
                                    product?.name || "",

                                source:
                                    product?.source || ""
                            };

                            if (
                                product?.price !== null
                                && Number.isFinite(
                                    product?.price
                                )
                            ) {
                                goalProduct.price =
                                    product.price;
                            }

                            sendGoal(
                                GOALS.ADD_TO_CART,
                                {
                                    product:
                                        goalProduct
                                }
                            );

                        })
                        .catch(() => {
                            /*
                             * Ничего не ломаем,
                             * даже если backend вернул не JSON.
                             */
                        })
                        .finally(() => {
                            pendingAdd = null;
                        });

                    return response;
                }
            );
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Клик по телефону
    |--------------------------------------------------------------------------
    |
    | Номер телефона в Метрику специально НЕ отправляем.
    |
    */

    document.addEventListener(
        "click",
        (event) => {

            const phoneLink =
                event.target.closest(
                    'a[href^="tel:"]'
                );

            if (!phoneLink) {
                return;
            }

            let placement = "site";

            if (phoneLink.closest("header")) {
                placement = "header";
            } else if (
                phoneLink.closest("footer")
            ) {
                placement = "footer";
            }

            sendGoal(
                GOALS.PHONE_CLICK,
                {
                    placement:
                        placement
                }
            );

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Открытие корзины
    |--------------------------------------------------------------------------
    |
    | Считаем именно действие пользователя по кнопке корзины.
    | Автоматическое открытие корзины после других действий
    | не создаст ложную цель.
    |
    */

    document.addEventListener(
        "click",
        (event) => {

            const cartButton =
                event.target.closest(
                    "#pm-cart-open,"
                    + ".header__action--cart"
                );

            if (!cartButton) {
                return;
            }

            sendGoal(
                GOALS.CART_OPEN,
                {
                    source: "header"
                }
            );

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Поиск
    |--------------------------------------------------------------------------
    |
    | Фразу поиска НЕ передаем в параметрах цели.
    |
    */

    document.addEventListener(
        "submit",
        (event) => {

            const form =
                event.target;

            if (
                !(form instanceof HTMLFormElement)
            ) {
                return;
            }

            let isSearchForm =
                form.matches(
                    ".header__search"
                );

            if (!isSearchForm) {

                try {

                    const path =
                        new URL(
                            form.action,
                            location.href
                        ).pathname;

                    isSearchForm =
                        path === "/search/"
                        || path.startsWith(
                            "/search/"
                        );

                } catch (error) {
                    // ignore
                }
            }

            if (!isSearchForm) {
                return;
            }

            const query =
                cleanText(
                    form
                        .querySelector(
                            '[name="q"],'
                            + '[type="search"]'
                        )
                        ?.value
                );

            if (!query) {
                return;
            }

            sendGoal(
                GOALS.SITE_SEARCH,
                {
                    source: "header"
                }
            );

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Фильтр каталога
    |--------------------------------------------------------------------------
    |
    | Поддерживает:
    |
    | filter[PRICE_MIN]
    | filter[BRAND]
    | filter[POWER_MIN]
    | filter[COLOR][]
    |
    | и Bitrix smart.filter:
    |
    | arrFilter_...
    |
    | Сами значения пользователю в Метрику не отправляем.
    | Передаем только тип использованного фильтра.
    |
    */

    let filterTimer = null;

    const filterFields =
        new Set();


    const normalizeFilterField = (
        element
    ) => {

        const name =
            element?.name || "";

        if (name.startsWith("filter[")) {

            const match =
                name.match(
                    /^filter\[([^\]]+)/
                );

            return match
                ? match[1]
                : "filter";
        }

        if (name.startsWith("arrFilter_")) {
            return "bitrix_filter";
        }

        if (
            element?.closest?.(
                ".catalog-filter-price"
            )
        ) {
            return "price";
        }

        if (
            element?.closest?.(
                ".catalog-filter-colors-group"
            )
        ) {
            return "color";
        }

        if (
            element?.closest?.(
                ".catalog-filter-select"
            )
        ) {
            return "select";
        }

        return "filter";
    };


    const flushFilterGoal = () => {

        if (filterTimer) {
            clearTimeout(
                filterTimer
            );

            filterTimer = null;
        }

        if (!filterFields.size) {
            return;
        }

        const fields =
            Array.from(
                filterFields
            );

        filterFields.clear();

        sendGoal(
            GOALS.CATALOG_FILTER,
            {
                filter_count:
                    fields.length,

                filters:
                    fields
                        .slice(0, 12)
                        .join(",")
            }
        );
    };


    const markFilterUsed = (
        element
    ) => {

        filterFields.add(
            normalizeFilterField(
                element
            )
        );

        if (filterTimer) {
            clearTimeout(
                filterTimer
            );
        }

        /*
         * Несколько быстрых выборов фильтра
         * объединяем в одно событие.
         */
        filterTimer =
            setTimeout(
                flushFilterGoal,
                900
            );
    };


    document.addEventListener(
        "change",
        (event) => {

            const element =
                event.target;

            if (!(element instanceof Element)) {
                return;
            }

            const name =
                element.getAttribute(
                    "name"
                ) || "";

            const isFilter =
                name.startsWith(
                    "filter["
                )
                ||
                name.startsWith(
                    "arrFilter_"
                )
                ||
                !!element.closest(
                    ".catalog-filter"
                )
                ||
                !!element.closest(
                    ".bx-filter"
                );

            if (!isFilter) {
                return;
            }

            markFilterUsed(
                element
            );

        },
        true
    );


    /*
     * У кастомных dropdown-ов hidden input
     * не всегда генерирует нативный change.
     */
    document.addEventListener(
        "click",
        (event) => {

            const option =
                event.target.closest(
                    ".catalog-filter-select__option,"
                    + ".catalog-filter-color,"
                    + ".catalog-filter-colors__all"
                );

            if (!option) {
                return;
            }

            markFilterUsed(
                option
            );

        },
        true
    );


    /*
     * Если пользователь сразу нажал
     * "Показать товары" — не ждём debounce.
     */
    document.addEventListener(
        "submit",
        (event) => {

            const form =
                event.target;

            if (
                !(form instanceof HTMLFormElement)
            ) {
                return;
            }

            const containsFilter =
                form.matches(
                    ".catalog-filter__form"
                )
                ||
                !!form.querySelector(
                    '[name^="filter["],'
                    + '[name^="arrFilter_"]'
                );

            if (containsFilter) {
                flushFilterGoal();
            }

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Главный баннер
    |--------------------------------------------------------------------------
    */

    document.addEventListener(
        "click",
        (event) => {

            const link =
                event.target.closest(
                    ".home-hero__catalog-button"
                );

            if (!link) {
                return;
            }

            const slide =
                link.closest(
                    "[data-home-slide]"
                );

            const slides =
                Array.from(
                    document.querySelectorAll(
                        "[data-home-slide]"
                    )
                );

            const slideIndex =
                slide
                    ? slides.indexOf(slide) + 1
                    : 0;

            let destination = "";

            try {
                destination =
                    new URL(
                        link.href,
                        location.href
                    ).pathname;
            } catch (error) {
                destination = "";
            }

            sendGoal(
                GOALS.HERO_CLICK,
                {
                    slide:
                        slideIndex,

                    button:
                        cleanText(
                            link.textContent
                        ),

                    destination:
                        destination
                }
            );

        },
        true
    );


    /*
    |--------------------------------------------------------------------------
    | Универсальный watcher успешного состояния
    |--------------------------------------------------------------------------
    */

    const isShown = (element) => {

        if (!element) {
            return false;
        }

        if (element.hidden) {
            return false;
        }

        if (
            element.getAttribute(
                "aria-hidden"
            ) === "true"
        ) {
            return false;
        }

        const style =
            window.getComputedStyle(
                element
            );

        return (
            style.display !== "none"
            && style.visibility !== "hidden"
        );
    };


    const watchTransition = (
        element,
        successTest,
        callback
    ) => {

        if (!element) {
            return;
        }

        let previous =
            !!successTest(element);

        const check = () => {

            const current =
                !!successTest(element);

            if (
                current
                && !previous
            ) {
                callback();
            }

            previous =
                current;
        };

        const observer =
            new MutationObserver(
                check
            );

        observer.observe(
            element,
            {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Заявка из корзины
    |--------------------------------------------------------------------------
    |
    | Успех = popup active +
    | заголовок "Получили вашу заявку".
    |
    */

    const initCartSubmitGoal = () => {

        const popup =
            document.getElementById(
                "pm-popup"
            );

        if (!popup) {
            return;
        }

        watchTransition(
            popup,

            (element) => {

                const title =
                    cleanText(
                        document
                            .getElementById(
                                "pm-popup-title"
                            )
                            ?.textContent
                    )
                    .toLowerCase();

                return (
                    element
                        .classList
                        .contains("active")
                    &&
                    title.includes(
                        "получили вашу заявку"
                    )
                );
            },

            () => {

                sendGoal(
                    GOALS.ORDER_SUBMIT,
                    {
                        source: "cart"
                    }
                );
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Купить сейчас
    |--------------------------------------------------------------------------
    */

    const initBuyNowGoal = () => {

        const success =
            document.getElementById(
                "product-buy-modal-success-step"
            );

        if (!success) {
            return;
        }

        watchTransition(
            success,

            (element) =>
                isShown(element),

            () => {

                const product =
                    getProductData();

                sendGoal(
                    GOALS.BUY_NOW_SUBMIT,
                    {
                        source:
                            "product_buy_now",

                        product_id:
                            product?.id || "",

                        product_name:
                            product?.name || ""
                    }
                );
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Обратный звонок — футер
    |--------------------------------------------------------------------------
    */

    const initFooterCallbackGoal =
        () => {

            const success =
                document.getElementById(
                    "footer-callback-success"
                );

            if (!success) {
                return;
            }

            watchTransition(
                success,

                (element) =>
                    isShown(element),

                () => {

                    sendGoal(
                        GOALS.CALLBACK_SUBMIT,
                        {
                            source:
                                "footer"
                        }
                    );
                }
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Обратный звонок — модалка главной
    |--------------------------------------------------------------------------
    */

    const initHomeCallbackGoal =
        () => {

            const success =
                document.getElementById(
                    "home-buy-modal-success-step"
                );

            if (!success) {
                return;
            }

            watchTransition(
                success,

                (element) =>
                    isShown(element),

                () => {

                    sendGoal(
                        GOALS.CALLBACK_SUBMIT,
                        {
                            source:
                                "home_callback"
                        }
                    );
                }
            );
        };


    /*
    |--------------------------------------------------------------------------
    | 2+ просмотренные модели
    |--------------------------------------------------------------------------
    |
    | Не считаем просто две карточки на экране.
    |
    | Считаем две РАЗНЫЕ открытые детальные
    | страницы техники в пределах одной сессии.
    |
    */

    const initEngagedProductsGoal =
        () => {

            const productRoot =
                document.querySelector(
                    ".product-detail"
                );

            const schema =
                getSchemaProduct();

            if (
                !productRoot
                && !schema
            ) {
                return;
            }

            const productKey =
                String(
                    schema?.url
                    || schema?.["@id"]
                    || location.pathname
                );

            if (!productKey) {
                return;
            }

            const STORAGE_KEY =
                "tl_metrika_viewed_products";

            const SENT_KEY =
                "tl_metrika_engaged_products_sent";

            let products = [];

            try {

                products =
                    JSON.parse(
                        sessionStorage.getItem(
                            STORAGE_KEY
                        )
                        || "[]"
                    );

                if (
                    !Array.isArray(products)
                ) {
                    products = [];
                }

            } catch (error) {
                products = [];
            }

            if (
                !products.includes(
                    productKey
                )
            ) {
                products.push(
                    productKey
                );
            }

            /*
             * Нам не нужно бесконечно хранить историю.
             */
            products =
                products.slice(-30);

            try {

                sessionStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        products
                    )
                );

            } catch (error) {
                // ignore
            }

            let alreadySent = false;

            try {

                alreadySent =
                    sessionStorage.getItem(
                        SENT_KEY
                    ) === "1";

            } catch (error) {
                alreadySent = false;
            }

            if (
                products.length >= 2
                && !alreadySent
            ) {

                sendGoal(
                    GOALS.ENGAGED_PRODUCTS,
                    {
                        models_count:
                            products.length
                    }
                );

                try {

                    sessionStorage.setItem(
                        SENT_KEY,
                        "1"
                    );

                } catch (error) {
                    // ignore
                }
            }
        };

/*
|--------------------------------------------------------------------------
| Bitrix24 — пользователь успешно начал чат
|--------------------------------------------------------------------------
|
| Цель отправляется только после успешной отправки сообщения
| в Bitrix24 через:
|
| /rest/im.message.add.json
|
| Защита:
| - не по клику на кнопку чата;
| - не по открытию виджета;
| - только после успешного HTTP-ответа;
| - максимум один раз за текущую сессию браузера.
|
*/

const initB24ChatGoal = () => {

    const STORAGE_KEY =
        "b24_goal_sent";

    let chatGoalSent = false;

    try {

        chatGoalSent =
            sessionStorage.getItem(
                STORAGE_KEY
            ) === "1";

    } catch (error) {

        chatGoalSent = false;

    }


    /*
     * Если цель уже была отправлена
     * в этой сессии — даже обработчик
     * повторно ставить не требуется.
     */
    if (chatGoalSent) {
        return;
    }


    const previousOpen =
        XMLHttpRequest.prototype.open;


    XMLHttpRequest.prototype.open =
        function (method, url) {

            this.__tlB24ChatUrl =
                typeof url === "string"
                    ? url
                    : String(url || "");


            /*
             * Не навешиваем обработчик повторно,
             * если один XHR-объект переиспользовали.
             */
            if (
                !this.__tlB24ChatGoalBound
            ) {

                this.__tlB24ChatGoalBound =
                    true;


                this.addEventListener(
                    "load",
                    function () {

                        /*
                         * Уже отправили цель.
                         */
                        if (chatGoalSent) {
                            return;
                        }


                        /*
                         * Нас интересует только
                         * отправка сообщения Bitrix24.
                         */
                        if (
                            typeof this.__tlB24ChatUrl
                                !== "string"
                            ||
                            !this.__tlB24ChatUrl.includes(
                                "/rest/im.message.add.json"
                            )
                        ) {
                            return;
                        }


                        /*
                         * Только успешный HTTP.
                         */
                        if (
                            this.status < 200
                            ||
                            this.status >= 300
                        ) {
                            return;
                        }


                        /*
                         * Дополнительная проверка ответа.
                         *
                         * Если Bitrix вернул JSON с error,
                         * такую отправку успешным чатом
                         * не считаем.
                         */
                        let responseSuccessful = true;

                        try {

                            if (
                                this.responseType === ""
                                ||
                                this.responseType === "text"
                            ) {

                                const responseText =
                                    String(
                                        this.responseText || ""
                                    ).trim();

                                if (responseText) {

                                    const responseData =
                                        JSON.parse(
                                            responseText
                                        );

                                    if (
                                        responseData
                                        &&
                                        (
                                            responseData.error
                                            ||
                                            responseData
                                                .error_description
                                        )
                                    ) {

                                        responseSuccessful =
                                            false;

                                    }

                                }

                            }

                        } catch (error) {

                            /*
                             * Если формат ответа изменился,
                             * ориентируемся на успешный HTTP,
                             * как на старом сайте.
                             */

                        }


                        if (!responseSuccessful) {
                            return;
                        }


                        /*
                         * Отправляем цель через наш
                         * общий безопасный sendGoal().
                         */
                        const goalSent =
                            sendGoal(
                                GOALS
                                    .B24_CLIENT_INITIATE_CHAT,
                                {
                                    source:
                                        "bitrix24_chat"
                                }
                            );


                        /*
                         * Помечаем сессию только если
                         * ym() реально был вызван.
                         */
                        if (!goalSent) {
                            return;
                        }


                        chatGoalSent = true;


                        try {

                            sessionStorage.setItem(
                                STORAGE_KEY,
                                "1"
                            );

                        } catch (error) {

                            // ignore

                        }


                        debug(
                            "B24 chat initiated successfully"
                        );

                    }
                );

            }


            return previousOpen.apply(
                this,
                arguments
            );
        };
};
    /*
    |--------------------------------------------------------------------------
    | INIT
    |--------------------------------------------------------------------------
    */

    const init = () => {

        initCartSubmitGoal();

        initBuyNowGoal();

        initFooterCallbackGoal();

        initHomeCallbackGoal();

        initEngagedProductsGoal();
        initB24ChatGoal();
        debug(
            "initialized",
            GOALS
        );
    };


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }


    /*
    |--------------------------------------------------------------------------
    | API для диагностики из консоли
    |--------------------------------------------------------------------------
    */

    window.TurboLemonsMetrika = {

        goals:
            GOALS,

        counterId:
            COUNTER_ID,

        setDebug(value = true) {
            DEBUG = !!value;

            console.log(
                "[TurboLemons Metrika] debug:",
                DEBUG
            );
        },

        getProduct() {
            return getProductData();
        },

        send(goalId, params = {}) {
            return sendGoal(
                goalId,
                params
            );
        }
    };

})();
/* End */
;; /* /local/templates/turbolemons-template/js/header.js?178817203141295*/
; /* /local/templates/turbolemons-template/js/metrika-goals.js?178826083445099*/
