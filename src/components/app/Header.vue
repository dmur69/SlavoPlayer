<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name
      to="about" = relative to current/active path
      to="/about" = relative to domain-->
      <router-link
        :to="{ name: 'home' }"
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="not-active"
        >Слушать</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white"
              >About</router-link
            >
          </li>
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }"
                >Manage</router-link
              >
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logoutUser"
                >Logout</a
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
// import { mapMutations, mapState, mapActions } from "vuex";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn
    })
  },
  methods: {
    // ... = spread operator = merges object returned from mapMutations like a new method
    // maps mutation object from the store
    ...mapMutations(["toggleAuthModal"]),
    //
    // This is the alternative with $store.commit = "commit theb changes to store"
    // toggleAuthModal() {
    //   this.$store.commit('toggleAuthModal');
    // },
    //
    // mapAction to logout user:
    // ...mapActions(["logoutUser"])
    //
    // Alternativ with dispatch
    logoutUser() {
      this.$store.dispatch("logoutUser");

      // Redirect to home view
      if (this.$route.meta.requiresAuthentication) {
        this.$router.push({ name: "home" });
      }
    }
  }
};
</script>
