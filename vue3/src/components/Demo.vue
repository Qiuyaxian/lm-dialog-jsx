<template>
  <div>
    <h1 class="text-center">{{ msg }}</h1>
    <div class="text-center">
      <button @click="openDialogPlugin">插件使用</button>
      <button @click="openDialog">函数使用</button>
      <button @click="openVisible">组件使用</button>
      <p>ant-design-vue</p>
      <button @click="openAntDialog">ant函数使用</button>
    </div>
    <el-widget-dialog v-model="visible" @submit="submitHandle">
       <div>测试</div>
    </el-widget-dialog> 
  </div>
</template>

<script lang="jsx">
import { reactive, ref, provide } from "vue"
import { ElButton } from 'element-plus'
import { createDialogModel, ElWidgetDialog } from '@/dialog/src/element-plus'

import { AntWidgetDialog, createAntDialogModel } from '@/dialog/src/ant-design'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    ElWidgetDialog
  },
  data() {
    return {
      count: 0,
      visible: false
    }
  },
  setup() {
    provide('info',"值")
    return {}
  },
  methods: {
    openAntDialog() {
      const rules = reactive([])
      const compRule = <div>div</div>
      const dialog = new createAntDialogModel({
        widgetRender: compRule
      })
      console.log(dialog, 'dialog')
    },
    // 插件使用
    openDialogPlugin() {
      const rules = reactive([])
      const compRule = <div>div</div>
      const dialogPlugin = this.$.appContext.config.globalProperties.$dialogPlugin({
          dialogProps: {
            'close-on-click-modal': false,
          },
          widgetRender: compRule
      })
    },
    // 函数使用
    openDialog() {
      const rules = reactive([])
      const compRule = <div>div</div>
      const dialog = new createDialogModel({
        widgetRender: compRule
      })
      console.log(dialog, 'dialog')
    },
    openVisible() {
       console.log(this.visible, 'this.')
       this.visible = true
    },
    submitHandle() {
      console.log('dsfdsf')
    }
  }
}
</script>
