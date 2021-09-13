import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Manage from "@/views/Manage.vue";
import Track from "@/views/Track.vue";
import About from "@/views/About.vue";
import store from "@/store";

// Define routes
const routes = [
  {
    name: "home",
    path: "/",
    component: Home
  },
  {
    name: "track",
    path: "/track/:id",
    component: Track
  },
  {
    name: "track_tag_link",
    path: "/track/:id/tag/:tag_id",
    component: Track
  },
  {
    name: "manage",
    // alias: "/manage", // do not redirect!
    path: "/manage-music",
    meta: {
      requiresAuthentication: true
    },
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log("beforeEnter Guard / defined in route/index.js");

      // Render and leave Guard if page not requires authentication
      if (!to.matched.some(record => record.meta.requiresAuthentication)) {
        next();
        return;
      }

      // Show requiresAuthentication page only for logged in user
      console.log(store.state);
      if (store.state.auth.userLoggedIn) {
        next();
      } else {
        next({ name: "home" }); // redirects to home named view
      }
    }
  },
  {
    name: "about",
    path: "/about",
    component: About
  },
  // pure redirect route
  {
    path: "/manage",
    redirect: { name: "manage" } // redirect via name
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" } // redirect all unknown pages to home
  }
];

// Create object managing defined routes
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500"
});

// Protect user access to certain routes: GLOBAL GUARD
router.beforeEach((to, from, next) => {
  console.log("Global Guard run.");
  next(); // renders page normally // No call - no redenring at all = white page
});

export default router;
