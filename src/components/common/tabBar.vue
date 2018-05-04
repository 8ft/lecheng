<template>
  <div class="tabbar" ref="tabBar">

    <router-link to="/home">
      <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-home'+(curPath==='/home'?'_fill':'')"></use>
      </svg>
      <div>首页</div>
    </router-link>

    <router-link to="/stores" :class="{'router-link-active':$route.path==='/partners'}">
      <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-store'+(['/stores','/partners'].includes(curPath)?'_fill':'')"></use>
      </svg>
      <div>服务门店</div>
    </router-link>

    <router-link to="/mall">
      <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-mall'+(curPath==='/mall'?'_fill':'')"></use>
      </svg>
      <div>商城</div>
    </router-link>

    <router-link to="/me">
      <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-personal'+(curPath==='/me'?'_fill':'')"></use>
      </svg>
      <div>我的</div>
    </router-link>

  </div>
</template>

<script>
  export default {
    name: 'lc-tabbar',
    data(){
      return{
        curPath:''
      }
    },
    mounted(){
      this.curPath=this.$route.path;
    },
    watch: {
      '$route'(to, from) {
        this.curPath=to.path;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/css/var.scss";
  .tabbar {position:absolute;bottom:0;left:0;right:0;z-index: $topFloor;@include box;border-top:$border;height: .5rem; background: #fff;box-sizing:border-box;padding-top:.06rem;
    a{@include flex;text-align:center;
      div{line-height: .1rem;font-size:$h4;margin-top:.03rem;}
    }
    .router-link-active{color:$mainColor;}
  }
</style>
