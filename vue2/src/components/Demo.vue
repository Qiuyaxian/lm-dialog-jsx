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
       <Content msg="Demo.vue"></Content>
    </el-widget-dialog> 
  </div>
</template>

<script>
import { Button } from 'element-ui'
import { createElDialogModel, ElWidgetDialog } from '@/dialog/src/element-ul'

import { AntWidgetDialog, createAntDialogModel } from '@/dialog/src/ant-design'
import Content from './Content.vue'

export default {
  name: 'Demo',
  props: {
    msg: String
  },
  components: {
    ElWidgetDialog,
    Content
  },
  data() {
    return {
      count: 0,
      visible: false
    }
  },
  setup() {
    return {}
  },
  methods: {
    openAntDialog() {
      const compRule = <Content></Content>
      const dialog = new createAntDialogModel({
        title: 'ant UI',
        widgetRender: compRule
      })
      console.log(dialog, 'dialog')
    },
    // 插件使用
    openDialogPlugin() {
      const compRule = <Content></Content>
      console.log(compRule, 'compRule')
      const dialogPlugin = this.$elDialogPlugin({
          dialogProps: {
            'close-on-click-modal': false,
          },
          buttons: [
            {
              text: '自定义',
              size: 'mini',
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
            }
          ],
          widgetRender: compRule
      })
    },
    // 函数使用
    openDialog() {
      const compRule = <Content></Content>
      const dialog = new createElDialogModel({
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
