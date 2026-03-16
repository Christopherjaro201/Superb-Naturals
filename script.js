const products = [
    { id: 1, name: "Natural Hair Growth Oil 100ml", price: 10500, image: "images/hair growth oil.jpg", category: "oils", rating: 4.8, reviews: 124, badge: "Best Seller", isNew: false },
    { id: 2, name: "Natural Hair Growth Oil 50ml", price: 7000, image: "images/hair growth oil 50ml.jpg", category: "oils", rating: 4.7, reviews: 98, badge: "", isNew: true },
    { id: 3, name: "Organic Hair Wash & Conditioner", price: 12000, image: "images/hair wash and conditioner.jpg", category: "wash", rating: 4.9, reviews: 156, badge: "Luxury Choice", isNew: false },
    { id: 4, name: "Organic Edge Oil", price: 10000, image: "images/essential edge oil.jpg", category: "oils", rating: 4.6, reviews: 87, badge: "", isNew: false },
    { id: 5, name: "Natural Beard Oil", price: 12000, image: "images/beard oil.jpg", category: "beard", rating: 4.8, reviews: 112, badge: "Top Rated", isNew: false },
    { id: 6, name: "Natural Beard Wash & Conditioner", price: 13000, image: "images/beard wash and conditioner.jpg", category: "beard", rating: 4.7, reviews: 94, badge: "", isNew: true }
];

// ============ USER-SPECIFIC DATA MANAGEMENT ============
function getCurrentUserEmail() {
    return localStorage.getItem("userEmail");
}

