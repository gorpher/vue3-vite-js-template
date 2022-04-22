import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
router.beforeEach((to, from, next) => {
    next()
})
const vue = createApp(App)
vue.use(router)
vue.use(store)
vue.mount('#app')
