import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import router from "./router";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import franquetteTheme from "@/themes/franquetteTheme.js";



const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify({
    components,
    directives,
    iconfont: 'mdi',
    theme: {
        defaultTheme: 'franquetteTheme',
        themes: {
            franquetteTheme,
        },
    },
  })

app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount("#app");
