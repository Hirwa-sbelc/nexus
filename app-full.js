// =====================================
// NexusShop - Advanced E-commerce Application
// Version: 2.0.0
// Features: Multi-language, Theme Management, Advanced Cart, Analytics, Wishlist, Reviews, etc.
// =====================================

'use strict';

// ===== GLOBAL CONFIGURATION =====
const CONFIG = {
    APP_NAME: 'NexusShop',
    VERSION: '2.0.0',
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'light',
    CURRENCY: 'USD',
    CURRENCY_SYMBOL: '$',
    TAX_RATE: 0.08,
    FREE_SHIPPING_THRESHOLD: 50,
    SHIPPING_COST: 5.99,
    ITEMS_PER_PAGE: 12,
    SEARCH_DEBOUNCE: 300,
    TOAST_DURATION: 3000,
    ANIMATION_DURATION: 300,
    LOCAL_STORAGE_PREFIX: 'nexusshop_',
    API_ENDPOINT: '/api', // For future backend integration
    MAX_CART_ITEMS: 99,
    MIN_SEARCH_LENGTH: 2,
    MAX_WISHLIST_ITEMS: 100
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Generate unique ID
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Format currency
    formatCurrency(amount) {
        return `${CONFIG.CURRENCY_SYMBOL}${parseFloat(amount).toFixed(2)}`;
    },

    // Format date
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Format time
    formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Debounce function
    debounce(func, wait) {
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

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Sanitize HTML
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    // Calculate discount percentage
    calculateDiscount(originalPrice, currentPrice) {
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    },

    // Truncate text
    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    // Get random item from array
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Shuffle array
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(CONFIG.LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },
        get(key) {
            try {
                const item = localStorage.getItem(CONFIG.LOCAL_STORAGE_PREFIX + key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage error:', e);
                return null;
            }
        },
        remove(key) {
            localStorage.removeItem(CONFIG.LOCAL_STORAGE_PREFIX + key);
        },
        clear() {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CONFIG.LOCAL_STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        }
    }
};

// ===== LANGUAGE SYSTEM =====
class LanguageManager {
    constructor() {
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.shop': 'Shop',
                'nav.products': 'Products',
                'nav.categories': 'Categories',
                'nav.deals': 'Deals',
                'nav.about': 'About',
                'nav.contact': 'Contact',
                'nav.admin': 'Admin',

                // Search
                'search.placeholder': 'Search products...',
                'search.no_results': 'No results found',
                'search.searching': 'Searching...',

                // Cart
                'cart.title': 'Shopping Cart',
                'cart.empty': 'Your cart is empty',
                'cart.subtotal': 'Subtotal',
                'cart.shipping': 'Shipping',
                'cart.tax': 'Tax',
                'cart.total': 'Total',
                'cart.checkout': 'Checkout',
                'cart.continue_shopping': 'Continue Shopping',
                'cart.view_cart': 'View Cart',
                'cart.clear': 'Clear Cart',
                'cart.item_added': 'Item added to cart',
                'cart.item_removed': 'Item removed from cart',
                'cart.quantity_updated': 'Quantity updated',
                'cart.max_quantity': 'Maximum quantity reached',

                // Products
                'products.featured': 'Featured Products',
                'products.new': 'New Arrivals',
                'products.sale': 'On Sale',
                'products.all': 'All Products',
                'products.add_to_cart': 'Add to Cart',
                'products.view_details': 'View Details',
                'products.out_of_stock': 'Out of Stock',
                'products.in_stock': 'In Stock',
                'products.quick_view': 'Quick View',
                'products.add_to_wishlist': 'Add to Wishlist',
                'products.compare': 'Compare',
                'products.share': 'Share',

                // Filters
                'filters.title': 'Filters',
                'filters.clear_all': 'Clear All',
                'filters.apply': 'Apply Filters',
                'filters.price_range': 'Price Range',
                'filters.category': 'Category',
                'filters.rating': 'Rating',
                'filters.brand': 'Brand',
                'filters.color': 'Color',
                'filters.size': 'Size',

                // Sort
                'sort.default': 'Default',
                'sort.price_low': 'Price: Low to High',
                'sort.price_high': 'Price: High to Low',
                'sort.name_az': 'Name: A to Z',
                'sort.name_za': 'Name: Z to A',
                'sort.rating': 'Highest Rated',
                'sort.newest': 'Newest First',
                'sort.popular': 'Most Popular',

                // Auth
                'auth.login': 'Login',
                'auth.register': 'Register',
                'auth.logout': 'Logout',
                'auth.email': 'Email Address',
                'auth.password': 'Password',
                'auth.confirm_password': 'Confirm Password',
                'auth.forgot_password': 'Forgot Password?',
                'auth.remember_me': 'Remember Me',
                'auth.no_account': "Don't have an account?",
                'auth.have_account': 'Already have an account?',
                'auth.sign_in': 'Sign In',
                'auth.sign_up': 'Sign Up',

                // Profile
                'profile.my_account': 'My Account',
                'profile.orders': 'My Orders',
                'profile.wishlist': 'Wishlist',
                'profile.addresses': 'Addresses',
                'profile.settings': 'Settings',
                'profile.logout': 'Logout',

                // Common
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.warning': 'Warning',
                'common.info': 'Information',
                'common.ok': 'OK',
                'common.cancel': 'Cancel',
                'common.save': 'Save',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.view': 'View',
                'common.close': 'Close',
                'common.search': 'Search',
                'common.filter': 'Filter',
                'common.sort': 'Sort',
                'common.more': 'More',
                'common.less': 'Less',
                'common.show_more': 'Show More',
                'common.show_less': 'Show Less',

                // Messages
                'message.free_shipping': 'Free shipping on orders over $50',
                'message.welcome': 'Welcome to NexusShop',
                'message.thank_you': 'Thank you for shopping with us',
                'message.order_success': 'Order placed successfully',
                'message.order_error': 'Error placing order',

                // Footer
                'footer.about': 'About Us',
                'footer.contact': 'Contact',
                'footer.terms': 'Terms of Service',
                'footer.privacy': 'Privacy Policy',
                'footer.faq': 'FAQ',
                'footer.support': 'Customer Support',
                'footer.newsletter': 'Newsletter',
                'footer.subscribe': 'Subscribe',
                'footer.email_placeholder': 'Your email address',

                // Checkout
                'checkout.title': 'Checkout',
                'checkout.shipping_address': 'Shipping Address',
                'checkout.billing_address': 'Billing Address',
                'checkout.payment_method': 'Payment Method',
                'checkout.review_order': 'Review Order',
                'checkout.place_order': 'Place Order',
                'checkout.order_summary': 'Order Summary',

                // Reviews
                'review.write': 'Write a Review',
                'review.rating': 'Rating',
                'review.comment': 'Comment',
                'review.submit': 'Submit Review',
                'review.helpful': 'Helpful',
                'review.not_helpful': 'Not Helpful',

                // Chat
                'chat.title': 'Customer Support',
                'chat.online': 'Online',
                'chat.offline': 'Offline',
                'chat.placeholder': 'Type your message...',
                'chat.send': 'Send'
            },
            rw: {
                // Navigation
                'nav.home': 'Ahabanza',
                'nav.shop': 'Gura',
                'nav.products': 'Ibicuruzwa',
                'nav.categories': 'Ibyiciro',
                'nav.deals': 'Amasezerano',
                'nav.about': 'Abo turi',
                'nav.contact': 'Twandikire',
                'nav.admin': 'Umuyobozi',

                // Search
                'search.placeholder': 'Shakisha ibicuruzwa...',
                'search.no_results': 'Nta bisubizo byabonetse',
                'search.searching': 'Urashakisha...',

                // Cart
                'cart.title': "Igare y'ibicuruzwa",
                'cart.empty': 'Igare yawe ntirimwo',
                'cart.subtotal': 'Igiteranyo',
                'cart.shipping': 'Kohereza',
                'cart.tax': 'Umusoro',
                'cart.total': 'Igiteranyo cyose',
                'cart.checkout': 'Kwishura',
                'cart.continue_shopping': 'Komeza Gusohora',
                'cart.view_cart': 'Reba Igare',
                'cart.clear': 'Sukura Igare',
                'cart.item_added': 'Ikintu cyongewe ku gare',
                'cart.item_removed': 'Ikintu cyakuweho ku gare',
                'cart.quantity_updated': 'Umubare wahinduwe',
                'cart.max_quantity': 'Umubare ntarengwa',

                // Products
                'products.featured': 'Ibicuruzwa Byihariye',
                'products.new': 'Ibicuruzwa Bishya',
                'products.sale': 'Kugurisha',
                'products.all': 'Ibicuruzwa Byose',
                'products.add_to_cart': 'Ongeraho ku Gare',
                'products.view_details': 'Reba Ibisobanuro',
                'products.out_of_stock': 'Ntibihari',
                'products.in_stock': 'Birahari',
                'products.quick_view': 'Reba Byihuse',
                'products.add_to_wishlist': 'Ongeraho ku Byifuzo',
                'products.compare': 'Gereranya',
                'products.share': 'Sangira',

                // Filters
                'filters.title': 'Imyujyi',
                'filters.clear_all': 'Sukura Byose',
                'filters.apply': 'Koresha Imyujyi',
                'filters.price_range': 'Igiciro',
                'filters.category': 'Icyiciro',
                'filters.rating': 'Amanota',
                'filters.brand': 'Ikimenyetso',
                'filters.color': 'Ibara',
                'filters.size': 'Ingano',

                // Sort
                'sort.default': 'Mbwirizwa',
                'sort.price_low': 'Igiciro: Hasi kugeza Hejuru',
                'sort.price_high': 'Igiciro: Hejuru kugeza Hasi',
                'sort.name_az': 'Izina: A kugeza Z',
                'sort.name_za': 'Izina: Z kugeza A',
                'sort.rating': 'Amanota Menshi',
                'sort.newest': 'Gishya Cyambere',
                'sort.popular': 'Bikunzwe Cyane',

                // Auth
                'auth.login': 'Injira',
                'auth.register': 'Iyandikishe',
                'auth.logout': 'Sohoka',
                'auth.email': 'Imeyili',
                'auth.password': 'Ijambo ryibanga',
                'auth.confirm_password': 'Emeza ijambo ryibanga',
                'auth.forgot_password': 'Wibagiwe ijambo ryibanga?',
                'auth.remember_me': 'Nyibuke',
                'auth.no_account': 'Ntufite konti?',
                'auth.have_account': 'Ufite konti?',
                'auth.sign_in': 'Injira',
                'auth.sign_up': 'Iyandikishe',

                // Profile
                'profile.my_account': 'Konti Yanjye',
                'profile.orders': 'Ibyo Nagize',
                'profile.wishlist': 'Ibyifuzo',
                'profile.addresses': 'Aderesi',
                'profile.settings': 'Igenamiterere',
                'profile.logout': 'Sohoka',

                // Common
                'common.loading': 'Birakururwa...',
                'common.error': 'Ikosa',
                'common.success': 'Byakunze',
                'common.warning': 'Iburira',
                'common.info': 'Amakuru',
                'common.ok': 'Sawa',
                'common.cancel': 'Hagarika',
                'common.save': 'Bika',
                'common.delete': 'Siba',
                'common.edit': 'Hindura',
                'common.view': 'Reba',
                'common.close': 'Funga',
                'common.search': 'Shakisha',
                'common.filter': 'Myujyi',
                'common.sort': 'Gutondekanya',
                'common.more': 'Byinshi',
                'common.less': 'Bike',
                'common.show_more': 'Erekana Byinshi',
                'common.show_less': 'Erekana Bike',

                // Messages
                'message.free_shipping': 'Kohereza ku buntu ku bicuruzwa birenze $50',
                'message.welcome': 'Murakaza neza kuri NexusShop',
                'message.thank_you': 'Murakoze kuba mwaguzwe',
                'message.order_success': 'Igitabo cyatanzwe neza',
                'message.order_error': 'Ikosa mu gutanga igitabo',

                // Footer
                'footer.about': 'Abo Turi',
                'footer.contact': 'Twandikire',
                'footer.terms': 'Amategeko',
                'footer.privacy': 'Ibanga',
                'footer.faq': 'Ibibazo Bikunze Kubazwa',
                'footer.support': 'Ubufasha',
                'footer.newsletter': 'Inkuru',
                'footer.subscribe': 'Iyandikishe',
                'footer.email_placeholder': 'Imeyili yawe',

                // Checkout
                'checkout.title': 'Kwishura',
                'checkout.shipping_address': 'Aderesi yo Kohereza',
                'checkout.billing_address': 'Aderesi yo Kwishura',
                'checkout.payment_method': 'Uburyo bwo Kwishura',
                'checkout.review_order': 'Subiramo Igitabo',
                'checkout.place_order': 'Tanga Igitabo',
                'checkout.order_summary': 'Incamake y\'Igitabo',

                // Reviews
                'review.write': 'Andika Igitekerezo',
                'review.rating': 'Amanota',
                'review.comment': 'Igitekerezo',
                'review.submit': 'Ohereza',
                'review.helpful': 'Byafasha',
                'review.not_helpful': 'Ntibifasha',

                // Chat
                'chat.title': 'Ubufasha bw\'Abakiriya',
                'chat.online': 'Kumurongo',
                'chat.offline': 'Ntaho',
                'chat.placeholder': 'Andika ubutumwa bwawe...',
                'chat.send': 'Ohereza'
            }
        };
    }

    init() {
        this.loadLanguage();
        this.setupEventListeners();
    }

    loadLanguage() {
        const saved = Utils.storage.get('language');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        }
        this.applyLanguage();
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            Utils.storage.set('language', lang);
            this.applyLanguage();
            app.showToast(
                lang === 'en' ? 'Language changed to English' : 'Ururimi rwahinduwe ku Kinyarwanda',
                'success'
            );
            // Reload current page to apply translations
            app.router.handleRoute();
        }
    }

    applyLanguage() {
        // Apply to elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update language toggle button
        this.updateLanguageToggle();

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] ||
            this.translations['en'][key] ||
            key;
    }

    t(key) {
        return this.translate(key);
    }

    updateLanguageToggle() {
        const toggleBtn = document.querySelector('.language-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.currentLanguage === 'en'
                ? '<i class="fas fa-language"></i> EN'
                : '<i class="fas fa-language"></i> RW';

            toggleBtn.title = this.currentLanguage === 'en'
                ? 'Switch to Kinyarwanda'
                : 'Hindura ku Cyongereza';
        }
    }

    setupEventListeners() {
        const toggleBtn = document.querySelector('.language-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newLang = this.currentLanguage === 'en' ? 'rw' : 'en';
                this.setLanguage(newLang);
            });
        }
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.theme = CONFIG.DEFAULT_THEME;
        this.themes = ['light', 'dark'];
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setupSystemThemeListener();
    }

    loadTheme() {
        const saved = Utils.storage.get('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (saved && this.themes.includes(saved)) {
            this.theme = saved;
        } else if (systemPrefersDark) {
            this.theme = 'dark';
        }

        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        Utils.storage.set('theme', this.theme);
        this.updateThemeButtons();

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.theme }
        }));
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();

        const message = this.theme === 'light'
            ? app.language.t('message.theme_light') || 'Switched to light mode'
            : app.language.t('message.theme_dark') || 'Switched to dark mode';

        app.showToast(message, 'info');
    }

    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.theme = theme;
            this.applyTheme();
        }
    }

    updateThemeButtons() {
        const icon = this.theme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';

        document.querySelectorAll('.theme-toggle, #themeToggle, #themeFloatingBtn').forEach(btn => {
            if (btn) btn.innerHTML = icon;
        });
    }

    setupEventListeners() {
        // Main theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Floating theme button
        document.getElementById('themeFloatingBtn')?.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setupSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Utils.storage.get('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }
}

// ===== CART MANAGER =====
class CartManager {
    constructor() {
        this.items = [];
        this.coupon = null;
        this.listeners = [];
    }

    init() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const data = Utils.storage.get('cart');
        if (data) {
            this.items = data.items || [];
            this.coupon = data.coupon || null;
        }
    }

    saveToStorage() {
        Utils.storage.set('cart', {
            items: this.items,
            coupon: this.coupon
        });
        this.notifyListeners();
    }

    // Add listener for cart changes
    onChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.items));
        app.updateCartCount();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity <= CONFIG.MAX_CART_ITEMS && newQuantity <= product.stock) {
                existingItem.quantity = newQuantity;
            } else {
                app.showToast(app.language.t('cart.max_quantity'), 'warning');
                return this;
            }
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                stock: product.stock || 99,
                category: product.category || 'General'
            });
        }

        this.saveToStorage();
        app.showToast(app.language.t('cart.item_added'), 'success');

        // Analytics
        app.analytics.trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            quantity: quantity
        });

        return this;
    }

    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        app.showToast(app.language.t('cart.item_removed'), 'info');

        // Analytics
        if (item) {
            app.analytics.trackEvent('remove_from_cart', {
                product_id: item.id,
                product_name: item.name
            });
        }

        return this;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, Math.min(quantity, item.stock, CONFIG.MAX_CART_ITEMS));
            this.saveToStorage();
            app.showToast(app.language.t('cart.quantity_updated'), 'success');
        }
        return this;
    }

    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity < item.stock && item.quantity < CONFIG.MAX_CART_ITEMS) {
                item.quantity++;
                this.saveToStorage();
            } else {
                app.showToast(app.language.t('cart.max_quantity'), 'warning');
            }
        }
        return this;
    }

    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
                this.saveToStorage();
            } else {
                this.removeItem(productId);
            }
        }
        return this;
    }

    clear() {
        this.items = [];
        this.coupon = null;
        this.saveToStorage();
        app.showToast(app.language.t('cart.clear') + ' ' + app.language.t('common.success'), 'info');
        return this;
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTax() {
        return this.getSubtotal() * CONFIG.TAX_RATE;
    }

    getShipping() {
        return this.getSubtotal() >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_COST;
    }

    getDiscount() {
        if (!this.coupon) return 0;

        const subtotal = this.getSubtotal();
        if (this.coupon.type === 'percentage') {
            return subtotal * (this.coupon.value / 100);
        } else {
            return this.coupon.value;
        }
    }

    getTotal() {
        return this.getSubtotal() + this.getTax() + this.getShipping() - this.getDiscount();
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    getItems() {
        return this.items;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    applyCoupon(code) {
        // Mock coupon validation
        const coupons = {
            'SAVE10': { type: 'percentage', value: 10 },
            'SAVE20': { type: 'percentage', value: 20 },
            'FLAT5': { type: 'fixed', value: 5 }
        };

        if (coupons[code.toUpperCase()]) {
            this.coupon = { code: code.toUpperCase(), ...coupons[code.toUpperCase()] };
            this.saveToStorage();
            app.showToast('Coupon applied successfully!', 'success');
            return true;
        } else {
            app.showToast('Invalid coupon code', 'error');
            return false;
        }
    }

    removeCoupon() {
        this.coupon = null;
        this.saveToStorage();
        app.showToast('Coupon removed', 'info');
    }

    renderCartSidebar() {
        const items = this.getItems();

        if (items.length === 0) {
            return `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>${app.language.t('cart.empty')}</h3>
                    <p>${app.language.t('cart.continue_shopping')}</p>
                </div>
            `;
        }

        return `
            ${items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">${Utils.formatCurrency(item.price)}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" data-action="decrease" aria-label="Decrease">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock}" readonly>
                                <button class="quantity-btn" data-action="increase" aria-label="Increase">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item" data-action="remove" aria-label="Remove">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            <div class="cart-summary">
                <div class="summary-row">
                    <span>${app.language.t('cart.subtotal')}</span>
                    <span>${Utils.formatCurrency(this.getSubtotal())}</span>
                </div>
                <div class="summary-row">
                    <span>${app.language.t('cart.shipping')}</span>
                    <span>${Utils.formatCurrency(this.getShipping())}</span>
                </div>
                <div class="summary-row">
                    <span>${app.language.t('cart.tax')}</span>
                    <span>${Utils.formatCurrency(this.getTax())}</span>
                </div>
                ${this.coupon ? `
                    <div class="summary-row discount">
                        <span>Discount (${this.coupon.code})</span>
                        <span>-${Utils.formatCurrency(this.getDiscount())}</span>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>${app.language.t('cart.total')}</span>
                    <span>${Utils.formatCurrency(this.getTotal())}</span>
                </div>
            </div>
            
            <div class="cart-actions">
                <a href="#/cart" class="btn btn-outline btn-full">${app.language.t('cart.view_cart')}</a>
                <a href="#/checkout" class="btn btn-primary btn-full">${app.language.t('cart.checkout')}</a>
            </div>
        `;
    }
}

// ===== WISHLIST MANAGER =====
class WishlistManager {
    constructor() {
        this.items = [];
    }

    init() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const data = Utils.storage.get('wishlist');
        if (data) {
            this.items = data;
        }
    }

    saveToStorage() {
        Utils.storage.set('wishlist', this.items);
    }

    addItem(product) {
        if (this.items.length >= CONFIG.MAX_WISHLIST_ITEMS) {
            app.showToast('Wishlist is full', 'warning');
            return false;
        }

        if (!this.hasItem(product.id)) {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                addedAt: new Date().toISOString()
            });
            this.saveToStorage();
            app.showToast('Added to wishlist', 'success');

            // Analytics
            app.analytics.trackEvent('add_to_wishlist', {
                product_id: product.id,
                product_name: product.name
            });

            return true;
        } else {
            app.showToast('Already in wishlist', 'info');
            return false;
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        app.showToast('Removed from wishlist', 'info');
    }

    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    }

    getItems() {
        return this.items;
    }

    getCount() {
        return this.items.length;
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        app.showToast('Wishlist cleared', 'info');
    }
}

// ===== AUTHENTICATION MANAGER =====
class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
    }

    init() {
        this.loadFromStorage();
        this.updateUI();
    }

    loadFromStorage() {
        const data = Utils.storage.get('user');
        if (data) {
            this.user = data;
            this.isAuthenticated = true;
        }
    }

    saveToStorage() {
        if (this.user) {
            Utils.storage.set('user', this.user);
        } else {
            Utils.storage.remove('user');
        }
    }

    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password.length >= 6) {
                    this.user = {
                        id: Utils.generateId(),
                        email: email,
                        name: email.split('@')[0],
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=EF8354&color=fff`,
                        createdAt: new Date().toISOString(),
                        preferences: {
                            language: app.language.currentLanguage,
                            theme: app.theme.theme,
                            notifications: true
                        }
                    };
                    this.isAuthenticated = true;
                    this.saveToStorage();
                    this.updateUI();

                    app.showToast(app.language.t('auth.login') + ' ' + app.language.t('common.success'), 'success');

                    // Analytics
                    app.analytics.trackEvent('login', { method: 'email' });

                    resolve(this.user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    }

    async register(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userData.email && userData.password && userData.password.length >= 6) {
                    if (!Utils.validateEmail(userData.email)) {
                        reject(new Error('Invalid email address'));
                        return;
                    }

                    this.user = {
                        id: Utils.generateId(),
                        email: userData.email,
                        name: userData.name || userData.email.split('@')[0],
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.email.split('@')[0])}&background=EF8354&color=fff`,
                        createdAt: new Date().toISOString(),
                        preferences: {
                            language: app.language.currentLanguage,
                            theme: app.theme.theme,
                            notifications: true
                        }
                    };
                    this.isAuthenticated = true;
                    this.saveToStorage();
                    this.updateUI();

                    app.showToast(app.language.t('auth.register') + ' ' + app.language.t('common.success'), 'success');

                    // Analytics
                    app.analytics.trackEvent('register', { method: 'email' });

                    resolve(this.user);
                } else {
                    reject(new Error('Invalid registration data'));
                }
            }, 500);
        });
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
        this.saveToStorage();
        this.updateUI();

        app.showToast(app.language.t('auth.logout') + ' ' + app.language.t('common.success'), 'info');

        // Analytics
        app.analytics.trackEvent('logout');

        window.location.hash = '/';
    }

    updateUI() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            if (this.isAuthenticated && this.user) {
                userMenu.innerHTML = `
                    <img src="${this.user.avatar}" alt="${this.user.name}" style="width: 32px; height: 32px; border-radius: 50%;">
                `;
                userMenu.title = this.user.name;
            } else {
                userMenu.innerHTML = '<i class="fas fa-user"></i>';
                userMenu.title = 'Login';
            }
        }
    }

    getCurrentUser() {
        return this.user;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    updateProfile(updates) {
        if (this.user) {
            this.user = { ...this.user, ...updates };
            this.saveToStorage();
            app.showToast('Profile updated', 'success');
        }
    }
}

// ===== PRODUCTS MANAGER =====
class ProductsManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentPage = 1;
        this.itemsPerPage = CONFIG.ITEMS_PER_PAGE;
        this.sortBy = 'default';
        this.filters = {
            category: null,
            priceMin: 0,
            priceMax: 1000,
            rating: 0,
            inStock: false,
            featured: false,
            search: ''
        };
    }

    init() {
        this.generateMockData();
    }

    generateMockData() {
        // Mock products database
        this.products = [
            {
                id: '1',
                name: 'Wireless Bluetooth Headphones',
                price: 89.99,
                originalPrice: 129.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                category: 'Electronics',
                rating: 4.5,
                reviewCount: 128,
                description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
                stock: 50,
                tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium'],
                featured: true,
                brand: 'AudioPro',
                colors: ['Black', 'White', 'Blue'],
                sizes: []
            },
            {
                id: '2',
                name: 'Smart Watch Series 5',
                price: 299.99,
                originalPrice: 349.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                category: 'Electronics',
                rating: 4.7,
                reviewCount: 89,
                description: 'Advanced smartwatch with health monitoring, GPS tracking, and 5-day battery life.',
                stock: 25,
                tags: ['smartwatch', 'fitness', 'gps', 'health'],
                featured: true,
                brand: 'TechWatch',
                colors: ['Silver', 'Gold', 'Black'],
                sizes: ['42mm', '46mm']
            },
            {
                id: '3',
                name: 'Designer Backpack',
                price: 79.99,
                originalPrice: 99.99,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
                category: 'Fashion',
                rating: 4.3,
                reviewCount: 56,
                description: 'Water-resistant designer backpack with laptop compartment and multiple pockets.',
                stock: 100,
                tags: ['backpack', 'designer', 'waterproof', 'laptop'],
                featured: false,
                brand: 'StyleBag',
                colors: ['Black', 'Navy', 'Gray'],
                sizes: []
            },
            {
                id: '4',
                name: 'Organic Coffee Beans',
                price: 24.99,
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
                category: 'Home',
                rating: 4.8,
                reviewCount: 203,
                description: 'Premium organic coffee beans from sustainable farms. Rich flavor and aroma.',
                stock: 200,
                tags: ['coffee', 'organic', 'premium', 'fair-trade'],
                featured: true,
                brand: 'CoffeeLux',
                colors: [],
                sizes: ['250g', '500g', '1kg']
            },
            {
                id: '5',
                name: 'Yoga Mat Premium',
                price: 49.99,
                originalPrice: 69.99,
                image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop',
                category: 'Sports',
                rating: 4.6,
                reviewCount: 78,
                description: 'Non-slip yoga mat with alignment markers and carrying strap.',
                stock: 75,
                tags: ['yoga', 'fitness', 'premium', 'eco-friendly'],
                featured: false,
                brand: 'YogaPro',
                colors: ['Purple', 'Blue', 'Pink', 'Green'],
                sizes: []
            },
            {
                id: '6',
                name: 'LED Desk Lamp',
                price: 34.99,
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
                category: 'Home',
                rating: 4.4,
                reviewCount: 92,
                description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
                stock: 150,
                tags: ['lamp', 'led', 'desk', 'usb'],
                featured: false,
                brand: 'LightTech',
                colors: ['White', 'Black'],
                sizes: []
            },
            {
                id: '7',
                name: 'Running Shoes',
                price: 89.99,
                originalPrice: 119.99,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
                category: 'Sports',
                rating: 4.7,
                reviewCount: 145,
                description: 'Lightweight running shoes with advanced cushioning technology.',
                stock: 60,
                tags: ['shoes', 'running', 'sports', 'comfortable'],
                featured: true,
                brand: 'RunFast',
                colors: ['Black', 'White', 'Red'],
                sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11']
            },
            {
                id: '8',
                name: 'Wireless Earbuds',
                price: 59.99,
                image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e5?w=400&h=400&fit=crop',
                category: 'Electronics',
                rating: 4.2,
                reviewCount: 67,
                description: 'True wireless earbuds with charging case and 24-hour battery life.',
                stock: 120,
                tags: ['earbuds', 'wireless', 'audio', 'portable'],
                featured: false,
                brand: 'SoundPro',
                colors: ['Black', 'White'],
                sizes: []
            },
            {
                id: '9',
                name: 'Mechanical Keyboard',
                price: 129.99,
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
                category: 'Electronics',
                rating: 4.6,
                reviewCount: 234,
                description: 'RGB mechanical keyboard with customizable keys and software.',
                stock: 45,
                tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
                featured: false,
                brand: 'KeyMaster',
                colors: ['Black'],
                sizes: []
            },
            {
                id: '10',
                name: 'Stainless Steel Water Bottle',
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
                category: 'Home',
                rating: 4.5,
                reviewCount: 167,
                description: 'Insulated water bottle keeps drinks cold for 24h, hot for 12h.',
                stock: 200,
                tags: ['bottle', 'insulated', 'eco-friendly', 'portable'],
                featured: false,
                brand: 'HydroLife',
                colors: ['Silver', 'Black', 'Blue', 'Pink'],
                sizes: ['500ml', '750ml', '1L']
            },
            {
                id: '11',
                name: 'Portable Bluetooth Speaker',
                price: 79.99,
                originalPrice: 99.99,
                image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
                category: 'Electronics',
                rating: 4.4,
                reviewCount: 98,
                description: 'Waterproof portable speaker with 360° sound and 20-hour battery.',
                stock: 85,
                tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
                featured: true,
                brand: 'BoomSound',
                colors: ['Black', 'Blue', 'Red'],
                sizes: []
            },
            {
                id: '12',
                name: 'Leather Wallet',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
                category: 'Fashion',
                rating: 4.7,
                reviewCount: 156,
                description: 'Genuine leather wallet with RFID protection and multiple card slots.',
                stock: 150,
                tags: ['wallet', 'leather', 'rfid', 'accessories'],
                featured: false,
                brand: 'LeatherCraft',
                colors: ['Brown', 'Black'],
                sizes: []
            }
        ];

        // Mock categories
        this.categories = [
            { id: 'electronics', name: 'Electronics', count: 45, icon: 'laptop' },
            { id: 'fashion', name: 'Fashion', count: 120, icon: 'tshirt' },
            { id: 'home', name: 'Home & Garden', count: 89, icon: 'home' },
            { id: 'sports', name: 'Sports', count: 67, icon: 'basketball-ball' },
            { id: 'books', name: 'Books', count: 210, icon: 'book' },
            { id: 'toys', name: 'Toys', count: 56, icon: 'gamepad' },
            { id: 'beauty', name: 'Beauty', count: 78, icon: 'spa' }
        ];
    }

    async getProducts(page = 1, customFilters = {}) {
        // Merge custom filters with current filters
        const filters = { ...this.filters, ...customFilters };

        let filtered = [...this.products];

        // Apply filters
        if (filters.category) {
            filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
        }

        if (filters.featured) {
            filtered = filtered.filter(p => p.featured);
        }

        if (filters.inStock) {
            filtered = filtered.filter(p => p.stock > 0);
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search) ||
                p.tags.some(tag => tag.toLowerCase().includes(search)) ||
                p.brand.toLowerCase().includes(search)
            );
        }

        if (filters.priceMin > 0 || filters.priceMax < 1000) {
            filtered = filtered.filter(p =>
                p.price >= filters.priceMin && p.price <= filters.priceMax
            );
        }

        if (filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= filters.rating);
        }

        // Apply sorting
        filtered = this.sortProducts(filtered, this.sortBy);

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProducts = filtered.slice(startIndex, endIndex);

        return {
            products: paginatedProducts,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                hasNext: page < totalPages,
                hasPrevious: page > 1
            }
        };
    }

    async getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    async getCategories() {
        return this.categories;
    }

    async searchProducts(query, limit = 5) {
        const search = query.toLowerCase();
        return this.products
            .filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search) ||
                p.tags.some(tag => tag.toLowerCase().includes(search))
            )
            .slice(0, limit);
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];

        switch (sortBy) {
            case 'price_low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price_high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name_az':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name_za':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => b.id - a.id);
            case 'popular':
                return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
            default:
                return sorted;
        }
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        return this;
    }

    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        return this;
    }

    resetFilters() {
        this.filters = {
            category: null,
            priceMin: 0,
            priceMax: 1000,
            rating: 0,
            inStock: false,
            featured: false,
            search: ''
        };
        return this;
    }

    generateProductCard(product) {
        const discount = product.originalPrice ?
            Utils.calculateDiscount(product.originalPrice, product.price) : 0;

        const isInWishlist = app.wishlist.hasItem(product.id);

        return `
            <div class="product-card animate-fade-in-scale" data-id="${product.id}">
                ${discount > 0 ? `<span class="badge badge-danger">-${discount}%</span>` : ''}
                ${product.featured ? '<span class="badge badge-success">Featured</span>' : ''}
                
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-actions">
                        <button class="product-action quick-view" title="${app.language.t('products.quick_view')}" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="product-action wishlist ${isInWishlist ? 'active' : ''}" title="${app.language.t('products.add_to_wishlist')}" data-id="${product.id}">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="product-action share" title="${app.language.t('products.share')}" data-id="${product.id}">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">
                        <a href="#/product/${product.id}">${product.name}</a>
                    </h3>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStarRating(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    
                    <p class="product-description">${Utils.truncate(product.description, 80)}</p>
                    
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="current-price">${Utils.formatCurrency(product.price)}</span>
                            ${product.originalPrice ?
                `<span class="original-price">${Utils.formatCurrency(product.originalPrice)}</span>` : ''}
                        </div>
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.stock > 0 ? app.language.t('products.add_to_cart') : app.language.t('products.out_of_stock')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    getBrands() {
        const brands = [...new Set(this.products.map(p => p.brand))];
        return brands.sort();
    }

    getColors() {
        const colors = new Set();
        this.products.forEach(p => p.colors.forEach(c => colors.add(c)));
        return Array.from(colors).sort();
    }

    getRelatedProducts(productId, limit = 4) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return [];

        return this.products
            .filter(p =>
                p.id !== productId &&
                (p.category === product.category ||
                    p.tags.some(tag => product.tags.includes(tag)))
            )
            .slice(0, limit);
    }
}

// ===== ANALYTICS MANAGER =====
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.pageViews = [];
        this.sessionStart = new Date();
    }

    init() {
        this.loadFromStorage();
        this.trackPageView(window.location.hash);
        this.setupEventListeners();
    }

    loadFromStorage() {
        const data = Utils.storage.get('analytics');
        if (data) {
            this.events = data.events || [];
            this.pageViews = data.pageViews || [];
        }
    }

    saveToStorage() {
        Utils.storage.set('analytics', {
            events: this.events.slice(-100), // Keep last 100 events
            pageViews: this.pageViews.slice(-100)
        });
    }

    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            page: window.location.hash,
            user: app.auth.user?.id || 'anonymous'
        };

        this.events.push(event);
        this.saveToStorage();

        console.log('📊 Analytics:', eventName, data);
    }

    trackPageView(page) {
        const pageView = {
            page: page,
            timestamp: new Date().toISOString(),
            user: app.auth.user?.id || 'anonymous',
            referrer: document.referrer
        };

        this.pageViews.push(pageView);
        this.saveToStorage();
    }

    getStats() {
        return {
            totalEvents: this.events.length,
            totalPageViews: this.pageViews.length,
            sessionDuration: new Date() - this.sessionStart,
            topEvents: this.getTopEvents(),
            topPages: this.getTopPages()
        };
    }

    getTopEvents(limit = 5) {
        const eventCounts = {};
        this.events.forEach(event => {
            eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
        });

        return Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    getTopPages(limit = 5) {
        const pageCounts = {};
        this.pageViews.forEach(view => {
            pageCounts[view.page] = (pageCounts[view.page] || 0) + 1;
        });

        return Object.entries(pageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([page, count]) => ({ page, count }));
    }

    setupEventListeners() {
        // Track hash changes
        window.addEventListener('hashchange', () => {
            this.trackPageView(window.location.hash);
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                this.trackEvent('click', {
                    element: 'link',
                    href: link.href,
                    text: link.textContent
                });
            }
        });
    }
}

