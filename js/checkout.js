// ========================================
// CONFIGURATION - Update these values
// ========================================
const CONFIG = {
    // Get your key from Razorpay Dashboard > Settings > API Keys
    razorpayKeyId: 'rzp_test_XXXXXXXXXX', // Replace with your key
    
    // Google Sheets Web App URL (set up instructions below)
    googleSheetsWebhook: 'YOUR_GOOGLE_SHEETS_WEB_APP_URL',
    
    // EmailJS configuration (optional - for order confirmation emails)
    emailjs: {
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        publicKey: 'YOUR_PUBLIC_KEY'
    },
    
    // Store info
    storeName: 'Grayscale',
    storeEmail: 'hello@weargrayscale.in'
};

// ========================================
// CHECKOUT LOGIC
// ========================================

// Load order summary on page load
document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    renderOrderSummary();
});

function renderOrderSummary() {
    const cart = getCart();
    const { subtotal, shipping, total } = getCartTotal();
    
    // Render items
    const itemsContainer = document.getElementById('order-items');
    itemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>Size: ${item.size} | Qty: ${item.quantity}</p>
            </div>
            <div class="order-item-price">₹${item.price * item.quantity}</div>
        </div>
    `).join('');
    
    // Update totals
    document.getElementById('summary-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    document.getElementById('summary-total').textContent = `₹${total}`;
}

// Form submission
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validate
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form data
    const customerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        state: document.getElementById('state').value
    };
    
    const { total } = getCartTotal();
    
    // Initialize Razorpay
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    const options = {
        key: CONFIG.razorpayKeyId,
        amount: total * 100, // Razorpay expects paise
        currency: 'INR',
        name: CONFIG.storeName,
        description: 'Order Payment',
        prefill: {
            name: `${customerData.firstName} ${customerData.lastName}`,
            email: customerData.email,
            contact: customerData.phone
        },
        theme: {
            color: '#000000'
        },
        handler: async function(response) {
            // Payment successful
            await processOrder(response, customerData);
        },
        modal: {
            ondismiss: function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    };
    
    const razorpay = new Razorpay(options);
    razorpay.open();
});

async function processOrder(paymentResponse, customerData) {
    const cart = getCart();
    const { subtotal, shipping, total } = getCartTotal();
    const orderId = 'GS' + Date.now().toString(36).toUpperCase();
    
    const orderData = {
        orderId,
        paymentId: paymentResponse.razorpay_payment_id,
        customer: customerData,
        items: cart,
        subtotal,
        shipping,
        total,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Save to Google Sheets
        await saveToGoogleSheets(orderData);
        
        // Send confirmation email (optional)
        // await sendConfirmationEmail(orderData);
        
        // Clear cart
        clearCart();
        
        // Redirect to confirmation
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        window.location.href = `confirmation.html?order=${orderId}`;
        
    } catch (error) {
        console.error('Error processing order:', error);
        // Still redirect - payment was successful, order can be reconciled later
        clearCart();
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        window.location.href = `confirmation.html?order=${orderId}`;
    }
}

// Save order to Google Sheets
async function saveToGoogleSheets(orderData) {
    if (!CONFIG.googleSheetsWebhook || CONFIG.googleSheetsWebhook === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL') {
        console.log('Google Sheets not configured. Order data:', orderData);
        return;
    }
    
    const itemsList = orderData.items.map(i => 
        `${i.name} (${i.size}) x${i.quantity}`
    ).join('; ');
    
    const sheetData = {
        orderId: orderData.orderId,
        paymentId: orderData.paymentId,
        timestamp: orderData.timestamp,
        customerName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.pincode}`,
        items: itemsList,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total
    };
    
    await fetch(CONFIG.googleSheetsWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetData)
    });
}
