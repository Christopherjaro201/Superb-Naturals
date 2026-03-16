// Use products array from script.js (already loaded)

// Helper function to get user-specific cart key
function getCartKey() {
    return "cart_" + (localStorage.getItem("userEmail") || "guest");
}

// Get current user's cart
let cart = JSON.parse(localStorage.getItem(getCartKey())) || [];

// Create test cart if empty (for debugging)
if (cart.length === 0 && localStorage.getItem("userEmail")) {
    console.log("WARNING: User cart is empty");
}

// Function to load and display cart
function loadCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.querySelector(".checkout-btn");
    
    console.log("=== loadCart Debug ===");
    console.log("Cart data:", cart);
    console.log("Cart length:", cart.length);
    console.log("CartItems element found:", !!cartItems);
    console.log("CartTotal element found:", !!cartTotal);
    console.log("Products array:", products);
    
    if (!cartItems || !cartTotal) {
        console.log("ERROR: Cart items or total element not found");
        return;
    }
    
    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="index.html" class="continue-shopping-link">Continue Shopping</a>
            </div>
        `;
        cartTotal.textContent = "Total: ₦0";
        if (checkoutBtn) checkoutBtn.style.display = "none";
        return;
    }
    
    // Show checkout button if cart has items
    if (checkoutBtn) checkoutBtn.style.display = "block";

    // Group items by product ID and count quantities
    let cartMap = {};
    cart.forEach((id, index) => {
        if (!cartMap[id]) {
            cartMap[id] = { quantity: 0, index: index };
        }
        cartMap[id].quantity += 1;
    });
    
    console.log("Cart map (items grouped by product ID):", cartMap);
    console.log("Number of unique products:", Object.keys(cartMap).length);

    let total = 0;
    let cartHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price per Item</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.keys(cartMap).forEach(productIdStr => {
        const productId = parseInt(productIdStr);
        let product = products.find(p => p.id == productId);
        console.log(`Product ID ${productIdStr}: Found product:`, product);
        if (!product) {
            console.log(`ERROR: Product with ID ${productId} not found in products array`);
            return; // Skip if product not found
        }
        
        let quantity = cartMap[productIdStr].quantity;
        let pricePerItem = product.price;
        let subtotal = pricePerItem * quantity;
        total += subtotal;

        cartHTML += `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                        <div>
                            <strong>${product.name}</strong>
                        </div>
                    </div>
                </td>
                <td>₦${pricePerItem.toLocaleString()}</td>
                <td>
                    <input type="number" value="${quantity}" min="1" onchange="updateQuantity(${productId}, this.value)" style="width: 50px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </td>
                <td><strong>₦${subtotal.toLocaleString()}</strong></td>
                <td><button class="delete-btn" onclick="removeProductFromCart(${productId})">🗑️ Delete</button></td>
            </tr>
        `;
    });

    cartHTML += `
            </tbody>
        </table>
    `;
    
    console.log("Cart HTML being set:", cartHTML.substring(0, 200) + "...");
    cartItems.innerHTML = cartHTML;
    console.log("Cart HTML successfully set to DOM");
    cartTotal.innerHTML = `
        <div style="text-align: right; padding: 20px; border-top: 2px solid #ddd; margin-top: 20px;">
            <p style="font-size: 18px;"><strong>Total Items:</strong> ${cart.length}</p>
            <p style="font-size: 20px; color: #4CAF50;"><strong>Total Price: ₦${total.toLocaleString()}</strong></p>
        </div>
    `;
}

// Function to remove all instances of a product
function removeProductFromCart(productId) {
    cart = cart.filter(id => id != productId);
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    loadCart();
    updateCartCount();
    alert("Product removed from cart!");
}

// Function to update item quantity
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeProductFromCart(productId);
        return;
    }
    
    // Count current quantity of this product
    let currentQuantity = cart.filter(id => id == productId).length;
    let difference = newQuantity - currentQuantity;
    
    if (difference > 0) {
        // Add more items
        for (let i = 0; i < difference; i++) {
            cart.push(productId);
        }
    } else if (difference < 0) {
        // Remove items
        for (let i = 0; i < Math.abs(difference); i++) {
            let index = cart.indexOf(productId);
            if (index > -1) {
                cart.splice(index, 1);
            }
        }
    }
    
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Function to update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired - calling loadCart()");
    loadCart();
    updateCartCount();
});

// Also call if DOM is already loaded
if (document.readyState === 'loading') {
    console.log("DOM still loading, waiting for DOMContentLoaded event");
} else {
    console.log("DOM already loaded, calling loadCart() immediately");
    loadCart();
    updateCartCount();
}