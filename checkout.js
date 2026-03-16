// Use products array from script.js (already loaded)

// Helper function to get user-specific cart key
function getCartKey() {
    return "cart_" + (localStorage.getItem("userEmail") || "guest");
}

let cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
let total = 0;
let cartMap = {};
let itemsList = [];

// Function to display checkout items
function displayCheckoutItems() {
    const checkoutItems = document.getElementById("checkout-items");
    const checkoutForm = document.getElementById("checkout-form");
    
    if (!checkoutItems) return;
    
    // If cart is empty
    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div style="background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Your cart is empty!</strong></p>
                <p><a href="index.html" style="color: #0c5460; text-decoration: underline;">Go back to shopping</a></p>
            </div>
        `;
        if (checkoutForm) {
            checkoutForm.style.display = "none";
        }
        return;
    }
    
    // Reset counters
    total = 0;
    itemsList = [];
    
    // Group items
    cartMap = {};
    cart.forEach(id => {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        if (!cartMap[numId]) {
            cartMap[numId] = { quantity: 0, product: products.find(p => p.id === numId) };
        }
        cartMap[numId].quantity += 1;
    });
    
    let checkoutHTML = `
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid #ddd;">
                        <th style="text-align: left; padding: 10px;">Product</th>
                        <th style="text-align: center; padding: 10px;">Price</th>
                        <th style="text-align: center; padding: 10px;">Qty</th>
                        <th style="text-align: right; padding: 10px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.keys(cartMap).forEach(productIdStr => {
        const productId = parseInt(productIdStr);
        let item = cartMap[productId];
        let product = item.product;
        
        // Skip if product not found
        if (!product) return;
        
        let quantity = item.quantity;
        let pricePerItem = product.price;
        let subtotal = pricePerItem * quantity;
        total += subtotal;
        
        itemsList.push(`${product.name} (${quantity})`);

        checkoutHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;"><strong>${product.name}</strong></td>
                <td style="text-align: center; padding: 10px;">₦${pricePerItem.toLocaleString()}</td>
                <td style="text-align: center; padding: 10px; font-weight: bold;">${quantity}</td>
                <td style="text-align: right; padding: 10px; font-weight: bold;">₦${subtotal.toLocaleString()}</td>
            </tr>
        `;
    });

    checkoutHTML += `
                </tbody>
            </table>
            <div style="margin-top: 15px; text-align: right; font-size: 16px; border-top: 2px solid #ddd; padding-top: 15px;">
                <p style="margin: 5px 0;"><strong>Subtotal:</strong> ₦${total.toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Shipping:</strong> Free</p>
                <p style="margin: 10px 0; font-size: 18px; color: #4CAF50;"><strong>Order Total: ₦${total.toLocaleString()}</strong></p>
                <p style="margin-top: 15px;"><a href="cart.html" style="color: #2196F3; text-decoration: underline;">← Edit Cart</a></p>
            </div>
        </div>
    `;

    checkoutItems.innerHTML = checkoutHTML;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    displayCheckoutItems();
    
    // Pre-fill user data if logged in
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === userEmail);
        
        if (user) {
            const nameField = document.getElementById("customer-name");
            const emailField = document.getElementById("customer-email");
            const addressField = document.getElementById("customer-address");
            
            if (nameField) nameField.value = user.fullName || "";
            if (emailField) emailField.value = user.email || "";
            if (addressField) addressField.value = user.address || "";
        }
    }

    // Handle checkout form submission
    const checkoutForm = document.getElementById("checkout-form");
    const orderMessage = document.getElementById("order-message");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Check if cart is empty
            if (cart.length === 0) {
                orderMessage.textContent = "❌ Your cart is empty!";
                orderMessage.style.color = "red";
                return;
            }

            // Get customer info from form
            const fullName = document.getElementById("customer-name").value;
            const email = document.getElementById("customer-email").value;
            const address = document.getElementById("customer-address").value;

            // Validate inputs
            if (!fullName || !email || !address) {
                orderMessage.textContent = "❌ Please fill in all fields!";
                orderMessage.style.color = "red";
                return;
            }

            // Generate unique order ID
            const orderId = "ORD" + String(Math.floor(Math.random() * 100000)).padStart(6, "0");
            
            // Get today's date
            const today = new Date();
            const dateStr = today.getFullYear() + "-" + 
                           String(today.getMonth() + 1).padStart(2, "0") + "-" + 
                           String(today.getDate()).padStart(2, "0");

            // Create order object
            const order = {
                id: orderId,
                customer: fullName,
                email: email,
                address: address,
                items: itemsList.join(", "),
                amount: total,
                date: dateStr,
                status: "pending",
                paymentStatus: "completed"
            };

            // Load existing orders
            let sellerOrders = JSON.parse(localStorage.getItem("sellerOrders")) || [];
            
            // Add new order to seller
            sellerOrders.push(order);
            localStorage.setItem("sellerOrders", JSON.stringify(sellerOrders));

            // Also save to user's orders (user-specific)
            const userOrdersKey = "userOrders_" + email;
            let userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
            userOrders.push(order);
            localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));

            // Clear user's cart (user-specific)
            localStorage.setItem(getCartKey(), JSON.stringify([]));

            // Show success message
            orderMessage.innerHTML = `
                <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <h4 style="margin: 0 0 10px 0;">✅ Order Placed Successfully!</h4>
                    <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₦${order.amount.toLocaleString()}</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #666;">Redirecting to home page...</p>
                </div>
            `;

            // Clear form
            checkoutForm.reset();

            // Redirect to home after 3 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        });
    }
});