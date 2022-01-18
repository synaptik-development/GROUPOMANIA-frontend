import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home"),
  },
  {
    path: "/newswall",
    name: "NewsWall",
    component: () => import("../views/NewsWall"),

    // empêcher l'entrée par saisi direct dans l'url
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import("../views/UserProfile"),

    // empêcher l'entrée par saisi direct dans l'url
    meta: {
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(store.getters.isLoggedIn){
      next()
      return
    }
    next("/")
  }else{
    next()
  }
});

export default router;