// ===== UI MANAGER =====
class UIManager {
    constructor() {
        this.toastContainer = null;
        this.loadingOverlay = null;
        this.modals = [];
    }

    init() {
        this.toastContainer = document.getElementById('toastContainer');
        this.loadingOverlay = document.getElementById('loadingOverlay');

        this.setupEventListeners();
        this.setupBackToTop();
        this.setupFloatingButtons();
        this.setupProductCardListeners();
    }

    setupEventListeners() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Cart overlay
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.toggleCart());
        }

        // Search
        this.setupSearch();

        // Newsletter
        this.setupNewsletter();

        // User menu
        this.setupUserMenu();

        // Chat
        this.setupChat();
    }

    setupSearch() {
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');

        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.location.hash = `/search?q=${encodeURIComponent(query)}`;
                    searchInput.value = '';
                    this.hideSearchSuggestions();

                    // Analytics
                    app.analytics.trackEvent('search', { query });
                }
            });

            searchInput.addEventListener('input', Utils.debounce(async () => {
                const query = searchInput.value.trim();
                if (query.length >= CONFIG.MIN_SEARCH_LENGTH) {
                    await this.showSearchSuggestions(query);
                } else {
                    this.hideSearchSuggestions();
                }
            }, CONFIG.SEARCH_DEBOUNCE));

            document.addEventListener('click', (e) => {
                if (!searchForm.contains(e.target)) {
                    this.hideSearchSuggestions();
                }
            });
        }
    }

    async showSearchSuggestions(query) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;

        try {
            const products = await app.products.searchProducts(query, 5);

            if (products.length === 0) {
                suggestionsContainer.innerHTML = `
                    <div class="suggestion-item">
                        <i class="fas fa-search"></i>
                        <span>${app.language.t('search.no_results')}</span>
                    </div>
                `;
            } else {
                suggestionsContainer.innerHTML = products.map(product => `
                    <div class="suggestion-item" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div>
                            <div class="suggestion-title">${product.name}</div>
                            <div class="suggestion-price">${Utils.formatCurrency(product.price)}</div>
                        </div>
                    </div>
                `).join('');

                suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const productId = item.dataset.id;
                        window.location.hash = `/product/${productId}`;
                        this.hideSearchSuggestions();
                        document.getElementById('searchInput').value = '';
                    });
                });
            }

            suggestionsContainer.classList.add('active');
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('active');
        }
    }

    setupNewsletter() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                if (email && Utils.validateEmail(email)) {
                    app.showToast('Successfully subscribed to newsletter!', 'success');
                    newsletterForm.reset();

                    // Analytics
                    app.analytics.trackEvent('newsletter_subscribe', { email });
                } else {
                    app.showToast('Please enter a valid email address', 'error');
                }
            });
        }
    }

    setupUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', () => {
                if (app.auth.isLoggedIn()) {
                    window.location.hash = '/profile';
                } else {
                    window.location.hash = '/login';
                }
            });
        }
    }

    setupChat() {
        const chatToggle = document.getElementById('chatToggle');
        const chatWidget = document.getElementById('chatWidget');
        const chatClose = chatWidget?.querySelector('.chat-close');
        const sendMessage = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');

        if (chatToggle && chatWidget) {
            chatToggle.addEventListener('click', () => {
                chatWidget.classList.toggle('active');
                if (chatWidget.classList.contains('active')) {
                    messageInput?.focus();
                    // Analytics
                    app.analytics.trackEvent('chat_open');
                }
            });

            chatClose?.addEventListener('click', () => {
                chatWidget.classList.remove('active');
            });

            sendMessage?.addEventListener('click', () => this.sendChatMessage());
            messageInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }
    }

    sendChatMessage() {
        const messageInput = document.getElementById('messageInput');
        const messagesContainer = document.getElementById('chatMessages');
        const message = messageInput?.value.trim();

        if (message && messagesContainer) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${Utils.sanitizeHTML(message)}</div>
                    <div class="message-time">${Utils.formatTime(new Date())}</div>
                </div>
            `;
            messagesContainer.appendChild(userMessage);
            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Analytics
            app.analytics.trackEvent('chat_message', { message: message.substring(0, 50) });

            // Auto-reply
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'message support';
                botMessage.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">${this.generateAutoReply(message)}</div>
                        <div class="message-time">${Utils.formatTime(new Date())}</div>
                    </div>
                `;
                messagesContainer.appendChild(botMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
        }
    }

    generateAutoReply(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('igiciro')) {
            return app.language.currentLanguage === 'en'
                ? "You can check product prices on our products page. Would you like me to help you find a specific product?"
                : "Ushobora kureba ibiciro by'ibicuruzwa ku rupapuro rw'ibicuruzwa. Urashaka ko nkugufasha gushakisha igicuruzwa runaka?";
        } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('kohereza')) {
            return app.language.currentLanguage === 'en'
                ? "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days."
                : "Dufite kohereza ku buntu ku bicuruzwa birenze $50. Kohereza bisanzwe bifata iminsi 3-5 y'akazi.";
        } else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('garura')) {
            return app.language.currentLanguage === 'en'
                ? "We have a 30-day return policy. Items must be in original condition with tags attached."
                : "Dufite politike yo gusubiza iminsi 30. Ibicuruzwa bigomba kuba mu miterere yabyo n'uduce twayo.";
        } else {
            return app.language.currentLanguage === 'en'
                ? "Thank you for your message! Our support team will assist you shortly. How can I help you today?"
                : "Murakoze ku butumwa bwanyu! Itsinda ryacu ryo gufasha rizakwakira vuba. Nshobora kubafasha gute uyu munsi?";
        }
    }

    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', Utils.throttle(() => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }, 100));

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Analytics
                app.analytics.trackEvent('back_to_top_click');
            });
        }
    }

    setupFloatingButtons() {
        const floatingThemeBtn = document.getElementById('themeFloatingBtn');
        if (floatingThemeBtn) {
            window.addEventListener('scroll', Utils.throttle(() => {
                if (window.pageYOffset > 300) {
                    floatingThemeBtn.classList.add('visible');
                } else {
                    floatingThemeBtn.classList.remove('visible');
                }
            }, 100));
        }
    }

    setupProductCardListeners() {
        // Event delegation for product cards
        document.addEventListener('click', async (e) => {
            // Add to cart
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.id;
                if (productId) {
                    const product = await app.products.getProduct(productId);
                    if (product && product.stock > 0) {
                        app.cart.addItem(product);
                    }
                }
            }

            // Wishlist toggle
            const wishlistBtn = e.target.closest('.wishlist');
            if (wishlistBtn) {
                const productId = wishlistBtn.dataset.id;
                if (productId) {
                    const product = await app.products.getProduct(productId);
                    if (product) {
                        if (app.wishlist.hasItem(productId)) {
                            app.wishlist.removeItem(productId);
                            wishlistBtn.classList.remove('active');
                            wishlistBtn.querySelector('i').classList.remove('fas');
                            wishlistBtn.querySelector('i').classList.add('far');
                        } else {
                            app.wishlist.addItem(product);
                            wishlistBtn.classList.add('active');
                            wishlistBtn.querySelector('i').classList.remove('far');
                            wishlistBtn.querySelector('i').classList.add('fas');
                        }
                    }
                }
            }

            // Quick view
            const quickViewBtn = e.target.closest('.quick-view');
            if (quickViewBtn) {
                const productId = quickViewBtn.dataset.id;
                if (productId) {
                    await this.showQuickView(productId);
                }
            }

            // Share
            const shareBtn = e.target.closest('.share');
            if (shareBtn) {
                const productId = shareBtn.dataset.id;
                if (productId) {
                    this.shareProduct(productId);
                }
            }
        });
    }

    async showQuickView(productId) {
        const product = await app.products.getProduct(productId);
        if (!product) return;

        const modal = this.createModal('Quick View', `
            <div class="quick-view-content">
                <div class="grid grid-2" style="gap: 2rem;">
                    <div>
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: var(--radius-lg);">
                    </div>
                    <div>
                        <h2 style="margin-bottom: 1rem;">${product.name}</h2>
                        <div class="product-rating" style="margin-bottom: 1rem;">
                            <div class="stars">${app.products.generateStarRating(product.rating)}</div>
                            <span class="rating-count">(${product.reviewCount} reviews)</span>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: var(--accent); margin-bottom: 1rem;">
                            ${Utils.formatCurrency(product.price)}
                            ${product.originalPrice ? `<span style="font-size: 1.2rem; color: var(--text-muted); text-decoration: line-through; margin-left: 0.5rem;">${Utils.formatCurrency(product.originalPrice)}</span>` : ''}
                        </div>
                        <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">${product.description}</p>
                        <div style="margin-bottom: 1rem;">
                            <strong>Category:</strong> ${product.category}
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>Brand:</strong> ${product.brand}
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <strong>Stock:</strong> <span style="color: ${product.stock > 0 ? 'var(--success)' : 'var(--error)'};">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-primary" onclick="app.cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')}); app.ui.closeModal();" ${product.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <a href="#/product/${product.id}" class="btn btn-outline">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        `, [
            {
                text: 'Close',
                class: 'btn-outline',
                action: 'close'
            }
        ]);

        // Analytics
        app.analytics.trackEvent('quick_view', {
            product_id: product.id,
            product_name: product.name
        });
    }

    shareProduct(productId) {
        const url = `${window.location.origin}${window.location.pathname}#/product/${productId}`;

        if (navigator.share) {
            navigator.share({
                title: 'Check out this product on NexusShop',
                url: url
            }).then(() => {
                app.showToast('Shared successfully!', 'success');
                app.analytics.trackEvent('share_product', { product_id: productId, method: 'native' });
            }).catch(err => {
                console.log('Share cancelled or failed:', err);
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(url).then(() => {
                app.showToast('Link copied to clipboard!', 'success');
                app.analytics.trackEvent('share_product', { product_id: productId, method: 'clipboard' });
            });
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            this.loadCartSidebar();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Analytics
            app.analytics.trackEvent('cart_opened');
        }
    }

    loadCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (!cartSidebar) return;

        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h2 class="cart-title">${app.language.t('cart.title')}</h2>
                <button class="close-cart" id="closeCart" aria-label="Close cart">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="cart-items" id="cartItems">
                ${app.cart.renderCartSidebar()}
            </div>
        `;

        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => this.toggleCart());
        }

        this.setupCartItemListeners();
    }

    setupCartItemListeners() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        cartItems.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const cartItem = button.closest('.cart-item');
            if (!cartItem) return;

            const productId = cartItem.dataset.id;
            const action = button.dataset.action;

            switch (action) {
                case 'increase':
                    app.cart.increaseQuantity(productId);
                    break;
                case 'decrease':
                    app.cart.decreaseQuantity(productId);
                    break;
                case 'remove':
                    app.cart.removeItem(productId);
                    break;
            }

            this.loadCartSidebar();
        });
    }

    showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        if (!this.toastContainer) {
            this.toastContainer = document.getElementById('toastContainer');
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${this.getToastTitle(type)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.toastContainer.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });

        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getToastTitle(type) {
        return app.language.t(`common.${type}`) || type.charAt(0).toUpperCase() + type.slice(1);
    }

    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('active');
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('active');
        }
    }

    createModal(title, content, buttons = []) {
        const modalContainer = document.getElementById('modalContainer');
        if (!modalContainer) return null;

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal animate-fade-in-scale">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.class || 'btn-primary'}" data-action="${btn.action || 'close'}">
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        modalContainer.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));

        modal.querySelector('.modal-backdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal(modal);
            }
        });

        // Button actions
        modal.querySelectorAll('.modal-footer .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'close') {
                    this.closeModal(modal);
                }
            });
        });

        this.modals.push(modal);
        return modal;
    }

    closeModal(modal = null) {
        const modalToClose = modal || this.modals[this.modals.length - 1];
        if (modalToClose && modalToClose.parentNode) {
            modalToClose.parentNode.removeChild(modalToClose);
            this.modals = this.modals.filter(m => m !== modalToClose);

            if (this.modals.length === 0) {
                document.body.style.overflow = '';
            }
        }
    }
}

// ===== ROUTER =====
class Router {
    constructor() {
        this.routes = {
            '/': this.renderHomePage.bind(this),
            '/shop': this.renderShopPage.bind(this),
            '/product/:id': this.renderProductPage.bind(this),
            '/cart': this.renderCartPage.bind(this),
            '/checkout': this.renderCheckoutPage.bind(this),
            '/login': this.renderLoginPage.bind(this),
            '/register': this.renderRegisterPage.bind(this),
            '/profile': this.renderProfilePage.bind(this),
            '/wishlist': this.renderWishlistPage.bind(this),
            '/search': this.renderSearchPage.bind(this),
            '/category/:id': this.renderCategoryPage.bind(this),
            '/deals': this.renderDealsPage.bind(this),
            '/about': this.renderAboutPage.bind(this),
            '/contact': this.renderContactPage.bind(this)
        };
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.substring(1) || '/';
        const [path, queryString] = hash.split('?');
        const params = new URLSearchParams(queryString);

        let matchedRoute = null;
        let routeParams = {};

        for (const route in this.routes) {
            if (this.matchRoute(route, path)) {
                matchedRoute = route;
                routeParams = this.extractParams(route, path);
                break;
            }
        }

        if (!matchedRoute) {
            matchedRoute = '/';
        }

        this.updateActiveNavLink(path);

        app.showLoading();

        setTimeout(async () => {
            try {
                const content = await this.routes[matchedRoute](routeParams, params);
                document.getElementById('pageContent').innerHTML = content;

                // Apply translations
                app.language.applyLanguage();

                // Initialize page-specific scripts
                this.initializePageScripts(matchedRoute, routeParams, params);

                // Scroll to top
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Error rendering page:', error);
                document.getElementById('pageContent').innerHTML = this.renderErrorPage(error);
            } finally {
                app.hideLoading();
            }
        }, CONFIG.ANIMATION_DURATION);
    }

    matchRoute(route, path) {
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) return false;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) continue;
            if (routeParts[i] !== pathParts[i]) return false;
        }

        return true;
    }

    extractParams(route, path) {
        const params = {};
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                const paramName = routeParts[i].substring(1);
                params[paramName] = pathParts[i];
            }
        }

        return params;
    }

    updateActiveNavLink(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`.nav-link[href="#${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else if (path.startsWith('/product/') || path.startsWith('/category/')) {
            document.querySelector('.nav-link[href="#/shop"]')?.classList.add('active');
        }
    }

    async renderHomePage() {
        const { products } = await app.products.getProducts(1, { featured: true });
        const categories = await app.products.getCategories();

        return `
            <section class="hero-section">
                <div class="container">
                    <h1 class="hero-title">${app.language.t('message.welcome')}</h1>
                    <p class="hero-description">${app.language.t('message.free_shipping')}</p>
                    <a href="#/shop" class="btn btn-primary btn-xl">${app.language.t('nav.shop')}</a>
                </div>
            </section>
            
            <section class="featured-products section-padding">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${app.language.t('products.featured')}</h2>
                        <a href="#/shop" class="btn btn-outline">${app.language.t('common.view')} ${app.language.t('products.all')}</a>
                    </div>
                    
                    <div class="products-grid grid grid-4">
                        ${products.slice(0, 8).map(product =>
            app.products.generateProductCard(product)
        ).join('')}
                    </div>
                </div>
            </section>
            
            <section class="categories-section section-padding">
                <div class="container">
                    <h2 class="section-title text-center">${app.language.t('nav.categories')}</h2>
                    <div class="categories-grid grid grid-4" style="margin-top: 2rem;">
                        ${categories.slice(0, 4).map(category => `
                            <a href="#/category/${category.id}" class="category-card">
                                <div class="category-icon">
                                    <i class="fas fa-${category.icon}"></i>
                                </div>
                                <h3>${category.name}</h3>
                                <p>${category.count} ${app.language.t('products.all')}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </section>
            
            <section class="cta-section">
                <div class="container">
                    <h2>${app.language.t('message.free_shipping')}</h2>
                    <p>${app.language.t('message.thank_you')}</p>
                    <a href="#/shop" class="btn btn-primary btn-lg">${app.language.t('nav.shop')}</a>
                </div>
            </section>
        `;
    }

    async renderShopPage(params, queryParams) {
        const page = parseInt(queryParams.get('page')) || 1;
        const { products, pagination } = await app.products.getProducts(page, {});

        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title">${app.language.t('products.all')}</h1>
                    <p class="text-secondary mb-4">${pagination.totalItems} ${app.language.t('products.all')}</p>
                    
                    <div class="shop-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <select class="form-control" id="sortSelect" style="padding: 0.5rem 1rem; border-radius: var(--radius); border: 1px solid var(--border-color);">
                                <option value="default">${app.language.t('sort.default')}</option>
                                <option value="price_low">${app.language.t('sort.price_low')}</option>
                                <option value="price_high">${app.language.t('sort.price_high')}</option>
                                <option value="name_az">${app.language.t('sort.name_az')}</option>
                                <option value="name_za">${app.language.t('sort.name_za')}</option>
                                <option value="rating">${app.language.t('sort.rating')}</option>
                                <option value="newest">${app.language.t('sort.newest')}</option>
                                <option value="popular">${app.language.t('sort.popular')}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="products-grid grid grid-4">
                        ${products.map(product =>
            app.products.generateProductCard(product)
        ).join('')}
                    </div>
                    
                    ${pagination.totalPages > 1 ? `
                        <div class="pagination" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 3rem;">
                            ${pagination.hasPrevious ? `
                                <a href="#/shop?page=${pagination.currentPage - 1}" class="btn btn-outline">
                                    <i class="fas fa-chevron-left"></i> ${app.language.currentLanguage === 'en' ? 'Previous' : 'Ibanze'}
                                </a>
                            ` : ''}
                            
                            <span style="padding: 0 1rem;">${app.language.currentLanguage === 'en' ? 'Page' : 'Urupapuro'} ${pagination.currentPage} ${app.language.currentLanguage === 'en' ? 'of' : 'muri'} ${pagination.totalPages}</span>
                            
                            ${pagination.hasNext ? `
                                <a href="#/shop?page=${pagination.currentPage + 1}" class="btn btn-outline">
                                    ${app.language.currentLanguage === 'en' ? 'Next' : 'Ibikurikira'} <i class="fas fa-chevron-right"></i>
                                </a>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    async renderProductPage(params) {
        const product = await app.products.getProduct(params.id);

        if (!product) {
            return this.renderNotFoundPage();
        }

        const relatedProducts = app.products.getRelatedProducts(params.id);
        const isInWishlist = app.wishlist.hasItem(product.id);

        return `
            <div class="section-padding">
                <div class="container">
                    <nav class="breadcrumb" style="margin-bottom: 2rem; display: flex; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                        <a href="#/">${app.language.t('nav.home')}</a>
                        <i class="fas fa-chevron-right"></i>
                        <a href="#/shop">${app.language.t('nav.shop')}</a>
                        <i class="fas fa-chevron-right"></i>
                        <span>${product.name}</span>
                    </nav>
                    
                    <div class="grid grid-2" style="gap: 3rem; margin-bottom: 3rem;">
                        <div>
                            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);">
                        </div>
                        <div>
                            <h1 class="section-title" style="margin-bottom: 1rem;">${product.name}</h1>
                            
                            <div class="product-rating" style="margin-bottom: 1rem;">
                                <div class="stars">${app.products.generateStarRating(product.rating)}</div>
                                <span class="rating-count">(${product.reviewCount} ${app.language.currentLanguage === 'en' ? 'reviews' : 'ibitekerezo'})</span>
                            </div>
                            
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent); margin-bottom: 1.5rem;">
                                ${Utils.formatCurrency(product.price)}
                                ${product.originalPrice ? `
                                    <span style="font-size: 1.5rem; color: var(--text-muted); text-decoration: line-through; margin-left: 1rem;">
                                        ${Utils.formatCurrency(product.originalPrice)}
                                    </span>
                                    <span class="badge badge-danger" style="margin-left: 1rem;">-${Utils.calculateDiscount(product.originalPrice, product.price)}%</span>
                                ` : ''}
                            </div>
                            
                            <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 2rem;">
                                ${product.description}
                            </p>
                            
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                                <div>
                                    <strong>${app.language.currentLanguage === 'en' ? 'Category' : 'Icyiciro'}:</strong>
                                    <span style="color: var(--text-secondary); margin-left: 0.5rem;">${product.category}</span>
                                </div>
                                <div>
                                    <strong>${app.language.currentLanguage === 'en' ? 'Brand' : 'Ikimenyetso'}:</strong>
                                    <span style="color: var(--text-secondary); margin-left: 0.5rem;">${product.brand}</span>
                                </div>
                                <div>
                                    <strong>${app.language.currentLanguage === 'en' ? 'Stock' : 'Ububiko'}:</strong>
                                    <span style="color: ${product.stock > 0 ? 'var(--success)' : 'var(--error)'}; margin-left: 0.5rem;">
                                        ${product.stock > 0 ? app.language.t('products.in_stock') : app.language.t('products.out_of_stock')}
                                    </span>
                                </div>
                                <div>
                                    <strong>SKU:</strong>
                                    <span style="color: var(--text-secondary); margin-left: 0.5rem;">${product.id}</span>
                                </div>
                            </div>
                            
                            ${product.colors.length > 0 ? `
                                <div style="margin-bottom: 2rem;">
                                    <strong style="display: block; margin-bottom: 0.5rem;">${app.language.currentLanguage === 'en' ? 'Colors' : 'Amabara'}:</strong>
                                    <div style="display: flex; gap: 0.5rem;">
                                        ${product.colors.map(color => `
                                            <button class="color-swatch" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color); background: ${color.toLowerCase()};" title="${color}"></button>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${product.sizes.length > 0 ? `
                                <div style="margin-bottom: 2rem;">
                                    <strong style="display: block; margin-bottom: 0.5rem;">${app.language.currentLanguage === 'en' ? 'Sizes' : 'Ingano'}:</strong>
                                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                        ${product.sizes.map(size => `
                                            <button class="size-option btn btn-outline btn-sm">${size}</button>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                                <button class="btn btn-primary btn-lg" onclick="app.cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')}); app.ui.toggleCart();" ${product.stock === 0 ? 'disabled' : ''} style="flex: 1;">
                                    <i class="fas fa-shopping-cart"></i> ${app.language.t('products.add_to_cart')}
                                </button>
                                <button class="btn btn-outline btn-lg wishlist-toggle ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                                    <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                                </button>
                                <button class="btn btn-outline btn-lg" onclick="app.ui.shareProduct('${product.id}')">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1.5rem; background: var(--surface); border-radius: var(--radius-lg);">
                                <div style="text-align: center;">
                                    <i class="fas fa-shipping-fast" style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;"></i>
                                    <div style="font-weight: 600;">${app.language.currentLanguage === 'en' ? 'Free Shipping' : 'Kohereza ku buntu'}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${app.language.currentLanguage === 'en' ? 'On orders over $50' : 'Ku bicuruzwa birenze $50'}</div>
                                </div>
                                <div style="text-align: center;">
                                    <i class="fas fa-undo" style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;"></i>
                                    <div style="font-weight: 600;">${app.language.currentLanguage === 'en' ? '30-Day Returns' : 'Gusubiza iminsi 30'}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${app.language.currentLanguage === 'en' ? 'Money back guarantee' : 'Kwishyura amafaranga'}</div>
                                </div>
                                <div style="text-align: center;">
                                    <i class="fas fa-shield-alt" style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;"></i>
                                    <div style="font-weight: 600;">${app.language.currentLanguage === 'en' ? 'Secure Payment' : 'Kwishura umutekano'}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${app.language.currentLanguage === 'en' ? '100% secure' : 'Umutekano 100%'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${relatedProducts.length > 0 ? `
                        <div style="margin-top: 4rem;">
                            <h2 class="section-title" style="margin-bottom: 2rem;">${app.language.currentLanguage === 'en' ? 'Related Products' : 'Ibicuruzwa bifitanye isano'}</h2>
                            <div class="products-grid grid grid-4">
                                ${relatedProducts.map(p => app.products.generateProductCard(p)).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Continue adding more render methods...



    renderCartPage() {
        const cart = app.cart;

        if (cart.isEmpty()) {
            return `
                <div class="section-padding">
                    <div class="container" style="text-align: center; padding: 4rem 0;">
                        <i class="fas fa-shopping-cart" style="font-size: 6rem; color: var(--text-muted); opacity: 0.3; margin-bottom: 2rem;"></i>
                        <h2>${app.language.t('cart.empty')}</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">${app.language.t('cart.continue_shopping')}</p>
                        <a href="#/shop" class="btn btn-primary btn-lg">${app.language.t('nav.shop')}</a>
                    </div>
                </div>
            `;
        }

        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title mb-4">${app.language.t('cart.title')}</h1>
                    
                    <div class="grid grid-2" style="gap: 2rem; align-items: start;">
                        <div>
                            ${cart.getItems().map(item => `
                                <div class="cart-item-page" data-id="${item.id}" style="display: flex; gap: 1rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius-lg); margin-bottom: 1rem; box-shadow: var(--shadow);">
                                    <img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius);">
                                    <div style="flex: 1;">
                                        <h3 style="margin-bottom: 0.5rem;">${item.name}</h3>
                                        <div style="color: var(--accent); font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem;">${Utils.formatCurrency(item.price)}</div>
                                        <div style="display: flex; align-items: center; gap: 1rem;">
                                            <div class="quantity-control">
                                                <button class="quantity-btn" onclick="app.cart.decreaseQuantity('${item.id}'); app.router.handleRoute();">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                                                <button class="quantity-btn" onclick="app.cart.increaseQuantity('${item.id}'); app.router.handleRoute();">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            <button class="btn btn-outline btn-sm" onclick="app.cart.removeItem('${item.id}'); app.router.handleRoute();">
                                                <i class="fas fa-trash"></i> ${app.language.currentLanguage === 'en' ? 'Remove' : 'Kuraho'}
                                            </button>
                                        </div>
                                    </div>
                                    <div style="font-weight: 700; font-size: 1.25rem;">
                                        ${Utils.formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div style="position: sticky; top: 100px;">
                            <div style="padding: 2rem; background: var(--surface); border-radius: var(--radius-lg);">
                                <h3 class="mb-3">${app.language.t('checkout.order_summary')}</h3>
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span>${app.language.t('cart.subtotal')}</span>
                                    <span style="font-weight: 600;">${Utils.formatCurrency(cart.getSubtotal())}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span>${app.language.t('cart.shipping')}</span>
                                    <span style="font-weight: 600;">${Utils.formatCurrency(cart.getShipping())}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span>${app.language.t('cart.tax')}</span>
                                    <span style="font-weight: 600;">${Utils.formatCurrency(cart.getTax())}</span>
                                </div>
                                
                                <hr style="margin: 1.5rem 0; border: none; border-top: 2px solid var(--border-color);">
                                
                                <div style="display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">
                                    <span>${app.language.t('cart.total')}</span>
                                    <span style="color: var(--accent);">${Utils.formatCurrency(cart.getTotal())}</span>
                                </div>
                                
                                <a href="#/checkout" class="btn btn-primary btn-full btn-lg">${app.language.t('cart.checkout')}</a>
                                <a href="#/shop" class="btn btn-outline btn-full mt-2">${app.language.t('cart.continue_shopping')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderWishlistPage() {
        const items = app.wishlist.getItems();

        if (items.length === 0) {
            return `
                <div class="section-padding">
                    <div class="container" style="text-align: center; padding: 4rem 0;">
                        <i class="fas fa-heart" style="font-size: 6rem; color: var(--text-muted); opacity: 0.3; margin-bottom: 2rem;"></i>
                        <h2>${app.language.currentLanguage === 'en' ? 'Your wishlist is empty' : 'Ibyifuzo byawe ntibyuzuye'}</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">${app.language.currentLanguage === 'en' ? 'Add some products you love' : 'Ongeraho ibicuruzwa ukunda'}</p>
                        <a href="#/shop" class="btn btn-primary btn-lg">${app.language.t('nav.shop')}</a>
                    </div>
                </div>
            `;
        }

        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title mb-4">${app.language.t('profile.wishlist')}</h1>
                    <p class="text-secondary mb-4">${items.length} ${app.language.currentLanguage === 'en' ? 'items' : 'ibintu'}</p>
                    
                    <div class="grid grid-4">
                        ${items.map(item => `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="${item.image}" alt="${item.name}">
                                    <button class="product-action remove-wishlist" onclick="app.wishlist.removeItem('${item.id}'); app.router.handleRoute();" style="position: absolute; top: 1rem; right: 1rem; background: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow);">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div class="product-content">
                                    <h3 class="product-title">${item.name}</h3>
                                    <div class="product-price">
                                        <span class="current-price">${Utils.formatCurrency(item.price)}</span>
                                    </div>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                                        <a href="#/product/${item.id}" class="btn btn-outline btn-sm" style="flex: 1;">${app.language.t('common.view')}</a>
                                        <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="event.preventDefault(); app.products.getProduct('${item.id}').then(p => app.cart.addItem(p));">
                                            <i class="fas fa-shopping-cart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderCheckoutPage() {
        if (app.cart.isEmpty()) {
            window.location.hash = '/cart';
            return '';
        }

        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title mb-4">${app.language.t('checkout.title')}</h1>
                    
                    <div class="grid grid-2" style="gap: 2rem;">
                        <div>
                            <h3 class="mb-3">${app.language.t('checkout.shipping_address')}</h3>
                            <form id="checkoutForm" class="checkout-form">
                                <div class="form-group mb-3">
                                    <label class="form-label">${app.language.currentLanguage === 'en' ? 'Full Name' : 'Amazina yombi'}</label>
                                    <input type="text" class="form-control" required>
                                </div>
                                
                                <div class="form-group mb-3">
                                    <label class="form-label">${app.language.t('auth.email')}</label>
                                    <input type="email" class="form-control" required>
                                </div>
                                
                                <div class="form-group mb-3">
                                    <label class="form-label">${app.language.currentLanguage === 'en' ? 'Phone' : 'Telefoni'}</label>
                                    <input type="tel" class="form-control" required>
                                </div>
                                
                                <div class="form-group mb-3">
                                    <label class="form-label">${app.language.currentLanguage === 'en' ? 'Address' : 'Aderesi'}</label>
                                    <input type="text" class="form-control" required>
                                </div>
                                
                                <div class="grid grid-2 mb-3" style="gap: 1rem;">
                                    <div class="form-group">
                                        <label class="form-label">${app.language.currentLanguage === 'en' ? 'City' : 'Umujyi'}</label>
                                        <input type="text" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">${app.language.currentLanguage === 'en' ? 'Postal Code' : 'Kode ya posita'}</label>
                                        <input type="text" class="form-control" required>
                                    </div>
                                </div>
                                
                                <div class="form-group mb-4">
                                    <label class="form-label">${app.language.currentLanguage === 'en' ? 'Country' : 'Igihugu'}</label>
                                    <select class="form-control" required>
                                        <option value="">${app.language.currentLanguage === 'en' ? 'Select Country' : 'Hitamo Igihugu'}</option>
                                        <option value="RW">Rwanda</option>
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="CA">Canada</option>
                                    </select>
                                </div>
                                
                                <h3 class="mb-3">${app.language.t('checkout.payment_method')}</h3>
                                <div class="payment-methods mb-4">
                                    <label class="payment-method" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 2px solid var(--border-color); border-radius: var(--radius); margin-bottom: 0.5rem; cursor: pointer;">
                                        <input type="radio" name="payment" value="card" checked>
                                        <i class="fas fa-credit-card" style="font-size: 1.5rem;"></i>
                                        <span>${app.language.currentLanguage === 'en' ? 'Credit/Debit Card' : 'Ikarita y\'Inguzanyo'}</span>
                                    </label>
                                    <label class="payment-method" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 2px solid var(--border-color); border-radius: var(--radius); margin-bottom: 0.5rem; cursor: pointer;">
                                        <input type="radio" name="payment" value="mobile">
                                        <i class="fas fa-mobile-alt" style="font-size: 1.5rem;"></i>
                                        <span>${app.language.currentLanguage === 'en' ? 'Mobile Money' : 'Amafaranga ya Telefoni'}</span>
                                    </label>
                                    <label class="payment-method" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 2px solid var(--border-color); border-radius: var(--radius); cursor: pointer;">
                                        <input type="radio" name="payment" value="cod">
                                        <i class="fas fa-money-bill-wave" style="font-size: 1.5rem;"></i>
                                        <span>${app.language.currentLanguage === 'en' ? 'Cash on Delivery' : 'Kwishyura ugeze'}</span>
                                    </label>
                                </div>
                                
                                <button type="submit" class="btn btn-primary btn-full btn-lg">${app.language.t('checkout.place_order')}</button>
                            </form>
                        </div>
                        
                        <div style="position: sticky; top: 100px;">
                            <div style="padding: 2rem; background: var(--surface); border-radius: var(--radius-lg);">
                                <h3 class="mb-3">${app.language.t('checkout.order_summary')}</h3>
                                
                                <div class="order-items mb-3">
                                    ${app.cart.getItems().map(item => `
                                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                                            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
                                            <div style="flex: 1;">
                                                <div style="font-weight: 600; margin-bottom: 0.25rem;">${item.name}</div>
                                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Qty: ${item.quantity}</div>
                                            </div>
                                            <div style="font-weight: 600;">${Utils.formatCurrency(item.price * item.quantity)}</div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span>${app.language.t('cart.subtotal')}</span>
                                    <span style="font-weight: 600;">${Utils.formatCurrency(app.cart.getSubtotal())}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span>${app.language.t('cart.shipping')}</span>
                                    <span style="font-weight: 600;">${Utils.formatCurrency(app.cart.getShipping())}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span>${app.language.t('cart.tax')}</span>
                                    <span style="font-weight: 600;">${Utils.formatCurrency(app.cart.getTax())}</span>
                                </div>
                                
                                <hr style="margin: 1.5rem 0; border: none; border-top: 2px solid var(--border-color);">
                                
                                <div style="display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 700;">
                                    <span>${app.language.t('cart.total')}</span>
                                    <span style="color: var(--accent);">${Utils.formatCurrency(app.cart.getTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLoginPage() {
        return `
            <div class="section-padding">
                <div class="container" style="max-width: 500px;">
                    <div class="auth-card" style="padding: 3rem; background: var(--card-bg); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);">
                        <h1 class="section-title text-center mb-4">${app.language.t('auth.login')}</h1>
                        
                        <form id="loginForm" class="auth-form">
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.t('auth.email')}</label>
                                <input type="email" class="form-control" id="loginEmail" placeholder="example@gmailcom" required>
                            </div>
                            
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.t('auth.password')}</label>
                                <input type="password" class="form-control" id="loginPassword" placeholder="type password" required>
                            </div>
                            
                            <div class="form-group mb-4" style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" id="rememberMe">
                                <label for="rememberMe" style="cursor: pointer;">${app.language.t('auth.remember_me')}</label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full btn-lg mb-3">${app.language.t('auth.sign_in')}</button>
                            
                            <div class="text-center">
                                <a href="#/forgot-password" class="text-sm">${app.language.t('auth.forgot_password')}</a>
                            </div>
                        </form>
                        
                        <hr style="margin: 2rem 0;">
                        
                        <div class="text-center">
                            <p>${app.language.t('auth.no_account')} <a href="#/register" style="color: var(--primary); font-weight: 600;">${app.language.t('auth.sign_up')}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRegisterPage() {
        return `
            <div class="section-padding">
                <div class="container" style="max-width: 500px;">
                    <div class="auth-card" style="padding: 3rem; background: var(--card-bg); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);">
                        <h1 class="section-title text-center mb-4">${app.language.t('auth.register')}</h1>
                        
                        <form id="registerForm" class="auth-form">
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.currentLanguage === 'en' ? 'Full Name' : 'Amazina yombi'}</label>
                                <input type="text" class="form-control"  id="registerName" required>
                            </div>
                            
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.t('auth.email')}</label>
                                <input type="email" class="form-control" placeholder="type your email" id="registerEmail" required>
                            </div>
                            
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.t('auth.password')}</label>
                                <input type="password" class="form-control" placeholder="your password" id="registerPassword" required minlength="6">
                            </div>
                            
                            <div class="form-group mb-4">
                                <label class="form-label">${app.language.t('auth.confirm_password')}</label>
                                <input type="password" class="form-control" placeholder="repeat password" id="registerConfirmPassword" required minlength="6">
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full btn-lg mb-3">${app.language.t('auth.sign_up')}</button>
                        </form>
                        
                        <hr style="margin: 2rem 0;">
                        
                        <div class="text-center">
                            <p>${app.language.t('auth.have_account')} <a href="#/login" style="color: var(--primary); font-weight: 600;">${app.language.t('auth.sign_in')}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfilePage() {
        if (!app.auth.isLoggedIn()) {
            window.location.hash = '/login';
            return '';
        }

        const user = app.auth.getCurrentUser();

        return `
            <div class="section-padding">
                <div class="container">
                    <div class="grid grid-3" style="gap: 2rem;">
                        <div style="grid-column: span 1;">
                            <div style="padding: 2rem; background: var(--card-bg); border-radius: var(--radius-lg); text-align: center;">
                                <img src="${user.avatar}" alt="${user.name}" style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 1rem;">
                                <h2 style="margin-bottom: 0.5rem;">${user.name}</h2>
                                <p style="color: var(--text-secondary); margin-bottom: 2rem;">${user.email}</p>
                                
                                <nav style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <a href="#/profile" class="nav-item active" style="padding: 0.75rem 1rem; border-radius: var(--radius); background: var(--surface);">${app.language.t('profile.my_account')}</a>
                                    <a href="#/orders" class="nav-item" style="padding: 0.75rem 1rem; border-radius: var(--radius);">${app.language.t('profile.orders')}</a>
                                    <a href="#/wishlist" class="nav-item" style="padding: 0.75rem 1rem; border-radius: var(--radius);">${app.language.t('profile.wishlist')}</a>
                                    <a href="#/addresses" class="nav-item" style="padding: 0.75rem 1rem; border-radius: var(--radius);">${app.language.t('profile.addresses')}</a>
                                    <a href="#/settings" class="nav-item" style="padding: 0.75rem 1rem; border-radius: var(--radius);">${app.language.t('profile.settings')}</a>
                                    <button onclick="app.auth.logout()" class="btn btn-outline btn-full mt-3">${app.language.t('auth.logout')}</button>
                                </nav>
                            </div>
                        </div>
                        
                        <div style="grid-column: span 2;">
                            <div style="padding: 2rem; background: var(--card-bg); border-radius: var(--radius-lg);">
                                <h2 class="mb-4">${app.language.t('profile.my_account')}</h2>
                                
                                <div class="grid grid-2 mb-4" style="gap: 1rem;">
                                    <div>
                                        <strong>${app.language.currentLanguage === 'en' ? 'Name' : 'Izina'}:</strong>
                                        <p>${user.name}</p>
                                    </div>
                                    <div>
                                        <strong>${app.language.t('auth.email')}:</strong>
                                        <p>${user.email}</p>
                                    </div>
                                    <div>
                                        <strong>${app.language.currentLanguage === 'en' ? 'Member Since' : 'Umwanditsi kuva'}:</strong>
                                        <p>${Utils.formatDate(user.createdAt)}</p>
                                    </div>
                                    <div>
                                        <strong>${app.language.currentLanguage === 'en' ? 'Language' : 'Ururimi'}:</strong>
                                        <p>${user.preferences.language === 'en' ? 'English' : 'Kinyarwanda'}</p>
                                    </div>
                                </div>
                                
                                <h3 class="mb-3">${app.language.currentLanguage === 'en' ? 'Recent Activity' : 'Ibikorwa by\'umwanya gushize'}</h3>
                                <p style="color: var(--text-secondary);">${app.language.currentLanguage === 'en' ? 'No recent activity' : 'Nta bikorwa by\'umwanya gushize'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderSearchPage(params, queryParams) {
        const query = queryParams.get('q');
        if (!query) {
            window.location.hash = '/';
            return '';
        }

        const products = await app.products.searchProducts(query, 50);

        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title">${app.language.currentLanguage === 'en' ? 'Search Results' : 'Ibisubizo by\'Ishakisha'} "${query}"</h1>
                    <p class="text-secondary mb-4">${products.length} ${app.language.currentLanguage === 'en' ? 'products found' : 'ibicuruzwa byabonetse'}</p>
                    
                    ${products.length > 0 ? `
                        <div class="products-grid grid grid-4">
                            ${products.map(product =>
            app.products.generateProductCard(product)
        ).join('')}
                        </div>
                    ` : `
                        <div style="text-center; padding: 4rem 0;">
                            <i class="fas fa-search" style="font-size: 6rem; color: var(--text-muted); opacity: 0.3; margin-bottom: 2rem;"></i>
                            <h3>${app.language.t('search.no_results')}</h3>
                            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${app.language.currentLanguage === 'en' ? 'Try different keywords or browse our categories' : 'Gerageza amagambo atandukanye cyangwa urebe ibyiciro byacu'}</p>
                            <a href="#/shop" class="btn btn-primary">${app.language.t('nav.shop')}</a>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    async renderCategoryPage(params) {
        const categoryId = params.id;
        const categories = await app.products.getCategories();
        const category = categories.find(c => c.id === categoryId);

        if (!category) {
            return this.renderNotFoundPage();
        }

        const { products } = await app.products.getProducts(1, { category: category.name });

        return `
            <div class="section-padding">
                <div class="container">
                    <div class="page-header text-center mb-5">
                        <div class="category-icon" style="width: 100px; height: 100px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-light), var(--primary)); color: white; border-radius: var(--radius-full); font-size: 3rem;">
                            <i class="fas fa-${category.icon}"></i>
                        </div>
                        <h1 class="section-title">${category.name}</h1>
                        <p class="text-secondary">${category.count} ${app.language.currentLanguage === 'en' ? 'products' : 'ibicuruzwa'}</p>
                    </div>
                    
                    ${products.length > 0 ? `
                        <div class="products-grid grid grid-4">
                            ${products.map(product =>
            app.products.generateProductCard(product)
        ).join('')}
                        </div>
                    ` : `
                        <div style="text-center; padding: 4rem 0;">
                            <i class="fas fa-box-open" style="font-size: 6rem; color: var(--text-muted); opacity: 0.3; margin-bottom: 2rem;"></i>
                            <h3>${app.language.currentLanguage === 'en' ? 'No products in this category' : 'Nta bicuruzwa muri iki cyiciro'}</h3>
                            <a href="#/shop" class="btn btn-primary mt-3">${app.language.t('products.all')}</a>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    async renderDealsPage() {
        const { products } = await app.products.getProducts(1, {});
        const deals = products.filter(p => p.originalPrice);

        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title">${app.language.t('nav.deals')}</h1>
                    <p class="text-secondary mb-4">${app.language.currentLanguage === 'en' ? 'Save big on these products' : 'Kiza amafaranga ku bicuruzwa bikurikira'}</p>
                    
                    <div class="products-grid grid grid-4">
                        ${deals.map(product =>
            app.products.generateProductCard(product)
        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderAboutPage() {
        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title text-center mb-4">${app.language.t('footer.about')}</h1>
                    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 2rem;">
                            ${app.language.currentLanguage === 'en'
                ? 'We are your trusted destination for premium quality products. Our mission is to bring you the best selection at competitive prices with exceptional customer service.'
                : 'Turi ahantu hawe wakizera ibicuruzwa byiza. Intego yacu ni ukuzanira uruhererekane rwiza ku giciro cyiza hamwe n\'ubufasha bwabakiriya'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderContactPage() {
        return `
            <div class="section-padding">
                <div class="container">
                    <h1 class="section-title text-center mb-4">${app.language.t('footer.contact')}</h1>
                    <div style="max-width: 600px; margin: 0 auto;">
                        <form id="contactForm" style="padding: 2rem; background: var(--card-bg); border-radius: var(--radius-lg);">
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.currentLanguage === 'en' ? 'Name' : 'Izina'}</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.t('auth.email')}</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="form-group mb-3">
                                <label class="form-label">${app.language.currentLanguage === 'en' ? 'Message' : 'Ubutumwa'}</label>
                                <textarea class="form-control" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">${app.language.currentLanguage === 'en' ? 'Send Message' : 'Ohereza Ubutumwa'}</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    renderNotFoundPage() {
        return `
            <div class="section-padding">
                <div class="container" style="text-center; padding: 6rem 0;">
                    <h1 style="font-size: 8rem; font-weight: 900; color: var(--primary); margin-bottom: 1rem;">404</h1>
                    <h2 style="margin-bottom: 1rem;">${app.language.currentLanguage === 'en' ? 'Page Not Found' : 'Urupapuro Ntirubonetse'}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">${app.language.currentLanguage === 'en' ? 'The page you are looking for doesn\'t exist or has been moved.' : 'Urupapuro urashaka ntiruhari cyangwa rwimutse.'}</p>
                    <a href="#/" class="btn btn-primary btn-lg">${app.language.t('nav.home')}</a>
                </div>
            </div>
        `;
    }

    renderErrorPage(error) {
        return `
            <div class="section-padding">
                <div class="container" style="text-center; padding: 6rem 0;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 6rem; color: var(--error); margin-bottom: 2rem;"></i>
                    <h1 style="margin-bottom: 1rem;">Oops!</h1>
                    <h2 style="margin-bottom: 1rem;">${app.language.currentLanguage === 'en' ? 'Something went wrong' : 'Habaye ikibazo'}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">${error.message}</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <a href="#/" class="btn btn-primary">${app.language.t('nav.home')}</a>
                        <button onclick="window.location.reload()" class="btn btn-outline">${app.language.currentLanguage === 'en' ? 'Try Again' : 'Ongera Ugerageze'}</button>
                    </div>
                </div>
            </div>
        `;
    }

    initializePageScripts(route, params, queryParams) {
        // Initialize sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = app.products.sortBy;
            sortSelect.addEventListener('change', (e) => {
                app.products.setSortBy(e.target.value);
                this.handleRoute();
            });
        }

        // Initialize checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                app.showToast(app.language.t('message.order_success'), 'success');
                app.cart.clear();
                setTimeout(() => {
                    window.location.hash = '/';
                }, 2000);
            });
        }

        // Initialize login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                try {
                    await app.auth.login(email, password);
                    window.location.hash = '/profile';
                } catch (error) {
                    app.showToast(error.message, 'error');
                }
            });
        }

        // Initialize register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;

                if (password !== confirmPassword) {
                    app.showToast(app.language.currentLanguage === 'en' ? 'Passwords do not match' : 'Amagambo y\'ibanga ntabwo ahura', 'error');
                    return;
                }

                try {
                    await app.auth.register({ name, email, password });
                    window.location.hash = '/profile';
                } catch (error) {
                    app.showToast(error.message, 'error');
                }
            });
        }

        // Initialize contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                app.showToast(app.language.currentLanguage === 'en' ? 'Message sent successfully!' : 'Ubutumwa bwoherejwe neza!', 'success');
                contactForm.reset();
            });
        }

        // Wishlist toggle on product page
        document.querySelectorAll('.wishlist-toggle').forEach(btn => {
            btn.addEventListener('click', async () => {
                const productId = btn.dataset.id;
                const product = await app.products.getProduct(productId);

                if (app.wishlist.hasItem(productId)) {
                    app.wishlist.removeItem(productId);
                    btn.classList.remove('active');
                    btn.querySelector('i').classList.remove('fas');
                    btn.querySelector('i').classList.add('far');
                } else {
                    app.wishlist.addItem(product);
                    btn.classList.add('active');
                    btn.querySelector('i').classList.remove('far');
                    btn.querySelector('i').classList.add('fas');
                }
            });
        });
    }
}

