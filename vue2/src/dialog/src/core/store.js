// https://www.jianshu.com/p/5294b2290064
import Vue from 'vue'
export default class DialogStore {
  constructor(vm) {
    const storeState = Vue.observable({
      vm: vm,
      visible: vm.visible || false,
      submit: false,
      cancel: false,
      dialogContent: null
    })
    return storeState
  }
}
