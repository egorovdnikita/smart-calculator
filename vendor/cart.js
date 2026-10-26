/*==================================================
    PROMMINER CART
==================================================*/
window.CartStore = {
    items: [],

    set(items) {
        this.items = items;
        localStorage.setItem("pm_cart", JSON.stringify(items));
        this.emit();
    },

    load() {
        const data = localStorage.getItem("pm_cart");
        this.items = data ? JSON.parse(data) : [];
        return this.items;
    },

emit() {
    updateCartBadge(this.items || []);

    localStorage.setItem("pm_cart", JSON.stringify(this.items || []));
    localStorage.setItem("pm_cart_sync", Date.now());
}
};
function updateCartBadge(items) {

    let total = 0;

    items.forEach(i => {
        total += Number(i.count || 0);
    });

    const header = document.getElementById("pm-cart-count-header");
    const badge = document.getElementById("pm-cart-badge");

    if (header) header.textContent = total + " товаров";

    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? "flex" : "none";
    }
}
window.PromminerCart = {

    _pageScrollLock: null,

    lockPageScroll() {
        const body = document.body;
        const html = document.documentElement;

        if (!body || !html || body.classList.contains("pm-cart-open")) {
            return;
        }

        const scrollY =
            window.scrollY ||
            window.pageYOffset ||
            html.scrollTop ||
            0;

        this._pageScrollLock = {
            scrollY,
            body: {
                position: body.style.position,
                top: body.style.top,
                left: body.style.left,
                right: body.style.right,
                width: body.style.width,
                overflow: body.style.overflow
            },
            html: {
                overflow: html.style.overflow
            }
        };

        html.classList.add("pm-cart-open");
        body.classList.add("pm-cart-open");

        /*
         * На мобильных одного overflow:hidden недостаточно:
         * Safari/Chrome могут передать overscroll странице под drawer.
         * Фиксируем body в текущей позиции и возвращаем её при close().
         */
        if (window.matchMedia("(max-width: 768px)").matches) {
            html.style.overflow = "hidden";
            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.overflow = "hidden";
        }
    },

    unlockPageScroll() {
        const body = document.body;
        const html = document.documentElement;
        const state = this._pageScrollLock;

        if (!body || !html) {
            return;
        }

        html.classList.remove("pm-cart-open");
        body.classList.remove("pm-cart-open");

        if (state) {
            body.style.position = state.body.position;
            body.style.top = state.body.top;
            body.style.left = state.body.left;
            body.style.right = state.body.right;
            body.style.width = state.body.width;
            body.style.overflow = state.body.overflow;
            html.style.overflow = state.html.overflow;

            const scrollY = Number(state.scrollY || 0);
            this._pageScrollLock = null;

            requestAnimationFrame(() => {
                window.scrollTo(0, scrollY);
            });
        }
    },


async loadPopular() {

    try {

        const response = await fetch(
            "/local/cart/ajax/hit.php?v=cart_hit_v1&ts=" + Date.now(),
            {
                method: "GET",
                cache: "no-store",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json",
                    "Cache-Control": "no-cache"
                }
            }
        );

        if (!response.ok) {
            throw new Error("hit.php HTTP " + response.status);
        }

        const data = await response.json();

        console.log("[TL CART HIT]", data);

        if (!data.success || !Array.isArray(data.items)) {
            console.error("[TL CART HIT] Некорректный ответ hit.php", data);
            return "";
        }

        return data.items.slice(0, 3).map(item => {

            return `

<div class="pm-cart-rec">

    <div class="pm-cart-rec__top">

        <a href="${item.DETAIL_PAGE_URL}" class="pm-cart-rec__image">
            <img src="${item.IMAGE}" alt="${item.NAME}">
        </a>

        <div class="pm-cart-rec__content">

            <a href="${item.DETAIL_PAGE_URL}" class="pm-cart-rec__title">
                ${item.NAME}
            </a>

            <div class="pm-cart-rec__prices">

                <div class="pm-cart-rec__price">
                    ${item.PRICE ? "" + Number(item.PRICE).toLocaleString("ru-RU") + " ₽" : ""}
                </div>

                ${
                    item.OLD_PRICE > 0
                    ? `<div class="pm-cart-rec__oldprice">
                        ${Number(item.OLD_PRICE).toLocaleString("ru-RU")} ₽
                    </div>`
                    : ""
                }

            </div>

        </div>

    </div>
    <button
        class="pm-cart-rec__btn pm-add-cart"
        data-offer="${item.ID}"
        title="Добавить в корзину">

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="cartMask${item.ID}" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<path d="M2.23737 2.28845C1.84442 2.15746 1.41968 2.36983 1.28869 2.76279C1.15771 3.15575 1.37008 3.58049 1.76303 3.71147L2.02794 3.79978C2.70435 4.02524 3.15155 4.17551 3.481 4.32877C3.79296 4.47389 3.92784 4.59069 4.01426 4.71059C4.10068 4.83049 4.16883 4.99538 4.20785 5.33722C4.24907 5.69823 4.2502 6.17 4.2502 6.883L4.2502 9.55484C4.25018 10.9224 4.25017 12.0247 4.36673 12.8917C4.48774 13.7918 4.74664 14.5497 5.34855 15.1516C5.95047 15.7535 6.70834 16.0124 7.60845 16.1334C8.47542 16.25 9.57773 16.25 10.9453 16.25H18.0002C18.4144 16.25 18.7502 15.9142 18.7502 15.5C18.7502 15.0857 18.4144 14.75 18.0002 14.75H11.0002C9.56479 14.75 8.56367 14.7484 7.80832 14.6468C7.07455 14.5482 6.68598 14.3677 6.40921 14.091C6.17403 13.8558 6.00839 13.5398 5.9034 13H16.0222C16.9817 13 17.4614 13 17.8371 12.7522C18.2128 12.5045 18.4017 12.0636 18.7797 11.1817L19.2082 10.1817C20.0177 8.2929 20.4225 7.34849 19.9779 6.67422C19.5333 5.99996 18.5058 5.99996 16.4508 5.99996H5.74526C5.73936 5.69227 5.72644 5.41467 5.69817 5.16708C5.64282 4.68226 5.52222 4.2374 5.23112 3.83352C4.94002 3.42965 4.55613 3.17456 4.1137 2.96873C3.69746 2.7751 3.16814 2.59868 2.54176 2.38991L2.23737 2.28845Z" fill="black"/>
<path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" fill="black"/>
<path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" fill="black"/>
</mask>
<g mask="url(#cartMask${item.ID})">
<rect width="24" height="24" fill="currentColor"/>
</g>
</svg>

    </button>

</div>

`;

        }).join("");

    } catch (e) {

        console.error(e);
        return "";

    }

},

    cart: null,
    overlay: null,
    items: null,
    openBtn: null,
    closeBtn: null,
    form: null,

