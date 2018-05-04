<template>
  <div id="app" :style="'height:'+wrapperHeight + 'px;'">

    <transition :name="transitionName" :leave-active-class="leaveName">
      <keep-alive :exclude="/^ex-/">
        <router-view :style="hasTabBar?'bottom:.5rem;':'bottom:0;'"></router-view>
      </keep-alive>
    </transition>

    <lc-tabbar v-if="hasTabBar"></lc-tabbar>

  </div>
</template>

<style lang="scss">
  @import '~assets/css/base.scss';
</style>

<script>
export default {
  data() {
    return {
      leaveName: '',
      transitionName: '',
      wrapperHeight: 0,
      hasTabBar:false
    };
  },
  mounted() {
    this.wrapperHeight = window.innerHeight;
  },
  watch: {
    '$route'(to, from) {
      this.hasTabBar=to.meta.hasTabBar;

      let tt = to.meta.transition,
        ft = from.meta.transition;

      if (this.$cache.history.indexOf(to.path) != -1) {//back
        this.transitionName = ft ? ft + '-out' : '';
        this.$cache.history.pop();
      } else {//forward
        this.transitionName = tt ? tt + '-in' : '';
        this.$cache.history.push(to.path);
      }
    }
  }
}
</script>
