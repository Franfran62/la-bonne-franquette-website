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
import colors from "tailwindcss/colors.js";

const franquetteTheme = {
    dark: false,
    colors: {
        primary: '#EDD382',
        secondary: '#020122',
        accent: '#FC9E4F',
        error: colors.red['600'],
        info: colors.teal['400'],
        success: colors.green['600'],
        warning: colors.amber['500'],
    },
}

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
