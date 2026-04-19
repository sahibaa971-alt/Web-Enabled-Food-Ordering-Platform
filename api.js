/**
 * Mock API Service
 * Simulates backend API calls using AuthService and network delays
 */

const ApiService = {
    /**
     * Simulate login API call
     */
    async login(email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            return AuthService.login(email, password);
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "An unexpected error occurred" };
        }
    },

    /**
     * Simulate register API call
     */
    async register(name, email, password) {
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            return AuthService.register(name, email, password);
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, message: "An unexpected error occurred" };
        }
    },

    /**
     * Simulate review submission
     */
    async submitReview(data) {
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log("Mock Review Submission:", data);

        // Randomly succeed
        return { success: true, message: "Review submitted successfully!" };
    }
};

// Expose to window
window.ApiService = ApiService;
