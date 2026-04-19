console.log("QuickBite App Initialized");

// State
const state = {
    cart: [],
    restaurants: [],
    categories: []
};

// Auth UI Logic
function updateAuthState() {
    const user = AuthService.getCurrentUser();
    const nav = document.querySelector('.app-header nav');
    const authLink = nav.querySelector('.btn-secondary'); // The Login button

    if (user) {
        // User is logged in
        if (authLink) {
            authLink.textContent = `Hi, ${user.name.split(' ')[0]}`;
            authLink.href = '#';
            authLink.classList.remove('btn-secondary');
            authLink.style.fontWeight = 'bold';

            // Create Logout button
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.style.marginLeft = '20px';
            logoutBtn.style.color = '#555';
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                AuthService.logout();
            });

            nav.appendChild(logoutBtn);
        }
    }
}

// DOM Elements
const cartTrigger = document.getElementById('cart-trigger');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPriceElement = document.getElementById('cart-total-price');

// Cart Functions
function toggleCart() {
    const isOpen = cartDrawer.classList.contains('open');
    if (isOpen) {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
    } else {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    }
}

function updateCartUI() {
    // Update Badge
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update List
    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItemsContainer.innerHTML = state.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Event Listeners
cartTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart();
});

closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Checkout Logic
document.querySelector('.cart-footer .btn-primary').addEventListener('click', () => {
    if (state.cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Calculate total properly
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const confirmCheckout = confirm(`Total is $${total.toFixed(2)}. Proceed to payment?`);

    if (confirmCheckout) {
        // Create Order Object
        const currentUser = AuthService.getCurrentUser();
        const order = {
            id: Date.now().toString(),
            user: currentUser ? currentUser.name : 'Guest',
            email: currentUser ? currentUser.email : 'guest@example.com',
            items: [...state.cart], // Copy cart
            total: total.toFixed(2),
            date: new Date().toLocaleString(),
            status: 'Preparing'
        };

        // Save to Database
        if (AuthService.saveOrder) {
            AuthService.saveOrder(order);
        } else {
            console.error("AuthService.saveOrder not found! Order not saved.");
        }

        // Clear cart
        state.cart = [];
        updateCartUI();
        toggleCart();

        // Redirect to tracking
        window.location.href = 'tracking.html';
    }
});

// Make addToCart available globally for HTML onclick events
window.addToCart = function (name, price) {
    // Check if item exists
    const existingItem = state.cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({
            id: Date.now().toString(), // Simple ID generation
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartUI();

    // Open cart to show feedback
    if (!cartDrawer.classList.contains('open')) {
        toggleCart();
    }

    // Optional: Toast notification could go here
    console.log(`Added ${name} to cart`);
};

window.updateQuantity = function (id, change) {
    const itemIndex = state.cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        state.cart[itemIndex].quantity += change;

        if (state.cart[itemIndex].quantity <= 0) {
            state.cart.splice(itemIndex, 1);
        }

        updateCartUI();
    }
};

// Init
lucide.createIcons();
updateAuthState();
