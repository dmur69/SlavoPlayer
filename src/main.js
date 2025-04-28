import { createApp } from "vue"; // load vue lib
import App from "./App.vue"; // SlavoPlayer root component
import router from "./router"; 
import store from "./store/vuexstore"; // app is still using vuex (not pinia)
import { auth } from "./datamappers/firebase/firebase"; // in compat (!) "firebase/compat/auth";
import VeeValidatePlugin from "./includes/validation"; // Form validation Plugin
import "./assets/base.css";
import "./assets/main.css";

let app;

// Called at least once on first load
auth.onAuthStateChanged(() => {
  if (!app) {
    // Plain way to disable logs
    const consoleLog = true
     if(!consoleLog) {
       console.log = function() {} 
     }

    console.log("In main.js");
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.mount("#app");
  }
});
