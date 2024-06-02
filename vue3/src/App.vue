<template>
  <div class="logo">
  	<img alt="Vue logo" src="./assets/logo.png" />
  </div>
  <Demo />
</template>

<script>
// 后续使用hooks 的方式（ref）的方式支持直接打开，关闭弹窗，减少声明变量
import Demo from './components/Demo.vue'

export default {
  name: 'App',
  components: {
    Demo
  }
}
</script>
