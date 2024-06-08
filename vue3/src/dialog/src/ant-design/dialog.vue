<template>
  <Modal v-bind="$attrs" v-model:visible="dialogStore.visible">
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key"></slot>
    </template>
  </Modal>
</template>
<script lang="jsx">
import { defineComponent, reactive, watch } from 'vue'
import { Modal } from 'ant-design-vue'

export default defineComponent({
    name: "ant-modal-dialog",
    components: {
      Modal
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false
      }
    },
    setup(props, context) {
      const dialogStore = reactive({
        visible: true
      })
      watch(() => props.modelValue, (nVal) => {
        dialogStore.visible = nVal
      }, {
        immediate: true
      })

      watch(() => dialogStore.visible, (nVal) => {
        context.emit('update:modelValue', nVal)  
      })
      return {
        dialogStore
      }
    }
})
</script>