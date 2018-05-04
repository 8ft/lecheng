<template>
    <div v-if="![1,6].includes(status)" :class="{'order-qrcode':true,used:isUsed}">
        <h1>兑换码：<span>{{cdkey}}</span></h1>
        <img :src="'http://qr.liantu.com/api.php?w=115&m=0&text='+encodeURIComponent(code)+'&fg='+(isUsed?'b1b1b1':'000000')"/>
        <p>请到指定商家并展示兑换码使用</p>
    </div>
</template>

<script>
export default {
  name:'order-qrcode',
  props:{
    cdkey:{type:String},
    code:{type:String},
    status
  },
  data() {
    return {
        isUsed:[4,5].includes(this.status)
    }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-qrcode{padding:.1rem .2rem;position: relative;background:#fff;
        h1{color:$black;line-height:.2rem;font-size:$h2;span{font-size:.18rem;}}
        img{margin:.15rem auto;display: block;width:115px;height:115px;}
        p{color:$gray;font-size:$h3;text-align:center;}
        &.used{
            h1 span{color:$gray;}
            &:after{content:'';position:absolute;right:.2rem;top:.2rem;width:.56rem;height: .56rem;background: url('~assets/img/recommendBuyers/icon_card_used.png') no-repeat center;background-size:100%;}
        }
    }
</style>
