// E-commerce Application - Fixed JavaScript Implementation
// Demonstrates: ES6+ features, state management, async patterns, and clean architecture

// Application Data Store
const AppData = {
  products: [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 199.99,
      rating: 4.5,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
      inStock: 25,
      featured: true
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      category: "Electronics",
      price: 299.99,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration. Track your health goals.",
      inStock: 15,
      featured: true
    },
    {
      id: 3,
      name: "Designer Cotton T-Shirt",
      category: "Clothing",
      price: 29.99,
      rating: 4.2,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      description: "Premium cotton t-shirt with modern fit and sustainable materials. Comfortable and stylish.",
      inStock: 50,
      featured: false
    },
    {
      id: 4,
      name: "JavaScript Programming Guide",
      category: "Books",
      price: 39.99,
      rating: 4.8,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
      description: "Complete guide to modern JavaScript development with practical examples and best practices.",
      inStock: 100,
      featured: true
    },
    {
      id: 5,
      name: "Ceramic Coffee Mug Set",
      category: "Home & Garden",
      price: 24.99,
      rating: 4.4,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500",
      description: "Elegant set of 4 ceramic coffee mugs, dishwasher and microwave safe. Perfect for daily use.",
      inStock: 30,
      featured: false
    },
    {
      id: 6,
      name: "Bluetooth Portable Speaker",
      category: "Electronics",
      price: 79.99,
      rating: 4.3,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      description: "Compact wireless speaker with powerful sound and 12-hour battery life. Waterproof design.",
      inStock: 40,
      featured: false
    },
    {
      id: 7,
      name: "Organic Cotton Hoodie",
      category: "Clothing",
      price: 69.99,
      rating: 4.6,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      description: "Soft organic cotton hoodie with premium comfort and eco-friendly materials.",
      inStock: 35,
      featured: true
    },
    {
      id: 8,
      name: "LED Desk Lamp",
      category: "Home & Garden",
      price: 45.99,
      rating: 4.1,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      description: "Adjustable LED desk lamp with touch controls and USB charging port. Energy efficient.",
      inStock: 22,
      featured: false
    }
  ],
  
  categories: ["Electronics", "Clothing", "Books", "Home & Garden"],
  
  users: [
    {
      id: 1,
      email: "admin@store.com",
      password: "admin123",
      name: "Admin User",
      role: "admin"
    },
    {
      id: 2,
      email: "user@example.com",
      password: "user123",
      name: "John Doe",
      role: "customer"
    }
  ],
  
  orders: [
    {
      id: 1001,
      userId: 2,
      date: "2024-08-25",
      status: "delivered",
      total: 229.98,
      items: [
        {productId: 1, quantity: 1, price: 199.99},
        {productId: 3, quantity: 1, price: 29.99}
      ]
    },
    {
      id: 1002,
      userId: 2,
      date: "2024-08-20",
      status: "delivered",
      total: 109.98,
      items: [
        {productId: 4, quantity: 1, price: 39.99},
        {productId: 8, quantity: 1, price: 45.99},
        {productId: 5, quantity: 1, price: 24.99}
      ]
    }
  ]
};

// Application State Management
class AppState {
  constructor() {
    this.currentView = 'homepage';
    this.currentUser = null;
    this.cart = [];
    this.filteredProducts = [...AppData.products];
    this.currentProduct = null;
    this.searchQuery = '';
    this.selectedCategory = '';
    this.maxPrice = 500;
    this.sortBy = 'name';
  }

  setCurrentView(view) {
    this.currentView = view;
    this.updateView();
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.updateUserInterface();
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.updateCartInterface();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.updateCartInterface();
  }

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeFromCart(productId);
      }
    }
    this.updateCartInterface();
  }

  clearCart() {
    this.cart = [];
    this.updateCartInterface();
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  updateView() {
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('view--active');
    });
    const targetView = document.getElementById(this.currentView);
    if (targetView) {
      targetView.classList.add('view--active');
    }
  }

  updateUserInterface() {
    const accountBtn = document.getElementById('accountBtn');
    const adminBtn = document.getElementById('adminBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const ordersTab = document.getElementById('ordersTab');

    if (this.currentUser) {
      accountBtn.textContent = this.currentUser.name;
      if (userName) userName.textContent = this.currentUser.name;
      if (userInfo) userInfo.classList.remove('hidden');
      if (ordersTab) ordersTab.classList.remove('hidden');
      
      if (this.currentUser.role === 'admin') {
        adminBtn.classList.remove('hidden');
      } else {
        adminBtn.classList.add('hidden');
      }
    } else {
      accountBtn.textContent = 'Account';
      if (userInfo) userInfo.classList.add('hidden');
      adminBtn.classList.add('hidden');
      if (ordersTab) ordersTab.classList.add('hidden');
    }
  }

  updateCartInterface() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = this.getCartItemCount();
    }
  }
}

