<template>

    <div class="order-info-box">
        <h1 v-if="title">{{title}}</h1>
        <div class="main">   
            <slot></slot>
        </div>
        <div class="totle" v-if="totle" v-html="getTotle(totle)"></div>
    </div>

</template>

<script>
export default {
  name:'info-box',
  
  props:{
    title:{type:String,default:''},
    totle:{type:String,default:''}
  },
  methods:{
      getTotle(txt){
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
    .order-info-box{border-bottom:$border;background:#fff;
        h1{padding:.1rem .2rem 0;}
        span,a{color:$mainColor;}
        .main{padding:.1rem 0;
            div{position:relative;padding-left:1.1rem;padding-right:.2rem;min-height:.2rem;line-height:.2rem;font-size:$h3;
                label{position: absolute;left:.2rem;top:0;color:$gray;}
            }
        }
        .totle{padding:.14rem .2rem;text-align:right;font-size:$h2;color:$black;border-top:$border;}
    }
</style>
