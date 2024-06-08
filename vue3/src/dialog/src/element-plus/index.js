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
    text: '确定',
    events: (dialogStore) => {
      return {
        onClick: function() {
          dialogStore.vm.$emit('submit', dialogStore)
        }
      }
    }
  }
})

const createDialogModelPlugin = createDialogPlugin(ElWidgetDialog)

export const createDialogModel = function(options) {
  let dialogInstance = null
  const dialogOptions = {
    ...options,
    widgetDialogProps: {
      ...options.widgetDialogProps
    },
    widgetDialogEvents: (dialogStore) => {
      const { widgetDialogEvents } = options
      return {
        onOpen() {
          if (widgetDialogEvents && widgetDialogEvents.open) {
            widgetDialogEvents.open()
          }
        },
        onOpened() {
          if (widgetDialogEvents && widgetDialogEvents.opened) {
            widgetDialogEvents.opened()
          }
        },
        onClose() {
          dialogStore.visible = false
          if (widgetDialogEvents && widgetDialogEvents.close) {
            widgetDialogEvents.close()
          }
        },
        onClosed() {
          if (widgetDialogEvents && widgetDialogEvents.closed) widgetDialogEvents.closed()
          dialogInstance && dialogInstance.destoryed()
        }
      }
    }
  }
  dialogInstance = createDialogModelPlugin(dialogOptions)
  return dialogInstance
}

export default {
  install: function(app) {
     app.config.globalProperties.$dialogPlugin = function(options) {
        return createDialogModel(options)
     }
  }
}