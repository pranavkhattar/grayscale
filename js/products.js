// Product catalog - edit this to add/remove products
const products = [
    {
        id: 'essential-tee-white',
        name: 'Essential Tee — White',
        price: 799,
        originalPrice: 999,
        category: 'tshirts',
        description: 'Our signature essential tee in pure white. Made from 100% premium cotton with a relaxed fit that works for any occasion. Pre-washed to prevent shrinkage.',
        images: [
            'images/products/essential-tee-white-1.jpg',
            'images/products/essential-tee-white-2.jpg',
            'images/products/essential-tee-white-3.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        tag: 'Sale'
    },
    {
        id: 'essential-tee-black',
        name: 'Essential Tee — Black',
        price: 799,
        originalPrice: 999,
        category: 'tshirts',
        description: 'Our signature essential tee in classic black. Made from 100% premium cotton with a relaxed fit. The perfect foundation for any outfit.',
        images: [
            'images/products/essential-tee-black-1.jpg',
            'images/products/essential-tee-black-2.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        tag: 'Sale'
    },
    {
        id: 'essential-tee-gray',
        name: 'Essential Tee — Gray',
        price: 899,
        category: 'tshirts',
        description: 'Our signature essential tee in heather gray. Soft, breathable, and versatile enough for everyday wear.',
        images: [
            'images/products/essential-tee-gray-1.jpg',
            'images/products/essential-tee-gray-2.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'oxford-shirt-white',
        name: 'Oxford Shirt — White',
        price: 1499,
        category: 'shirts',
        description: 'Classic oxford shirt in crisp white. Button-down collar, chest pocket, and a slightly tapered fit. Perfect for work or weekends.',
        images: [
            'images/products/oxford-white-1.jpg',
            'images/products/oxford-white-2.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        tag: 'New'
    },
    {
        id: 'linen-shirt-black',
        name: 'Linen Shirt — Black',
        price: 1699,
        category: 'shirts',
        description: 'Lightweight linen shirt for warmer days. Relaxed fit with a camp collar. Made from 100% European linen.',
        images: [
            'images/products/linen-black-1.jpg',
            'images/products/linen-black-2.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'relaxed-trousers-black',
        name: 'Relaxed Trousers — Black',
        price: 1899,
        category: 'bottoms',
        description: 'Wide-leg trousers with an elastic waistband and drawstring. Made from a cotton-linen blend for breathability.',
        images: [
            'images/products/trousers-black-1.jpg',
            'images/products/trousers-black-2.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        tag: 'New'
    },
    {
        id: 'chino-shorts-gray',
        name: 'Chino Shorts — Gray',
        price: 1299,
        category: 'bottoms',
        description: '7-inch inseam chino shorts in a neutral gray. Comfortable stretch cotton with a clean, minimal design.',
        images: [
            'images/products/shorts-gray-1.jpg',
            'images/products/shorts-gray-2.jpg'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'canvas-tote',
        name: 'Canvas Tote',
        price: 599,
        category: 'accessories',
        description: 'Heavyweight canvas tote with reinforced handles. Simple, functional, and built to last.',
        images: [
            'images/products/tote-1.jpg',
            'images/products/tote-2.jpg'
        ],
        sizes: ['One Size']
    }
];

// Render products to a container
function renderProducts(containerId, category = null, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = category ? products.filter(p => p.category === category) : products;
    if (limit) filtered = filtered.slice(0, limit);

    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <div class="product-image">
                    ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                    <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">
                        ${product.originalPrice ? `<span class="original">₹${product.originalPrice}</span>` : ''}
                        ₹${product.price}
                    </p>
                </div>
            </a>
        </div>
    `).join('');
}