init() {
    this.cart = document.getElementById("pm-cart");
    this.overlay = document.getElementById("pm-cart-overlay");
    this.items = document.getElementById("pm-cart-items");
    this.empty = document.getElementById("pm-cart-empty");

    this.openBtn = document.getElementById("pm-cart-open");
    this.closeBtn = document.getElementById("pm-cart-close");

    this.form = document.getElementById("pm-cart-form");
    this.summary = document.getElementById("pm-cart-summary");
    this.footer = document.getElementById("pm-cart-footer");
    this.clearBtn = document.getElementById("pm-cart-clear");

    this.popup = document.getElementById("pm-popup");
    this.popupTitle = document.getElementById("pm-popup-title");
    this.popupText = document.getElementById("pm-popup-text");
    this.popupClose = document.getElementById("pm-popup-close");

    /*
     * Desktop alert must be positioned relative to the viewport, not the cart drawer.
     * Moving only the alert node does not change delete/undo logic: all handlers use its ID.
     */
    this.deleteAlert = document.getElementById("pm-cart-alert");

    if (this.deleteAlert && this.deleteAlert.parentElement !== document.body) {
        document.body.appendChild(this.deleteAlert);
    }

    if (!this.cart) {
        console.error("Не найден элемент #pm-cart");
    }

    if (!this.overlay) {
        console.error("Не найден элемент #pm-cart-overlay");
    }

    if (!this.items) {
        console.error("Не найден элемент #pm-cart-items");
    }

    if (!this.openBtn) {
        console.error("Не найдена кнопка #pm-cart-open");
    }

    if (
        this.cart &&
        this.overlay &&
        this.items &&
        this.empty
    ) {
        this.bindEvents();
    }
},
    bindEvents() {


        if (this.closeBtn) {

            this.closeBtn.addEventListener("click", () => {

                this.close();

            });

        }

        if (this.overlay) {

            this.overlay.addEventListener("click", () => {

                this.close();

            });

        }
const undoBtn = document.getElementById("pm-cart-alert-undo");

if (undoBtn) {

    undoBtn.addEventListener("click", async () => {

        if (!this.lastDeletedItem) {
            return;
        }

        await fetch("/bitrix/cart/ajax/add.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "offer=" + encodeURIComponent(this.lastDeletedItem.offer_id) +
                "&count=" + encodeURIComponent(this.lastDeletedItem.count)
        });

        clearInterval(this.deleteAlertInterval);
        clearTimeout(this.deleteAlertTimeout);

        document
            .getElementById("pm-cart-alert")
            .classList.remove("active");

        /*
         * Если удалённый товар был ТП с собственной картинкой,
         * возвращаем её вместе с Undo.
         */
        if (
            this.lastDeletedItem?.offer_id &&
            this.lastDeletedItem?.image
        ) {
            pmCartSaveOfferImage(
                this.lastDeletedItem.offer_id,
                this.lastDeletedItem.image
            );
        }

        this.lastDeletedItem = null;

        await this.load();

    });

}


        document.addEventListener("keydown", (e) => {

            if (e.key === "Escape") {

                this.close();

            }


        });




        this.items.addEventListener("click", (e) => {

            const plus = e.target.closest(".pm-plus");
            const minus = e.target.closest(".pm-minus");
            const remove = e.target.closest(".pm-remove");

            if (plus) {

                this.update(
                    plus.dataset.id,
                    1
                );

                return;

            }

            if (minus) {

                this.update(
                    minus.dataset.id,
                    -1
                );

                return;

            }

            if (remove) {

                this.remove(
                    remove.dataset.id
                );

            }

        });
this.items.addEventListener("change", (e) => {

    const input = e.target.closest(".pm-counter__value");

    if (!input) return;

    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {
        value = 1;
    }

    this.setCount(input.dataset.id, value);

});

        if (this.form) {

            this.form.addEventListener("submit", (e) => {

                e.preventDefault();

                this.send();

            });

        }
if (this.clearBtn) {

    this.clearBtn.addEventListener("click", () => {

        this.clear();

    });

}
if (this.popupClose) {

    this.popupClose.addEventListener("click", () => {

        this.hidePopup();

    });

}

const popupCloseTop = document.getElementById("pm-popup-close-top");

if (popupCloseTop) {

    popupCloseTop.addEventListener("click", () => {

        this.hidePopup();

    });

}

if (this.popup) {

    this.popup.addEventListener("click", (e) => {

        if (e.target === this.popup) {

            this.hidePopup();

        }

    });

}

    },


async open() {
    this.cart = document.getElementById("pm-cart");
    this.overlay = document.getElementById("pm-cart-overlay");
    this.items = document.getElementById("pm-cart-items");
    this.empty = document.getElementById("pm-cart-empty");

    if (!this.cart || !this.overlay) {
        console.error(
            "Корзина не открыта: отсутствует #pm-cart или #pm-cart-overlay"
        );

        return;
    }

    this.cart.classList.add("active");
    this.overlay.classList.add("active");
    this.lockPageScroll();

    if (this.items && this.empty) {
        await this.load();
    }
},
close() {
    this.cart?.classList.remove("active");
    this.overlay?.classList.remove("active");
    this.unlockPageScroll();
},
    async load() {

this.items.innerHTML = `
    <div class="pm-loader">
        Загрузка...
    </div>
`;

this.empty.innerHTML = "";
this.empty.style.display = "flex";
this.items.style.display = "none";
        try {

            const response = await fetch(
                "/local/cart/ajax/get.php?cache=" + Date.now()
            );

            const data = await response.json();

            if (!data.success) {

                throw new Error(
                    data.error || "Ошибка загрузки корзины."
                );

            }
const cartItems = pmCartApplyOfferImages(
    data.items || []
);

await this.render(cartItems);
CartStore.set(cartItems);

this.syncCatalogCounters(cartItems);
        }
        catch (e) {

            console.error(e);

this.empty.innerHTML = `
<div class="pm-cart-empty">
    <div class="pm-cart-empty__icon">
        🛒
    </div>

    <div class="pm-cart-empty__title">
        В корзине пока пусто
    </div>

    <div class="pm-cart-empty__text">
        Загляните в каталог — собрали там товары,<br>
        которые могут вам понравиться
    </div>

    <a href="/catalog/" class="pm-cart-empty__btn">
        Перейти в каталог
    </a>

</div>
`;
this.items.innerHTML = "";

this.items.innerHTML = "";
            this.updateSummary([]);

        }

    },

async render(items) {
if (!items.length) {

    const popularHTML = await this.loadPopular();

this.empty.innerHTML = `
<div class="pm-cart-empty">


    <div class="pm-cart-empty__center">

        <div class="pm-cart-empty__icon">
            <img src="/local/cart/img/cart-empty.png" alt="">
        </div>

        <div class="pm-cart-empty__title">
            В корзине пока пусто
        </div>

        <div class="pm-cart-empty__text">
Загляните в каталог — собрали там товары,<br>
которые могут вам понравиться
        </div>

        <a href="/catalog/" class="pm-cart-empty__btn">
            Перейти в каталог
        </a>

    </div>
<div class="pm-cart-empty__popular">

    <div class="pm-cart-empty__popular-title">
        Хиты продаж
    </div>

    <div class="pm-cart-empty__popular-grid">
        ${popularHTML}
    </div>

</div>

</div>
`;
this.empty.style.display = "flex";
this.items.style.display = "none";
this.items.innerHTML = "";

    this.updateSummary([]);
    this.toggleBlocks([]);

    return;
}        let html = "";

        items.forEach(item => {

            html += this.createItem(item);

        });
this.empty.innerHTML = "";

this.empty.style.display = "none";

this.items.style.display = "block";

this.items.innerHTML = html;
        this.updateSummary(items);
this.toggleBlocks(items);

    },