function getUserCart() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return [];
    const cartKey = `cart_${userEmail}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function setUserCart(cartData) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    const cartKey = `cart_${userEmail}`;
    localStorage.setItem(cartKey, JSON.stringify(cartData));
    return true;
}

function getUserWishlist() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return [];
    const wishlistKey = `wishlist_${userEmail}`;
    return JSON.parse(localStorage.getItem(wishlistKey)) || [];
}

function setUserWishlist(wishlistData) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    const wishlistKey = `wishlist_${userEmail}`;
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistData));
    return true;
}

function getUserOrders() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return [];
    const ordersKey = `userOrders_${userEmail}`;
    return JSON.parse(localStorage.getItem(ordersKey)) || [];
}

function setUserOrders(ordersData) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    const ordersKey = `userOrders_${userEmail}`;
    localStorage.setItem(ordersKey, JSON.stringify(ordersData));
    return true;
}

// Initialize luxury features data
function initializeLuxuryFeatures() {
    if (!localStorage.getItem("wishlist")) {
        localStorage.setItem("wishlist", JSON.stringify([]));
    }
    if (!localStorage.getItem("userLoyaltyPoints")) {
        localStorage.setItem("userLoyaltyPoints", JSON.stringify({}));
    }
    if (!localStorage.getItem("userReviews")) {
        localStorage.setItem("userReviews", JSON.stringify({}));
    }
}

initializeLuxuryFeatures();

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");

// ============ WISHLIST SYSTEM ============
function toggleWishlist(productId) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
        alert("Please login to use wishlist");
        return;
    }
    
    let wishlist = getUserWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    setUserWishlist(wishlist);
    updateWishlistUI();
}

function updateWishlistUI() {
    const wishlist = getUserWishlist();
    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        if (wishlist.includes(productId)) {
            btn.classList.add("active");
            btn.textContent = "♥";
        } else {
            btn.classList.remove("active");
            btn.textContent = "♡";
        }
    });
}

// ============ LOYALTY POINTS SYSTEM ============
function addLoyaltyPoints(userEmail, points) {
    let loyaltyData = JSON.parse(localStorage.getItem("userLoyaltyPoints")) || {};
    if (!loyaltyData[userEmail]) {
        loyaltyData[userEmail] = { points: 0, tier: "Silver" };
    }
    loyaltyData[userEmail].points += points;
    
    // Update tier
    const pointsAmount = loyaltyData[userEmail].points;
    if (pointsAmount >= 5000) loyaltyData[userEmail].tier = "Platinum";
    else if (pointsAmount >= 2000) loyaltyData[userEmail].tier = "Gold";
    else if (pointsAmount >= 500) loyaltyData[userEmail].tier = "Silver";
    
    localStorage.setItem("userLoyaltyPoints", JSON.stringify(loyaltyData));
    return loyaltyData[userEmail];
}

function getLoyaltyPoints(userEmail) {
    let loyaltyData = JSON.parse(localStorage.getItem("userLoyaltyPoints")) || {};
    return loyaltyData[userEmail] || { points: 0, tier: "Bronze" };
}

// ============ PRODUCT REVIEWS & RATINGS ============
function addProductReview(productId, userEmail, rating, reviewText) {
    let reviews = JSON.parse(localStorage.getItem("userReviews")) || {};
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    
    reviews[productId].push({
        email: userEmail,
        rating: rating,
        text: reviewText,
        date: new Date().toISOString(),
        helpful: 0
    });
    
    localStorage.setItem("userReviews", JSON.stringify(reviews));
}

function getProductReviews(productId) {
    let reviews = JSON.parse(localStorage.getItem("userReviews")) || {};
    return reviews[productId] || [];
}

// ============ PRODUCT SEARCH & FILTERING ============
function searchProducts(query) {
    return products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.includes(query.toLowerCase())
    );
}

function filterProducts(category, minPrice = 0, maxPrice = 999999, minRating = 0) {
    return products.filter(p => 
        (category === "all" || p.category === category) &&
        (p.price >= minPrice && p.price <= maxPrice) &&
        (p.rating >= minRating)
    );
}

// ============ REFERRAL PROGRAM ============
function generateReferralCode(userEmail) {
    const code = "REF-" + userEmail.split("@")[0].toUpperCase() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    let referrals = JSON.parse(localStorage.getItem("referralCodes")) || {};
    referrals[userEmail] = code;
    localStorage.setItem("referralCodes", JSON.stringify(referrals));
    return code;
}

function validateReferralCode(code) {
    let referrals = JSON.parse(localStorage.getItem("referralCodes")) || {};
    return Object.values(referrals).includes(code);
}

// ============ STAR RATING DISPLAY ============
function createStarRating(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<span class="star">★</span>';
        } else if (i - rating < 1) {
            stars += '<span class="star">½</span>';
        } else {
            stars += '<span class="star empty">☆</span>';
        }
    }
    return stars;
}

// ============ PASSWORD VISIBILITY TOGGLE ============
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const toggleIcon = document.getElementById(`toggle-${inputId}`);
    if (!input) return;
    
    // Add fade-out animation
    if (toggleIcon) {
        toggleIcon.classList.add("fade-out");
    }
    
    // Toggle password visibility
    setTimeout(() => {
        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }
        
        // Add fade-in animation
        if (toggleIcon) {
            toggleIcon.classList.remove("fade-out");
            toggleIcon.classList.add("fade-in");
            setTimeout(() => {
                toggleIcon.classList.remove("fade-in");
            }, 300);
        }
    }, 150);
}

// ============ PASSWORD STRENGTH CHECKER ============
function checkPasswordStrength(inputId, strengthBarId) {
    const password = document.getElementById(inputId).value;
    const strengthBar = document.getElementById(strengthBarId);
    const strengthText = document.getElementById(strengthBarId + "-text");
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let feedback = "";
    
    // Check length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Check for numbers
    if (/\d/.test(password)) strength += 1;
    
    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 2;
    
    // Reset if empty
    if (password === "") {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "#ccc";
        strengthText.textContent = "";
        strengthText.style.color = "#666";
        return;
    }
    
    // Determine strength level
    if (strength < 3) {
        strengthBar.style.width = "25%";
        strengthBar.style.backgroundColor = "#ff4444";
        strengthText.textContent = "Weak";
        strengthText.style.color = "#ff4444";
    } else if (strength < 5) {
        strengthBar.style.width = "50%";
        strengthBar.style.backgroundColor = "#ffaa00";
        strengthText.textContent = "Fair";
        strengthText.style.color = "#ffaa00";
    } else if (strength < 7) {
        strengthBar.style.width = "75%";
        strengthBar.style.backgroundColor = "#44dd44";
        strengthText.textContent = "Good";
        strengthText.style.color = "#44dd44";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "#00aa00";
        strengthText.textContent = "Strong";
        strengthText.style.color = "#00aa00";
    }
}

// Helper function to check if password meets minimum strength requirements
function isPasswordStrong(password) {
    // Requires: at least 8 chars, uppercase, lowercase, number, special char
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

// Real-time password match validation
function validatePasswordMatch(passwordId, confirmPasswordId, errorId) {
    const password = document.getElementById(passwordId).value;
    const confirmPassword = document.getElementById(confirmPasswordId).value;
    const errorElement = document.getElementById(errorId);
    
    if (!errorElement) return;
    
    if (confirmPassword === "") {
        errorElement.textContent = "";
        return;
    }
    
    if (password !== confirmPassword) {
        errorElement.textContent = "❌ Passwords do not match";
        errorElement.style.color = "#ff4444";
    } else {
        errorElement.textContent = "✓ Passwords match";
        errorElement.style.color = "#44dd44";
    }
}

// ============ GOOGLE ONE TAP LOGIN HANDLER ============
function handleGoogleLogin(response) {
    // The response contains the JWT token
    const token = response.credential;
    
    // Decode the JWT to get user info (without verification for demo)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const userData = JSON.parse(jsonPayload);
    
    // Store user data in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        loginMethod: 'google',
        loginTime: new Date().toISOString()
    }));
    
    // Show success message
    alert(`Welcome ${userData.name}! You have been logged in with Google.`);
    
    // Redirect to home or dashboard
    window.location.href = 'index.html';
}

// ============ SOCIAL LOGIN HANDLER ============
function handleSocialLogin(provider) {
    if (provider === 'apple') {
        // Apple ID login
        // Replace with your actual Apple credentials from Apple Developer Account
        const clientId = 'com.superbnaturals.web'; // Your Service ID / Bundle ID
        const redirectUri = window.location.origin + '/'; // Redirect back to home
        
        const authUrl = `https://appleid.apple.com/auth/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `response_mode=form_post&` +
            `scope=email%20name`;
        
        window.location.href = authUrl;
    }
}

