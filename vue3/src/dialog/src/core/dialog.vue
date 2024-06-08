<script lang="jsx">
import { defineComponent, getCurrentInstance, ref, reactive, computed, watch, onMounted, onUnmounted, isVNode, markRaw } from "vue"
import merge from 'lodash/merge'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import useDialogStore from './useStore.js'
export default defineComponent({
    name: "widget-dialog",
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '弹窗'
      },
      // 转发dialog配置
      widgetDialogProps: {
        type: [Object, Function],
        default: () => {}
      },
      // 转发dialog配置
      widgetDialogAttrs: {
        type: [Object, Function],
        default: () => {}
      },
      // 转发dialog配置
      widgetDialogEvents: {
        type: [Object, Function],
        default: () => ({})
      },
      // 自定义渲染器
      widgetDialogRender: {
        type: [Object, Function],
        default: null 
      },
      // 传递参数至内容组件
      widgetProps: {
        type: [Object, Function],
        default: null
      },
      widgetAttrs: {
        type: [Object, Function],
        default: null
      },
      widgetEvents: {
        type: [Object, Function],
        default: null
      },
      // 使用组件渲染
      widgetRender: {
        type: [String, Function, Object],
        default: null
      },
       // 按钮功能，优先级最高
      buttons: {
        type: [Array, Function],
        default: null
      },
      // 取消按钮配置
      enabledCannelButton: {
        type: Boolean,
        default: true
      },
      cannelButton: {
        type: Object,
        default: null
      },
      enabledSubmitButton: {
        type: Boolean,
        default: true
      },
      // 提交按钮配置
      submitButton: {
        type: Object,
        default: null
      },
      // 销毁操作
      destoryed: {
        type: Function,
        default: null
      }
    },
    data() {
      return {
        widgetComponents: {
          widgetDialogRender: null,
          cannelButtonRender: null,
          submitButtonRender: null
        },
        defaultDialogProps: {
          width: '50%',
          fullscreen: false,
          modal: true,
          'append-to-body': false,
          'lock-scroll': true,
          'close-on-click-modal': false,
          'close-on-press-escape': true,
          'show-close': true
        },
        defaultDialogAttrs: {},
        defaultDialogEvents: {
          onClose:() => {
            this.dialogStore.visible = false
          }
        },
        defaultCannelButtonRender: null,
        defaultSubmitButtonRender: null
      }
    },
    setup(props, context) {
      const { destoryed, modelValue = false } = props
      const vm = getCurrentInstance();
      const dialogContent = ref(null)

      const dialogStore = useDialogStore(vm)

      const getDialogProps = computed(() => {
        const dialogStore = vm.ctx.dialogStore
        const defaultDialogProps = isFunction(vm.ctx.defaultDialogProps) ? vm.ctx.defaultDialogProps(dialogStore) : vm.ctx.defaultDialogProps
        const widgetDialogProps = vm.ctx.widgetDialogProps || {}
        const dialogProps = merge({
          visible: dialogStore.visible
        }, defaultDialogProps)
        return merge(dialogProps, isFunction(widgetDialogProps) ? widgetDialogProps(dialogStore, dialogProps) : widgetDialogProps)
      })

      const getDialogAttrs = computed(() => {
        const dialogStore = vm.ctx.dialogStore
        const defaultDialogAttrs = isFunction(vm.ctx.defaultDialogAttrs) ? vm.ctx.defaultDialogAttrs(dialogStore) : vm.ctx.defaultDialogAttrs
        const widgetDialogAttrs = vm.ctx.widgetDialogAttrs || {}
        return isFunction(widgetDialogAttrs) ? widgetDialogAttrs(dialogStore) : widgetDialogAttrs
      })

      const getDialogEvents = computed(() => {
        const dialogStore = vm.ctx.dialogStore
        const defaultDialogEvents = isFunction(vm.ctx.defaultDialogEvents) ? vm.ctx.defaultDialogEvents(dialogStore) : vm.ctx.defaultDialogEvents
        const dialogEvents = merge({}, defaultDialogEvents)
        const widgetDialogEvents = vm.ctx.widgetDialogEvents || {}
        return merge(dialogEvents, isFunction(widgetDialogEvents) ? widgetDialogEvents(dialogStore, dialogEvents) : widgetDialogEvents)
      })

      const getDialogButtons = computed(() => {
        const dialogStore = vm.ctx.dialogStore
        const widgetComponents = vm.ctx.widgetComponents
        const buttons = vm.ctx.buttons
        const dialogButtons = []
        if (isArray(buttons)) {
          buttons.forEach(item => {
            if (isFunction(item)) {
              dialogButtons.push(item)
            } else if (Reflect.has(item, 'render') && item.render) {
              dialogButtons.push(item)
            } else {
              console.warn(`请传入正确的 buttons 参数!，buttons 配置请查看文档！`)
            }
          })
        } else {
          const { cannelButton, submitButton } = vm.ctx.$props
          const enabledCannelButton = vm.ctx.enabledCannelButton
          const enabledSubmitButton = vm.ctx.enabledSubmitButton
          if (enabledCannelButton) {
            const defaultCannelButtonRender = vm.ctx.defaultCannelButtonRender
            const cannelButtonRenderConfig = merge({
              action: 'cannel',
              type: 'default',
              text: '取消',
              size: 'mini',
              props: {},
              events: {
                click: () => {
                  dialogStore.visible = false
                  dialogStore.loading = false
                  vm.ctx.$emit('cannel', dialogStore)
                }
              },
              render: widgetComponents.cannelButtonRender
            }, defaultCannelButtonRender)
            if (cannelButton) {
              dialogButtons.push(merge(cannelButtonRenderConfig, cannelButton))
            } else {
              dialogButtons.push(cannelButtonRenderConfig)
            }
          }
          if (enabledSubmitButton) {
            const defaultSubmitButtonRender = vm.ctx.defaultSubmitButtonRender
            const submitButtonRenderConfig = merge({
              action: 'submit',
              type: 'primary',
              text: '提交',
              size: 'mini',
              props: {},
              events: {
                click: () => {
                  vm.ctx.$emit('submit', dialogStore)
                }
              },
              render: widgetComponents.submitButtonRender
            }, defaultSubmitButtonRender)
            if (submitButton) {
              dialogButtons.push(merge(submitButtonRenderConfig, submitButton))
            } else {
              dialogButtons.push(submitButtonRenderConfig)
            }
          }
        }
        return dialogButtons
      })

      watch(() => props.modelValue, (nVal) => {
        dialogStore.visible = nVal
      }, {
        immediate: true
      })

      watch(() => dialogStore.visible, (nVal) => {
        context.emit('update:modelValue', nVal)  
      })

      onMounted(() => {
        // 获取弹窗渲染组件
        if (dialogContent) {
          dialogStore.dialogContent = dialogContent
        }
      })
      
      onUnmounted(() => {
        destoryed && destoryed()
      })
      
      const renderDialogBody = () => {
         const widgetProps = vm.ctx.widgetProps
         const widgetRender = vm.ctx.widgetRender
         const nodeType = typeof widgetRender
         const widgetRenderMap = {
            'string': (url) => {
              return <iframe ref="dialogContent" url={url} width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>
            },
            'object': (component) => {
               if (isVNode(component)) return component
               return <component is={component} ref="dialogContent"></component>
            },
            'function': (render) => {
               if (!render) return
               const widgetComponent = render(widgetProps)
               return <component is={widgetComponent} ref="dialogContent"></component>
            }
         }
         if (widgetRenderMap[nodeType]) {
            return widgetRenderMap[nodeType](widgetRender)
         }
         return null
      }

      const renderButtons = () => {
        const buttons = vm.ctx.buttons
        if (isFunction(buttons)) {
          return buttons(dialogStore)
        }
        return <div>
          { 
            getDialogButtons.value.map(item => {
              let { text, type, size, action, props, events } = item
              if (isFunction(item)) {
                return item(dialogStore)
              }
              if (isFunction(item.render)) {
                return item.render(dialogStore, item)
              }
              const buttonItemProps = isFunction(props) ? props(dialogStore) : isObject(props) ? props : {}
              const buttonItemEvents = isFunction(events) ? events(dialogStore) : isObject(events) ? events : {}
              return <item.render 
                type={type}
                {...{
                  ...buttonItemProps,
                  ...buttonItemEvents
                }}
              >{text}</item.render>
            })
          }
        </div>
      }
      return {
        dialogStore,
        getDialogProps,
        getDialogAttrs,
        getDialogEvents,
        getDialogButtons,
        renderDialogBody,
        renderButtons
      }
    },
    render() {
      const dialogStore = this.dialogStore
      const widgetComponents = this.widgetComponents
      const widgetDialogRender = this.widgetDialogRender || widgetComponents.widgetDialogRender || null
      if (!widgetDialogRender) return null
      const dialogProps = this.getDialogProps
      const dialogAttrs = this.getDialogAttrs
      const dialogEvents = this.getDialogEvents
      const slots = this.$slots
      const dialogSlots = {
        title: () => <div>{this.title}</div>,
        footer: () => this.renderButtons(),
        default: () => this.renderDialogBody()
      }
      if (Reflect.has(slots, 'title')) {
        dialogSlots.title = slots.title
      }
      if (Reflect.has(slots, 'header')) {
        dialogSlots.header = slots.header
      }
      if (Reflect.has(slots, 'footer')) {
        dialogSlots.footer = slots.footer
      }
      if (Reflect.has(slots, 'default')) {
        dialogSlots.default = slots.default
      }
      if (isFunction(widgetDialogRender)) {
        return widgetDialogRender(dialogProps, dialogAttrs, dialogEvents, dialogSlots, this)
      }
      return <widgetDialogRender
        v-model={dialogStore.visible}
        {...{
          ...dialogProps,
          ...dialogAttrs,
          ...dialogEvents
        }}
        v-slots={dialogSlots}
      >
        <template slot="title">title</template>
        <template slot="footer">footer</template>
      </widgetDialogRender>
    }
})
</script>

<style scoped>

</style>