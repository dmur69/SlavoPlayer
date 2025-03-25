import { createApp } from "vue"; // load vue lib
import App from "./App.vue"; // app root component
import router from "./router"; 
import store from "./store"; // app is still using vuex (not pinia)
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./datamappers/firebase/firebase"; // in compat (!) "firebase/compat/auth";
import "./assets/base.css";
import "./assets/main.css";

let app;

// Called at least once on first load
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);

    app.mount("#app");
  }
});