// ============ LOADING STATE HANDLER ============
function showLoadingState(button) {
    button.disabled = true;
    const btnText = button.querySelector(".btn-text");
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    button.insertBefore(spinner, btnText);
    btnText.textContent = "Processing...";
}

function showSuccessState(button, originalText) {
    const spinner = button.querySelector(".spinner");
    if (spinner) spinner.remove();
    
    const btnText = button.querySelector(".btn-text");
    btnText.textContent = "";
    
    const successIcon = document.createElement("div");
    successIcon.className = "success-icon";
    successIcon.innerHTML = "✓";
    button.insertBefore(successIcon, btnText);
    
    button.style.background = "#44dd44";
}

function resetButtonState(button, originalText) {
    button.disabled = false;
    const spinner = button.querySelector(".spinner");
    const successIcon = button.querySelector(".success-icon");
    
    if (spinner) spinner.remove();
    if (successIcon) successIcon.remove();
    
    const btnText = button.querySelector(".btn-text");
    btnText.textContent = originalText;
    button.style.background = "";
}

function displayProducts(productsToDisplay = products) {
    if (productList) {
        productList.innerHTML = "";
        productsToDisplay.forEach(product => {
            const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            const isWishlisted = wishlist.includes(product.id);
            const starRating = createStarRating(product.rating);
            const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : "";
            const newBadgeHtml = product.isNew ? `<div class="product-badge" style="top: 50px; background: #4a90e2; color: white;">NEW</div>` : "";
            
            productList.innerHTML += `
                <div class="product-card">
                    ${badgeHtml}
                    ${newBadgeHtml}
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-rating">
                            ${starRating}
                        </div>
                        <div class="review-count">${product.reviews} reviews</div>
                        <p>₦${product.price.toLocaleString()}</p>
                        <div class="product-quantity">
                            <button class="qty-btn" onclick="decrementQuantity(${product.id})">−</button>
                            <input type="number" id="qty-${product.id}" class="qty-input" value="1" min="1" readonly>
                            <button class="qty-btn" onclick="incrementQuantity(${product.id})">+</button>
                        </div>
                        <div class="product-actions">
                            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                            <button class="wishlist-btn" data-product-id="${product.id}" onclick="toggleWishlist(${product.id})">${isWishlisted ? '♥' : '♡'}</button>
                        </div>
                    </div>
                </div>
            `;
        });
        updateWishlistUI();
    }
}

// Increment product quantity
function incrementQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (qtyInput) {
        let currentQty = parseInt(qtyInput.value) || 1;
        qtyInput.value = currentQty + 1;
    }
}

// Decrement product quantity
function decrementQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (qtyInput) {
        let currentQty = parseInt(qtyInput.value) || 1;
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    }
}

