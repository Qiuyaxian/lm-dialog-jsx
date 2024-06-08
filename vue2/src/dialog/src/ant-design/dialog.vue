<template>
  <Modal v-bind="$attrs" v-on="$listeners">
    <template slot="default">
      <slot name="default"></slot>
    </template>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>
<script>
import { Modal } from 'ant-design-vue'

export default {
  name: "ant-modal-dialog",
  components: {
    Modal
  }
}
</script>