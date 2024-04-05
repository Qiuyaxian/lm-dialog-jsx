import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import DialogPlugin from "./dialog/src/element-plus"
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.use(DialogPlugin).mount('#app')
