<template>
  <div class="order-action-bar">
    <!-- 1：待付款 2：进行中 3：待收货 4：待评价 5：已完成 6：已取消 7：取消中 -->
    <button v-if="[1,2].includes(data.status)&&!['XC','MG'].includes(data.orderType)" @click="changeStatus(4)">取消订单</button>
    <button v-if="data.deliveryCode===1&&![1,2,6,7].includes(data.status)" @click="next('/shipping/'+orderNo)">查看物流</button>
    <button v-if="data.deliveryCode===1&&data.status===3" class="red" @click="changeStatus(3)">确认收货</button>

    <button v-if="data.status===1" class="red" @click="next('/pay/'+orderNo)">立即支付</button>
    <button v-if="data.status===4" class="red" @click="next('/orders/comment/'+orderNo)">立即评价</button>
  </div>
</template>

<script>
export default {
  name:'order-action-bar',
  
  props:{
    orderNo:{type:String},
    data:{type:Object}
  },

  methods:{
    next(path){
      if(['WB','SJ','MR','CP','NC','YY','MG'].includes(this.data.orderType)){
        this.$router.push(path);
      }else{
        this.$utils.downLoad(this.$messagebox,'请下载APP', '微信版暂无此功能');
      }
    },
    async changeStatus(status){

        //【3】已完成  【4】取消  【25】申请退货   【27】填写退货信息
        let res='',
            data=this.$sign({
                content: {
                    no: this.orderNo,
                    orderState:status
                }
            });

        if(status===4){
          this.$messagebox.confirm('确定取消订单?', '提示').then(async ()=>{
            if(!data.content.no){
              this.$toast('订单异常，请重试');
              eventBus.$emit('updateOrder');
              return
            }
            res = await this.$post('/CRM/api/update.order.info.json',data);
            if(res&&res.errcode==0){
                eventBus.$emit('updateOrder');
            }
          })
        }else{
            res = await this.$post('/CRM/api/update.order.info.json',data);
            if(res&&res.errcode==0){
                eventBus.$emit('updateOrder');
            }
        }
    }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-action-bar{height: .44rem;text-align:right;box-sizing: border-box;padding:.095rem .2rem;background:#fff;border-top:$border;
      button{height:.25rem;padding:0 .1rem;border-radius:.03rem;margin-left:.1rem;border:$border;color:$gray;}
      button.red{border-color:$mainColor;color:$mainColor;}
    }
</style>
