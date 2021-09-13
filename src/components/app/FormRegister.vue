<template>
  <div>
    <!-- Alert area -->
    <div
      class="text white text-center font-bold p-5 mb-4"
      v-if="reg_show_alert"
      :class="reg_alert_variant"
    >
      {{ reg_alert_message }}
    </div>
    <!-- Registration Form -->
    <vee-form
      :validation-schema="valSchema"
      @submit="registerUser"
      :initial-values="userData"
    >
      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <vee-field
          type="text"
          name="name"
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
          placeholder="Enter Name"
        />
        <ErrorMessage class="text-red-600" name="name" />
      </div>
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
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field
          type="number"
          name="age"
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
        />
        <ErrorMessage class="text-red-600" name="age" />
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
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field
          type="password"
          name="confirmed"
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
          placeholder="Confirm Password"
        />
        <ErrorMessage class="text-red-600" name="confirmed" />
      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <vee-field
          as="select"
          name="country"
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
        >
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="Phantasialand">Phantasialand</option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="country" />
      </div>
      <!-- TOS -->
      <div class="mb-3 pl-6">
        <vee-field
          type="checkbox"
          name="tos"
          value="1"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        />
        <label class="inline-block">Accept terms of service</label>
        <ErrorMessage class="text-red-600 block" name="tos" />
      </div>
      <button
        type="submit"
        :disabled="reg_in_submission"
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

export default {
  name: "FormRegister",
  data() {
    return {
      valSchema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:14|max_value:100",
        password: "required|min:6|max:20",
        confirmed: "passwords_mismatch:@password",
        country: "required|country_excluded:Phantasialand",
        tos: "tos"
      },
      userData: {
        country: "Germany"
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-50",
      reg_alert_message: "Please wait! Processing registration..."
    };
  },
  computed: {},
  methods: {
    async registerUser(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-blue-50";
      this.reg_alert_message = "Please wait! Processing registration...";

      // Register user first (firebase authenticates user behind the scene) to save data to DB
      try {
        await this.$store.dispatch("registerUser", values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-50";
        this.reg_alert_message = `Unexpected error during registration... Error message: ${error.message}`;
        console.log(error);
        return;
      }

      this.reg_alert_variant = "bg-green-50";
      this.reg_alert_message = "Your account was created!";
      setTimeout(() => {
        this.toggleAuthModal();
      }, 1000);
    },
    ...mapMutations(["toggleAuthModal"])
  }
};
</script>
