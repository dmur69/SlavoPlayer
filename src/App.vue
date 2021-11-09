<template>
  <div>
    <!-- App Header -->
    <app-header />

    <!-- Page contens via vue router -->
    <router-view :key="$route.fullPath"></router-view>

    <!-- Modal Login and Registration Form -->
    <auth-modal />
  </div>
</template>

<script>
import AppHeader from "./components/app/Header.vue";
import AuthModal from "./components/app/Auth.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AuthModal
  },
  // Vue Life-Cycle function
  created() {
    // To persist User LoggedIn in Browsers Store "IndexedDB"
    this.$store.dispatch("initLogin");
  }
};
</script>
