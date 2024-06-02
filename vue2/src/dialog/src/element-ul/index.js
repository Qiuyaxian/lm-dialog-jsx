import { Dialog, Button } from 'element-ui'
import { createDialogComponent, createDialogPlugin } from '../core/index'

export const ElWidgetDialog = createDialogComponent({
  widgetComponents: {
    widgetDialogRender: Dialog,
    cannelButtonRender: Button,
    submitButtonRender: Button
  },
  defaultCannelButtonRender: {
    text: '关闭',
    events: (dialogStore) => {
      return {
        click: function() {
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
        click: function() {
          dialogStore.vm.$emit('submit', dialogStore)
        }
      }
    }
  }
})

const createElDialogModelPlugin = createDialogPlugin(ElWidgetDialog) 

export const createElDialogModel = function(options) {
  let dialogInstance = null
  const dialogOptions = {
    ...options,
    widgetDialogProps: (dialogStore) => {
      const { widgetDialogProps } = options
      return {
        ...widgetDialogProps,
        visible: dialogStore.visible
      }
    },
    widgetDialogEvents: (dialogStore) => {
      const { widgetDialogEvents } = options
      return {
        open() {
          if (widgetDialogEvents && widgetDialogEvents.open) {
            widgetDialogEvents.open()
          }
        },
        opened() {
          if (widgetDialogEvents && widgetDialogEvents.opened) {
            widgetDialogEvents.opened()
          }
        },
        close() {
          dialogStore.visible = false
          if (widgetDialogEvents && widgetDialogEvents.close) {
            widgetDialogEvents.close()
          }
        },
        closed() {
          if (widgetDialogEvents && widgetDialogEvents.onClosed) widgetDialogEvents.onClosed()
          dialogInstance && dialogInstance.destoryed()
        }
      }
    }
  }
  dialogInstance = createElDialogModelPlugin(dialogOptions)
  return dialogInstance
}

export default {
  install: function(Vue, installOptions) {
    Vue.prototype.$elDialogPlugin = function (options) {
      return createElDialogModel(options, installOptions)
    }
  }
}