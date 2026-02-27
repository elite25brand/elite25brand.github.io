let cart = [];
const cartCountElements = document.querySelectorAll('.cart-count');
const cartList = document.getElementById('cart-list');
const totalPriceElement = document.getElementById('total-price');
const sideCart = document.getElementById('side-cart');

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.display === 'block';
            document.querySelectorAll('.faq-answer').forEach(ans => ans.style.display = 'none');
            answer.style.display = isOpen ? 'none' : 'block';
        });
    });

    // Thumbnail Gallery Logic
    const thumbs = document.querySelectorAll('.thumb');
    const mainImg = document.querySelector('.main-product-image');
    if (thumbs && mainImg) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImg.src = thumb.src;
            });
        });
    }

    // Size Selector
    const sizeBtns = document.querySelectorAll('.size-btn:not(.out-of-stock)');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Load User Session
    const savedUser = localStorage.getItem('elite25_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const headerIcons = document.querySelector('.header-icons');
        if (headerIcons) {
            const profileLink = headerIcons.querySelector('a[href="login.html"]');
            if (profileLink) {
                profileLink.style.display = "flex";
                profileLink.style.alignItems = "center";
                profileLink.style.gap = "8px";
                profileLink.style.textDecoration = "none";

                profileLink.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1;">
                        <span style="font-size: 9px; letter-spacing: 1px; color: #4CAF50; font-weight: bold;">MEMBRE</span>
                        <span style="font-size: 8px; color: #666; font-family: var(--font-body);">PROFIL</span>
                    </div>
                    <div style="position: relative;">
                        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" 
                             style="filter: invert(1); width: 20px; border: 1px solid #333; border-radius: 50%; padding: 4px; transition: 0.3s;">
                        <span style="position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; background: #4CAF50; border: 2px solid #000; border-radius: 50%; box-shadow: 0 0 5px #4CAF50;"></span>
                    </div>
                `;
                profileLink.href = "#";
                profileLink.onclick = (e) => {
                    e.preventDefault();
                    if (confirm("Voulez-vous vous déconnecter de votre compte [élite 25] ?")) window.logout();
                };
            }
        }
    }

    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('elite25_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // Mobile Menu Toggle
    window.toggleMobileMenu = () => {
        const nav = document.querySelector('.nav-main');
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (nav && toggle) {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        }
    };
});

window.logout = () => {
    localStorage.removeItem('elite25_user');
    window.location.href = 'index.html';
};

window.toggleCart = () => {
    if (sideCart) sideCart.classList.toggle('open');
};

window.goToCheckout = () => {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }

    // Check if user is logged in
    const user = localStorage.getItem('elite25_user');
    if (!user) {
        alert('Connecte-toi pour profiter de tes offres et finaliser ta commande.');
        window.location.href = 'login.html?flow=checkout';
        return;
    }

    window.location.href = 'paiement.html';
};

window.updateQty = (val) => {
    const input = document.getElementById('qty-val');
    if (input) {
        let newVal = parseInt(input.value) + val;
        if (newVal < 1) newVal = 1;
        input.value = newVal;
    }
};

window.addToCart = () => {
    const productTitle = document.querySelector('.product-title-large')?.textContent || 'Produit';
    const productPrice = parseFloat(document.querySelector('.price-current')?.textContent.replace('€', '')) || 30.0;
    const productImage = document.querySelector('.main-product-image')?.src || '';
    const selectedSize = document.querySelector('.size-btn.selected')?.textContent;
    const quantity = parseInt(document.getElementById('qty-val')?.value) || 1;

    if (!selectedSize && document.querySelector('.size-selector')) {
        alert('Veuillez sélectionner une taille');
        return;
    }

    const item = {
        id: Date.now(),
        title: productTitle,
        price: productPrice,
        image: productImage,
        size: selectedSize,
        qty: quantity
    };

    cart.push(item);
    localStorage.setItem('elite25_cart', JSON.stringify(cart));
    updateCartUI();
    if (!sideCart.classList.contains('open')) {
        toggleCart();
    }
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('elite25_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    // Update counts
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);

    // Update List
    if (cartList) {
        if (cart.length === 0) {
            cartList.innerHTML = '<p class="empty-msg">Ton panier est vide.</p>';
        } else {
            cartList.innerHTML = cart.map(item => `
                <div class="cart-item" style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; border-bottom: 1px solid #222; padding-bottom: 15px;">
                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h4 style="font-family: 'Bebas Neue', sans-serif; font-size: 16px; margin-bottom: 5px;">${item.title}</h4>
                        <p style="font-size: 12px; color: #888;">Taille: ${item.size} | Qté: ${item.qty}</p>
                        <p style="font-weight: bold; color: var(--accent-color);">${(item.price * item.qty).toFixed(2)}€</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 18px;">&times;</button>
                </div>
            `).join('');
        }
    }

    // Update Total
    if (totalPriceElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        totalPriceElement.textContent = total.toFixed(2) + '€';
    }
}
