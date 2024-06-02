import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import ElDialogPlugin from './dialog/src/element-ul/index'
Vue.use(ElDialogPlugin)

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);
import AntDialogPlugin from './dialog/src/ant-design/index'
Vue.use(AntDialogPlugin)


Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
