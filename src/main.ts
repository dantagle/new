import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// vs React: like createRoot(el).render(<App />), but plugins (Pinia, router) are registered
// on the app instance with app.use() before mounting, instead of wrapping <App> in providers.
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
