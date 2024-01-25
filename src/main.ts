import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './assets/index.scss'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App)
    .use(router)
    .use(ArcoVue)
    .use(pinia)
    .mount('#app')
