import './assets/css/index.css'

import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { withMinDelay } from './utils/withMinDelay'

import App from './App.vue'
import router from './router'


import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import BaseInput from './components/base/input/BaseInput.vue'
import BaseButton from './components/base/button/BaseButton.vue'
import BaseAlert from './components/base/alert/BaseAlert.vue'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
    }
  }
})

const app = createApp(App)

app.component('BaseInput', BaseInput)
app.component('BaseButton', BaseButton)
app.component('BaseAlert', BaseAlert)

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
