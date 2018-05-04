<template>

    <div class="orders-goods">
        <router-link to="">
            <img :src="data.icon">
            <div class="info">
                <h1>{{data.name}}</h1>
                <h2>{{data.subtitle}}</h2>
                
                <div v-if="type==='NC'" class="dingjin">：￥{{data.price}}</div>
                <p v-else><span>￥{{data.price}}</span><br>x{{data.num}}</p>
            </div>
        </router-link>
        <div v-if="data.afterSaleText" class="afterSale"><button @click.stop="$utils.downLoad($messagebox,'请下载APP', '微信版暂无此功能')">{{data.afterSaleText}}</button></div>
    </div>

</template>

<script>
export default {
  name:'order-goods',
  
  props:{
    type:{type:String,default:'CP'},
    data:{type:Object}
  },

  methods:{
    cancel(id,type){
        let vm=this;
        vm.$messagebox.confirm('确定取消订单?', '提示').then(async function(){
            let res=await vm.$post('/CRM/apptestdriveorder/cancelTestdriveOrderById.json',d);
            if(res.errcode==0){
                eventBus.$emit('updateOrder','service');
            }
        });
    },
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .orders-goods{border-bottom:$border;padding:.14rem .2rem;background:#fff;
            
        a{display:block;min-height:.66rem;padding-left:.7rem;overflow: hidden;zoom:1;position: relative;}
        img{width:.6rem;height:.6rem;display: block;position:absolute;left:0;top:0;}
        
        .info{padding-right:.8rem;font-size:$h3;line-height:.2rem;
            &.car{padding-right:0;}
            h1{color:$black;max-height:.4rem;overflow: hidden;}
            h2{color:$gray;@include txtOverflow;}
            p{line-height:.15rem;position:absolute;right:0;top:0;text-align: right;span{color:$mainColor;}}
            div{color:$mainColor;}
        }
        .num{line-height: .6rem;float:right;}

        .afterSale{text-align:right;
            button{min-width:.8rem;font-size:$h2;color:$gray;line-height:.25rem;padding:0 .1rem;border:$border;}
        }
            
    }
</style>
