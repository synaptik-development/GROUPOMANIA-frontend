import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/newswall',
    name: 'NewsWall',
    component: () => import('../views/NewsWall')
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('../views/UserProfile')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
