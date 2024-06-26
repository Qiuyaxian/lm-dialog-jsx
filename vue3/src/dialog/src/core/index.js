import { defineComponent, createApp, markRaw } from 'vue'

import Dialog from './dialog.vue'
// 创建弹窗组件
export const createDialogComponent = function(widgetDialogConfig) {
    const newWidgetDialogConfig = {
        ...widgetDialogConfig
    }
    if (Reflect.has(newWidgetDialogConfig, 'widgetComponents')) {
       newWidgetDialogConfig.widgetComponents = markRaw(newWidgetDialogConfig.widgetComponents)
    }
    return defineComponent({
        ...Dialog,
        data() {
            // 可配置数据
            return {
              ...newWidgetDialogConfig
            }
        }
    })
}
// 统计累计数
let createDialogId = 0
// 创建可挂载弹窗
export const createDialogPlugin = function (dialogComponent) {
    const dialogPluginMap = new Map()
    // 创建实例
    const createDialogInstance = function (container, options) {
        if (!container) return
        const dialogApp = createApp(dialogComponent, options)
        return dialogApp.mount(container)
    }
    return function (options) {
        const container = document.createElement("div")
        const containerId = `dialog-${++createDialogId}`
        container.id = containerId
        let $vm = null
        const closeAll = () => {
          dialogPluginInstanceMap.forEach((vmItem) => {
            vmItem.dialogStore.visible = false
          })
        }
        const widgetDialogDestoryed = () => {
            // 移除dom对象
            let containerBox = document.getElementById(containerId)
            if (containerBox) {
                document.body.removeChild(containerBox)
                containerBox = null
            }
            // 释放内存
            dialogPluginMap.delete(containerId)
            $vm = null
        }
        const close = () => {
            $vm && ($vm.dialogStore.visible = false)
        }
        $vm = new createDialogInstance(container, options)
        dialogPluginMap.set(containerId, $vm)
        document.body.appendChild(container)
        $vm && ($vm.dialogStore.visible = true)
        return {
            closeAll: closeAll,
            containerId: containerId,
            dialogStore: $vm.dialogStore,
            destoryed: widgetDialogDestoryed,
            close: close
        } 
    }
}