createItem(item) {

    return `

<div class="pm-cart-item" data-id="${item.offer_id}">

    <div class="pm-cart-item__image">
        <img
            src="${item.image || "/bitrix/cart/assets/no-photo.png"}"
            alt="${item.title}"
            loading="lazy">
    </div>

    <div class="pm-cart-item__content">

        <div class="pm-cart-item__info">

            <div class="pm-cart-item__title">
                ${item.title}
            </div>

            ${(() => {
                const color = String(item.color || "").trim();
                let variant = String(item.size || item.variant || item.offer || item.model || "").trim();

                if (color && variant && color.toLocaleLowerCase("ru-RU") === variant.toLocaleLowerCase("ru-RU")) {
                    variant = String(item.model || "").trim();
                }

                const parts = [];

                if (color) {
                    parts.push(color.toLocaleLowerCase("ru-RU"));
                }

                if (variant) {
                    parts.push(variant);
                }

                return parts.length
                    ? `<div class="pm-cart-item__meta">${parts.join(" • ")}</div>`
                    : "";
            })()}

        </div>

        <div class="pm-cart-item__prices">

            <div class="pm-cart-item__price">
                ${item.price > 0 ? "" + Number(item.price).toLocaleString("ru-RU") + " ₽" : "Цена по запросу"}
            </div>

            ${
                item.old_price > 0
                ? `<div class="pm-cart-item__oldprice">
                        ${Number(item.old_price).toLocaleString("ru-RU")} ₽
                   </div>`
                : ""
            }

        </div>

        <div class="pm-cart-item__bottom">

            <div class="pm-counter">

                <button
                    type="button"
                    class="pm-minus"
                    data-id="${item.offer_id}">
                    −
                </button>

<input
    type="number"
    class="pm-counter__value"
    value="${item.count}"
    min="1"
    data-id="${item.offer_id}"
>
                <button
                    type="button"
                    class="pm-plus"
                    data-id="${item.offer_id}">
                    +
                </button>

            </div>

            <button
                type="button"
                class="pm-remove"
                data-id="${item.offer_id}"
                aria-label="Удалить">

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_8665_13357_${item.offer_id}" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.5956 22H12.4044C15.1871 22 16.5785 22 17.4831 21.1141C18.3878 20.2281 18.4803 18.7749 18.6654 15.8685L18.9321 11.6806C19.0326 10.1036 19.0828 9.31511 18.6289 8.81545C18.1751 8.31579 17.4087 8.31579 15.876 8.31579H8.12404C6.59127 8.31579 5.82488 8.31579 5.37105 8.81545C4.91722 9.31511 4.96744 10.1036 5.06788 11.6806L5.33459 15.8685C5.5197 18.7749 5.61225 20.2281 6.51689 21.1141C7.42153 22 8.81289 22 11.5956 22ZM15.2463 12.3456C15.2875 11.9117 14.9868 11.5249 14.5746 11.4815C14.1625 11.4381 13.7949 11.7546 13.7537 12.1885L13.2537 17.4516C13.2125 17.8855 13.5132 18.2724 13.9254 18.3157C14.3375 18.3591 14.7051 18.0426 14.7463 17.6087L15.2463 12.3456ZM9.42537 11.4815C9.83753 11.4381 10.2051 11.7546 10.2463 12.1885L10.7463 17.4516C10.7875 17.8855 10.4868 18.2724 10.0746 18.3157C9.66247 18.3591 9.29494 18.0426 9.25372 17.6087L8.75372 12.3456C8.71251 11.9117 9.01321 11.5249 9.42537 11.4815Z" fill="black"/>
</mask>
<g mask="url(#mask0_8665_13357_${item.offer_id})">
<rect width="24" height="24" fill="currentColor"/>
</g>
</svg>

            </button>

        </div>

    </div>
 </div>
`;

},

toggleBlocks(items) {

    const hasItems = items.length > 0;

    if (this.summary) {
        this.summary.style.display = hasItems ? "block" : "none";
    }

    if (this.footer) {
        this.footer.style.display = hasItems ? "block" : "none";
    }

    if (this.clearBtn) {
        this.clearBtn.style.display = hasItems ? "inline-flex" : "none";
    }

},
syncCatalogCounters(items) {

    document.querySelectorAll(
        ".catalog-product-card__action[data-product-id], " +
        ".catalog-product-card__cart[data-product-id]"
    ).forEach(button => {

        const item = pmCartFindCatalogCardItem(
            button,
            items || []
        );

        pmCartSetCatalogCardButtonState(
            button,
            item
        );

    });

    document.querySelectorAll(".pm-cart-wrap").forEach(wrap => {

        const addBtn = wrap.querySelector(".pm-add-cart");
        const counter = wrap.querySelector(".pm-card-counter");

        if (!addBtn || !counter) return;

        const offer = addBtn.dataset.offer;

        const item = (items || []).find(i => String(i.offer_id) === String(offer));

        if (item) {

            addBtn.style.display = "none";

            counter.style.display = "flex";

            counter.querySelector(".pm-card-counter__value").textContent = item.count;

        } else {

            addBtn.style.display = "flex";

            counter.style.display = "none";

        }

    });
document.querySelectorAll(".pm-add-cart").forEach(productBtn => {

    const offer = productBtn.dataset.offer;

    const item = items.find(i => String(i.offer_id) === String(offer));

    if (item) {

        productBtn.disabled = true;
        productBtn.classList.add("pm-btn--disabled");

        const text = productBtn.querySelector(".pm-btn-text");

        if (text) {
            text.textContent = "В корзине";
        }

    } else {

        productBtn.disabled = false;
        productBtn.classList.remove("pm-btn--disabled");

        const text = productBtn.querySelector(".pm-btn-text");

        if (text) {
            text.textContent = "В корзину";
        }

    }

});

    /* Синхронизируем состояние кнопки текущего ТП на detail-странице. */
    if (typeof pmCartSyncDetailOffer === "function") {
        pmCartSyncDetailOffer(items || []);
    }
},

showPopup(title, text, type = "success") {

    this.popupTitle.textContent = title;

    this.popupText.textContent = text;

const icon = this.popup.querySelector(".pm-popup__icon");

if (icon) {

    if (type === "error") {

        icon.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#FDECEC"/>
                <path d="M24 24L40 40M40 24L24 40"
                      stroke="#E53935"
                      stroke-width="3"
                      stroke-linecap="round"/>
            </svg>
        `;

    } else {

        icon.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#7086FC"/>
                <circle cx="32" cy="32" r="12" fill="white"/>
                <path d="M27.5 32L30.5 35L36.5 29"
                      stroke="#7086FC"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
        `;

    }

}
    this.popup.classList.add("active");

},
hidePopup() {

    this.popup.classList.remove("active");

},
showDeleteAlert() {

    const alert = document.getElementById("pm-cart-alert");

    if (!alert) return;

    const timer = alert.querySelector(".pm-cart-alert__timer");

    clearInterval(this.deleteAlertInterval);
    clearTimeout(this.deleteAlertTimeout);

    let seconds = 3;

    timer.textContent = seconds;

    alert.classList.add("active");

    this.deleteAlertInterval = setInterval(() => {

        seconds--;

        if (seconds > 0) {

            timer.textContent = seconds;

        }

    }, 1000);

    this.deleteAlertTimeout = setTimeout(() => {

        clearInterval(this.deleteAlertInterval);

        alert.classList.remove("active");

    }, 3000);

},
updateSummary(items) {

    let totalCount = 0;
    let totalPrice = 0;

    items.forEach(item => {

        const count = Number(item.count) || 0;
        const price = Number(item.price) || 0;

        totalCount += count;
        totalPrice += count * price;

    });

const headerCount = document.getElementById("pm-cart-count-header");
const footerCount = document.getElementById("pm-cart-count-header-footer");
const cartTotal = document.getElementById("pm-cart-total");
if (headerCount) {
    headerCount.textContent =
        totalCount + " " + this.plural(totalCount);
}

if (footerCount) {
    footerCount.textContent =
        totalCount + " " + this.plural(totalCount);
}
    if (cartTotal) {
        cartTotal.textContent = this.formatPrice(totalPrice);
    }
},

    formatPrice(price) {

        price = Number(price);

if (price <= 0) {

    return "Цена по запросу";

}
        return price.toLocaleString("ru-RU") + " ₽";

    },

    plural(count) {

        count = Math.abs(Number(count));

        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod100 >= 11 && mod100 <= 19) {

            return "товаров";

        }

        if (mod10 === 1) {

            return "товар";

        }

        if (mod10 >= 2 && mod10 <= 4) {

            return "товара";

        }

        return "товаров";

    },

    async update(offerId, delta) {

        try {

const response = await fetch(
    "/bitrix/cart/ajax/updat.php",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            "offer=" + encodeURIComponent(offerId) +
            "&delta=" + encodeURIComponent(delta)
    }
);

const data = await response.json();

if (!data.success) {
    throw new Error(data.error || "Ошибка обновления корзины.");
}


const item = CartStore.items.find(
    i => Number(i.offer_id) === Number(offerId)
);

if (item) {

    /* Если нажали "-" и количество = 1 → удалить товар */
    if (delta < 0 && item.count === 1) {

        await this.remove(offerId);
        return;

    }

    item.count += delta;

    CartStore.set(CartStore.items);

    this.updateSummary(CartStore.items);
    this.syncCatalogCounters(CartStore.items);

    const input = this.items.querySelector(
        '.pm-counter__value[data-id="' + offerId + '"]'
    );

    if (input) {
        input.value = item.count;
    }

}

        }
        catch (e) {

            console.error("Cart update error:", e);

this.showPopup(

    "Ошибка",

    "Не удалось обновить корзину.",

    "error"

);
        }

    },
