import { createApp } from "vue";
import "./registerServiceWorker";
import VueToast from "vue-toast-notification";

import router from "./router";

import api from "./api";
import { api_base_url } from "./config";

import App from "./App.vue";

import "./index.css";
import "vue-toast-notification/dist/theme-sugar.css";
import "nprogress/nprogress.css";

import nprogress from "nprogress";
nprogress.configure({ showSpinner: false });

createApp(App)
  .use(router)
  .use(VueToast, { duration: 7500, position: "bottom" })
  .use(api, { base_url: api_base_url })
  .mount("#app");
