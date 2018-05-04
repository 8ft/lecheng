<!--过滤器-->
<template>
    <ul class="lc-filter">

        <li v-if="type==='cargoods'" :class="s==='default'?'on':''" v-on:click="s='default'">综合</li>

        <li v-if="type==='car'" :class="s==='default'?'on':''" v-on:click="s='default'">最新</li>

        <li :class="/price/.test(s)?'on':''" v-on:click="changeSort">价格
            <div class="arrow">
                <div :class="s"></div>
                <div :class="s"></div>
            </div>
        </li>

        <slot></slot>
        
    </ul>
</template>

<script>
export default {
  name:'lc-filter',
  
  props:{
    type:{type:String,default:''},
    sort:{type:String,default:'default'}
  },
  watch:{
      s(val){
          this.update();
      },
      sort(val){
          this.s=val;
      }
  },
  data: function () {
    return { 
        s:'default'
    }
  },
  methods:{
      changeSort(){
          if(this.$cache.search.type==='cargoods'){
              this.s==='price_asc'?(this.s='price_desc'):(this.s='price_asc');
          }else{
              this.s==='zdprice_asc'?(this.s='zdprice_desc'):(this.s='zdprice_asc');
          }
          
      },
      update(){
          this.$emit('update:sort', this.s);
      }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  .lc-filter{@include box;background:#fff;border-bottom:$border;
    li{@include flex;text-align: center;height:.4rem;line-height:.4rem;
        &.on{color:$mainColor;}
      
        .arrow{position:relative;height:100%;display:inline-block;width:.12rem;vertical-align: top;
            div{width:100%;height:100%;position: absolute;top:0;left:0;right:0;}
            div:nth-of-type(1){
                &::after{position:absolute;content:'';width:0;height:0;right:0;top:50%;margin-top:-.06rem;border:.05rem solid transparent;border-top:0;border-bottom-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;right:0;top:50%;margin-top:-.07rem;border:.05rem solid transparent;border-top:0;border-bottom-color:$gray;}
                &.price_asc::before{border-bottom-color:$mainColor;}
                &.zdprice_asc::before{border-bottom-color:$mainColor;}
            }
            div:nth-of-type(2){
                &::after{position:absolute;content:'';width:0;height:0;right:0;top:auto;bottom:50%;margin-bottom:-.06rem;border:.05rem solid transparent;border-bottom:0;border-top-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;right:0;top:auto;bottom:50%;margin-bottom:-.07rem;border:.05rem solid transparent;border-bottom:0;border-top-color:$gray;}
                &.price_desc::before{border-top-color:$mainColor;}
                &.zdprice_desc::before{border-top-color:$mainColor;}
            }
        }
    }
  }
</style>


    