function addToCart(id) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
        alert("Please login to add items to cart");
        return;
    }
    
    const qtyInput = document.getElementById(`qty-${id}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    
    let cart = getUserCart();
    
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
        cart.push(id);
    }
    
    setUserCart(cart);
    
    // Reset quantity to 1 after adding to cart
    if (qtyInput) {
        qtyInput.value = 1;
    }
    
    updateCartCount();
    alert(`${quantity} item(s) added to cart!`);
}

function updateCartCount() {
    let cart = getUserCart();
    if(cartCount) cartCount.textContent = cart.length;
}

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger) {
    hamburger.addEventListener("click", function() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

// Close menu when clicking outside
document.addEventListener("click", function(event) {
    if (hamburger && navMenu) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    }
});

// Handle Login Form
const loginForm = document.getElementById("login-form");
if (loginForm) {
    // Auto-fill credentials if "Remember me" was previously checked
    const savedEmail = localStorage.getItem("savedBuyerEmail");
    const savedPassword = localStorage.getItem("savedBuyerPassword");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("remember").checked = true;
    }
    if (savedPassword) {
        document.getElementById("password").value = savedPassword;
    }

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const button = document.getElementById("login-btn");
        const originalText = button.querySelector(".btn-text").textContent;
        
        showLoadingState(button);
        
        // Simulate API call (2 second delay)
        setTimeout(() => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const remember = document.getElementById("remember").checked;

            // Store login info
            localStorage.setItem("userEmail", email);
            
            if (remember) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("savedBuyerEmail", email);
                localStorage.setItem("savedBuyerPassword", password);
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("savedBuyerEmail");
                localStorage.removeItem("savedBuyerPassword");
            }

            showSuccessState(button, originalText);
            
            // Redirect after success animation
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        }, 2000);
    });
}

// Handle Register Form
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const button = document.getElementById("register-btn");
        const originalText = button.querySelector(".btn-text").textContent;
        
        const fullName = document.getElementById("full-name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("home-address").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Check password strength (minimum: Fair strength)
        if (!isPasswordStrong(password)) {
            alert("Password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.");
            return;
        }

        // Store user registration info
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert("Email already registered!");
            return;
        }

        showLoadingState(button);
        
        // Simulate API call (2 second delay)
        setTimeout(() => {
            users.push({
                fullName: fullName,
                email: email,
                phone: phone,
                address: address,
                password: password,
                avatar: null
            });

            localStorage.setItem("users", JSON.stringify(users));
            
            showSuccessState(button, originalText);
            
            // Redirect after success animation
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }, 2000);
    });
}

// ============ SELLER AUTHENTICATION & DASHBOARD ============

// Initialize default seller account if not exists
function initializeDefaultSeller() {
    if (!localStorage.getItem("sellers")) {
        const defaultSellers = [
            {
                businessName: "Superb Naturals",
                ownerName: "Honeybell Mkpanam",
                email: "honeybell@superbnaturals.com",
                password: "admin123",
                phone: "+234 802 086 6239",
                address: "Plot 1, Block 1, Off Ebitu Ukiwe Street, Jabi, Abuja"
            }
        ];
        localStorage.setItem("sellers", JSON.stringify(defaultSellers));
    }
}

initializeDefaultSeller();

// Handle Seller Registration
const sellerRegisterForm = document.getElementById("seller-register-form");
if (sellerRegisterForm) {
    sellerRegisterForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const button = document.getElementById("seller-register-btn");
        const originalText = button.querySelector(".btn-text").textContent;
        
        const businessName = document.getElementById("business-name").value;
        const ownerName = document.getElementById("owner-name").value;
        const email = document.getElementById("seller-email").value;
        const phone = document.getElementById("seller-phone").value;
        const address = document.getElementById("business-address").value;
        const password = document.getElementById("seller-password").value;
        const confirmPassword = document.getElementById("confirm-seller-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Check password strength (minimum: Fair strength)
        if (!isPasswordStrong(password)) {
            alert("Password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.");
            return;
        }

        let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
        const sellerExists = sellers.some(s => s.email === email);

        if (sellerExists) {
            alert("Email already registered as a seller!");
            return;
        }

        showLoadingState(button);
        
        // Simulate API call (2 second delay)
        setTimeout(() => {
            sellers.push({
                businessName: businessName,
                ownerName: ownerName,
                email: email,
                password: password,
                phone: phone,
                address: address
            });

            localStorage.setItem("sellers", JSON.stringify(sellers));
            
            showSuccessState(button, originalText);
            
            // Redirect after success animation
            setTimeout(() => {
                window.location.href = "seller-login.html";
            }, 1000);
        }, 2000);
    });
}

// Handle Seller Login
const sellerLoginForm = document.getElementById("seller-login-form");
if (sellerLoginForm) {
    // Auto-fill credentials if "Remember me" was previously checked
    const savedSellerEmail = localStorage.getItem("savedSellerEmail");
    const savedSellerPassword = localStorage.getItem("savedSellerPassword");
    if (savedSellerEmail) {
        document.getElementById("seller-email").value = savedSellerEmail;
        document.getElementById("seller-remember").checked = true;
    }
    if (savedSellerPassword) {
        document.getElementById("seller-password").value = savedSellerPassword;
    }

    sellerLoginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const button = document.getElementById("seller-login-btn");
        const originalText = button.querySelector(".btn-text").textContent;
        const email = document.getElementById("seller-email").value;
        const password = document.getElementById("seller-password").value;
        const remember = document.getElementById("seller-remember").checked;

        showLoadingState(button);
        
        // Simulate API call (2 second delay)
        setTimeout(() => {
            let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
            const seller = sellers.find(s => s.email === email && s.password === password);

            if (seller) {
                localStorage.setItem("sellerLoggedIn", "true");
                localStorage.setItem("sellerEmail", seller.email);
                localStorage.setItem("sellerName", seller.ownerName);
                localStorage.setItem("businessName", seller.businessName);
                
                if (remember) {
                    localStorage.setItem("savedSellerEmail", email);
                    localStorage.setItem("savedSellerPassword", password);
                } else {
                    localStorage.removeItem("savedSellerEmail");
                    localStorage.removeItem("savedSellerPassword");
                }
                
                showSuccessState(button, originalText);
                
                // Redirect after success animation
                setTimeout(() => {
                    window.location.href = "seller-dashboard.html";
                }, 1000);
            } else {
                resetButtonState(button, originalText);
                alert("Invalid credentials! Please try again.");
            }
        }, 2000);
    });
}

// Check if seller is logged in on dashboard
function checkSellerAuth() {
    const isLoggedIn = localStorage.getItem("sellerLoggedIn");
    const currentPage = window.location.pathname;

    if (currentPage.includes("seller-dashboard")) {
        if (!isLoggedIn) {
            alert("Access denied! Please login as seller first.");
            window.location.href = "seller-login.html";
        } else {
            // Show dashboard content only if authenticated
            const dashboardBody = document.getElementById("dashboard-body");
            if (dashboardBody) {
                dashboardBody.style.display = "block";
            }
        }
    }
}

// Initialize seller dashboard
function initSellerDashboard() {
    const sellerName = localStorage.getItem("sellerName");
    const businessName = localStorage.getItem("businessName");
    const sellerNameElement = document.getElementById("seller-name");
    if (sellerNameElement && sellerName) {
        sellerNameElement.textContent = `Welcome, ${sellerName}`;
    }

    // Initialize sample data
    initializeSampleOrders();
    loadDashboardData();

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("sellerLoggedIn");
            localStorage.removeItem("sellerEmail");
            localStorage.removeItem("sellerName");
            localStorage.removeItem("businessName");
            alert("Logged out successfully!");
            window.location.href = "index.html";
        });
    }
}

// Initialize sample orders data
function initializeSampleOrders() {
    if (!localStorage.getItem("sellerOrders")) {
        const sampleOrders = [
            { id: "ORD001", customer: "Chioma Okafor", items: "Hair Growth Oil (2)", amount: 30000, date: "2026-02-18", status: "delivered", paymentStatus: "completed", address: "123 Lekki, Lagos" },
            { id: "ORD002", customer: "Amina Bello", items: "Beard Oil, Edge Oil", amount: 22000, date: "2026-02-17", status: "shipped", paymentStatus: "completed", address: "456 Ikoyi, Lagos" },
            { id: "ORD003", customer: "Tunde Adeyemi", items: "Hair Wash & Conditioner (3)", amount: 36000, date: "2026-02-16", status: "processing", paymentStatus: "completed", address: "789 VI, Lagos" },
            { id: "ORD004", customer: "Zainab Mohammed", items: "Beard Wash & Conditioner", amount: 13000, date: "2026-02-15", status: "pending", paymentStatus: "pending", address: "321 Yaba, Lagos" }
        ];
        localStorage.setItem("sellerOrders", JSON.stringify(sampleOrders));
    }
}

// Load and display dashboard data
function loadDashboardData() {
    const orders = JSON.parse(localStorage.getItem("sellerOrders")) || [];

    // Update stats
    let totalOrders = orders.length;
    let pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
    let deliveredCount = orders.filter(o => o.status === "delivered").length;
    let totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

    document.getElementById("total-orders").textContent = totalOrders;
    document.getElementById("pending-orders").textContent = pendingOrders;
    document.getElementById("delivered-count").textContent = deliveredCount;
    document.getElementById("total-revenue").textContent = "₦" + totalRevenue.toLocaleString();

    // Display orders
    displayOrders(orders);

    // Display payments
    displayPayments(orders);

    // Display deliveries
    displayDeliveries(orders);
}

// Display orders in table
function displayOrders(orders) {
    const ordersList = document.getElementById("orders-list");
    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No orders yet</td></tr>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td>₦${order.amount.toLocaleString()}</td>
            <td>${order.date}</td>
            <td><span class="status-badge ${order.status}">${order.status.toUpperCase()}</span></td>
            <td><button class="edit-btn" onclick="openStatusModal('${order.id}', '${order.status}')">Update</button></td>
        </tr>
    `).join("");
}

