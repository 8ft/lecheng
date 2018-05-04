<template>

    <div class="store-discount">
        <div>{{title}}</div>
        <p>{{discount==10?'原价':discount+(isMin?'折起':'折')}}</p>
    </div>

</template>

<script>
export default {
  name:'store-discount',
  
  props:{
    title:{type:String,default:'预约工时'},
    discount:{type:String},
    isMin:{type:Boolean,default:true}
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .store-discount{background:#f2f2f1;color:$mainColor;text-align: center;border-radius:.04rem;position: absolute;right:.2rem;top:.1rem;width:.65rem;border:$border;overflow: hidden;
        div{font-size:$h4;color:$gray;width:100%;line-height:.18rem;border-radius:.04rem .04rem 0 0;}
        p{font-size:$h3;background:#fff;line-height: .22rem;}
    }
</style>
