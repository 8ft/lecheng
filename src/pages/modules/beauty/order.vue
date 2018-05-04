<template>
  <app-layout id="beautyOrder">

     <div class="part">
        <ul class="status">
            <li class="on"><div></div><p><img src="~assets/img/orders/step/pay.png">待付款</p></li>
            <li><div></div><p><img src="~assets/img/orders/step/service.png">待使用</p></li>
            <li><div></div><p><img src="~assets/img/orders/step/comment.png">待评价</p></li>
            <li><div></div><p><img src="~assets/img/orders/step/finish.png">已完成</p></li>
        </ul>
    </div>

    <div class="part mt store">
        <img class="pic" :src="store.foursImg">
        <h1>{{store.name}}</h1>
        <div class="brands">
          <img v-for="item in store['4SBrandList']" :src="item.brandIcon">
        </div>

        <lc-rate disabled v-model="store.foursAppraise"></lc-rate>  
    </div>

    <div class="part goods">
        <img src="~assets/img/orders/icon_order_detail_beauty@2x.png">
        <h1>{{goods.title}}<span>￥{{goods.price}}</span></h1>
        <p>x{{goods.quantity}}</p>
    </div>

    <div class="coupon-popup">
        <div class="arrow-link switch" @click="showCoupon=!showCoupon">
            <h1>优惠券</h1>
            <div><span :class="{red:coupon.len}">{{coupon.desc||''}}</span></div>
        </div>
    </div>
    
    <use-coupon slot="aside" :switch="showCoupon" :goods="list" v-model="coupon"></use-coupon>

    <div class="tip mt"><span>*</span>特别提示，服务耗时约<span>{{goods.needtime}}</span>小时，实际完成时间以到店后为准</div>

    <div id="footer" slot="footer">
      总计：<span>￥{{final}}</span>
      <button class="next" @click="next">提交订单</button>
    </div>

  </app-layout>
</template>

<script>
import UseCoupon from 'components/coupon/use'
export default {
  name:'ex-beautyOrder',
  components:{
      'use-coupon':UseCoupon,
  },
  data() {
      return {
        totle:0,
        final:0,
        goods:{},
        list:[],
        store:{},

        showCoupon:false,
        coupon:{}
      }
  },
  watch:{
    coupon(data){
      let coupon=data.coupon;
      if(coupon&&coupon.coupon_id){
        let final=parseFloat(this.$np.minus(this.totle,coupon.deduct_money)).toFixed(2);
        this.final=final>0?final:0;
      }else{
        this.final=this.totle;
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    async next(){
        let coupon=this.coupon.coupon,
          query=this.$route.query,
          data=this.$sign({
            content:{
              orderType:'MR',
              items:[{
                itemid:this.goods.item_id,
                skuid:query.sid,
                num:1
              }],
              ziti_id:query.zid,
              totalfee:this.final,
              coupon_code:coupon?coupon.coupon_id:''
            }
        });

        let res= await this.$post('/CRM/api/commit.order.json', data);
        if (res.errcode === 0) {
          this.$cache.history.pop();
          if(this.final){
            this.$router.replace('/pay/'+res.content.no);
          }else{
            this.$router.replace('/paid/'+res.content.no);
          }
        }
    },
    async getStoreInfo(id) {
      let data={
            content:{
              foursId:id
            }
        };

      let res= await this.$post('/CRM/appfourspoint/query4SInfoV2.json', data);
      if (res.errcode === 0) {
        this.store=res.content.fsList[0];
      }

    },
    async getData(){
      let user=this.$cache.user,
          query=this.$route.query,
          data={
            content:{
              mbeid:user.memberId,
              mobile:user.phone,
              sku_id:query.sid,
              ziti_id:query.zid
            }
        };

      let res= await this.$post('/mall26/cart-checkout.html', data);
      if (res.errcode === 0) {
        let con=res.content;
        this.list=con.items;
        this.goods=con.items[0];
        this.final=this.totle=this.goods.price;
        this.getStoreInfo(con.items[0].crmid);
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#beautyOrder{
    .part{display:block;padding:.1rem .2rem;background: #fff;overflow: hidden;zoom:1;min-height:.24rem;line-height:.24rem;border-bottom:$border;}
    .mt{margin-top:.05rem;}

    .status{padding:.24rem 0 .1rem;@include box;

        li{@include flex;text-align:center;color:$gray;position:relative;
            &:first-of-type{div{left:auto;right:0;width:50%;}}
            &:last-of-type{div{width:50%;}}
            div{display:block;height:1px;width:100%;background:$lightGray;position: absolute;top: 0;left:0;}
            p{position:relative;display:inline-block;padding-top:.18rem;font-size:.14rem;line-height:.14rem;
                img{width:.2rem;position:absolute;top:-.18rem;left:50%;margin-left:-.18rem;border-radius:100%;padding:.02rem;background:$lightGray;border:.06rem solid #fff;}
            }
        }
        li.on{color:$mainColor;
            div{background-color:$mainColor;}
            img{background:$mainColor;}
        }
    }

    .store{padding-left:1.1rem;position: relative;
        .pic{position:absolute;left:.2rem;top:.1rem;width:.7rem;height:.7rem;border-radius:5px;}
        .brands{height: .2rem;margin:.04rem 0;
            img{width:.2rem;height:.2rem;margin-right:.05rem;}
        }
    }

    .goods{
        img{float:left;width:.45rem;height: .45rem;margin-right:.2rem;border-radius: 100%;}
        span{float:right;color:$mainColor;}
        p{text-align: right;font-size: $h3;color:$gray;}
    }

    .tip{font-size:$h3;color:$gray;text-align: center;span{color:$mainColor;}}

    #footer{height:.5rem;line-height: .5rem;background:#fff;padding-left:.2rem;font-size:$h2;border-top:$border;
        span{color:$mainColor;}
        button{float:right;
        &.next{background:$mainColor;height: 100%;width:1.1rem;color:#fff;}
        &.del{color:$mainColor;border:1px solid $mainColor;border-radius: 3px;height:.3rem;margin-top:.1rem;margin-right:.2rem;padding:0 .2rem;line-height: .3rem;}
        }
    }
}
</style>
