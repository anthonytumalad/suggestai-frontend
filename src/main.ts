import './assets/css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'


import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import BaseInput from './components/base/input/BaseInput.vue'
import BaseButton from './components/base/button/BaseButton.vue'
import BaseAlert from './components/base/alert/BaseAlert.vue'
import BaseDatePicker from './components/base/datepicker/BaseDatePicker.vue'
import BaseDialog from './components/base/modal/BaseDialog.vue'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
    }
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.component('BaseInput', BaseInput)
app.component('BaseButton', BaseButton)
app.component('BaseAlert', BaseAlert)
app.component('BaseDatePicker', BaseDatePicker)
app.component('BaseDialog', BaseDialog)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none',
    }
  }
})

app.mount('#app')
