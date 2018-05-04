<template>
    <div class="coupon-popup">
        <mt-popup v-model="popupSwitch" position="bottom" style="width:100%;">
            <div class="coupons">
                <h1>领取优惠券</h1>

                <div class="page-content">
                    <div class="li" v-if="coupons.length>0" v-for="(item,index) in coupons">
                        <div class="top">
                            <div class="title">{{item.coupon_name}}</div>
                            <div class="money">
                                <div><span>¥</span>{{item.deduct_money}}</div>
                                <span>满{{item.limit_money}}元可用</span>
                            </div>
                        </div>

                        <div class="bottom">
                            <p class="time"><span style="flex:1">{{item.canuse_start_time}}至{{item.canuse_end_time}}</span></p>
                            <p class="desc"><span>{{item.description}}</span></p>
                            
                            <img v-if="item.hasgetnum>=item.userlimit_quantity" src="~assets/img/mall/icon_card_have.png">
                            <button v-else @click="takeCoupon(item.coupon_id,index)">立即领取</button>
                        </div> 
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
  name:'take-coupon',
  
  props:{
      value:{type:Boolean},
      gid:{type:String}
  },
  watch:{
      value(val){
        if(val&&this.coupons.length===0){
            this.getCoupon();
        }else if(val){
            this.popupSwitch=val;
        }
      },
      popupSwitch(val){
          if(!val){
              this.$emit('input',val);
          }
      }
  },
  data: function () {
    return { 
        coupons:[],
        popupSwitch:false
    }
  },
  methods:{
        getCoupon(){
            if(this.coupons.length>0){
                this.popupSwitch=true;
            }else{
                this.$login(async ()=>{
                    let data={
                            content:{
                                memberId:this.$cache.user.memberId,
                                id:this.gid
                            }
                        };
                    let res= await this.$post('/couponSys/crmCoupon/canReceivelist.json', data);
                    if (res.errcode === 0) {
                        this.coupons = res.content.couponList;
                        this.popupSwitch=true;
                    }
                });
            }
        },
        async takeCoupon(id,index){
            let data={
                content: {
                    memberId: this.$cache.user.memberId,
                    id:id,
                    receiveType:1
                }
            };
            let res = await this.$post('/couponSys/appcoupon/receiveOnCoupon.json',data);
            if (res.errcode === 0) {
                this.coupons[index].hasgetnum+=1;
                this.$toast(res.msg);
            }
        }
    }
}
</script>

<style lang="scss">
 @import "~assets/css/coupon/popup.scss";
</style>


    