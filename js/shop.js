(function () {
    'use strict';

    const CATALOG_URL = 'data/shop-products.json';
    const STORAGE_CART = 'cyberteka-shop-cart-v2';
    const MOBILE_SLIDER_MQ = window.matchMedia('(max-width: 768px)');

    const CATEGORIES = [
        { id: 'snacks', title: 'Снеки', accent: '#E637B7' },
        { id: 'drinks', title: 'Напитки', accent: '#149EF2' },
        { id: 'hot', title: 'Горячие блюда', accent: '#FF003D' },
    ];

    const CLUBS = {
        bauman: { name: 'Бауманская', address: 'Спартаковская 21' },
        profsouz: { name: 'Профсоюзная', address: 'Профсоюзная 22/10к1' },
    };

    const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.title]));

    let products = [];
    /** @type {{ items: Record<string, number>, club: string }} */
    let cartState = { items: {}, club: 'bauman' };
    let openProductId = null;
    /** @type {import('swiper').Swiper[]} */
    let categorySwipers = [];

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function escapeAttr(s) {
        return escapeHtml(s).replace(/"/g, '&quot;');
    }

    function formatPrice(n) {
        return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
    }

    function toast(msg) {
        const el = $('#shop-toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('shop__toast--show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => el.classList.remove('shop__toast--show'), 2800);
    }

    function pluralItems(n) {
        const m10 = n % 10;
        const m100 = n % 100;
        if (m100 >= 11 && m100 <= 14) return 'позиций';
        if (m10 === 1) return 'позиция';
        if (m10 >= 2 && m10 <= 4) return 'позиции';
        return 'позиций';
    }

    function hasImage(product) {
        return Boolean(product.image && String(product.image).trim());
    }

    function productImageSrc(product) {
        if (!hasImage(product)) return '';
        const raw = String(product.image).trim();
        if (/^https?:\/\//i.test(raw)) return raw;
        return raw.replace(/^\//, '');
    }

    function renderThumb(product, className) {
        const src = productImageSrc(product);
        if (src) {
            return `<img class="${className}" src="${escapeAttr(src)}" alt="${escapeAttr(product.name)}" loading="lazy" decoding="async">`;
        }
        return `<div class="${className} shop__thumb-placeholder"><img src="img/icon.svg" alt=""></div>`;
    }

    function cardCartControlsHtml(productId) {
        const qty = cartState.items[productId] || 0;
        if (qty <= 0) {
            return `<button type="button" class="shop__card-add" data-card-plus="${escapeAttr(productId)}" aria-label="В корзину">+</button>`;
        }
        return `
            <div class="shop__card-cart" data-card-controls="${escapeAttr(productId)}">
                <button type="button" class="shop__card-cart-btn" data-card-minus="${escapeAttr(productId)}" aria-label="Убрать одну">−</button>
                <span class="shop__card-cart-qty">${qty}</span>
                <button type="button" class="shop__card-cart-btn" data-card-plus="${escapeAttr(productId)}" aria-label="Добавить ещё">+</button>
            </div>
        `;
    }

    function modalCartButtonHtml(productId) {
        const qty = cartState.items[productId] || 0;
        if (qty <= 0) {
            return `<button type="button" class="shop__btn shop__btn--primary" data-card-plus="${escapeAttr(productId)}">В корзину</button>`;
        }
        return `
            <div class="shop__card-cart shop__card-cart--modal">
                <button type="button" class="shop__card-cart-btn" data-card-minus="${escapeAttr(productId)}" aria-label="Убрать одну">−</button>
                <span class="shop__card-cart-qty">${qty}</span>
                <button type="button" class="shop__card-cart-btn" data-card-plus="${escapeAttr(productId)}" aria-label="Добавить ещё">+</button>
            </div>
        `;
    }

    function loadCart() {
        try {
            const raw = localStorage.getItem(STORAGE_CART);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                if (parsed.items && typeof parsed.items === 'object') {
                    cartState = {
                        items: parsed.items,
                        club: parsed.club === 'profsouz' ? 'profsouz' : 'bauman',
                    };
                    return;
                }
                cartState = { items: parsed, club: 'bauman' };
            }
        } catch (_) {
            /* ignore */
        }
    }

    function saveCart() {
        localStorage.setItem(STORAGE_CART, JSON.stringify(cartState));
    }

    function getSelectedClub() {
        const radio = document.querySelector('input[name="shop-club"]:checked');
        return radio?.value === 'profsouz' ? 'profsouz' : 'bauman';
    }

    function syncClubFromUI() {
        cartState.club = getSelectedClub();
        saveCart();
    }

    function applyClubToUI() {
        const radio = document.querySelector(`input[name="shop-club"][value="${cartState.club}"]`);
        if (radio) radio.checked = true;
    }

    function getProduct(id) {
        return products.find((p) => p.id === id);
    }

    function cartCount() {
        return Object.values(cartState.items).reduce((s, q) => s + q, 0);
    }

    function cartTotal() {
        let sum = 0;
        for (const [id, qty] of Object.entries(cartState.items)) {
            const p = getProduct(id);
            if (p) sum += p.price * qty;
        }
        return sum;
    }

    function updateCartBadge() {
        const n = cartCount();

        /* Обновляем все бейджи (FAB + если есть кнопка в header) */
        $$('[id^="cart-badge"]').forEach((badge) => {
            badge.hidden = n <= 0;
            badge.textContent = String(n);
        });
    }

    function updateAllCardQtyUI() {
        $$('.shop__card').forEach((card) => {
            const id = card.dataset.id;
            if (!id) return;
            const qty = cartState.items[id] || 0;
            card.classList.toggle('shop__card--in-cart', qty > 0);
            const footer = card.querySelector('.shop__card-footer');
            if (!footer) return;
            const priceEl = footer.querySelector('.shop__card-price');
            if (!priceEl) return;
            footer.innerHTML = priceEl.outerHTML + cardCartControlsHtml(id);
        });

        if (openProductId) {
            const slot = $('#product-modal-cart-slot');
            if (slot) slot.innerHTML = modalCartButtonHtml(openProductId);
        }
    }

    async function loadCatalog() {
        const loading = $('#shop-loading');
        const errorEl = $('#shop-error');
        loading?.removeAttribute('hidden');
        errorEl?.setAttribute('hidden', '');

        try {
            const res = await fetch(CATALOG_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data.products)) throw new Error('Неверный формат JSON');
            products = data.products.filter(
                (p) => p.id && p.name && p.category && typeof p.price === 'number'
            );
            loading?.setAttribute('hidden', '');
        } catch (err) {
            loading?.setAttribute('hidden', '');
            if (errorEl) {
                errorEl.hidden = false;
                errorEl.textContent =
                    'Не удалось загрузить каталог. Проверьте файл data/shop-products.json и обновите страницу.';
            }
            console.error(err);
            products = [];
        }
    }

    function productDetails(product) {
        const d = product.details && String(product.details).trim();
        if (d) return d;
        return product.description || '';
    }

    function buildProductCard(product) {
        const qty = cartState.items[product.id] || 0;
        const article = document.createElement('article');
        article.className = 'shop__card' + (qty > 0 ? ' shop__card--in-cart' : '');
        article.dataset.id = product.id;
        article.setAttribute('role', 'button');
        article.setAttribute('tabindex', '0');
        article.setAttribute('aria-label', `Подробнее: ${product.name}`);

        const src = productImageSrc(product);
        const imgInner = src
            ? `<img class="shop__card-img" src="${escapeAttr(src)}" alt="${escapeAttr(product.name)}" loading="lazy" decoding="async">`
            : `<div class="shop__card-placeholder" aria-hidden="true"><img src="img/icon.svg" alt=""></div>`;

        article.innerHTML = `
            <div class="shop__card-img-wrap">
                ${imgInner}
            </div>
            <div class="shop__card-body">
                <h3 class="shop__card-name">${escapeHtml(product.name)}</h3>
                <p class="shop__card-desc">${escapeHtml(product.description || '')}</p>
                <div class="shop__card-footer">
                    <p class="shop__card-price">${formatPrice(product.price)}</p>
                    ${cardCartControlsHtml(product.id)}
                </div>
            </div>
        `;
        return article;
    }

    function renderProductModalMedia(product) {
        const src = productImageSrc(product);
        if (src) {
            return `<img src="${escapeAttr(src)}" alt="${escapeAttr(product.name)}">`;
        }
        return `<div class="shop__thumb-placeholder"><img src="img/icon.svg" alt=""></div>`;
    }

    function openProductModal(productId) {
        const product = getProduct(productId);
        if (!product) return;

        openProductId = productId;
        const body = $('#product-modal-body');
        const modal = $('#modal-product');
        if (!body || !modal) return;

        const catTitle = CATEGORY_LABELS[product.category] || product.category;
        const metaParts = [];
        if (product.weight) metaParts.push(escapeHtml(product.weight));
        metaParts.push(escapeHtml(catTitle));

        body.innerHTML = `
            <div class="shop__product-modal">
                <div class="shop__product-modal-media">${renderProductModalMedia(product)}</div>
                <div class="shop__product-modal-body">
                    <p class="shop__product-modal-cat" id="product-modal-title">${escapeHtml(catTitle)}</p>
                    <h3 class="shop__product-modal-name">${escapeHtml(product.name)}</h3>
                    <p class="shop__product-modal-meta">${metaParts.join(' · ')}</p>
                    <p class="shop__product-modal-desc">${escapeHtml(productDetails(product))}</p>
                    <div class="shop__product-modal-footer">
                        <p class="shop__product-modal-price">${formatPrice(product.price)}</p>
                        <div id="product-modal-cart-slot">${modalCartButtonHtml(product.id)}</div>
                    </div>
                </div>
            </div>
        `;
        body.removeAttribute('hidden');
        modal.classList.add('shop__modal--open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('shop-modal-open');
    }

    function closeProductModal() {
        openProductId = null;
        const modal = $('#modal-product');
        const body = $('#product-modal-body');
        modal?.classList.remove('shop__modal--open');
        modal?.setAttribute('aria-hidden', 'true');
        if (body) {
            body.innerHTML = '';
            body.setAttribute('hidden', '');
        }
        document.body.classList.remove('shop-modal-open');
    }

    function destroyCategorySwipers() {
        categorySwipers.forEach((s) => s.destroy(true, true));
        categorySwipers = [];
    }

    function initCategorySwipers() {
        destroyCategorySwipers();
        if (!MOBILE_SLIDER_MQ.matches || typeof Swiper === 'undefined') return;

        $$('.shop__swiper').forEach((el) => {
            const wrap = el.closest('.shop__catalog-slider');
            const prev = wrap?.querySelector('.shop__swiper-prev');
            const next = wrap?.querySelector('.shop__swiper-next');
            const slidesPerView = window.innerWidth >= 528 ? 2 : 1;
            categorySwipers.push(
                new Swiper(el, {
                    slidesPerView,
                    spaceBetween: 16,
                    speed: 420,
                    grabCursor: true,
                    watchOverflow: true,
                    navigation: {
                        prevEl: prev,
                        nextEl: next,
                    },
                })
            );
        });
    }

    function renderCatalog() {
        const root = $('#categories-root');
        if (!root) return;
        destroyCategorySwipers();
        root.innerHTML = '';

        CATEGORIES.forEach((cat) => {
            const items = products.filter((p) => p.category === cat.id);
            const section = document.createElement('section');
            section.className = 'shop__category';
            section.id = 'cat-' + cat.id;
            section.style.setProperty('--cat-accent', cat.accent);

            section.innerHTML = `
                <div class="shop__category-head">
                    <div class="shop__category-title-wrap">
                        <h2 class="shop__category-title">${escapeHtml(cat.title)}</h2>
                        <p class="shop__category-count">${items.length} ${pluralItems(items.length)}</p>
                    </div>
                </div>
            `;

            if (!items.length) {
                const empty = document.createElement('p');
                empty.className = 'shop__empty';
                empty.textContent = 'В этой категории пока нет товаров.';
                section.appendChild(empty);
            } else {
                const catalog = document.createElement('div');
                catalog.className = 'shop__catalog';

                const grid = document.createElement('div');
                grid.className = 'shop__grid shop__catalog-grid';

                const sliderWrap = document.createElement('div');
                sliderWrap.className = 'shop__catalog-slider';
                sliderWrap.innerHTML = `
                    <div class="swiper shop__swiper" id="shop-swiper-${cat.id}">
                        <div class="swiper-wrapper"></div>
                    </div>
                    <div class="shop__swiper-nav">
                        <button type="button" class="shop__swiper-btn shop__swiper-prev" aria-label="Предыдущие товары">‹</button>
                        <button type="button" class="shop__swiper-btn shop__swiper-next" aria-label="Следующие товары">›</button>
                    </div>
                `;
                const wrapper = sliderWrap.querySelector('.swiper-wrapper');

                items.forEach((p) => {
                    grid.appendChild(buildProductCard(p));
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.appendChild(buildProductCard(p));
                    wrapper.appendChild(slide);
                });

                catalog.appendChild(grid);
                catalog.appendChild(sliderWrap);
                section.appendChild(catalog);
            }

            root.appendChild(section);
        });

        initCategorySwipers();
    }

    function setCartQty(productId, qty) {
        if (qty <= 0) delete cartState.items[productId];
        else cartState.items[productId] = qty;
        saveCart();
        updateCartBadge();
        updateAllCardQtyUI();
        renderCart();
    }

    function addToCart(productId, delta) {
        const p = getProduct(productId);
        if (!p) return;
        const next = (cartState.items[productId] || 0) + delta;
        setCartQty(productId, next);
        if (delta > 0) toast(`${p.name} в корзине`);
    }

    function renderCart() {
        const container = $('#cart-items');
        const totalEl = $('#cart-total');
        if (!container || !totalEl) return;

        applyClubToUI();

        const ids = Object.keys(cartState.items);
        if (!ids.length) {
            container.innerHTML =
                '<p class="shop__cart-empty">Корзина пуста — нажмите «+» на карточке товара</p>';
            totalEl.textContent = '0 ₽';
            return;
        }

        container.innerHTML = ids
            .map((id) => {
                const p = getProduct(id);
                if (!p) return '';
                const qty = cartState.items[id];
                const thumb = renderThumb(p, 'shop__cart-item-img');
                return `
                    <div class="shop__cart-item" data-cart-id="${id}">
                        ${thumb}
                        <div>
                            <p class="shop__cart-item-name">${escapeHtml(p.name)}</p>
                            <p class="shop__cart-item-price">${formatPrice(p.price)} × ${qty}</p>
                        </div>
                        <div class="shop__qty">
                            <button type="button" data-qty-minus="${id}" aria-label="Меньше">−</button>
                            <span>${qty}</span>
                            <button type="button" data-qty-plus="${id}" aria-label="Больше">+</button>
                        </div>
                    </div>
                `;
            })
            .join('');

        totalEl.textContent = formatPrice(cartTotal());
    }

    function openCart() {
        document.body.classList.add('shop-cart-open');
        $('#shop-cart')?.classList.add('shop__cart--open');
        $('#cart-overlay')?.classList.add('shop__overlay--open');
        $$('[aria-label="Открыть корзину"]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
        renderCart();
    }

    function closeCart() {
        document.body.classList.remove('shop-cart-open');
        $('#shop-cart')?.classList.remove('shop__cart--open');
        $('#cart-overlay')?.classList.remove('shop__overlay--open');
        $$('[aria-label="Открыть корзину"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    }

    function openCheckout() {
        closeProductModal();
        syncClubFromUI();
        if (!cartCount()) {
            toast('Корзина пуста');
            return;
        }
        const club = CLUBS[cartState.club];
        const line = $('#checkout-club-line');
        if (line && club) {
            line.textContent = `Филиал: ${club.name} · ${club.address}`;
        }
        $('#modal-checkout-form')?.removeAttribute('hidden');
        $('#modal-checkout-success')?.setAttribute('hidden', '');
        $('#pay-amount').textContent = formatPrice(cartTotal());
        const modal = $('#modal-checkout');
        modal?.classList.add('shop__modal--open');
        modal?.setAttribute('aria-hidden', 'false');
    }

    function closeCheckout() {
        const modal = $('#modal-checkout');
        modal?.classList.remove('shop__modal--open');
        modal?.setAttribute('aria-hidden', 'true');
    }

    function simulatePayment() {
        syncClubFromUI();
        const card = ($('#pay-card')?.value || '').replace(/\s/g, '');
        const name = ($('#pay-name')?.value || '').trim();
        if (card.length < 16) {
            toast('Введите номер карты (16 цифр)');
            return;
        }
        if (!name) {
            toast('Введите имя на карте');
            return;
        }

        const total = cartTotal();
        const count = cartCount();
        const club = CLUBS[cartState.club];

        cartState.items = {};
        saveCart();
        updateCartBadge();
        updateAllCardQtyUI();
        renderCart();
        closeCart();

        $('#modal-checkout-form')?.setAttribute('hidden', '');
        $('#modal-checkout-success')?.removeAttribute('hidden');
        $('#success-message').textContent = `Заказ на ${formatPrice(total)} (${count} ${pluralItems(count)}) оформлен в клубе «${club.name}», ${club.address}. Приятной игры!`;
        toast('Оплата прошла успешно');
    }

    function handleCardCartClick(e) {
        const minus = e.target.closest('[data-card-minus]');
        const plus = e.target.closest('[data-card-plus]');
        if (minus) {
            e.stopPropagation();
            const id = minus.dataset.cardMinus;
            setCartQty(id, (cartState.items[id] || 1) - 1);
            return true;
        }
        if (plus) {
            e.stopPropagation();
            addToCart(plus.dataset.cardPlus, 1);
            return true;
        }
        return false;
    }

    function bindEvents() {
        $('#categories-root')?.addEventListener('click', (e) => {
            if (handleCardCartClick(e)) return;
            const card = e.target.closest('.shop__card');
            if (card?.dataset.id) openProductModal(card.dataset.id);
        });

        $('#categories-root')?.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const card = e.target.closest('.shop__card');
            if (!card?.dataset.id) return;
            if (e.target.closest('[data-card-plus], [data-card-minus]')) return;
            e.preventDefault();
            openProductModal(card.dataset.id);
        });

        $('#modal-product')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-product') closeProductModal();
            if (handleCardCartClick(e)) return;
        });

        $('#btn-close-product')?.addEventListener('click', closeProductModal);

        $('#cart-items')?.addEventListener('click', (e) => {
            const minus = e.target.closest('[data-qty-minus]');
            const plus = e.target.closest('[data-qty-plus]');
            if (minus) {
                const id = minus.dataset.qtyMinus;
                setCartQty(id, (cartState.items[id] || 1) - 1);
            }
            if (plus) {
                const id = plus.dataset.qtyPlus;
                setCartQty(id, (cartState.items[id] || 0) + 1);
            }
        });

        $$('input[name="shop-club"]').forEach((input) => {
            input.addEventListener('change', () => {
                syncClubFromUI();
            });
        });


        $('#btn-open-cart-fab')?.addEventListener('click', openCart);

        $('#btn-close-cart')?.addEventListener('click', closeCart);
        $('#cart-overlay')?.addEventListener('click', closeCart);
        $('#btn-checkout')?.addEventListener('click', openCheckout);
        $('#btn-cancel-pay')?.addEventListener('click', closeCheckout);
        $('#btn-confirm-pay')?.addEventListener('click', simulatePayment);
        $('#btn-success-close')?.addEventListener('click', closeCheckout);

        $('#modal-checkout')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-checkout') closeCheckout();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProductModal();
                closeCart();
                closeCheckout();
            }
        });

        $('#pay-card')?.addEventListener('input', (e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 16);
            e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
        });

        let resizeTimer;
        const onLayoutChange = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => initCategorySwipers(), 150);
        };
        MOBILE_SLIDER_MQ.addEventListener('change', onLayoutChange);
        window.addEventListener('resize', onLayoutChange);
    }

    async function init() {
        loadCart();
        applyClubToUI();
        bindEvents();
        await loadCatalog();
        renderCatalog();
        updateCartBadge();
        renderCart();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
