/**
 * Mock Authentication Service
 * Uses localStorage to simulate a backend database.
 */

const AuthService = {
    // Keys for localStorage
    USERS_KEY: 'quickbite_users',
    CURRENT_USER_KEY: 'quickbite_current_user',

    /**
     * Initialize keys if not present
     */
    init() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    },

    /**
     * Register a new user
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns {object} { success: boolean, message: string }
     */
    register(name, email, password) {
        this.init();
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));

        // Check if email exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Auto login after register
        this.setCurrentUser(newUser);

        return { success: true, message: 'Registration successful' };
    },

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {object} { success: boolean, message: string }
     */
    login(email, password) {
        this.init();
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.setCurrentUser(user);
            return { success: true, message: 'Login successful' };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Get current logged in user
     * @returns {object|null}
     */
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    },

    /**
     * Set current user session
     * @param {object} user 
     */
    setCurrentUser(user) {
        // Don't store password in session
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionUser));
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem(this.CURRENT_USER_KEY);
    },

    // --- Order Management (Database) ---
    ORDERS_KEY: 'quickbite_orders',

    saveOrder(order) {
        let orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
        orders.unshift(order); // Add to top
        localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    },

    getOrders() {
        return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    },

    getAllUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },

    clearDatabase() {
        localStorage.removeItem(this.USERS_KEY);
        localStorage.removeItem(this.ORDERS_KEY);
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.reload();
    }
};

// Expose to window
window.AuthService = AuthService;

// Init immediately
AuthService.init();
