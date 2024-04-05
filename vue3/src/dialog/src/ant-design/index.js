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
    action: 'cannel',
    type: 'default',
    text: '取消',
    size: 'mini',
    componentProps: null,
    render: null,
    click: (dialogStore) => {
      dialogStore.visible = false
      dialogStore.loading = false
      // this.$emit('cannel')
    }
  },
  defaultSubmitButtonRender: {
    action: 'submit',
    type: 'primary',
    text: '提交',
    size: 'mini',
    componentProps: null,
    render: null,
    click: () => {
      console.log('提交;ddsfsdf')
      // this.$emit('submit', dialogStore)
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