// Initialize application state
const appState = new AppState();

// Utility Functions
const Utils = {
  formatPrice: (price) => `$${price.toFixed(2)}`,
  
  formatRating: (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    return stars.padEnd(5, '☆');
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  generateId: () => Date.now() + Math.random(),

  showNotification: (message, type = 'success') => {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');
    if (modal && messageEl) {
      messageEl.textContent = message;
      modal.classList.remove('hidden');
    }
  }
};

// Product Management
const ProductManager = {
  renderProductCard: (product) => {
    const stockStatus = product.inStock > 10 ? 'available' : 
                      product.inStock > 0 ? 'low' : 'out';
    
    return `
      <div class="product-card" onclick="viewProduct(${product.id})">
        <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
        <div class="product-card__content">
          <div class="product-card__category">${product.category}</div>
          <h3 class="product-card__title">${product.name}</h3>
          <div class="product-card__price">${Utils.formatPrice(product.price)}</div>
          <div class="product-card__rating">
            <span class="product-card__stars">${Utils.formatRating(product.rating)}</span>
            <span class="product-card__reviews">(${product.reviews})</span>
          </div>
          <div class="product-card__actions">
            <button class="btn btn--primary btn--sm" onclick="event.stopPropagation(); addToCart(${product.id})" 
                    ${stockStatus === 'out' ? 'disabled' : ''}>
              ${stockStatus === 'out' ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button class="btn btn--outline btn--sm" onclick="event.stopPropagation(); viewProduct(${product.id})">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderProductDetail: (product) => {
    const stockStatus = product.inStock > 10 ? 'available' : 
                      product.inStock > 0 ? 'low' : 'out';
    const stockText = product.inStock > 10 ? `${product.inStock} in stock` :
                     product.inStock > 0 ? `Only ${product.inStock} left!` : 'Out of stock';
    
    return `
      <img src="${product.image}" alt="${product.name}" class="product-detail__image">
      <div class="product-detail__info">
        <div class="product-detail__category">${product.category}</div>
        <h1 class="product-detail__title">${product.name}</h1>
        <div class="product-detail__price">${Utils.formatPrice(product.price)}</div>
        <div class="product-detail__rating">
          <span class="product-detail__stars">${Utils.formatRating(product.rating)}</span>
          <span>(${product.reviews} reviews)</span>
        </div>
        <p class="product-detail__description">${product.description}</p>
        <div class="product-detail__stock stock--${stockStatus}">${stockText}</div>
        <div class="product-detail__actions">
          <div class="quantity-selector">
            <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
            <input type="number" class="quantity-display" id="productQuantity" value="1" min="1" max="${product.inStock}">
            <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
          </div>
          <button class="btn btn--primary" onclick="addToCartWithQuantity(${product.id})" 
                  ${stockStatus === 'out' ? 'disabled' : ''}>
            ${stockStatus === 'out' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
  },

  filterAndSortProducts: () => {
    let filtered = [...AppData.products];
    
    // Apply search filter
    if (appState.searchQuery) {
      const query = appState.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (appState.selectedCategory) {
      filtered = filtered.filter(product => product.category === appState.selectedCategory);
    }
    
    // Apply price filter
    filtered = filtered.filter(product => product.price <= appState.maxPrice);
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (appState.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    appState.filteredProducts = filtered;
    return filtered;
  }
};

// Global Navigation Functions
window.showHomepage = function() {
  appState.setCurrentView('homepage');
  renderHomepage();
};

window.showProducts = function(category = '') {
  appState.selectedCategory = category;
  appState.setCurrentView('products');
  renderProducts();
};

window.showCart = function() {
  appState.setCurrentView('cart');
  renderCart();
};

window.showCheckout = function() {
  if (appState.cart.length === 0) {
    Utils.showNotification('Your cart is empty!', 'error');
    return;
  }
  appState.setCurrentView('checkout');
  renderCheckout();
};

window.showAccount = function() {
  appState.setCurrentView('account');
  renderAccount();
};

window.toggleAccount = function() {
  showAccount();
};

window.showAdmin = function() {
  if (!appState.currentUser || appState.currentUser.role !== 'admin') {
    Utils.showNotification('Access denied. Admin privileges required.', 'error');
    return;
  }
  appState.setCurrentView('admin');
  renderAdmin();
};

window.viewProduct = function(productId) {
  const product = AppData.products.find(p => p.id === productId);
  if (product) {
    appState.currentProduct = product;
    appState.setCurrentView('productDetail');
    renderProductDetail();
  }
};

// Rendering Functions
function renderHomepage() {
  // Render categories
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (categoriesGrid) {
    const categoryIcons = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Books': '📚',
      'Home & Garden': '🏠'
    };
    
    categoriesGrid.innerHTML = AppData.categories.map(category => `
      <div class="category-card" onclick="showProducts('${category}')">
        <div class="category-card__icon">${categoryIcons[category]}</div>
        <h3 class="category-card__title">${category}</h3>
      </div>
    `).join('');
  }
  
  // Render featured products
  const featuredProducts = document.getElementById('featuredProducts');
  if (featuredProducts) {
    const featured = AppData.products.filter(p => p.featured);
    featuredProducts.innerHTML = featured.map(ProductManager.renderProductCard).join('');
  }
}

function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const priceRange = document.getElementById('priceRange');
  const priceRangeValue = document.getElementById('priceRangeValue');
  
  // Update filters
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
      AppData.categories.map(cat => `<option value="${cat}" ${cat === appState.selectedCategory ? 'selected' : ''}>${cat}</option>`).join('');
  }
  
  if (sortFilter) sortFilter.value = appState.sortBy;
  if (priceRange) priceRange.value = appState.maxPrice;
  if (priceRangeValue) priceRangeValue.textContent = appState.maxPrice;
  
  // Filter and render products
  const filtered = ProductManager.filterAndSortProducts();
  if (productsGrid) {
    productsGrid.innerHTML = filtered.length > 0 
      ? filtered.map(ProductManager.renderProductCard).join('')
      : '<div class="cart--empty"><p>No products found matching your criteria.</p></div>';
  }
}

function renderProductDetail() {
  const productDetailContent = document.getElementById('productDetailContent');
  if (productDetailContent && appState.currentProduct) {
    productDetailContent.innerHTML = ProductManager.renderProductDetail(appState.currentProduct);
  }
}

function renderCart() {
  const cartContent = document.getElementById('cartContent');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (!cartContent) return;
  
  if (appState.cart.length === 0) {
    cartContent.innerHTML = '<div class="cart--empty"><p>Your cart is empty</p></div>';
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    cartContent.innerHTML = appState.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__info">
          <h4 class="cart-item__title">${item.name}</h4>
          <div class="cart-item__price">${Utils.formatPrice(item.price)} each</div>
        </div>
        <div class="cart-item__controls">
          <div class="quantity-selector">
            <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
          <div class="cart-item__subtotal">${Utils.formatPrice(item.price * item.quantity)}</div>
          <button class="cart-item__remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `).join('');
    if (checkoutBtn) checkoutBtn.disabled = false;
  }
  
  if (cartTotal) cartTotal.textContent = Utils.formatPrice(appState.getCartTotal());
}

function renderCheckout() {
  const checkoutSummary = document.getElementById('checkoutSummary');
  if (checkoutSummary) {
    const items = appState.cart.map(item => `
      <div class="checkout-summary-item">
        <span>${item.name} x ${item.quantity}</span>
        <span>${Utils.formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('');
    
    checkoutSummary.innerHTML = items + `
      <div class="checkout-summary-item">
        <span>Total</span>
        <span>${Utils.formatPrice(appState.getCartTotal())}</span>
      </div>
    `;
  }
}

function renderAccount() {
  if (appState.currentUser) {
    showAccountTab('orders');
    renderOrderHistory();
  } else {
    showAccountTab('login');
  }
}

function renderOrderHistory() {
  const orderHistory = document.getElementById('orderHistory');
  if (!orderHistory) return;
  
  const userOrders = AppData.orders.filter(order => order.userId === appState.currentUser?.id);
  
  if (userOrders.length === 0) {
    orderHistory.innerHTML = '<div class="cart--empty"><p>No orders found</p></div>';
  } else {
    orderHistory.innerHTML = userOrders.map(order => {
      const orderItems = order.items.map(item => {
        const product = AppData.products.find(p => p.id === item.productId);
        return product ? `${product.name} x ${item.quantity}` : `Product ${item.productId} x ${item.quantity}`;
      }).join(', ');
      
      return `
        <div class="order-item">
          <div class="order-item__header">
            <span class="order-item__id">Order #${order.id}</span>
            <span class="order-item__date">${order.date}</span>
            <span class="order-item__status order-item__status--${order.status}">${order.status}</span>
          </div>
          <div class="order-item__items">${orderItems}</div>
          <div class="order-item__total">Total: ${Utils.formatPrice(order.total)}</div>
        </div>
      `;
    }).join('');
  }
}

function renderAdmin() {
  renderAdminProducts();
  renderAdminOrders();
  renderAdminAnalytics();
}

function renderAdminProducts() {
  const adminProductsTable = document.getElementById('adminProductsTable');
  if (adminProductsTable) {
    adminProductsTable.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${AppData.products.map(product => `
            <tr>
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td>${product.category}</td>
              <td>${Utils.formatPrice(product.price)}</td>
              <td>${product.inStock}</td>
              <td class="table__actions">
                <button class="btn btn--sm btn--outline" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn--sm btn--danger" onclick="deleteProduct(${product.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

function renderAdminOrders() {
  const adminOrdersTable = document.getElementById('adminOrdersTable');
  if (adminOrdersTable) {
    adminOrdersTable.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${AppData.orders.map(order => {
            const customer = AppData.users.find(u => u.id === order.userId);
            return `
              <tr>
                <td>#${order.id}</td>
                <td>${customer ? customer.name : 'Unknown'}</td>
                <td>${order.date}</td>
                <td>${order.status}</td>
                <td>${Utils.formatPrice(order.total)}</td>
                <td class="table__actions">
                  <button class="btn btn--sm btn--outline" onclick="updateOrderStatus(${order.id})">Update Status</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
}

function renderAdminAnalytics() {
  const totalProducts = document.getElementById('totalProducts');
  const totalOrders = document.getElementById('totalOrders');
  const totalRevenue = document.getElementById('totalRevenue');
  
  if (totalProducts) totalProducts.textContent = AppData.products.length;
  if (totalOrders) totalOrders.textContent = AppData.orders.length;
  if (totalRevenue) {
    const revenue = AppData.orders.reduce((sum, order) => sum + order.total, 0);
    totalRevenue.textContent = Utils.formatPrice(revenue);
  }
}

// Global Event Handlers
window.handleSearch = function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    appState.searchQuery = searchInput.value.trim();
    if (appState.currentView !== 'products') {
      showProducts();
    } else {
      renderProducts();
    }
  }
};

window.addToCart = function(productId) {
  const product = AppData.products.find(p => p.id === productId);
  if (product && product.inStock > 0) {
    appState.addToCart(product);
    Utils.showNotification(`${product.name} added to cart!`);
  } else {
    Utils.showNotification('Product is out of stock!', 'error');
  }
};

window.addToCartWithQuantity = function(productId) {
  const product = AppData.products.find(p => p.id === productId);
  const quantityInput = document.getElementById('productQuantity');
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
  
  if (product && product.inStock >= quantity) {
    appState.addToCart(product, quantity);
    Utils.showNotification(`${product.name} (${quantity}) added to cart!`);
  } else {
    Utils.showNotification('Insufficient stock!', 'error');
  }
};

window.removeFromCart = function(productId) {
  appState.removeFromCart(productId);
  renderCart();
  Utils.showNotification('Item removed from cart');
};

window.updateCartItemQuantity = function(productId, newQuantity) {
  appState.updateCartQuantity(productId, newQuantity);
  renderCart();
};

window.changeQuantity = function(delta) {
  const quantityInput = document.getElementById('productQuantity');
  if (quantityInput && appState.currentProduct) {
    const currentQuantity = parseInt(quantityInput.value) || 1;
    const newQuantity = Math.max(1, Math.min(currentQuantity + delta, appState.currentProduct.inStock));
    quantityInput.value = newQuantity;
  }
};

window.showAccountTab = function(tabName) {
  // Hide all tabs
  document.querySelectorAll('.account__content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.account__tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById(`${tabName}Tab`);
  if (targetTab) {
    targetTab.classList.remove('hidden');
  }
};

window.showAdminTab = function(tabName) {
  // Hide all admin tabs
  document.querySelectorAll('.admin__content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.admin__tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (targetTab) {
    targetTab.classList.remove('hidden');
  }
};

window.login = function(email, password) {
  const user = AppData.users.find(u => u.email === email && u.password === password);
  if (user) {
    appState.setCurrentUser(user);
    Utils.showNotification(`Welcome back, ${user.name}!`);
    showHomepage();
  } else {
    Utils.showNotification('Invalid credentials', 'error');
  }
};

window.register = function(name, email, password) {
  const existingUser = AppData.users.find(u => u.email === email);
  if (existingUser) {
    Utils.showNotification('Email already registered', 'error');
    return;
  }
  
  const newUser = {
    id: Utils.generateId(),
    name,
    email,
    password,
    role: 'customer'
  };
  
  AppData.users.push(newUser);
  appState.setCurrentUser(newUser);
  Utils.showNotification(`Welcome, ${name}! Account created successfully.`);
  showHomepage();
};

window.logout = function() {
  appState.setCurrentUser(null);
  Utils.showNotification('Logged out successfully');
  showHomepage();
};

window.placeOrder = function(orderData) {
  if (appState.cart.length === 0) {
    Utils.showNotification('Cart is empty!', 'error');
    return;
  }
  
  const newOrder = {
    id: Utils.generateId(),
    userId: appState.currentUser?.id || null,
    date: new Date().toISOString().split('T')[0],
    status: 'processing',
    total: appState.getCartTotal(),
    items: appState.cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    customerInfo: orderData
  };
  
  AppData.orders.push(newOrder);
  appState.clearCart();
  Utils.showNotification(`Order #${newOrder.id} placed successfully!`);
  showHomepage();
};

// Modal Management
window.showModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
};

window.showAddProductForm = function() {
  showModal('addProductModal');
};

// Admin Functions
window.addProduct = function(productData) {
  const newProduct = {
    id: Utils.generateId(),
    ...productData,
    rating: 4.0,
    reviews: 0,
    featured: false
  };
  
  AppData.products.push(newProduct);
  Utils.showNotification('Product added successfully!');
  renderAdminProducts();
  closeModal('addProductModal');
};

window.deleteProduct = function(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    const index = AppData.products.findIndex(p => p.id === productId);
    if (index > -1) {
      AppData.products.splice(index, 1);
      Utils.showNotification('Product deleted successfully!');
      renderAdminProducts();
    }
  }
};

window.editProduct = function(productId) {
  Utils.showNotification('Edit functionality would be implemented here', 'info');
};

window.updateOrderStatus = function(orderId) {
  const order = AppData.orders.find(o => o.id === orderId);
  if (order) {
    const statuses = ['processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    order.status = statuses[nextIndex];
    Utils.showNotification(`Order #${orderId} status updated to ${order.status}`);
    renderAdminOrders();
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  showHomepage();
  appState.updateCartInterface();
  
  // Logo click handler
  const logo = document.querySelector('.nav__logo');
  if (logo) {
    logo.addEventListener('click', showHomepage);
    logo.style.cursor = 'pointer';
  }
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(handleSearch, 300));
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  // Filter event listeners
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function(e) {
      appState.selectedCategory = e.target.value;
      renderProducts();
    });
  }
  
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', function(e) {
      appState.sortBy = e.target.value;
      renderProducts();
    });
  }
  
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', function(e) {
      appState.maxPrice = parseInt(e.target.value);
      const priceRangeValue = document.getElementById('priceRangeValue');
      if (priceRangeValue) priceRangeValue.textContent = appState.maxPrice;
      renderProducts();
    });
  }
  
  // Form submissions
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      login(email, password);
    });
  }
  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      register(name, email, password);
    });
  }
  
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const orderData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value
      };
      placeOrder(orderData);
    });
  }
  
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        inStock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value
      };
      addProduct(productData);
      e.target.reset();
    });
  }
  
  console.log('TechStore E-commerce Application Loaded');
  console.log('Features: Product Catalog, Shopping Cart, User Auth, Admin Dashboard');
  console.log('Built with: Vanilla JavaScript ES6+, CSS Grid/Flexbox, Semantic HTML5');
});

async function fetchRecommendations(userId) {
  // Placeholder: call to AI recommendation backend
  const response = await fetch(`/api/recommendations?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  return await response.json();
}

async function renderRecommendations(userId) {
  try {
    const recommended = await fetchRecommendations(userId);
    const container = document.getElementById("recommendedProducts");
    container.innerHTML = recommended.map(p => ProductManager.renderProductCard(p)).join('');
  } catch (error) {
    console.error("Recommendation error:", error);
  }
}


if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;

  document.getElementById('voiceSearchBtn').addEventListener('click', () => recognition.start());

  recognition.onresult = event => {
    appState.searchQuery = event.results[0][0].transcript;
    // Optionally update search input UI if exists
    document.querySelector('.nav__search-input').value = appState.searchQuery;
    ProductManager.filterAndRenderProducts(); // Assuming this exists to render filtered
  };

  recognition.onerror = event => console.error('Voice recognition error:', event.error);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  });
}
