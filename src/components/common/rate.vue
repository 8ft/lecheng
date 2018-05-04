<template>
  <div class="lc-rate">
      
        <!-- 仅展示，可精确到小数点 -->
        <template v-if="disabled">
            <svg v-for="num in max" :class="{icon:true,on:isActive(num)}" :style="starStyle" aria-hidden="true" @click="rate(num)">
                <use :xlink:href="'#icon-star'+(isActive(num)?'_fill':'')"></use>
            </svg>

            <div class="star-cover" :style="coverStyle">
                <svg v-for="num in max" class="icon on" :style="starStyle" aria-hidden="true">
                    <use xlink:href="#icon-star_fill"></use>
                </svg>
            </div>
            <div class="point">{{val}}</div>
        </template>


        <!-- 用于评价，精确到整数 -->
        <template v-else>
            <svg v-for="(num,index) in max" :class="'icon '+icon+(isActive(num)?' on':'')" :style="starStyle" aria-hidden="true" @click="rate(num)">
                <use :xlink:href="'#icon-'+getIcon(index)"></use>
            </svg>
        </template>

  </div>
</template>

<script>
  export default {
    name: 'lc-rate',
    props:{
        icon:{
            type:String,
            default:'star'
        },
        value: {
            default: 0
        },
        max:{
            type:Number,
            default:5
        },
        disabled:{
            type:Boolean,
            default:false
        },
        size:{
            type:Number,
            default:.11
        },
        margin:{
            type:Number
        }
    },
    data(){
      return{
        val:this.toDecimal1(this.value),
        icons:{
            star:'star_fill',
            faces:[
                ['neutral','neutral','neutral','neutral','neutral'],
                ['negative','neutral','neutral','neutral','neutral'],
                ['negative','negative','neutral','neutral','neutral'],
                ['neutral','neutral','neutral','neutral','neutral'],
                ['positive','positive','positive','positive','neutral'],
                ['positive','positive','positive','positive','positive']
            ]
        }
      }
    },
    computed:{
        starStyle(){
            let size=this.size,
                margin=this.margin||size/4;

            return 'width:'+size+'rem;height:'+size+'rem;margin-right:'+margin+'rem;'
        },
        coverStyle(){
            let vm=this,
                size=vm.size,
                val=parseFloat(vm.val),
                margin=this.margin||size/4;

            return 'width:'+(size*val+margin*Math.floor(val))+'rem'
        }
    },
    watch: {
      value(val) {
        this.val = this.toDecimal1(val);
      }
    },
    methods:{
        getIcon(index){
            if(this.icon!=='star'){
                return this.icons[this.icon][this.value][index];
            }else{
                return this.icons[this.icon];
            }
        },
        toDecimal1(val){
            let s=val.toString(),
                len=s.split('.').length;

            return len>1?s:s+'.0'
        },
        isActive(value){
            return !this.disabled&&value<=this.val
        },  
        rate(value){
            if(!this.disabled&&typeof value==='number'&&value<=this.max&&value>=0){
                this.val=this.val===value?value-1:value;
                this.$emit('input', this.val);
            }
        }
    }
  }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
    .lc-rate{position: relative;display:inline-block;color:#c9c9c9;
        .faces.on{color:#ffd800;}
        .star-cover{position: absolute;left:0;top:0;overflow: hidden;white-space: nowrap;}
        .point{display:inline-block;width:25px;vertical-align: middle;line-height: .11rem;color:#fff;background: $mainColor;border-radius: 3px;font-size:$h4;letter-spacing:normal;text-align: center;}
    }
</style>

