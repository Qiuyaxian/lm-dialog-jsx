import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import path from 'path'

export default {
    base: './',
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve('./src')
        }
      ]
    }
}