async setCount(offerId, count) {

    try {

        const response = await fetch(
            "/bitrix/cart/ajax/updat.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:
                    "offer=" + encodeURIComponent(offerId) +
                    "&count=" + encodeURIComponent(count)
            }
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Ошибка обновления корзины.");
        }

        await this.load();

    }
    catch (e) {

        console.error(e);

        this.showPopup(
            "Ошибка",
            "Не удалось обновить количество.",
            "error"
        );

    }

},

async remove(offerId) {

    const deletedItem = CartStore.items.find(
        item => Number(item.offer_id) === Number(offerId)
    );

    this.lastDeletedItem = deletedItem;

    try {
            const response = await fetch(
                "/bitrix/cart/ajax/delete_item.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },

                    body:
                        "offer=" + encodeURIComponent(offerId)
                }
            );

            const data = await response.json();

            if (!data.success) {

                throw new Error(
                    data.error || "Ошибка удаления."
                );

            }

pmCartRemoveOfferImage(offerId);

const items = CartStore.items.filter(
    i => Number(i.offer_id) !== Number(offerId)
);

CartStore.set(items);
const card = this.items.querySelector(
    '.pm-cart-item[data-id="' + offerId + '"]'
);

if (card) {
    card.remove();
}

this.updateSummary(items);
this.syncCatalogCounters(items);

document.dispatchEvent(
    new CustomEvent("pm-cart:changed")
);

if (!items.length) {

    await this.render([]);

    this.empty.style.display = "flex";
    this.items.style.display = "none";

}

this.showDeleteAlert();
        }
        catch (e) {

            console.error("Cart remove error:", e);

this.showPopup(

    "Ошибка",

    "Не удалось удалить товар.",

    "error"

);
        }

    },
async clear() {

    try {

        const response = await fetch(
            "/bitrix/cart/ajax/clear.php",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!data.success) {

            throw new Error("Ошибка очистки.");

        }

pmCartClearOfferImages();

await this.load();
document.dispatchEvent(
    new CustomEvent("pm-cart:changed")
);


    }
catch (e) {

    console.error(e);

this.showPopup(

    "Ошибка",

    "Не удалось очистить корзину.",

    "error"

);
}
},


async send() {

    const button = document.getElementById("pm-send");

    try {

        /* ---------------- Очистка ошибок ---------------- */

        document.querySelectorAll(".pm-error-text").forEach(el => {
            el.textContent = "";
        });

        document.querySelectorAll(".pm-cart-field-wrap.error").forEach(el => {
            el.classList.remove("error");
        });

        document.querySelector(".pm-cart-policy")?.classList.remove("error");


        /* ---------------- Поля ---------------- */

        const nameField = document.getElementById("pm-name");
        const phoneField = document.getElementById("pm-phone");
        const policy = document.getElementById("pm-policy");

        let hasError = false;

        const name = nameField ? nameField.value.trim() : "";

        if (!name) {

            const wrap = nameField?.closest(".pm-cart-field-wrap");

            if (wrap) {
                wrap.classList.add("error");
                wrap.querySelector(".pm-error-text").textContent = "Заполните это поле";
            }

            hasError = true;

        } else if (!/^[А-Яа-яA-Za-zЁё\s-]+$/.test(name)) {

            const wrap = nameField.closest(".pm-cart-field-wrap");

            wrap.classList.add("error");
            wrap.querySelector(".pm-error-text").textContent = "Некорректный формат";

            hasError = true;
        }


        /* ---------------- Телефон ---------------- */

        const phoneRaw = phoneField
            ? phoneField.value.replace(/\D/g, "")
            : "";

        if (!phoneRaw.length) {

            const wrap = phoneField?.closest(".pm-cart-field-wrap");

            if (wrap) {
                wrap.classList.add("error");
                wrap.querySelector(".pm-error-text").textContent = "Заполните это поле";
            }

            hasError = true;

        } else if (phoneRaw.length !== 10) {

            const wrap = phoneField.closest(".pm-cart-field-wrap");

            wrap.classList.add("error");
            wrap.querySelector(".pm-error-text").textContent = "Некорректный формат";

            hasError = true;
        }


        /* ---------------- Политика ---------------- */

        if (policy && !policy.checked) {

            const policyWrap = policy.closest(".pm-cart-policy");

            if (policyWrap) {
                policyWrap.classList.add("error");
                policyWrap.querySelector(".pm-error-text").textContent = "Заполните это поле";
            }

            hasError = true;
        }

        if (hasError) {
            return;
        }


        /* ---------------- Блокируем кнопку ---------------- */

        if (button) {
            button.disabled = true;
            button.classList.add("loading");
        }


        /* ---------------- Получаем актуальную корзину ---------------- */

        const responseCart = await fetch(
            "/local/cart/ajax/get.php?cache=" + Date.now(),
            {
                credentials: "same-origin",
                cache: "no-store"
            }
        );

        if (!responseCart.ok) {
            throw new Error("Не удалось получить корзину.");
        }

        const cart = await responseCart.json();

        if (!cart.success || !Array.isArray(cart.items) || !cart.items.length) {

            this.showPopup(
                "Корзина пуста",
                "Добавьте хотя бы один товар.",
                "error"
            );

            return;
        }


        /* ---------------- Собираем товары ---------------- */

        const productLines = [];

        let totalCount = 0;
        let totalPrice = 0;

        cart.items.forEach(item => {

            const count = Number(item.count) || 0;
            const price = Number(item.price) || 0;

            const title = String(
                item.title || "Товар"
            ).trim();

            const offer = String(
                item.offer || ""
            ).trim();

            totalCount += count;
            totalPrice += count * price;

            let line = title;

            if (offer) {
                line += " (" + offer + ")";
            }

            line += " × " + count;

            if (price > 0) {

                line +=
                    " — " +
                    (price * count).toLocaleString("ru-RU") +
                    " ₽";

            } else {

                line += " — цена по запросу";
            }

            productLines.push(line);
        });


        const products = productLines.join("\n");


        /* --------------------------------------------------
         * Обновляем старые hidden-поля.
         *
         * Они больше не участвуют непосредственно
         * в отправке формы, но оставляем их заполненными,
         * чтобы не ломать существующую верстку.
         * -------------------------------------------------- */

        const productHidden =
            document.getElementById("cart-product");

        const countHidden =
            document.getElementById("cart-count");

        const priceHidden =
            document.getElementById("cart-price");


        if (productHidden) {
            productHidden.value = products;
        }

        if (countHidden) {
            countHidden.value = totalCount;
        }

        if (priceHidden) {
            priceHidden.value = totalPrice;
        }


        /* --------------------------------------------------
         * ОТПРАВКА
         *
         * Больше НЕ используем:
         *
         * WEB_FORM_ID: 25
         * /ajax/newprominer.php
         *
         * Отправляем данные в наш новый submit.php.
         *
         * submit.php создаёт настоящий результат
         * существующей формы #1 "Купить сейчас".
         *
         * После этого автоматически срабатывает
         * onAfterResultAdd в init.php и создаёт сделку
         * в Bitrix24 в воронке 44.
         * -------------------------------------------------- */

        const submitData = new FormData();


        /* Имя */

        submitData.append(
            "name",
            name
        );


        /* Телефон */

        submitData.append(
            "phone",
            "+7" + phoneRaw
        );


        /* Все товары корзины */

        submitData.append(
            "product",
            products
        );


        /* Страница, с которой отправили корзину */

        submitData.append(
            "link",
            window.location.href
        );


        /* Общая стоимость */

        submitData.append(
            "price",
            String(totalPrice)
        );


        /* Общее количество товаров */

        submitData.append(
            "quantity",
            String(totalCount)
        );


        /*
         * В корзине сейчас нет отдельных
         * значений Цвет / Комплектация.
         *
         * В форме #1 эти поля необязательные,
         * поэтому передаём пустыми.
         */

        submitData.append(
            "color",
            ""
        );

        submitData.append(
            "configuration",
            ""
        );


        /* ---------------- Запрос ---------------- */

        const response = await fetch(
            "/local/cart/ajax/submit.php?cache=" + Date.now(),
            {
                method: "POST",

                body: submitData,

                credentials: "same-origin",

                cache: "no-store",

                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }
        );


        /* ---------------- Ответ сервера ---------------- */

        const responseText =
            await response.text();

        let result;


        try {

            result =
                JSON.parse(responseText);

        } catch (parseError) {

            console.error(
                "Cart submit invalid JSON:",
                responseText
            );

            throw new Error(
                "Сервер вернул некорректный ответ."
            );
        }


        if (
            !response.ok ||
            result.status !== "success"
        ) {

            throw new Error(
                result.message ||
                "Не удалось отправить заявку."
            );
        }


        /* ---------------- УСПЕХ ---------------- */

        this.showPopup(
            "Получили вашу заявку",
            "Свяжемся с вами в ближайшее время!"
        );


        /*
         * Очищаем поля формы.
         */

        this.form?.reset();


        /*
         * Очищаем корзину на сервере.
         */

        try {

            await this.clear();

        } catch (clearError) {

            /*
             * Важно:
             *
             * заявка уже успешно создана.
             * Поэтому даже если очистка корзины
             * по какой-то причине упала,
             * клиенту нельзя показывать ошибку
             * "заявка не отправлена".
             */

            console.error(
                "Cart clear after successful submit:",
                clearError
            );


            CartStore.set([]);

            updateCartBadge([]);


            localStorage.removeItem(
                "pm_cart"
            );

            localStorage.removeItem(
                "pm_cart_sync"
            );
        }


        /*
         * Показываем success popup,
         * затем закрываем корзину.
         */

        setTimeout(() => {

            this.hidePopup();

            this.close();

        }, 1800);


    } catch (e) {

        console.error(
            "Cart submit error:",
            e
        );


        this.showPopup(
            "Ошибка",
            e.message ||
            "Не удалось отправить заявку.",
            "error"
        );


    } finally {

        /*
         * Кнопка должна разблокироваться
         * при любом исходе.
         */

        if (button) {

            button.disabled = false;

            button.classList.remove(
                "loading"
            );
        }
    }
}
};

