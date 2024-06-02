<script>
import DialogStore from './store.js'
import merge from 'lodash/merge'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
export default {
  name: 'widget-dialog',
  props: {
    value: {
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
      dialogStore: new DialogStore(this),
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
        close:() => {
          this.dialogStore.visible = false
        }
      },
      defaultCannelButtonRender: null,
      defaultSubmitButtonRender: null
    }
  },
  computed: {
    getDialogProps() {
      const dialogStore = this.dialogStore
      const defaultDialogProps = isFunction(this.defaultDialogProps) ? this.defaultDialogProps(dialogStore) : this.defaultDialogProps
      const widgetDialogProps = this.widgetDialogProps || {}
      const dialogProps = merge({
        visible: dialogStore.visible
      }, defaultDialogProps)
      return merge(dialogProps, isFunction(widgetDialogProps) ? widgetDialogProps(dialogStore, dialogProps) : widgetDialogProps)
    },
    getDialogAttrs() {
      const dialogStore = this.dialogStore
      const defaultDialogAttrs = isFunction(this.defaultDialogAttrs) ? this.defaultDialogAttrs(dialogStore) : this.defaultDialogAttrs
      const widgetDialogAttrs = this.widgetDialogAttrs || {}
      return isFunction(widgetDialogAttrs) ? widgetDialogAttrs(dialogStore) : widgetDialogAttrs
    },
    getDialogEvents() {
      const dialogStore = this.dialogStore
      const defaultDialogEvents = isFunction(this.defaultDialogEvents) ? this.defaultDialogEvents(dialogStore) : this.defaultDialogEvents
      const dialogEvents = merge({}, defaultDialogEvents)
      const widgetDialogEvents = this.widgetDialogEvents || {}
      return merge(dialogEvents, isFunction(widgetDialogEvents) ? widgetDialogEvents(dialogStore, dialogEvents) : widgetDialogEvents)
    },
    getDialogButtons() {
      const dialogStore = this.dialogStore
      const widgetComponents = this.widgetComponents
      const buttons = this.buttons
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
        const { cannelButton, submitButton } = this.$props
        const enabledCannelButton = this.enabledCannelButton
        const enabledSubmitButton = this.enabledSubmitButton
        if (enabledCannelButton) {
          const defaultCannelButtonRender = this.defaultCannelButtonRender
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
                this.$emit('cannel', dialogStore)
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
          const defaultSubmitButtonRender = this.defaultSubmitButtonRender
          const submitButtonRenderConfig = merge({
            action: 'submit',
            type: 'primary',
            text: '提交',
            size: 'mini',
            props: {},
            events: {
              click: () => {
                this.$emit('submit', dialogStore)
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
    }
  },
  watch: {
    value(nVal) {
      const dialogStore = this.dialogStore
      if (dialogStore) {
        dialogStore.visible = nVal
      }
    },
    'dialogStore.visible': {
      immediate: false,
      handler(nVal) {
        this.$emit('input', nVal)
        this.$emit('change', nVal)
      }
    }
  },
  mounted() {
    console.log(this, 'this')
    const dialogStore = this.dialogStore
    if (dialogStore) {
      const { dialogContent } = this.$refs
      if (dialogContent) {
        dialogStore.dialogContent = dialogContent
      }
    }
  },
  methods: {
    isVNode(node) {
      const VNode = this.$createElement().constructor
      return node instanceof VNode
    },
    renderDialogBody() {
       const widgetProps = this.widgetProps
       const widgetRender = this.widgetRender
       const nodeType = typeof widgetRender
       const widgetRenderMap = {
          'string': (url) => {
            return <iframe ref="dialogContent" url={url} width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>
          },
          'object': (component) => {
             if (this.isVNode(component)) return component
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
    },
    renderButtons() {
      const dialogStore = this.dialogStore
      const buttons = this.buttons
      if (isFunction(buttons)) {
        return buttons(dialogStore)
      }
      const dialogButtons = this.getDialogButtons
      return <div>
        { 
          dialogButtons.map(item => {
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
              size={size}
              {...{
                props: buttonItemProps,
                on: buttonItemEvents
              }}
            >{text}</item.render>
          })
        }
      </div>
    },
    destroyInstance() {
      this.$destroy()
    }
  },
  beforeDestroy() {
    // 销毁回调
    this.destoryed && this.destoryed(this)
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
      dialogSlots.title = () => slots.title
    }
    if (Reflect.has(slots, 'header')) {
      dialogSlots.header = () => slots.header
    }
    if (Reflect.has(slots, 'footer')) {
      dialogSlots.footer = () => slots.footer
    }
    if (Reflect.has(slots, 'default')) {
      dialogSlots.default = () => slots.default
    }
    if (isFunction(widgetDialogRender)) {
      return widgetDialogRender(dialogProps, dialogAttrs, dialogEvents, dialogSlots, this)
    }
    return <widgetDialogRender
      v-model={dialogStore.visible}
      {...{
        attrs: {
          ...dialogProps,
          ...dialogAttrs
        },
        props: dialogProps,
        on: dialogEvents,
        scopedSlots: dialogSlots
      }}
    >
      <template slot="title">title</template>
      <template slot="footer">footer</template>
    </widgetDialogRender>
  }
}
</script>