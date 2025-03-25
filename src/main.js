import { createApp } from "vue"; // импорт всего содержимого
import App from "./App.vue"; // иморт единичного значения / например с помощь export
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./datamappers/firebase/firebase";
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
