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
  defaultCannelButtonRender: {
    text: '取消',
    size: 'mini',
    events: (dialogStore) => {
      return {
        onClick: function() {
          dialogStore.visible = false
          dialogStore.loading = false
          dialogStore.vm.$emit('cannel')
        }
      }
    }
  },
  defaultSubmitButtonRender: {
    type: 'primary',
    text: '提交',
    size: 'mini',
    events: (dialogStore) => {
      return {
        onClick: function() {
          dialogStore.vm.$emit('submit')
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
    widgetDialogProps: {
      destroyOnClose: true,
      ...options.widgetDialogProps,
      afterClose() {
        const { widgetDialogProps } = options
        if (widgetDialogProps && widgetDialogProps.afterClose) widgetDialogProps.afterClose()
        dialogInstance && dialogInstance.destoryed()
      }
    }
  }
  dialogInstance = createAntDialogModelPlugin(dialogOptions)
  return dialogInstance
}

const AntDialogPlugin = {}

AntDialogPlugin.install = function(app) {
   app.config.globalProperties.$dialogPlugin = function(options) {
      return createAntDialogModel(options)
   }
}

export default AntDialogPlugin