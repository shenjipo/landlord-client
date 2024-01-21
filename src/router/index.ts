import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        name: '',
        path: '/',
        component: () => import('../views/Login.vue')
    },
    {
        name: 'WaitingHall',
        path: '/WaitingHall',
        component: () => import('../views/WaitingHall.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
