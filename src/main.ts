import './assets/css/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import BaseInput from './components/base/input/BaseInput.vue'
import BaseButton from './components/base/button/BaseButton.vue'

const app = createApp(App)

app.component('BaseInput', BaseInput)
app.component('BaseButton', BaseButton)

app.use(router)

app.mount('#app')
