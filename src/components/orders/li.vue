<template>
  <div class="order-li">
    <div class="top">{{data.createTime}}<span>{{data.statusInfo.text}}</span></div>
    <div class="middle" @click="next(data.statusInfo.orderType,data.no)">
        <img :src="data.icon">
        <h1>{{data.title}}</h1>
        <p>{{data.subtitle}}</p>
    </div>
    <div class="bottom" v-html="getBottom(data.otherText)"></div>

    <order-action-bar v-if="![5,6,7].includes(data.statusInfo.status)&&!(data.statusInfo.status===2&&['XC','MG'].includes(data.statusInfo.orderType))&&data.statusInfo.state!==39" :data="data.statusInfo" :orderNo="data.no"></order-action-bar>
  </div>
</template>

<script>
export default {
  name:'order-li',

  props:{
    data:{type:Object}
  },

  methods:{
      next(type,no){
        if(['WB','SJ','MR','CP','NC','YY','MG'].includes(type)){
          this.$router.push('/orders/'+no);
        }else{
          this.$utils.downLoad(this.$messagebox,'请下载APP', '微信版暂无此功能');
        }
      },
      getBottom(txt){
        if(/：/.test(txt)){
          let txtArr=txt.split('：');
          return txtArr[0]+':<span>'+txtArr[1]+'</span>'
        }else{
          return txt
        }
      }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-li{background:#fff;margin-top:.05rem;color:$black;font-size:.12rem;
        .top{padding:0 .2rem;line-height: .4rem;border-bottom:$border;
          span{font-size:.15rem;color:$gray;float:right;}
        }
        .middle{padding:.15rem .2rem 0 .9rem;position: relative;min-height:.65rem;display: block;
          img{width:.6rem;height: .6rem;position: absolute;left:.2rem;top:.15rem;}
          p{color:$gray;}
        }
        .bottom{font-size: .15rem;line-height:.25rem;text-align:right;padding:0 .2rem;
          span{color:$mainColor;}
        }
    }
</style>