document.addEventListener("DOMContentLoaded", () => {

    PromminerCart.init();

CartStore.load();
updateCartBadge(CartStore.items);
fetch("/local/cart/ajax/get.php?cache=" + Date.now())
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            PromminerCart.syncCatalogCounters(data.items || []);
        }
    });
document.addEventListener("click", (e) => {

    const btn = e.target.closest("#pm-cart-open");

    if (!btn) return;

    e.preventDefault();

    PromminerCart.open();

});

});

/* ==================================================
 * DETAIL SKU -> CART
 *
 * На детальной странице data-product-id содержит ID
 * родительского товара. После переключения ТП он может
 * оставаться прежним до перезагрузки страницы.
 *
 * Поэтому для детальной страницы источник истины —
 * отмеченный radio внутри #skus-container.
 *
 * Одновременно запоминаем картинку выбранного ТП,
 * чтобы корзина не подставляла картинку родителя.
 * ================================================== */

const PM_CART_OFFER_IMAGE_KEY = "pm_cart_offer_images";

function pmCartReadOfferImages() {
    try {
        const raw = localStorage.getItem(PM_CART_OFFER_IMAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};

        return parsed && typeof parsed === "object"
            ? parsed
            : {};
    } catch (e) {
        console.warn("[TL CART] Не удалось прочитать картинки ТП:", e);
        return {};
    }
}

function pmCartSaveOfferImage(offerId, image) {
    const id = String(offerId || "").trim();
    const src = String(image || "").trim();

    if (!id || !src) {
        return;
    }

    try {
        const images = pmCartReadOfferImages();
        images[id] = src;

        localStorage.setItem(
            PM_CART_OFFER_IMAGE_KEY,
            JSON.stringify(images)
        );
    } catch (e) {
        console.warn("[TL CART] Не удалось сохранить картинку ТП:", e);
    }
}

function pmCartGetOfferImage(offerId) {
    const id = String(offerId || "").trim();

    if (!id) {
        return "";
    }

    const images = pmCartReadOfferImages();

    return String(images[id] || "").trim();
}

function pmCartRemoveOfferImage(offerId) {
    const id = String(offerId || "").trim();

    if (!id) {
        return;
    }

    try {
        const images = pmCartReadOfferImages();

        if (Object.prototype.hasOwnProperty.call(images, id)) {
            delete images[id];

            localStorage.setItem(
                PM_CART_OFFER_IMAGE_KEY,
                JSON.stringify(images)
            );
        }
    } catch (e) {
        console.warn("[TL CART] Не удалось удалить картинку ТП:", e);
    }
}

function pmCartClearOfferImages() {
    try {
        localStorage.removeItem(PM_CART_OFFER_IMAGE_KEY);
    } catch (e) {
        console.warn("[TL CART] Не удалось очистить картинки ТП:", e);
    }
}

function pmCartApplyOfferImages(items) {
    /*
     * Картинку позиции определяет только get.php.
     * Для ТП get.php возвращает PREVIEW_PICTURE самого ТП
     * («Картинка для анонса»). Никаких подмен из localStorage.
     */
    return Array.isArray(items) ? items : [];
}

function pmCartGetDetailRoot(button = null) {
    return (
        button?.closest?.(".product-detail") ||
        document.querySelector(".product-detail") ||
        null
    );
}

function pmCartGetDetailOptions(button = null) {
    const root = pmCartGetDetailRoot(button);

    return root
        ? root.querySelector(
            ".product-detail__options[data-variant-offers]"
        )
        : null;
}

function pmCartReadDetailOffers(button = null) {
    const options = pmCartGetDetailOptions(button);

    if (!options) {
        return [];
    }

    try {
        const parsed = JSON.parse(
            options.dataset.variantOffers || "[]"
        );

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn(
            "[TL CART] Не удалось разобрать data-variant-offers:",
            error
        );

        return [];
    }
}

function pmCartGetActiveVariantValues(button = null) {
    const options = pmCartGetDetailOptions(button);
    const values = {};

    if (!options) {
        return values;
    }

    options
        .querySelectorAll(
            "[data-axis-code][data-axis-value].is-active"
        )
        .forEach(control => {
            const code = String(
                control.dataset.axisCode || ""
            ).trim();

            const value = String(
                control.dataset.axisValue || ""
            ).trim();

            if (code && value) {
                values[code] = value;
            }
        });

    return values;
}

