<template>
  <!-- Auth Modal -->
  <div
    id="modal"
    class="fixed z-10 inset-0 overflow-y-auto"
    :class="{ hidden: !authShowModal }"
  >
    <div
      class="
        flex
        items-end
        justify-center
        min-h-screen
        pt-4
        px-4
        pb-20
        text-center
        sm:block
        sm:p-0
      "
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >&#8203;</span
      >

      <div
        class="
          inline-block
          align-bottom
          bg-white
          rounded-lg
          text-left
          overflow-hidden
          shadow-xl
          transform
          transition-all
          sm:my-8
          sm:align-middle
          sm:max-w-lg
          sm:w-full
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div
              class="modal-close cursor-pointer z-50"
              @click.prevent="toggleAuthModal"
            >
              <i class="fas fa-times" />
            </div>
          </div>
          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'login'
                }"
                href="#"
                @click.prevent="tab = 'login'"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'register'
                }"
                href="#"
                @click.prevent="tab = 'register'"
                >Register</a
              >
            </li>
          </ul>
          <!-- Login Form -->
          <app-form-login :activeTab="tab" v-show="tab === 'login'" />
          <!-- Registration Form -->
          <app-form-register :activeTab="tab" v-show="tab === 'register'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import AppFormRegister from "./FormRegister.vue";
import AppFormLogin from "./FormLogin.vue";

export default {
  components: { AppFormRegister, AppFormLogin },
  name: "Auth",
  data() {
    return {
      tab: "login"
    };
  },
  computed: {
    // Not optimal dirct access to a getter in store
    // getAuthShowModal() {
    //   return this.$store.getters.getAuthShowModal;
    // },
    //
    // using mapGetters  makes sense only if some calculation takes place
    // ...mapGetters(['getAuthShowModal']),
    //
    // in our case use of mapState is recommended / only reads a value
    ...mapState({
      authShowModal: (state) => state.auth.authShowModal
    })
  },
  methods: {
    ...mapMutations(["toggleAuthModal"])
    // // Using aliases for even shorter notation
    // ...mapMutations({
    //     toggle: 'toggleAuthModal',
    // }),
  }
};
</script>
