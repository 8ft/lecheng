<template>
    <div class="coupon-popup">
        <mt-popup v-model="popupSwitch" position="bottom" style="width:100%;">
            <div class="coupons">
                <h1>使用优惠券</h1>

                <div class="page-content" style="background:#f2f2f2;">

                    <div class="li" v-if="coupons.length>0" v-for="(item,index) in coupons">
                        <div class="top">
                            <div class="title">{{item.coupon_name}}</div>
                            <div class="money">
                                <div><span>¥</span>{{item.deduct_money}}</div>
                                <span>{{item.condition}}</span>
                            </div>
                        </div>

                        <div class="bottom">
                            <p class="time">{{item.canuse_start_time}}至{{item.canuse_end_time}}</p>
                            <p class="desc">{{item.coupon_desc}}</p>

                            <div :class="{'item-radio':true,'on':selectedCoupon===index}" @click="selectedCoupon=index;"></div>
                        </div> 
                    </div>

                    <div v-if="coupons.length<=0" class="lc-error" style="height:2rem;">
                        <img src="~assets/img/mall/icon_goods_empty.png">
                        <p>当前无可用优惠券</p>
                    </div>

                    <template v-if="disCoupons.length>0">
                        <div class="sep">
                            <span></span>
                            <h1>不可用优惠券</h1>
                        </div>

                        <div class="li dis" v-if="disCoupons.length>0" v-for="(item,index) in disCoupons">
                            <div class="top">
                                <div class="title">{{item.coupon_name}}</div>
                                <div class="money">
                                    <div><span>¥</span>{{item.deduct_money}}</div>
                                    <span>{{item.condition}}</span>
                                </div>
                            </div>
                            <div class="bottom">
                                <p class="time">{{item.canuse_start_time}}至{{item.canuse_end_time}}</p>
                                <p class="desc">{{item.coupon_desc}}</p>
                            </div> 
                        </div>
                    </template>
                </div>
                <button v-if="coupons.length>0" :class="{none:true,on:selectedCoupon===-1}" @click="selectedCoupon=-1;">不使用优惠券</button>
            </div>
        </mt-popup>

    </div>
</template>

<script>
export default {
  name:'use-coupon',
  
  props:{
      value:{type:Object},
      goods:{type:Array,default:[]},
      switch:{type:Boolean,default:false}
  },
  data: function () {
    return { 
        coupons:[],
        disCoupons:[],
        popupSwitch:false,
        selectedCoupon:-1
    }
  },
  watch:{
      switch(val){
          if(val){
              this.popupSwitch=true;
          }
      },
      popupSwitch(val){
          if(!val){
              this.$emit('close');
          }
      },
      goods(val){
          if(val.length>0){
              this.getCoupon(val);
          }else{
              this.selectedCoupon=-1;
              popupSwitch:false;
              this.coupons=[];
              this.disCoupons=[];
          }
      },
      selectedCoupon(val){
        let coupons=this.coupons,
        clen=coupons.length;

        if(val>=0){
            this.$emit('input',{
                coupon:coupons[val],
                len:clen,
                desc:coupons[val].coupon_name
            });
        }else{
            this.$emit('input',{
                len:clen,
                desc:clen+'张可用优惠券'
            });
        }

        this.popupSwitch=false;
      }
  },
  methods:{
        async getCoupon(goods){
            let data={
                    content:{
                        memberId:this.$cache.user.memberId,
                        goodsList:this.initGoods(goods)
                    }
                };
            let res= await this.$post('/couponSys/crmCoupon/orderCouponList.json', data);
            if (res.errcode === 0) {
                let list=res.content.couponList;
                this.coupons =list.filter(item => item.state!==0);
                this.disCoupons=list.filter(item => item.state===0);

                let clen=this.coupons.length;
                if(clen){
                    this.$emit('input',{
                        len:clen,
                        desc:clen+'张可用优惠券'
                    });
                }else{
                    this.$emit('input',{
                        desc:'暂无可用优惠券'
                    });
                }
            }
        },
        initGoods(arr){
            return arr.map(function(item){
                return {
                    id:item.item_id,
                    price:item.price,
                    num:item.quantity
                }
            });
        }
    }
}
</script>

<style lang="scss">
 @import "~assets/css/coupon/popup.scss";
</style>


    