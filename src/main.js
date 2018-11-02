import Vue from 'vue'
import dashboard from './pageDesiner'

import iView from 'iview'
import iEditor from 'iview-editor'

import axios from 'axios'

// 全局组件
import Datas from './components/datas/datas'

import 'iview/dist/styles/iview.css'
import 'iview-editor/dist/iview-editor.css'

import './assets/iconfont.css'
import 'animate.css'

Vue.component(Datas.name, Datas)

// 使用插件
Vue.use(iView)
Vue.use(iEditor)

Vue.prototype.$axios = axios

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(dashboard)
})
