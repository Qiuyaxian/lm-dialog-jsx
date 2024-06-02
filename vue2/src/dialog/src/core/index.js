// https://www.jianshu.com/p/5294b2290064
import Vue from 'vue'
import merge from 'lodash/merge'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import Dialog from './dialog.vue'
import DialogStore from './store.js'

const h = new Vue().$createElement

export const createDialogComponent = function (widgetDialogConfig = {}) {
  return Vue.extend({
    extends: Dialog,
    data() {
      return {
        ...widgetDialogConfig
      }
    }
  })
}

let createDialogId = 0
export const createDialogPlugin = function (widgetDialogComponent) {
  // 用于管理多窗口
  const dialogPluginInstanceMap = new Map()
  return function (options, globalOptions) {
    const containerId = `dialog-${++createDialogId}`
    let $vm = null
    const widgetDialogDestoryed = () => {
      // 移除dom对象
      const dialogVm = dialogPluginInstanceMap.get(containerId)
      if (dialogVm) {
        if (dialogVm.el instanceof HTMLElement) {
          document.body.removeChild(dialogVm.$vm.$el)
        } else {
          const parentElem = $vm.$el.parentNode
          if (parentElem && parentElem !== document.body) {
            parentElem.parentNode.removeChild(parentElem)
          }
        }
        $vm.$destroy()
      }
      // // 释放内存
      dialogPluginInstanceMap.delete(containerId)
      $vm = null
    }
    const closeAll = () => {
      dialogPluginInstanceMap.forEach((vmItem) => {
        vmItem.dialogStore.visible = false
      })
    }
    const ctxGlobalOptions =
      isObject(globalOptions) && isObject(globalOptions.dialog)
        ? globalOptions.dialog
        : {}
    const dialogElem = document.createElement('div')
    dialogElem.setAttribute('id', containerId)
    $vm = new widgetDialogComponent({
      el: dialogElem,
      // 解决 vue 服务 vuex，路由问题
      ...ctxGlobalOptions,
      propsData: {
        ...options
      }
    })
    dialogPluginInstanceMap.set(containerId, {
      el: $vm.$el,
      $vm
    })
    // 打开窗口
    document.body.appendChild($vm.$el)
    
    $vm.dialogStore.visible = true
    return {
      destoryed: widgetDialogDestoryed,
      containerId: containerId,
      dialogStore: $vm.dialogStore,
      closeAll: closeAll,
      close: () => {
        $vm.dialogStore.visible = false
      }
    }
  }
}
