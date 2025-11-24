// ========================================
// PRODUCTS PAGE - JavaScript File
// Purpose: Handle "Add to Cart" functionality
// ========================================

/**
 * Initialize the products page
 * - Add event listeners to all "Add to Cart" buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Add click event listener to each button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
});

/**
 * Handle the "Add to Cart" button click
 * @param {Event} event - The click event object
 */
function handleAddToCart(event) {
    event.preventDefault();
    
    // Get the button element
    const button = event.target;
    
    // Extract product data from data attributes
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));
    const productImage = button.getAttribute('data-img');
    
    // Create a product object
    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };
    
    // Add product to cart
    addProductToCart(product);
    
    // Provide user feedback
    showAddedToCartMessage(button);
}

/**
 * Add a product to the shopping cart (in localStorage)
 * If the product already exists, increase its quantity
 * @param {Object} product - The product object to add
 */
function addProductToCart(product) {
    // Get existing cart from localStorage, or initialize as empty array
    let cart = getCart();
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        // If product exists, increase quantity
        existingProduct.quantity += 1;
    } else {
        // If product doesn't exist, add it to cart
        cart.push(product);
    }
    
    // Save updated cart to localStorage
    saveCart(cart);
}

/**
 * Get the shopping cart from localStorage
 * @returns {Array} - Array of product objects in the cart
 */
function getCart() {
    const cartData = localStorage.getItem('cart');
    // Return parsed cart data or empty array if nothing exists
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * Save the shopping cart to localStorage
 * @param {Array} cart - Array of product objects to save
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Show a temporary "Added to Cart" message
 * @param {HTMLElement} button - The button element that was clicked
 */
function showAddedToCartMessage(button) {
    // Store original button text
    const originalText = button.textContent;
    
    // Change button text and styling
    button.textContent = '✓ Added!';
    button.style.backgroundColor = '#28a745';
    button.style.color = 'white';
    
    // Revert button after 2 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
    }, 2000);
}
