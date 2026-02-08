'use strict';

// ===== CONFIGURATION =====
const CONFIG = {
    API_URL: 'http://localhost:5000/api',
    TOKEN_KEY: 'nexusshop_admin_token',
    THEME_KEY: 'nexusshop_admin_theme',
    ITEMS_PER_PAGE: 20,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// ===== GLOBAL STATE =====
const state = {
    currentUser: null,
    products: [],
    orders: [],
    customers: [],
    adminUsers: [],
    selectedImages: [],
    currentProduct: null,
    filters: {
        products: { search: '', category: '', status: '', stock: '' },
        orders: { search: '', status: '', date: 'all' },
        customers: { search: '' }
    },
    pagination: {
        products: { current: 1, total: 1 },
        orders: { current: 1, total: 1 },
        customers: { current: 1, total: 1 }
    }
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format datetime
    formatDateTime(date) {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    // Sanitize HTML
    sanitize(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Generate ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Get token
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    // Set token
    setToken(token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
    },

    // Remove token
    removeToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
    },

    // Show loading
    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    },

    // Hide loading
    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }
};

// ===== API SERVICE =====
const api = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_URL}${endpoint}`;
        const token = utils.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    login(credentials) {
        return this.request('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    getCurrentUser() {
        return this.request('/admin/me');
    },

    // Products
    getProducts(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/admin/products${query ? '?' + query : ''}`);
    },

    getProduct(id) {
        return this.request(`/admin/products/${id}`);
    },

    createProduct(formData) {
        return this.request('/admin/products', {
            method: 'POST',
            body: formData
        });
    },

    updateProduct(id, formData) {
        return this.request(`/admin/products/${id}`, {
            method: 'PUT',
            body: formData
        });
    },

    deleteProduct(id) {
        return this.request(`/admin/products/${id}`, {
            method: 'DELETE'
        });
    },

    updateStock(id, data) {
        return this.request(`/admin/products/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    // Orders
    getOrders(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/admin/orders${query ? '?' + query : ''}`);
    },

    updateOrderStatus(id, data) {
        return this.request(`/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    // Dashboard
    getDashboardStats() {
        return this.request('/admin/dashboard/stats');
    },

    // Categories
    getCategories() {
        return this.request('/admin/categories');
    },

    // Users
    getAdminUsers() {
        return this.request('/admin/users');
    }
};

// ===== UI FUNCTIONS =====
const ui = {
    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${utils.sanitize(message)}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    },

    // Show confirmation dialog
    confirm(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Confirm Action</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-danger" id="confirm-btn">Confirm</button>
                </div>
            </div>
        `;

        document.getElementById('modals-container').appendChild(modal);

        modal.querySelector('#confirm-btn').addEventListener('click', () => {
            onConfirm();
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    // Update stat card
    updateStat(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
};

// ===== PAGE MANAGEMENT =====
const pageManager = {
    init() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.showPage(page);
            });
        });

        // Load initial page
        this.showPage('dashboard');
    },

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show requested page
        const page = document.getElementById(`${pageName}-page`);
        if (page) {
            page.classList.add('active');

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === pageName) {
                    link.classList.add('active');
                }
            });

            // Load page data
            this.loadPageData(pageName);
        }
    },

    async loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                await dashboard.load();
                break;
            case 'products':
                await products.load();
                break;
            case 'add-product':
                products.initForm();
                break;
            case 'orders':
                await orders.load();
                break;
            case 'customers':
                await customers.load();
                break;
            case 'users':
                await adminUsers.load();
                break;
        }
    }
};

