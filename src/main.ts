import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configure Axios for CSRF and base URL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; // Your Laravel backend URL
axios.defaults.withXSRFToken = true;

// Function to get CSRF token
async function getCsrfToken() {
    try {
        await axios.get('/sanctum/csrf-cookie');
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
