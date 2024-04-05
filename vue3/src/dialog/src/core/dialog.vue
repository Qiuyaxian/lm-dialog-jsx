<script lang="jsx">
import { reactive, watch, defineComponent, onMounted, onUnmounted, ref } from "vue"

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
      // 按钮功能
      buttons: {
        type: Array,
        default: null
      },
      // 转发dialog配置
      widgetDialogProps: {
        type: Object,
        default: () => {}
      },
      // 自定义渲染器
      widgetDialogRender: {
        type: [Function, Object],
        required: true,
        default: null 
      },
      // 传递参数
      widgetProps: {
        type: Object,
        default: null
      },
      // 使用组件渲染
      widgetRender: {
        type: [String, Function, Object],
        default: null
      },
      // 取消按钮配置
      cannelButton: {
        type: Object,
        default: null
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
        defaultCannelButtonRender: null,
        defaultSubmitButtonRender: null
      }
    },
    setup(props, context) {
      const { destoryed } = props
      const dialogContent = ref(null)
      const dialogStore = reactive({
        visible: true,
        loading: false,
        dialogContent: null,
        $emit: function(name, data) {
          context.emit(name, data)  
        }
      })
      
      const dialogProps = {}
      
      let dialogButtons = []
      
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

      return {
        dialogProps,
        dialogButtons,
        dialogStore,
        dialogContent
      }
    },
    created() {
      const dialogStore = this.dialogStore
      const widgetComponents = this.widgetComponents
      const cannelButtonRender = {
        action: 'cannel',
        type: 'default',
        text: '取消',
        size: 'mini',
        componentProps: null,
        component: widgetComponents.cannelButtonRender,
        render: null,
        click: () => {
          // dialogStore.visible = false
          // dialogStore.loading = false
          this.$emit('cannel')
        }
      }
      const submitButtonRender = {
        action: 'submit',
        type: 'primary',
        text: '提交',
        size: 'mini',
        componentProps: null,
        component: widgetComponents.submitButtonRender,
        render: null,
        click: () => {
          this.$emit('submit', dialogStore)
        }
      }
      const defaultDialogButtonsConfig = {
         'cannel': Object.assign({}, cannelButtonRender, this.defaultCannelButtonRender),
         'submit': Object.assign({}, submitButtonRender, this.defaultSubmitButtonRender)
      }
      const props = this.$props
      const { cannelButton, submitButton, widgetDialogProps } = props
      
      if (typeof cannelButton === 'object') {
         defaultDialogButtonsConfig.cannel = Object.assign(defaultDialogButtonsConfig.cannel, cannelButton)
      }
      
      if (typeof submitButton === 'object') {
         defaultDialogButtonsConfig.submit = Object.assign(defaultDialogButtonsConfig.submit, submitButton)
      }

      let dialogButtons = [
         defaultDialogButtonsConfig.cannel,
         defaultDialogButtonsConfig.submit
      ]
      
      if (Array.isArray(props.buttons)) {
        const buttons = []
        props.buttons.forEach(item => {
          if (typeof item === 'function') {
            buttons.push(item)
          } else if (Reflect.has(item, 'component') || Reflect.has(item, 'render')) {
            buttons.push(item)
          } else {
            console.warn(`请传入正确的 buttons 参数!`)
          }
        })
        if (buttons.length !== 0) {
          dialogButtons = buttons
        }
      }
      const defaultDialogProps = this.defaultDialogProps
      const dialogProps = Object.assign({}, defaultDialogProps)
      if (widgetDialogProps) {
        for (let key in widgetDialogProps) {
          dialogProps[key] = widgetDialogProps[key]
        }
      }
      this.dialogProps = dialogProps
      this.dialogButtons = dialogButtons
    },
    methods: {
      renderDialogBody() {
         const widgetProps = this.widgetProps
         const widgetRender = this.widgetRender
         const type = typeof widgetRender
         const widgetRenderMap = {
            'string': (url) => <iframe ref="dialogContent" url={url} width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>,
            'object': (component) => {
               return <component is={component} {...widgetProps} ref="dialogContent"></component>
            },
            'function': (render) => {
               if (!render) return
               const widgetComponent = render(widgetProps)
               return <component is={widgetComponent} {...widgetProps} ref="dialogContent"></component>
            }
         }
         if (widgetRenderMap[type]) {
            return widgetRenderMap[type](widgetRender)
         }
         return null
      },
      renderButtons() {
        const dialogStore = this.dialogStore
        const dialogButtons = this.dialogButtons
        return <div>
          { 
            dialogButtons.map(item => {
              let { text, type, size, action, componentProps } = item
              if (typeof item === 'function') {
                return item(dialogStore)
              }
              if (typeof item.render === 'function') {
                return item.render(dialogStore, item)
              }
              if (Reflect.has(item, 'action') && action === 'submit') {
                if (item.install) {
                  return <component is={item.component} {...componentProps} loading={dialogStore.loading} type={type} size={size} onClick={() => item.click(dialogStore)}>{text}</component>
                }
                return <item.component {...componentProps} loading={dialogStore.loading} type={type} size={size} onClick={() => item.click(dialogStore)}>{text}</item.component>
              }
              if (item.install) {
                return <component is={item.component} {...componentProps} type={type} size={size} onClick={() => item.click(dialogStore)}>{text}</component>
              }
              return <item.component {...componentProps} type={type} size={size} onClick={() => item.click(dialogStore)}>{text}</item.component>
            })
          }
        </div>
      }
    },
    render() {
      const widgetComponents = this.widgetComponents
      const widgetDialogRender = this.widgetDialogRender || widgetComponents.widgetDialogRender || null
      if (!widgetDialogRender) return null
      const dialogStore = this.dialogStore
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
      if (typeof widgetDialogRender === 'function') {
        return widgetDialogRender(this.dialogProps, dialogSlots, dialogStore, this)
      }
      return <widgetDialogRender
        {...this.dialogProps}
        v-model={dialogStore.visible}
        v-slots={dialogSlots}
      >
      </widgetDialogRender>
    }
})
</script>

<style scoped>

</style>