function pmCartGetSelectedDetailOffer(button = null) {
    const offers = pmCartReadDetailOffers(button);

    if (!offers.length) {
        return null;
    }

    const selectedValues =
        pmCartGetActiveVariantValues(button);

    const selectedEntries =
        Object.entries(selectedValues);

    let candidates = offers;

    if (selectedEntries.length) {
        candidates = offers.filter(offer => {
            const offerValues =
                offer && typeof offer.values === "object"
                    ? offer.values
                    : {};

            return selectedEntries.every(
                ([code, value]) =>
                    String(offerValues?.[code] ?? "") ===
                    String(value)
            );
        });
    }

    /*
     * Если комбинация свойств однозначно указывает на SKU — отлично.
     */
    if (candidates.length === 1) {
        return candidates[0];
    }

    /*
     * ВАЖНО: сначала смотрим ID на АКТИВНЫХ контролах варианта.
     * data-offer на кнопке может ещё содержать предыдущий SKU,
     * поэтому его нельзя использовать раньше фактического active-state.
     */
    const options = pmCartGetDetailOptions(button);

    if (options) {
        const activeIds = Array.from(
            options.querySelectorAll(
                "[data-axis-code][data-axis-value].is-active[data-offer-id]"
            )
        )
            .map(control => Number(control.dataset.offerId || 0))
            .filter(value => value > 0);

        for (const activeId of activeIds) {
            const matched = candidates.find(
                offer => Number(offer?.id || 0) === activeId
            );

            if (matched) {
                return matched;
            }
        }
    }

    /*
     * Только после active-state используем ID кнопки как fallback.
     * Он нужен для старых карточек/неполных конфигураций, но не должен
     * удерживать состояние предыдущего торгового предложения.
     */
    const currentIds = [
        button?.dataset?.offer,
        button?.dataset?.productId,
        pmCartGetDetailRoot(button)
            ?.querySelector(
                ".product-detail__cart[data-product-id]"
            )
            ?.dataset?.offer,
        pmCartGetDetailRoot(button)
            ?.querySelector(
                ".product-detail__cart[data-product-id]"
            )
            ?.dataset?.productId
    ]
        .map(value => Number(value || 0))
        .filter(value => value > 0);

    for (const currentId of currentIds) {
        const matched = candidates.find(
            offer => Number(offer?.id || 0) === currentId
        );

        if (matched) {
            return matched;
        }
    }

    return candidates[0] || offers[0] || null;
}

function pmCartIsDetailCartButton(button) {
    return Boolean(
        button &&
        (
            button.matches?.(".product-detail__cart") ||
            button.hasAttribute?.("data-sticky-cart") ||
            button.closest?.(".product-detail__actions")
        )
    );
}


/* ==================================================
 * CATALOG CARD COLOR -> EXACT SKU
 *
 * В каталоге и блоках вроде "Покупают вместе" кнопка
 * исторически содержит ID родительского товара, а цвет
 * выбирается отдельным swatch. Поэтому перед добавлением
 * разрешаем выбранный цвет в конкретный offer_id через
 * /local/cart/ajax/resolve_offer.php.
 * ================================================== */

function pmCartNormalizeVariantText(value) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLocaleLowerCase("ru-RU");
}

function pmCartIsCatalogCardButton(button) {
    return Boolean(
        button &&
        button.closest?.(".catalog-product-card") &&
        (
            button.matches?.(".catalog-product-card__action") ||
            button.matches?.(".catalog-product-card__cart")
        )
    );
}

function pmCartGetCatalogCardSelection(button) {
    const card = button?.closest?.(".catalog-product-card");

    if (!card) {
        return {
            card: null,
            productId: 0,
            color: "",
            image: "",
            swatch: null
        };
    }

    const swatch =
        card.querySelector(".catalog-product-card__color.is-selected") ||
        card.querySelector(".catalog-product-card__color");

    const color = String(
        swatch?.dataset?.colorName ||
        swatch?.getAttribute?.("title") ||
        swatch?.getAttribute?.("aria-label") ||
        ""
    )
        .replace(/\s+/g, " ")
        .trim();

    const image = String(
        swatch?.dataset?.colorImage || ""
    ).trim();

    const productId = Number(
        button?.dataset?.productId ||
        card.querySelector(
            ".catalog-product-card__action[data-product-id], " +
            ".catalog-product-card__cart[data-product-id]"
        )?.dataset?.productId ||
        0
    );

    return {
        card,
        productId,
        color,
        image,
        swatch
    };
}

async function pmCartResolveCatalogOffer(button) {
    const selection = pmCartGetCatalogCardSelection(button);

    if (selection.productId <= 0) {
        throw new Error("Не найден ID товара карточки.");
    }

    const body = new URLSearchParams();

    body.set("product_id", String(selection.productId));

    if (selection.color) {
        body.set("color", selection.color);
    }

    const response = await fetch(
        "/local/cart/ajax/resolve_offer.php?cache=" + Date.now(),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: body.toString(),
            credentials: "same-origin",
            cache: "no-store"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Не удалось определить торговое предложение: HTTP " +
            response.status
        );
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(
            data.error ||
            "Не удалось определить торговое предложение выбранного цвета."
        );
    }

    const offerId = Number(data.offer_id || 0);

    if (offerId <= 0) {
        throw new Error("Сервер не вернул ID торгового предложения.");
    }

    /*
     * Кэшируем только состояние конкретного выбранного цвета.
     * При смене swatch этот кэш сбрасывается обработчиком ниже.
     */
    button.dataset.offer = String(offerId);
    button.dataset.resolvedProductId = String(selection.productId);
    button.dataset.resolvedColor = selection.color;

    if (data.image) {
        button.dataset.resolvedImage = String(data.image);
    } else {
        delete button.dataset.resolvedImage;
    }

    return {
        offerId,
        productId: selection.productId,
        color: String(data.color || selection.color || ""),
        image: String(data.image || selection.image || ""),
        isSku: Boolean(data.is_sku)
    };
}

function pmCartFindCatalogCardItem(button, items) {
    const selection = pmCartGetCatalogCardSelection(button);
    const list = Array.isArray(items) ? items : [];

    if (selection.productId <= 0) {
        return null;
    }

    const selectedColor = pmCartNormalizeVariantText(selection.color);

    /*
     * Если resolver уже отработал именно для ТЕКУЩЕГО цвета —
     * offer_id является самым точным ключом.
     */
    const resolvedColor = pmCartNormalizeVariantText(
        button?.dataset?.resolvedColor || ""
    );

    const resolvedOfferId = Number(
        button?.dataset?.offer || 0
    );

    if (
        resolvedOfferId > 0 &&
        (
            !selectedColor ||
            resolvedColor === selectedColor
        )
    ) {
        const byOffer = list.find(
            item =>
                Number(item?.offer_id || 0) === resolvedOfferId
        );

        if (byOffer) {
            return byOffer;
        }
    }

    /*
     * До первого клика resolver ещё не вызывался.
     * Тогда состояние карточки можно точно восстановить по:
     * parent product_id + одному выбранному цвету SKU.
     */
    if (selectedColor) {
        const byProductAndColor = list.find(item => {
            if (
                Number(item?.product_id || 0) !==
                selection.productId
            ) {
                return false;
            }

            const itemColors = [
                item?.color,
                item?.offer
            ]
                .map(pmCartNormalizeVariantText)
                .filter(Boolean);

            return itemColors.some(
                value => value === selectedColor
            );
        });

        if (byProductAndColor) {
            return byProductAndColor;
        }

        /*
         * Выбран конкретный цвет, но такого SKU в корзине нет.
         * Родительскую позицию с "черный, серый" намеренно
         * НЕ считаем совпадением.
         */
        return null;
    }

    /*
     * Товар без цветового выбора.
     */
    return (
        list.find(
            item =>
                Number(item?.offer_id || 0) ===
                selection.productId
        ) ||
        list.find(
            item =>
                Number(item?.product_id || 0) ===
                selection.productId
        ) ||
        null
    );
}

