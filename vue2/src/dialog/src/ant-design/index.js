import { Button } from 'ant-design-vue'

import { createDialogComponent, createDialogPlugin } from '../core/index'

import Modal from './dialog.vue'

export const AntWidgetDialog = createDialogComponent({
  widgetComponents: {
    widgetDialogRender: Modal,
    cannelButtonRender: Button,
    submitButtonRender: Button
  },
  defaultDialogProps: {
    mask: true,
    maskClosable: false,
    width: '30%',
    keyboard: false
  },
  defaultDialogEvents: () => {
    return {
      afterClose() {
        console.log('defaultDialogEvents')
      }
    }
  },
  defaultCannelButtonRender: {
    action: 'cannel',
    type: 'default',
    text: '取消',
    size: 'small',
    render: Button,
    events: (dialogStore) => {
      return {
        click: () => {
          dialogStore.visible = false
          dialogStore.loading = false
          // this.$emit('cannel')
        }
      }
    }
  },
  defaultSubmitButtonRender: {
    action: 'submit',
    type: 'primary',
    text: '提交',
    size: 'small',
    render: Button,
    events: (dialogStore) => {
      return {
        click: () => {
          // console.log('提交;ddsfsdf')
          // this.$emit('submit', dialogStore)
        }
      }
    }
  }
})

const createAntDialogModelPlugin = createDialogPlugin(AntWidgetDialog)

export const createAntDialogModel = function(options) {
  let dialogInstance = null
  const dialogOptions = {
    ...options,
    widgetDialogProps: (dialogStore) => {
      const { widgetDialogProps, title } = options
      return {
        destroyOnClose: true,
        ...widgetDialogProps,
        title: title,
        visible: dialogStore.visible,
        afterClose() {
          dialogStore.visible = false
          if (widgetDialogProps && widgetDialogProps.afterClose) widgetDialogProps.afterClose()
          dialogInstance && dialogInstance.destoryed()
        }
      }
    },
    widgetDialogEvents: (dialogStore) => {
      const { widgetDialogEvents } = options
      return {
        ...widgetDialogEvents
      }
    } 
  }
  dialogInstance = createAntDialogModelPlugin(dialogOptions)
  return dialogInstance
}

export default {
  install: function(Vue, installOptions) {
    Vue.prototype.$antDialogPlugin = function (options) {
      return createAntDialogModel(options, installOptions)
    }
  }
}