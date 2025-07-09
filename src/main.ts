import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configure Axios for CSRF and base URL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; // Your Laravel backend URL

// Add a request interceptor to manually set the X-XSRF-TOKEN header
axios.interceptors.request.use(config => {
    // Get the XSRF-TOKEN from the cookies
    const xsrfToken = document.cookie.split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (xsrfToken) {
        // Decode the token (it's URL-encoded by Laravel)
        const decodedToken = decodeURIComponent(xsrfToken);
        config.headers['X-XSRF-TOKEN'] = decodedToken;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Function to get CSRF token
async function getCsrfToken() {
    try {
        await axios.get('/sanctum/csrf-cookie');
        console.log('CSRF cookie set successfully.');
    } catch (error) {
        console.error('Failed to get CSRF cookie:', error);
    }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Call getCsrfToken before mounting the app
getCsrfToken().then(() => {
    app.mount('#app')
});