// ===== MAIN APPLICATION =====
class NexusShop {
    constructor() {
        this.language = new LanguageManager();
        this.theme = new ThemeManager();
        this.cart = new CartManager();
        this.wishlist = new WishlistManager();
        this.auth = new AuthManager();
        this.products = new ProductsManager();
        this.analytics = new AnalyticsManager();
        this.ui = new UIManager();
        this.router = new Router();
    }

    init() {
        console.log(`🚀 Initializing ${CONFIG.APP_NAME} v${CONFIG.VERSION}...`);

        // Initialize all managers
        this.language.init();
        this.theme.init();
        this.cart.init();
        this.wishlist.init();
        this.auth.init();
        this.products.init();
        this.analytics.init();
        this.ui.init();
        this.router.init();

        // Load categories
        this.loadCategories();

        // Update cart count
        this.updateCartCount();

        // Handle route
        this.router.handleRoute();

        console.log('✅ Application initialized successfully!');
    }

    async loadCategories() {
        try {
            const categories = await this.products.getCategories();
            const categoriesDropdown = document.getElementById('categoriesDropdown');

            if (categoriesDropdown) {
                categoriesDropdown.innerHTML = categories.map(category => `
                    <a href="#/category/${category.id}" class="category-item">
                        <span>${category.name}</span>
                        <span class="category-count">${category.count}</span>
                    </a>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const count = this.cart.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        return this.ui.showToast(message, type, duration);
    }

    showLoading() {
        this.ui.showLoading();
    }

    hideLoading() {
        this.ui.hideLoading();
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NexusShop();
    window.app.init();

    console.log('🎉 Welcome to NexusShop!');
    console.log('📦 Total Products:', window.app.products.products.length);
    console.log('🛒 Cart Items:', window.app.cart.getItemCount());
    console.log('❤️ Wishlist Items:', window.app.wishlist.getCount());
    console.log('🌐 Language:', window.app.language.currentLanguage);
    console.log('🎨 Theme:', window.app.theme.theme);
    console.log('👤 Logged In:', window.app.auth.isLoggedIn());
});

// ===== GLOBAL ERROR HANDLER =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app) {
        window.app.showToast('An error occurred. Please try again.', 'error');
    }
});

// ===== SERVICE WORKER (for future PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker when ready
        // navigator.serviceWorker.register('/sw.js');
    });
}

console.log('📝 NexusShop JavaScript loaded successfully!');
console.log('📏 Total lines of code: ~4000+');
console.log('✨ Features: Multi-language, Theme switching, Cart, Wishlist, Analytics, and more!');

