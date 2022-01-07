import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
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
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.token) {
          next("/");
        } else {
          next();
        }
      },
    },
    {
      path: "/profile",
      name: "UserProfile",
      component: () => import("../views/UserProfile"),

      // empêcher l'entrée par saisi direct dans l'url
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.token) {
          next("/");
        } else {
          next();
        }
      },
    },
  ],
});

export default router;