// Display payments in table
function displayPayments(orders) {
    const paymentsList = document.getElementById("payments-list");
    if (!paymentsList) return;

    const payments = orders.filter(o => o.paymentStatus === "completed").map((o, i) => ({
        paymentId: `PAY${String(i + 1).padStart(3, "0")}`,
        orderId: o.id,
        customer: o.customer,
        amount: o.amount,
        date: o.date,
        status: o.paymentStatus,
        method: "Bank Transfer"
    }));

    if (payments.length === 0) {
        paymentsList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No payments recorded</td></tr>';
        return;
    }

    paymentsList.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.paymentId}</td>
            <td>${payment.orderId}</td>
            <td>${payment.customer}</td>
            <td>₦${payment.amount.toLocaleString()}</td>
            <td>${payment.date}</td>
            <td><span class="status-badge completed">COMPLETED</span></td>
            <td>${payment.method}</td>
        </tr>
    `).join("");
}

// Display deliveries in table
function displayDeliveries(orders) {
    const deliveriesList = document.getElementById("deliveries-list");
    if (!deliveriesList) return;

    const deliveries = orders.filter(o => o.status !== "pending" && o.status !== "processing").map((o, i) => ({
        deliveryId: `DEL${String(i + 1).padStart(3, "0")}`,
        orderId: o.id,
        customer: o.customer,
        address: o.address,
        date: o.date,
        status: o.status
    }));

    if (deliveries.length === 0) {
        deliveriesList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No deliveries yet</td></tr>';
        return;
    }

    deliveriesList.innerHTML = deliveries.map(delivery => `
        <tr>
            <td>${delivery.deliveryId}</td>
            <td>${delivery.orderId}</td>
            <td>${delivery.customer}</td>
            <td>${delivery.address}</td>
            <td>${delivery.date}</td>
            <td><span class="status-badge ${delivery.status}">${delivery.status.toUpperCase()}</span></td>
            <td><button class="edit-btn" onclick="openStatusModal('${delivery.orderId}', '${delivery.status}')">Update</button></td>
        </tr>
    `).join("");
}

// Switch between tabs
function switchTab(tabName) {
    const tabs = document.querySelectorAll(".dashboard-tab");
    tabs.forEach(tab => tab.classList.remove("active"));

    const activeTab = document.getElementById(tabName + "-tab");
    if (activeTab) {
        activeTab.classList.add("active");
    }
}

// Modal functionality
function openStatusModal(orderId, currentStatus) {
    const modal = document.getElementById("status-modal");
    const statusSelect = document.getElementById("order-status");
    const modalOrderId = document.getElementById("modal-order-id");

    if (modal) {
        modal.style.display = "block";
        modalOrderId.value = orderId;
        statusSelect.value = currentStatus;
    }
}

// Close modal
const modal = document.getElementById("status-modal");
const closeBtn = document.querySelector(".close");
if (closeBtn) {
    closeBtn.addEventListener("click", function() {
        if (modal) modal.style.display = "none";
    });
}

// Update order status
const statusForm = document.getElementById("status-form");
if (statusForm) {
    statusForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const orderId = document.getElementById("modal-order-id").value;
        const newStatus = document.getElementById("order-status").value;

        let orders = JSON.parse(localStorage.getItem("sellerOrders")) || [];
        orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        localStorage.setItem("sellerOrders", JSON.stringify(orders));

        alert("Order status updated successfully!");
        if (modal) modal.style.display = "none";
        loadDashboardData();
    });
}

// ============ USER AUTHENTICATION & PROFILE ============

// Check if user is logged in and update UI
function checkUserAuthentication() {
    const userEmail = localStorage.getItem("userEmail");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const avatarContainer = document.getElementById("avatar-container");
    
    if (userEmail) {
        // User is logged in
        if (loginLink) {
            loginLink.style.display = "none";
            loginLink.style.visibility = "hidden";
        }
        if (registerLink) {
            registerLink.style.display = "none";
            registerLink.style.visibility = "hidden";
        }
        if (avatarContainer) {
            avatarContainer.style.display = "flex";
            avatarContainer.style.visibility = "visible";
        }
        
        // Load and display user avatar
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === userEmail);
        
        if (user) {
            const avatarImg = document.getElementById("avatar-img");
            if (avatarImg) {
                avatarImg.src = user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6 0-8 3-8 3v6h16v-6s-2-3-8-3z'/%3E%3C/svg%3E";
            }
            
            // Set user display name if available
            const avatarDisplayName = document.getElementById("avatar-display-name");
            if (avatarDisplayName) {
                avatarDisplayName.textContent = user.fullName || "User";
            }
        }
    } else {
        // User is not logged in
        if (loginLink) {
            loginLink.style.display = "block";
            loginLink.style.visibility = "visible";
        }
        if (registerLink) {
            registerLink.style.display = "block";
            registerLink.style.visibility = "visible";
        }
        if (avatarContainer) {
            avatarContainer.style.display = "none";
            avatarContainer.style.visibility = "hidden";
        }
    }
}

// Navigate to profile page
function goToProfile() {
    window.location.href = "profile.html";
}

// Handle logout
function handleLogout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("savedBuyerEmail");
    localStorage.removeItem("savedBuyerPassword");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}

// Load and display profile
function loadProfile() {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        window.location.href = "login.html";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === userEmail);
    
    if (user) {
        document.getElementById("profile-name").textContent = user.fullName;
        document.getElementById("profile-email").textContent = user.email;
        document.getElementById("edit-name").value = user.fullName;
        document.getElementById("edit-email").value = user.email;
        document.getElementById("edit-phone").value = user.phone || "";
        document.getElementById("edit-address").value = user.address || "";
        
        const profileAvatar = document.getElementById("profile-avatar");
        if (profileAvatar) {
            profileAvatar.src = user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6 0-8 3-8 3v6h16v-6s-2-3-8-3z'/%3E%3C/svg%3E";
        }
    }
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const avatarData = e.target.result;
        const userEmail = localStorage.getItem("userEmail");
        
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === userEmail);
        
        if (userIndex !== -1) {
            users[userIndex].avatar = avatarData;
            localStorage.setItem("users", JSON.stringify(users));
            
            // Update avatar displays
            document.getElementById("profile-avatar").src = avatarData;
            document.getElementById("avatar-img").src = avatarData;
            
            alert("Avatar updated successfully!");
        }
    };
    reader.readAsDataURL(file);
}

// Handle profile form submission
function initProfileForm() {
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const button = document.querySelector(".profile-save-btn");
            const originalText = button.querySelector(".btn-text").textContent;
            
            const currentUserEmail = localStorage.getItem("userEmail");
            const newEmail = document.getElementById("edit-email").value;
            const name = document.getElementById("edit-name").value;
            const phone = document.getElementById("edit-phone").value;
            const address = document.getElementById("edit-address").value;
            
            // Check if email has changed
            const emailChanged = newEmail !== currentUserEmail;
            
            if (emailChanged) {
                const confirmed = confirm("Changing your email address will update all your account references (orders, reviews, etc.). Continue?");
                if (!confirmed) return;
                
                // Check if new email already exists
                const users = JSON.parse(localStorage.getItem("users")) || [];
                if (users.some(u => u.email === newEmail && u.email !== currentUserEmail)) {
                    alert("This email address is already in use!");
                    return;
                }
            }
            
            showLoadingState(button);
            
            setTimeout(() => {
                let users = JSON.parse(localStorage.getItem("users")) || [];
                const userIndex = users.findIndex(u => u.email === currentUserEmail);
                
                if (userIndex !== -1) {
                    users[userIndex].fullName = name;
                    users[userIndex].email = newEmail;
                    users[userIndex].phone = phone;
                    users[userIndex].address = address;
                    localStorage.setItem("users", JSON.stringify(users));
                    
                    // If email changed, update all user-specific data
                    if (emailChanged) {
                        // Move orders
                        const oldOrdersKey = `userOrders_${currentUserEmail}`;
                        const newOrdersKey = `userOrders_${newEmail}`;
                        const orders = JSON.parse(localStorage.getItem(oldOrdersKey)) || [];
                        if (orders.length > 0) {
                            localStorage.setItem(newOrdersKey, JSON.stringify(orders));
                            localStorage.removeItem(oldOrdersKey);
                        }
                        
                        // Move cart
                        const oldCartKey = `cart_${currentUserEmail}`;
                        const newCartKey = `cart_${newEmail}`;
                        const cart = JSON.parse(localStorage.getItem(oldCartKey)) || [];
                        if (cart.length > 0) {
                            localStorage.setItem(newCartKey, JSON.stringify(cart));
                            localStorage.removeItem(oldCartKey);
                        }
                        
                        // Move wishlist
                        const oldWishlistKey = `wishlist_${currentUserEmail}`;
                        const newWishlistKey = `wishlist_${newEmail}`;
                        const wishlist = JSON.parse(localStorage.getItem(oldWishlistKey)) || [];
                        if (wishlist.length > 0) {
                            localStorage.setItem(newWishlistKey, JSON.stringify(wishlist));
                            localStorage.removeItem(oldWishlistKey);
                        }
                        
                        // Update stored email
                        localStorage.setItem("userEmail", newEmail);
                    }
                    
                    showSuccessState(button, originalText);
                    
                    setTimeout(() => {
                        document.getElementById("profile-name").textContent = name;
                        document.getElementById("profile-email").textContent = newEmail;
                        resetButtonState(button, originalText);
                        alert("Profile updated successfully!");
                    }, 1000);
                }
            }, 2000);
        });
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    
    // Deactivate all buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Show selected tab and activate button
    const tabElement = document.getElementById(tabName + "-tab");
    if (tabElement) {
        tabElement.classList.add("active");
    }
    
    event.target.classList.add("active");
    
    // Load orders if switching to orders tab
    if (tabName === "orders") {
        loadUserOrders();
    }
    
    // Load reviews if switching to reviews tab
    if (tabName === "reviews") {
        if (typeof loadProfileProductSelect === 'function') {
            loadProfileProductSelect();
        }
        if (typeof displayUserReviews === 'function') {
            displayUserReviews();
        }
    }
}

// Load user orders
function loadUserOrders() {
    const userEmail = localStorage.getItem("userEmail");
    const ordersList = document.getElementById("orders-list");
    
    // Get user-specific orders
    const userOrdersKey = `userOrders_${userEmail}`;
    let userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">No orders yet. Start shopping!</p>';
        return;
    }
    
    ordersList.innerHTML = '<style>.order-item { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #f9f9f9; } .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; } .order-id { font-weight: bold; color: #333; } .order-status { padding: 5px 10px; border-radius: 4px; font-size: 12px; } .order-status.pending { background: #fff3cd; color: #856404; } .order-status.processing { background: #d1ecf1; color: #0c5460; } .order-status.shipped { background: #cce5ff; color: #004085; } .order-status.delivered { background: #d4edda; color: #155724; } .order-details { font-size: 14px; color: #666; margin-bottom: 10px; } .order-actions { display: flex; gap: 10px; } .pay-btn, .review-btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; transition: 0.3s; } .pay-btn { background: #4CAF50; color: white; } .pay-btn:hover { background: #45a049; } .pay-btn:disabled { background: #ccc; cursor: not-allowed; } .review-btn { background: #2196F3; color: white; } .review-btn:hover { background: #0b7dda; }</style>' + 
    userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Items:</strong> ${order.items}</p>
                <p><strong>Total Amount:</strong> ₦${order.amount.toLocaleString()}</p>
                <p><strong>Shipping Address:</strong> ${order.address}</p>
                <p><strong>Payment Status:</strong> <span style="color: ${order.paymentStatus === 'completed' ? '#28a745' : '#dc3545'}; font-weight: bold;">${order.paymentStatus.toUpperCase()}</span></p>
            </div>
            <div class="order-actions">
                ${order.paymentStatus !== 'completed' ? `<button class="pay-btn" onclick="processPayment('${order.id}', ${order.amount})">💳 Pay Now</button>` : ''}
                <button class="review-btn" onclick="openReviewModal('${order.id}', '${order.items}')">⭐ Leave Review</button>
            </div>
        </div>
    `).join("");
}

