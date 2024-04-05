<template>
  <div class="logo">
  	<img alt="Vue logo" src="./assets/logo.png" />
  </div>
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script>
// 后续使用hooks 的方式（ref）的方式支持直接打开，关闭弹窗，减少声明变量
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
