<template>
  <div>
    <!-- Alert area -->
    <div
      class="text white text-center font-bold p-5 mb-4"
      v-if="login_show_alert"
      :class="login_alert_variant"
    >
      {{ login_alert_message }}
    </div>
    <vee-form :validation-schema="valSchema" @submit="loginUser">
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          name="email"
          class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none
            focus:border-black
            rounded
          "
          placeholder="Enter Email"
        />
        <ErrorMessage class="text-red-600" name="email" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          type="password"
          name="password"
          class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none
            focus:border-black
            rounded
          "
          placeholder="Password"
        />
        <ErrorMessage class="text-red-600" name="password" />
      </div>
      <button
        type="submit"
        class="
          block
          w-full
          bg-purple-600
          text-white
          py-1.5
          px-3
          rounded
          transition
          hover:bg-purple-700
        "
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import AppAlertBox from "./AlertBox.vue";

export default {
  name: "FormLogin",
  data() {
    return {
      valSchema: {
        email: "loginEmptyEmail",
        password: "loginEmptyPwd"
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-50",
      login_alert_message: "Please wait! Processing registration..."
    };
  },
  components: {},
  methods: {
    async loginUser(values) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-blue-50";
      this.login_alert_message = "Please wait! Processing registration...";

      // Login user (firebase authenticates user behind the scene)
      try {
        await this.$store.dispatch("loginUser", values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-50";
        this.reg_alert_message = `Unexpected error during login... Error message: ${error.message}`;
        console.log(error);
        return;
      }

      this.login_alert_variant = "bg-green-50";
      this.login_alert_message = "Your are logged in!";
      setTimeout(() => {
        this.toggleAuthModal();
      }, 1000);
    },
    ...mapMutations(["toggleAuthModal"])
  }
};
</script>