function pmCartSetCatalogCardButtonState(button, item) {
    if (!button) {
        return;
    }

    const inCart = Boolean(item);

    button.classList.toggle("is-added", inCart);
    button.dataset.cartCount = inCart
        ? String(item?.count || 1)
        : "0";

    if (button.matches?.(".catalog-product-card__cart")) {
        button.textContent = inCart
            ? "В корзине"
            : "В корзину";
    }
}

function pmCartResetCatalogCardResolvedVariant(card) {
    if (!card) {
        return;
    }

    card.querySelectorAll(
        ".catalog-product-card__action[data-product-id], " +
        ".catalog-product-card__cart[data-product-id]"
    ).forEach(button => {
        delete button.dataset.offer;
        delete button.dataset.resolvedProductId;
        delete button.dataset.resolvedColor;
        delete button.dataset.resolvedImage;
    });
}

/*
 * Существующий catalog/detail script сам переключает is-selected и фото.
 * После того как он закончит обработку клика, сбрасываем старый SKU
 * и пересчитываем состояние кнопки уже для нового цвета.
 */
document.addEventListener("click", event => {
    const swatch = event.target.closest(
        ".catalog-product-card__color"
    );

    if (!swatch) {
        return;
    }

    const card = swatch.closest(".catalog-product-card");

    requestAnimationFrame(() => {
        pmCartResetCatalogCardResolvedVariant(card);

        if (
            window.PromminerCart &&
            typeof PromminerCart.syncCatalogCounters === "function"
        ) {
            PromminerCart.syncCatalogCounters(
                Array.isArray(CartStore?.items)
                    ? CartStore.items
                    : []
            );
        }
    });
});

function pmCartGetSelectedOfferId(button) {
    /*
     * Новая карточка Turbolemons.
     * Здесь ТП выбираются НЕ radio-кнопками, а через
     * .product-detail__color / .product-detail__configuration.
     */
    if (pmCartIsDetailCartButton(button)) {
        const selectedOffer =
            pmCartGetSelectedDetailOffer(button);

        const selectedOfferId = Number(
            selectedOffer?.id || 0
        );

        if (selectedOfferId > 0) {
            return selectedOfferId;
        }

        /*
         * Для товара без ТП берём ID основной кнопки.
         * Sticky-кнопка собственного ID не имеет.
         */
        const root = pmCartGetDetailRoot(button);
        const mainButton = root?.querySelector(
            ".product-detail__cart[data-product-id]"
        );

        const detailId = Number(
            button?.dataset?.offer ||
            button?.dataset?.productId ||
            mainButton?.dataset?.offer ||
            mainButton?.dataset?.productId ||
            0
        );

        if (detailId > 0) {
            return detailId;
        }
    }

    /*
     * Старые карточки и каталог.
     */
    return Number(
        button?.dataset?.offer ||
        button?.dataset?.productId ||
        0
    );
}

function pmCartGetSelectedOfferImage(button) {
    /*
     * Самый надёжный источник — JSON вариантов текущей detail-страницы.
     * В PHP туда уже передаётся IMAGE конкретного SKU.
     */
    if (pmCartIsDetailCartButton(button)) {
        const selectedOffer =
            pmCartGetSelectedDetailOffer(button);

        const selectedImage = String(
            selectedOffer?.image || ""
        ).trim();

        if (selectedImage) {
            return selectedImage;
        }

        const root = pmCartGetDetailRoot(button);
        const mainImage = root?.querySelector(
            "#product-gallery-main-image"
        );

        const currentImage = String(
            mainImage?.currentSrc ||
            mainImage?.getAttribute("src") ||
            ""
        ).trim();

        if (currentImage) {
            return currentImage;
        }
    }

    return "";
}

function pmCartSetDetailButtonState(button, cartItem) {
    if (!button) {
        return;
    }

    const inCart = Boolean(cartItem);

    button.classList.toggle("is-added", inCart);
    button.dataset.cartCount = inCart
        ? String(cartItem.count || 1)
        : "0";

    /*
     * На detail-кнопках текст находится непосредственно внутри button.
     * Принудительно синхронизируем его с ТОЧНЫМ выбранным offer_id,
     * чтобы состояние предыдущего SKU не оставалось визуально.
     */
    const textNode = button.querySelector(
        "[data-cart-button-text], .product-detail__cart-text, .pm-btn-text"
    );

    if (textNode) {
        textNode.textContent = inCart ? "В корзине" : "В корзину";
    } else {
        button.textContent = inCart ? "В корзине" : "В корзину";
    }

    /* Смена SKU не должна оставлять кнопку заблокированной. */
    if (!button.classList.contains("is-loading")) {
        button.disabled = false;
        button.removeAttribute("aria-disabled");
    }
}

function pmCartSyncDetailOffer(items = null) {
    const root = document.querySelector(".product-detail");

    if (!root) {
        return;
    }

    const selectedOffer = pmCartGetSelectedDetailOffer();

    const mainButton = root.querySelector(
        ".product-detail__cart[data-product-id]"
    );

    const offerId = Number(
        selectedOffer?.id ||
        mainButton?.dataset?.productId ||
        0
    );

    if (offerId <= 0) {
        return;
    }

    const sourceItems = Array.isArray(items)
        ? items
        : (CartStore.items || []);

    /*
     * Ключевая логика: состояние detail-кнопки определяется ТОЛЬКО
     * наличием текущего offer_id в корзине. product_id родителя здесь
     * никогда не участвует.
     */
    const cartItem = sourceItems.find(
        item => String(item.offer_id) === String(offerId)
    ) || null;

    root
        .querySelectorAll(
            ".product-detail__cart, [data-sticky-cart]"
        )
        .forEach(button => {
            button.dataset.offer = String(offerId);
            pmCartSetDetailButtonState(button, cartItem);
        });
}

let pmCartDetailSyncTimers = [];

function pmCartScheduleDetailSync() {
    pmCartDetailSyncTimers.forEach(timer => clearTimeout(timer));
    pmCartDetailSyncTimers = [];

    /*
     * detail.js может обновлять is-active/цену/фото не в тот же tick.
     * Перепроверяем несколько раз; каждый запуск читает фактические
     * активные controls, поэтому старый SKU не может "залипнуть".
     */
    [0, 20, 60, 140].forEach(delay => {
        const timer = setTimeout(() => {
            pmCartSyncDetailOffer();
        }, delay);

        pmCartDetailSyncTimers.push(timer);
    });
}

/* Переключение любого варианта на detail-странице. */
document.addEventListener("click", event => {
    const variantControl = event.target.closest(
        ".product-detail__options " +
        "[data-axis-code][data-axis-value]"
    );

    if (!variantControl) {
        return;
    }

    pmCartScheduleDetailSync();
});

/*
 * Дополнительная страховка: синхронизируемся по фактической смене
 * классов is-active, а не только по клику пользователя.
 */
