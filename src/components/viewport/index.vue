<template>
  <div class="holder" id="viewport">
    <!-- @dblclick="replaceImage" -->
    <div class="screen"
      :style="{
        backgroundColor: backgroundColor,
        backgroundImage: 'url(' + this.$store.state.page.backPic + ')',
        height: height + 'px',
        width: width + 'px',
        transform: 'scale(' + zoom / 100 + ')'
      }">
      
      <!-- 组件 -->
      <component
        :is="val.common.type"
        :data-title="val.common.type"
        class="layer"
        :class="{'g-active': id === val.uuid}"
        v-for="val in widgetStore"
        :key="val.uuid"
        :val="val"
        :h="height"
        :w="width"
        :defaultWidthRate="defaultWidthRate"
        :defaultHeightRate="defaultHeightRate"
        :data-type="val.common.type"
        :data-uuid="val.uuid"
        :id="val.common.type+val.uuid"
        :playState="playState">
        <component
          v-if="val.common.isContainer"
          :is="child.common.type"
          :data-title="child.common.type"
          class="layer layer-child"
          :class="{'g-active': id === child.uuid}"
          v-for="child in getChilds(val.name)"
          :key="child.uuid"
          :val="child"
          :h="height"
          :w="width"
          :defaultWidthRate="defaultWidthRate"
          :defaultHeightRate="defaultHeightRate"
          :data-type="child.common.type"
          :data-uuid="child.uuid"
          :id="child.common.type+child.uuid"
          :playState="playState" />
      </component>

      <!-- 参考线 -->
      <ref></ref>
      
      <!-- 尺寸控制器 -->
      <control></control>
    </div>
  </div>
</template>

<script>
import ref from './ref-lines.vue'
import control from './size-control.vue'
import { move } from '../../mixins'

export default {
  name: 'viewport',
  components: {
    ref: ref, // 参考线
    control: control // 尺寸控制
  },

  mixins: [move],

  props: ['val', 'zoom', 'activeElement'],

  data () {
    return {}
  },

  mounted () {
    // 采用事件代理的方式监听元件的选中操作
    document
      .getElementById('viewport')
      .addEventListener('mousedown', this.handleSelection, false)

    // 绑定键盘上下左右键用于元件的移动
    document.addEventListener(
      'keydown',
      e => {
        e.stopPropagation()
        var target = this.$store.state.activeElement

        // 左
        if (e.keyCode === 37 && target.common.position.left) {
          target.common.position.left -= 1
          return
        }
        // 上
        if (e.keyCode === 38 && target.common.position.top) {
          e.preventDefault()
          target.common.position.top -= 1
          return
        }
        // 右
        if (e.keyCode === 39 && target.common.position.left) {
          target.common.position.left += 1
          return
        }

        // 下
        if (e.keyCode === 40 && target.common.position.top) {
          e.preventDefault()
          target.common.position.top += 1
        }
      },
      true
    )
  },

  methods: {
    handleSelection (e) {
      var target = e.target
      var type = target.getAttribute('data-type')
      var uuid = '-1'
      if (type === null && target.tagName === 'CANVAS') {
        // 选中图表组件，只能激活本组件的选中状态
        let targetParent = target.parentElement.parentElement
        type = targetParent.getAttribute('data-type')
        uuid = targetParent.getAttribute('data-uuid')
        this.$store.commit('select', {
          uuid: uuid || -1
        })
      } else if (type) {
        uuid = target.getAttribute('data-uuid')
        // 设置选中元素
        this.$store.commit('select', {
          uuid: uuid || -1
        })
        // 绑定移动事件：只有从属于 page 的，除背景图以外的元件才能移动
        target = this.$store.state.activeElement
        if (target.common.belong === 'page' && target.common.dragable) {
          this.initmovement(e) // 参见 mixins
        }
      } else {
        // 取消选中元素
        this.$store.commit('select', {
          uuid: -1
        })
      }
    },

    // 替换图片
    // replaceImage (e) {
    //   if (!this.$store.state.activeElement.isUpload) {
    //     // console.log(11)
    //     this.$store.$emit('upload', payload => {
    //       this.$store.commit('replaceImage', payload)
    //     })
    //   }
    // },

    // 获取子组件
    getChilds (name) {
      return this.$store.state.widgets.filter(
        item => item.belong === name
      )
    }
  },

  computed: {
    // 已添加的组件
    widgetStore () {
      return this.$store.state.widgets.filter(item => item.common.belong === 'page')
    },

    // 画布高度
    height () {
      return this.$store.state.page.height
    },

    // 页面背景色
    backgroundColor () {
      return this.$store.state.page.backgroundColor
    },

    // 选中项id
    id () {
      // var type = this.$store.state.type
      // var index = this.$store.state.index
      // index = index >= 0 ? index : ''
      // return type + index
      return this.$store.state.uuid
    },

    // 动画播放状态
    playState () {
      return this.$store.state.playState
    },
    // 默认画布宽度
    width () {
      return this.$store.state.page.width
    },
    defaultWidthRate () {
      return this.$store.state.defaultWidthRate
    },
    defaultHeightRate () {
      return this.$store.state.defaultHeightRate
    }
  },
  created () {
    // console.log(this.$store.state.backgroundImage, 88)
  }
}
</script>

<style scoped>
.holder {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: auto;
  font-size: 0;
  border: 1px solid #f5f5f5;
  border-width: 0 1px;
  background-image: linear-gradient(
      45deg,
      #f5f5f5 25%,
      transparent 0,
      transparent 75%,
      #f5f5f5 0
    ),
    linear-gradient(
      45deg,
      #f5f5f5 25%,
      transparent 0,
      transparent 75%,
      #f5f5f5 0
    );
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
}
.screen {
  margin: 40px auto;
  transform-origin: center top;
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
