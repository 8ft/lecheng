<template>
    <router-link :class="{'lc-address':true,'arrow-link':!readOnly,dis:readOnly}" to="/address">
        <div></div>
        <h1>{{data.receiverName?(data.receiverName+'&nbsp;&nbsp;&nbsp;&nbsp;'+data.receiverMobile):'请填写收货地址'}}</h1>
        <p>{{data.receiverAddr||''}}</p>
    </router-link>
</template>

<script>
export default {
  name:'lc-address',

  props:{
    readOnly:{type:Boolean,default:false},
    data:{type:Object}
  },

  methods:{
     
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
       .lc-address{display:block;padding:.1rem .3rem .1rem .5rem;position:relative;background: #fff;overflow: hidden;zoom:1;min-height:.24rem;line-height:.24rem;border-bottom:$border;
            h1{color:$black;display: inline-block;}
            div{width:.5rem;position:absolute;height:100%;left:0;top:0;background: url('~assets/img/icon-addr-new.png') no-repeat center .1rem;background-size:.15rem .19rem;}
            p{color:$gray;font-size:$h3;position: relative;
                span{position:absolute;left:.75rem;top:0;}
            }
        }
</style>