// Process payment for an order
function processPayment(orderId, amount) {
    const userEmail = localStorage.getItem("userEmail");
    const confirmed = confirm(`Process payment of ₦${amount.toLocaleString()}?\n\nClick OK to continue with payment.`);
    
    if (!confirmed) return;
    
    // Update user-specific orders
    const userOrdersKey = `userOrders_${userEmail}`;
    let userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
    userOrders = userOrders.map(o => {
        if (o.id === orderId) {
            return { ...o, paymentStatus: 'completed' };
        }
        return o;
    });
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
    
    // Also update in seller orders
    let sellerOrders = JSON.parse(localStorage.getItem("sellerOrders")) || [];
    sellerOrders = sellerOrders.map(o => {
        if (o.id === orderId && o.email === userEmail) {
            return { ...o, paymentStatus: 'completed' };
        }
        return o;
    });
    localStorage.setItem("sellerOrders", JSON.stringify(sellerOrders));
    
    alert("✅ Payment successful! Order #" + orderId + " is confirmed.");
    loadUserOrders();
}

// Open review modal
function openReviewModal(orderId, items) {
    const productSelect = document.getElementById("profile-product-select");
    if (productSelect) {
        // Show items from this order for review
        productSelect.innerHTML = `<option value="">Select product from this order to review</option>`;
        
        // Parse items from order
        const itemsArray = items.split(", ");
        itemsArray.forEach((item, index) => {
            productSelect.innerHTML += `<option value="${item}">${item}</option>`;
        });
        
        // Store current order ID for review submission
        document.getElementById("profile-review-form").dataset.orderId = orderId;
    }
    
    // Switch to reviews tab
    const reviewsBtn = document.querySelectorAll(".tab-btn")[2];
    if (reviewsBtn) {
        reviewsBtn.click();
    }
}