function pmCartObserveDetailVariants() {
    const options = document.querySelector(
        ".product-detail__options[data-variant-offers]"
    );

    if (!options || options.dataset.cartStateObserver === "1") {
        return;
    }

    options.dataset.cartStateObserver = "1";

    const observer = new MutationObserver(mutations => {
        const hasRelevantChange = mutations.some(mutation =>
            mutation.type === "attributes" &&
            (
                mutation.attributeName === "class" ||
                mutation.attributeName === "data-offer-id" ||
                mutation.attributeName === "data-axis-value"
            )
        );

        if (hasRelevantChange) {
            pmCartScheduleDetailSync();
        }
    });

    observer.observe(options, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "data-offer-id", "data-axis-value"]
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        () => {
            pmCartObserveDetailVariants();
            pmCartSyncDetailOffer();
        },
        { once: true }
    );
} else {
    pmCartObserveDetailVariants();
    pmCartSyncDetailOffer();
}


/*
 * Добавление товара в корзину
 */
document.addEventListener("click", async (event) => {

    const button = event.target.closest(
        ".pm-add-cart, " +
        ".catalog-product-card__action[data-product-id], " +
        ".catalog-product-card__cart[data-product-id], " +
        ".product-detail__cart[data-product-id], " +
        "[data-sticky-cart]"
    );

    if (!button) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (button.classList.contains("is-loading")) {
        return;
    }

    button.classList.add("is-loading");
    button.disabled = true;

    let offerId = 0;

    try {

        /*
         * Каталог / "Покупают вместе" / просмотренные:
         * сначала превращаем parent product_id + выбранный цвет
         * в точный offer_id.
         */
        if (pmCartIsCatalogCardButton(button)) {

            const resolved =
                await pmCartResolveCatalogOffer(button);

            offerId = Number(
                resolved?.offerId || 0
            );

        } else {

            offerId =
                pmCartGetSelectedOfferId(button);

        }

        if (offerId <= 0) {
            throw new Error(
                "Не найден ID товара или торгового предложения."
            );
        }

        /*
         * На detail-странице сохраняем актуальный ID ТП.
         * Картинку не передаём: после добавления get.php вернёт
         * PREVIEW_PICTURE именно этого offer_id.
         */
        if (pmCartIsDetailCartButton(button)) {
            button.dataset.offer = String(offerId);
        }

        const response = await fetch(
            "/bitrix/cart/ajax/add.php",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                    "X-Requested-With":
                        "XMLHttpRequest"
                },

                body:
                    "offer=" +
                    encodeURIComponent(offerId) +
                    "&count=1",

                credentials: "same-origin"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Ошибка сервера: " +
                response.status
            );
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.error ||
                "Не удалось добавить товар"
            );
        }

        /*
         * Перезагружаем корзину. Для SKU get.php теперь получает
         * конкретный offer_id, поэтому возвращает ровно один цвет
         * и PREVIEW_PICTURE выбранного ТП.
         */
        await PromminerCart.load();

        const cartItem = CartStore.items.find(
            item =>
                Number(item?.offer_id || 0) ===
                Number(offerId)
        );

        if (pmCartIsCatalogCardButton(button)) {
            pmCartSetCatalogCardButtonState(
                button,
                cartItem || null
            );
        } else {
            button.classList.add("is-added");
            button.dataset.cartCount = String(
                cartItem
                    ? cartItem.count
                    : 1
            );
        }

        /*
         * На детальной странице можно сразу открывать корзину.
         */
        if (pmCartIsDetailCartButton(button)) {
            await PromminerCart.open();
        }

        /*
         * Поддержка старых карточек.
         */
        const wrap = button.closest(
            ".pm-cart-wrap"
        );

        if (wrap) {
            button.style.display = "none";

            const counter = wrap.querySelector(
                ".pm-card-counter"
            );

            if (counter) {
                counter.style.display = "flex";

                const counterValue =
                    counter.querySelector(
                        ".pm-card-counter__value"
                    );

                if (counterValue) {
                    counterValue.textContent =
                        String(
                            cartItem
                                ? cartItem.count
                                : 1
                        );
                }
            }
        }

    } catch (error) {

        console.error(
            "Ошибка добавления в корзину:",
            error
        );

        if (
            PromminerCart.popup &&
            PromminerCart.popupTitle &&
            PromminerCart.popupText
        ) {
            PromminerCart.showPopup(
                "Ошибка",
                error.message ||
                "Не удалось добавить товар.",
                "error"
            );
        } else {
            alert(
                error.message ||
                "Не удалось добавить товар."
            );
        }

    } finally {

        button.classList.remove("is-loading");
        button.disabled = false;

    }

});
document.addEventListener("click", async (e) => {

    const plus = e.target.closest(".pm-card-counter__plus");
    const minus = e.target.closest(".pm-card-counter__minus");

    if (!plus && !minus) return;

    e.preventDefault();

    const btn = plus || minus;
    const offer = btn.dataset.offer;
    const delta = plus ? 1 : -1;

    try {

        const response = await fetch("/bitrix/cart/ajax/updat.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "offer=" + encodeURIComponent(offer) +
                "&delta=" + encodeURIComponent(delta)
        });

        const data = await response.json();

        if (!data.success) {
            return;
        }

await PromminerCart.load();
    } catch (e) {

        console.error(e);

    }

});

function syncCartBadgeFromStorage() {
    const data = localStorage.getItem("pm_cart");
    const items = data ? JSON.parse(data) : [];
    updateCartBadge(items);
}

window.addEventListener("pageshow", () => {
    syncCartBadgeFromStorage();
});

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        syncCartBadgeFromStorage();
    }
});

/* ==========================
   Подъем поля над клавиатурой
========================== */

if (window.innerWidth <= 768) {

    document.querySelectorAll("#pm-cart input").forEach(input => {

        input.addEventListener("focus", () => {

            setTimeout(() => {

                input.scrollIntoView({

                    behavior: "smooth",
                    block: "center"

                });

            }, 350);

        });

    });

}
/* ==========================
   Маска телефона: (977) 752-07-40
   В поле хранится только национальная часть из 10 цифр.
   +7 уже нарисован отдельным префиксом в верстке.
========================== */
(function initCartPhoneMask() {
    const phone = document.getElementById("pm-phone");

    if (!phone || phone.dataset.maskReady === "1") {
        return;
    }

    phone.dataset.maskReady = "1";
    phone.setAttribute("inputmode", "numeric");
    phone.setAttribute("autocomplete", "tel-national");
    phone.setAttribute("maxlength", "15");

    function normalizeDigits(value) {
        let digits = String(value || "").replace(/\D/g, "");

        // Если вставили полный российский номер +7... или 8...,
        // убираем код страны/межгорода.
        if (digits.length > 10 && (digits[0] === "7" || digits[0] === "8")) {
            digits = digits.slice(1);
        }

        return digits.slice(0, 10);
    }

    function formatPhone(value) {
        const d = normalizeDigits(value);

        if (!d.length) {
            return "";
        }

        let result = "(" + d.slice(0, 3);

        if (d.length >= 3) {
            result += ")";
        }

        if (d.length > 3) {
            result += " " + d.slice(3, 6);
        }

        if (d.length > 6) {
            result += "-" + d.slice(6, 8);
        }

        if (d.length > 8) {
            result += "-" + d.slice(8, 10);
        }

        return result;
    }

    function applyMask() {
        phone.value = formatPhone(phone.value);

        const field = phone.closest(".pm-phone-wrap") || phone.closest(".pm-cart-field");
        if (field) {
            field.classList.toggle("filled", phone.value.trim() !== "");
        }
    }

    phone.addEventListener("input", applyMask);
    phone.addEventListener("paste", () => {
        setTimeout(applyMask, 0);
    });
    phone.addEventListener("blur", applyMask);

    applyMask();
})();

/* ==========================
   Floating labels
========================== */

document.querySelectorAll(".pm-cart-input").forEach(input => {

    const field = input.closest(".pm-phone-wrap") || input.closest(".pm-cart-field");

    const update = () => {

        field.classList.toggle("filled", input.value.trim() !== "");

    };

    input.addEventListener("input", update);
    input.addEventListener("blur", update);

    update();

});