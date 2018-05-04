<template>
    <a class="order-benefit" :href="data.link||''">
      <label>{{data.label}}</label>
      <p>{{data.desc}}</p>
    </a>
</template>

<script>
export default {
  name:'order-benefit',
  props:{
    data:{type:Object}
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-benefit{background:#fff;padding:.14rem .2rem;font-size:$h3;border-bottom:$border;display:block;overflow: hidden;position: relative;@include box;
        label{@include txtOverflow;color:#fff;background:$mainColor;border-radius:3px;max-width:.64rem;display: inline-block;line-height:.16rem;padding:0 .03rem;margin-right:.1rem;}
        p{display: inline-block;@include txtOverflow;max-width:2.5rem;}
    }
</style>