// ===== DASHBOARD MODULE =====
const dashboard = {
    async load() {
        try {
            utils.showLoading();
            const data = await api.getDashboardStats();

            // Update stats
            ui.updateStat('stat-total-products', data.stats.products.total);
            ui.updateStat('stat-total-orders', data.stats.orders.total);
            ui.updateStat('stat-revenue', utils.formatCurrency(data.stats.revenue.total));
            ui.updateStat('stat-customers', data.stats.customers || 0);

            // Update nav badges
            document.getElementById('products-count').textContent = data.stats.products.total;
            document.getElementById('pending-orders').textContent = data.stats.orders.pending;

            // Load recent orders
            this.loadRecentOrders(data.recentOrders);

            // Load low stock items
            this.loadLowStockItems(data.stats.products.lowStock);

        } catch (error) {
            console.error('Dashboard error:', error);
            ui.showToast('Failed to load dashboard', 'error');
        } finally {
            utils.hideLoading();
        }
    },

    loadRecentOrders(orders) {
        const tbody = document.getElementById('recent-orders-table');
        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No recent orders</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><strong>${order.orderNumber}</strong></td>
                <td>${order.customer.name}</td>
                <td>${order.items.length} items</td>
                <td><strong>${utils.formatCurrency(order.totals.total)}</strong></td>
                <td><span class="badge badge-${this.getStatusClass(order.status)}">${order.status}</span></td>
                <td>${utils.formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="orders.view('${order._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    loadLowStockItems(count) {
        document.getElementById('low-stock-count').textContent = count || 0;
        const container = document.getElementById('low-stock-items');

        if (count > 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${count} products are running low on stock
                </div>
                <button class="btn btn-outline btn-sm" onclick="showPage('products')">
                    View Products
                </button>
            `;
        } else {
            container.innerHTML = '<p class="text-muted">All products are in stock</p>';
        }
    },

    getStatusClass(status) {
        const classes = {
            'pending': 'warning',
            'processing': 'info',
            'shipped': 'primary',
            'delivered': 'success',
            'cancelled': 'danger'
        };
        return classes[status] || 'info';
    }
};

// ===== PRODUCTS MODULE =====
const products = {
    async load() {
        this.setupFilters();
        await this.fetchProducts();
    },

    setupFilters() {
        // Search
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => {
                state.filters.products.search = searchInput.value;
                this.fetchProducts();
            }, CONFIG.DEBOUNCE_DELAY));
        }

        // Category filter
        const categoryFilter = document.getElementById('product-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                state.filters.products.category = categoryFilter.value;
                this.fetchProducts();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('product-status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                state.filters.products.status = statusFilter.value;
                this.fetchProducts();
            });
        }

        // Stock filter
        const stockFilter = document.getElementById('product-stock-filter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => {
                state.filters.products.stock = stockFilter.value;
                this.fetchProducts();
            });
        }
    },

    async fetchProducts() {
        try {
            utils.showLoading();
            const params = {
                page: state.pagination.products.current,
                limit: CONFIG.ITEMS_PER_PAGE,
                ...state.filters.products
            };

            const data = await api.getProducts(params);
            state.products = data.products;
            state.pagination.products.total = data.totalPages;

            this.renderProducts();
        } catch (error) {
            console.error('Fetch products error:', error);
            ui.showToast('Failed to load products', 'error');
        } finally {
            utils.hideLoading();
        }
    },

    renderProducts() {
        const tbody = document.getElementById('products-table');
        if (!state.products || state.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No products found</td></tr>';
            return;
        }

        tbody.innerHTML = state.products.map(product => `
            <tr>
                <td><input type="checkbox" value="${product._id}"></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${product.images[0]?.url || '/placeholder.jpg'}" 
                             style="width: 50px; height: 50px; border-radius: 0.5rem; object-fit: cover;"
                             alt="${product.name}">
                        <div>
                            <strong>${product.name}</strong>
                            <div class="text-muted" style="font-size: 0.75rem;">${product.brand}</div>
                        </div>
                    </div>
                </td>
                <td>${product.sku}</td>
                <td>${product.category}</td>
                <td><strong>${utils.formatCurrency(product.price)}</strong></td>
                <td>
                    <span class="badge ${product.stock <= 10 ? 'badge-warning' : 'badge-success'}">
                        ${product.stock}
                    </span>
                </td>
                <td>
                    <span class="badge badge-${this.getStatusBadge(product.status)}">
                        ${product.status}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-outline" onclick="products.edit('${product._id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="products.view('${product._id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="products.delete('${product._id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    initForm() {
        // Reset form
        document.getElementById('product-form')?.reset();
        state.selectedImages = [];
        document.getElementById('image-preview-grid').innerHTML = '';

        // Setup image upload
        this.setupImageUpload();
    },

    setupImageUpload() {
        const uploadArea = document.getElementById('image-upload-area');
        const fileInput = document.getElementById('product-images');

        if (!uploadArea || !fileInput) return;

        uploadArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            this.handleImages(e.target.files);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border)';
            this.handleImages(e.dataTransfer.files);
        });
    },

    handleImages(files) {
        Array.from(files).forEach(file => {
            if (!CONFIG.ALLOWED_IMAGES.includes(file.type)) {
                ui.showToast('Only image files are allowed', 'error');
                return;
            }

            if (file.size > CONFIG.MAX_FILE_SIZE) {
                ui.showToast('File size must be less than 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                state.selectedImages.push({
                    file: file,
                    preview: e.target.result
                });
                this.renderImagePreviews();
            };
            reader.readAsDataURL(file);
        });
    },

    renderImagePreviews() {
        const container = document.getElementById('image-preview-grid');
        container.innerHTML = state.selectedImages.map((img, index) => `
            <div class="image-preview-item">
                <img src="${img.preview}" alt="Preview ${index + 1}">
                <button type="button" class="image-remove-btn" onclick="products.removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    },

    removeImage(index) {
        state.selectedImages.splice(index, 1);
        this.renderImagePreviews();
    },

    edit(id) {
        state.currentProduct = id;
        document.getElementById('product-form-title').textContent = 'Edit Product';
        showPage('add-product');
        // Load product data and populate form
    },

    view(id) {
        // Show product details modal
        ui.showToast('Product details view - Coming soon', 'info');
    },

    delete(id) {
        ui.confirm('Are you sure you want to delete this product?', async () => {
            try {
                await api.deleteProduct(id);
                ui.showToast('Product deleted successfully', 'success');
                await this.fetchProducts();
            } catch (error) {
                ui.showToast('Failed to delete product', 'error');
            }
        });
    },

    getStatusBadge(status) {
        const badges = {
            'draft': 'warning',
            'pending': 'info',
            'approved': 'primary',
            'published': 'success',
            'archived': 'danger'
        };
        return badges[status] || 'info';
    }
};

// ===== ORDERS MODULE =====
const orders = {
    async load() {
        await this.fetchOrders();
        this.setupFilters();
    },

    setupFilters() {
        const searchInput = document.getElementById('order-search');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => {
                state.filters.orders.search = searchInput.value;
                this.fetchOrders();
            }, CONFIG.DEBOUNCE_DELAY));
        }

        const statusFilter = document.getElementById('order-status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                state.filters.orders.status = statusFilter.value;
                this.fetchOrders();
            });
        }

        const dateFilter = document.getElementById('order-date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                state.filters.orders.date = dateFilter.value;
                this.fetchOrders();
            });
        }
    },

    async fetchOrders() {
        try {
            utils.showLoading();
            const data = await api.getOrders(state.filters.orders);
            state.orders = data.orders;
            this.renderOrders();
        } catch (error) {
            console.error('Fetch orders error:', error);
            ui.showToast('Failed to load orders', 'error');
        } finally {
            utils.hideLoading();
        }
    },

    renderOrders() {
        const tbody = document.getElementById('orders-table');
        if (!state.orders || state.orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = state.orders.map(order => `
            <tr>
                <td><strong>${order.orderNumber}</strong></td>
                <td>
                    <div>
                        <strong>${order.customer.name}</strong>
                        <div class="text-muted" style="font-size: 0.75rem;">${order.customer.email}</div>
                    </div>
                </td>
                <td>${order.items.length} items</td>
                <td><strong>${utils.formatCurrency(order.totals.total)}</strong></td>
                <td><span class="badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}">${order.paymentStatus}</span></td>
                <td><span class="badge badge-${this.getStatusClass(order.status)}">${order.status}</span></td>
                <td>${utils.formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="orders.view('${order._id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="orders.updateStatus('${order._id}')" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    view(id) {
        ui.showToast('Order details view - Coming soon', 'info');
    },

    updateStatus(id) {
        ui.showToast('Update order status - Coming soon', 'info');
    },

    getStatusClass(status) {
        const classes = {
            'pending': 'warning',
            'processing': 'info',
            'shipped': 'primary',
            'delivered': 'success',
            'cancelled': 'danger'
        };
        return classes[status] || 'info';
    }
};

// ===== CUSTOMERS MODULE =====
const customers = {
    async load() {
        await this.fetchCustomers();
    },

    async fetchCustomers() {
        try {
            utils.showLoading();
            // Mock data for now
            state.customers = this.generateMockCustomers();
            this.renderCustomers();
        } catch (error) {
            ui.showToast('Failed to load customers', 'error');
        } finally {
            utils.hideLoading();
        }
    },

    generateMockCustomers() {
        return [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                orders: 15,
                totalSpent: 2500.00,
                joinedDate: '2023-01-15'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+1234567891',
                orders: 8,
                totalSpent: 1200.00,
                joinedDate: '2023-03-20'
            }
        ];
    },

    renderCustomers() {
        const tbody = document.getElementById('customers-table');
        if (!state.customers || state.customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No customers found</td></tr>';
            return;
        }

        tbody.innerHTML = state.customers.map(customer => `
            <tr>
                <td>
                    <div>
                        <strong>${customer.name}</strong>
                    </div>
                </td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.orders}</td>
                <td><strong>${utils.formatCurrency(customer.totalSpent)}</strong></td>
                <td>${utils.formatDate(customer.joinedDate)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="customers.view('${customer.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    view(id) {
        ui.showToast('Customer details - Coming soon', 'info');
    }
};

// ===== ADMIN USERS MODULE =====
const adminUsers = {
    async load() {
        await this.fetchUsers();
    },

    async fetchUsers() {
        try {
            utils.showLoading();
            const data = await api.getAdminUsers();
            state.adminUsers = data.users;
            this.renderUsers();
        } catch (error) {
            ui.showToast('Failed to load admin users', 'error');
        } finally {
            utils.hideLoading();
        }
    },

    renderUsers() {
        const tbody = document.getElementById('admin-users-table');
        if (!state.adminUsers || state.adminUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No admin users found</td></tr>';
            return;
        }

        tbody.innerHTML = state.adminUsers.map(user => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.875rem;">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <strong>${user.name}</strong>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="badge badge-primary">${user.role}</span></td>
                <td>${this.formatPermissions(user.permissions)}</td>
                <td><span class="badge ${user.isActive ? 'badge-success' : 'badge-danger'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${user.lastLogin ? utils.formatDateTime(user.lastLogin) : 'Never'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="adminUsers.edit('${user._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    formatPermissions(permissions) {
        const count = Object.values(permissions).filter(p => p).length;
        return `${count} permissions`;
    },

    edit(id) {
        ui.showToast('Edit admin user - Coming soon', 'info');
    }
};

// ===== THEME MANAGEMENT =====
const theme = {
    init() {
        const current = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
        document.documentElement.setAttribute('data-theme', current);

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggle();
        });
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(CONFIG.THEME_KEY, newTheme);

        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
};

// ===== SIDEBAR MANAGEMENT =====
const sidebar = {
    init() {
        document.getElementById('menu-toggle')?.addEventListener('click', () => {
            this.toggle();
        });
    },

    toggle() {
        document.querySelector('.sidebar').classList.toggle('active');
    }
};

// ===== GLOBAL FUNCTIONS =====
function showPage(pageName) {
    pageManager.showPage(pageName);
}

async function saveProduct() {
    const form = document.getElementById('product-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    // Add images
    state.selectedImages.forEach(img => {
        formData.append('images', img.file);
    });

    try {
        utils.showLoading();

        if (state.currentProduct) {
            await api.updateProduct(state.currentProduct, formData);
            ui.showToast('Product updated successfully', 'success');
        } else {
            await api.createProduct(formData);
            ui.showToast('Product created successfully', 'success');
        }

        showPage('products');
    } catch (error) {
        ui.showToast(error.message || 'Failed to save product', 'error');
    } finally {
        utils.hideLoading();
    }
}

function addCustomer() {
    ui.showToast('Add customer - Coming soon', 'info');
}

function addAdminUser() {
    ui.showToast('Add admin user - Coming soon', 'info');
}

function saveSettings() {
    ui.showToast('Settings saved successfully', 'success');
}

function exportProducts() {
    ui.showToast('Export started - Coming soon', 'info');
}

function logout() {
    ui.confirm('Are you sure you want to logout?', () => {
        utils.removeToken();
        window.location.href = 'login.html';
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 NexusShop Admin Back Office Initialized');

    // Check authentication
    if (!utils.getToken()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize modules
    theme.init();
    sidebar.init();
    pageManager.init();

    // Load current user
    try {
        const data = await api.getCurrentUser();
        state.currentUser = data.admin;

        document.getElementById('current-user-name').textContent = data.admin.name;
        document.getElementById('current-user-role').textContent = data.admin.role;
    } catch (error) {
        console.error('Auth error:', error);
        utils.removeToken();
        window.location.href = 'login.html';
    }

    console.log('✅ Admin Back Office Ready');
});
