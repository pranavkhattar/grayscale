// Cart stored in localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('grayscale_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('grayscale_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(item) {
    const cart = getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id && i.size === item.size);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += item.quantity;
    } else {
        cart.push(item);
    }
    
    saveCart(cart);
}

function removeFromCart(id, size) {
    const cart = getCart();
    const filtered = cart.filter(i => !(i.id === id && i.size === size));
    saveCart(filtered);
}

function updateCartItemQuantity(id, size, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === id && i.size === size);
    
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        if (item.quantity > 10) item.quantity = 10;
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem('grayscale_cart');
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('#cart-count, .mobile-cart-count').forEach(el => {
        el.textContent = count;
    });
}

function getCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 999 ? 0 : 79;
    return { subtotal, shipping, total: subtotal + shipping };
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