// Initialize profile page
function initProfile() {
    if (window.location.pathname.includes("profile.html")) {
        loadProfile();
        initProfileForm();
    }
}

// Check authentication on page load
function initializeAuthUI() {
    checkSellerAuth();
    checkUserAuthentication();
}

// Run immediately and also on DOMContentLoaded to ensure timing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthUI);
} else {
    initializeAuthUI();
}

// Also run at the end to ensure it catches everything
initializeAuthUI();

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes("seller-dashboard")) {
    initSellerDashboard();
}

// Initialize profile if on profile page
initProfile();

// Display products on home page
displayProducts();
updateCartCount();

// ============ SEARCH & FILTER UI ============

function filterByCategory(category) {
    const results = filterProducts(category);
    displayProducts(results);
}

function filterByPrice(minPrice, maxPrice) {
    const results = filterProducts("all", minPrice, maxPrice);
    displayProducts(results);
}

function filterByRating(minRating) {
    const results = filterProducts("all", 0, 999999, minRating);
    displayProducts(results);
}

// ============ FEATURED PRODUCTS ============
function getFeaturedProducts() {
    // Return best sellers and highly rated products
    return products.filter(p => p.badge || p.rating >= 4.7).sort((a, b) => b.rating - a.rating);
}

function displayFeaturedProducts() {
    const featured = getFeaturedProducts();
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    featuredContainer.innerHTML = featured.map(product => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const isWishlisted = wishlist.includes(product.id);
        const starRating = createStarRating(product.rating);
        
        return `
            <div class="featured-card">
                <div class="featured-badge">${product.badge || 'Recommended'}</div>
                <img src="${product.image}" alt="${product.name}">
                <div class="featured-info">
                    <h4>${product.name}</h4>
                    <div class="featured-rating">${starRating}</div>
                    <p class="featured-price">₦${product.price.toLocaleString()}</p>
                    <div class="featured-actions">
                        <button class="featured-cart-btn" onclick="addToCart(${product.id})">Quick Add</button>
                        <button class="featured-wishlist" onclick="toggleWishlist(${product.id})">${isWishlisted ? '♥' : '♡'}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}