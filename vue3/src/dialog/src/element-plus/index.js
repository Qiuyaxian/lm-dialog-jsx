import { ElDialog, ElButton } from 'element-plus'
import { createDialogComponent, createDialogPlugin } from '../core/index'

export const ElWidgetDialog = createDialogComponent({
  widgetComponents: {
    widgetDialogRender: ElDialog,
    cannelButtonRender: ElButton,
    submitButtonRender: ElButton
  },
  defaultCannelButtonRender: {
    text: '关闭',
    click: (dialogStore) => {
      dialogStore.visible = false
      dialogStore.loading = false
      // this.$emit('cannel')
    }
  },
  defaultSubmitButtonRender: {
    text: '确定',
    componentProps: null,
    render: null,
    click: () => {
      this.$emit('submit', dialogStore)
    }
  }
})

const createDialogModelPlugin = createDialogPlugin(ElWidgetDialog) 

export const createDialogModel = function(options) {
  let dialogInstance = null
  const dialogOptions = {
    ...options,
    widgetDialogProps: {
      ...options.widgetDialogProps,
      onClosed() {
        const { widgetDialogProps } = options
        if (widgetDialogProps && widgetDialogProps.onClosed) widgetDialogProps.onClosed()
        dialogInstance && dialogInstance.destoryed()
      }
    }
  }
  dialogInstance = createDialogModelPlugin(dialogOptions)
  return dialogInstance
}

const DialogPlugin = {}

DialogPlugin.install = function(app) {
   app.config.globalProperties.$dialogPlugin = function(options) {
      return createDialogModel(options)
   }
}

export default DialogPlugin