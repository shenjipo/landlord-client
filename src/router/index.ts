import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        name: 'Login',
        path: '/',
        component: () => import('../views/Login.vue')
    },
    {
        name: 'WaitingHall',
        path: '/WaitingHall',
        component: () => import('../views/WaitingHall.vue')
    },
    {
        name: 'Room',
        path: '/Room/:roomId',
        component: () => import('../views/Room.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})
// 没有身份的用户去登录页
router.beforeEach((to, from) => {
   
    if (to.fullPath !== '/' && !sessionStorage.getItem('user')) {
        return { name: 'Login' }
    }
    return true
})
export default router
