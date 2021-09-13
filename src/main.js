import { createApp } from "vue"; // импорт всего содержимого
import App from "./App.vue"; // иморт единичного значения / например с помощь export
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./datamappers/firebase/firebase";
import "./assets/tailwind.css";
import "./assets/main.css";
import i18n from "./includes/i18n";

let app;

// Called at least once on first load
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);

    app.mount("#app");
  }
});
