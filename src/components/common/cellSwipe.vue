<template>
  <div v-clickoutside:touchstart="swipeMove" @click="swipeMove()" @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag" class="lc-cell" ref="cell">

    <div class="lc-cell-wrapper">
      <slot></slot>
    </div>

    <div class="lc-cell-right" ref="right" >
      <div class="lc-cell-swipe-button" v-for="btn in right" :style="btn.style" @click.stop="btn.handler && btn.handler(), swipeMove()" v-html="btn.content" ></div>
    </div>

  </div>
</template>

<script>
import { once } from '../../utils/dom';
import Clickoutside from '../../utils/clickoutside';

/**
 * lc-cell-swipe
 * @desc 类似 iOS 滑动 Cell 的效果
 *
 * @example
 * <lc-cell-swipe
 *   :right=[
 *     {
 *       content: 'text',
 *       style: {color: 'white', backgroundColor: 'red'},
 *       handler(e) => console.log(123)
 *     }
 *   ]
 *   swipe me
 * </lc-cell-swipe>
 */
export default {
  name: 'lc-cell-swipe',

  directives: { Clickoutside },

  props: {
    draggable:{type:Boolean,default:true},
    right: Array
  },

  data() {
    return {
      start: { x: 0, y: 0 },

    };
  },

  mounted() {

    this.wrap = this.$refs.cell.querySelector('.lc-cell-wrapper');

    this.rightElm = this.$refs.right;
    this.rightWidth = this.rightElm.getBoundingClientRect().width;
    this.rightDefaultTransform = this.translate3d(this.rightWidth);
    this.rightElm.style.webkitTransform = this.rightDefaultTransform;
  },

  methods: {
    resetSwipeStatus() {
      this.swiping = false;
      this.opened = true;
      this.offsetLeft = 0;
    },

    translate3d(offset) {
      return `translate3d(${offset}px, 0, 0)`;
    },

    swipeMove(offset = 0) {
      this.wrap.style.webkitTransform = this.translate3d(offset);
      this.wrap.style['pointer-events'] = offset < 0 ? 'none' : 'auto';

      this.rightElm.style.webkitTransform = this.translate3d(this.rightWidth + offset);
      offset && (this.swiping = true);
    },

    swipeLeaveTransition(direction) {
      setTimeout(() => {
        this.swipeLeave = true;

        if (direction > 0 && -this.offsetLeft > this.rightWidth * 0.4) {
          this.swipeMove(-this.rightWidth);
          this.resetSwipeStatus();
          return;
        }

        this.swipeMove(0);
        once(this.wrap, 'webkitTransitionEnd', _ => {
          this.wrap.style.webkitTransform = '';
          this.rightElm.style.webkitTransform = this.rightDefaultTransform;
          this.swipeLeave = false;
          this.swiping = false;
        });
      }, 0);
    },

    startDrag(evt) {
      if(this.draggable){
        evt = evt.changedTouches ? evt.changedTouches[0] : evt;
        this.dragging = true;
        this.start.x = evt.pageX;
        this.start.y = evt.pageY;
      }
    },

    onDrag(evt) {
      if (this.opened) {
        !this.swiping && this.swipeMove(0);
        this.opened = false;
        return;
      }
      if (!this.dragging) return;
      let swiping;
      const e = evt.changedTouches ? evt.changedTouches[0] : evt;
      const offsetTop = e.pageY - this.start.y;
      const offsetLeft = this.offsetLeft = e.pageX - this.start.x;

      if ((offsetLeft < 0 && -offsetLeft > this.rightWidth) ||
        (offsetLeft > 0 && offsetLeft > this.leftWidth) ||
        (offsetLeft > 0 && !this.leftWidth) ||
        (offsetLeft < 0 && !this.rightWidth)) {
        return;
      }

      const y = Math.abs(offsetTop);
      const x = Math.abs(offsetLeft);

      swiping = !(x < 5 || (x >= 5 && y >= x * 1.73));
      if (!swiping) return;
      evt.preventDefault();

      this.swipeMove(offsetLeft);
    },

    endDrag() {
      if (!this.swiping) return;
      this.swipeLeaveTransition(this.offsetLeft > 0 ? -1 : 1);
    }
  }
};
</script>

<style lang="scss">
.lc-cell {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background:#fff;

  .lc-cell-wrapper,
  .lc-cell-right {
    transition: transform 150ms ease-in-out;
  }

  .lc-cell-wrapper {
    position: relative;
    overflow: hidden;
  }

  .lc-cell-right {
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
