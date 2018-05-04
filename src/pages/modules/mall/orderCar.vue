<template>
  <app-layout id="mall_orderCar">

    <div class="mt1 part">
      <h1>购车人姓名:</h1>
      <input type="text" placeholder="输入购车人姓名" v-model="name">
    </div>
    <div class="part">
      <h1>购车人电话:</h1>
      <input type="text" placeholder="购车人手机号码" v-model="phone">
    </div>

    <div style="font-size:$h3;color:#c9c9c9;padding:0 .2rem;line-height:.3rem;">提示：请填写真实购车人信息，以享有优惠活动</div>

    <div class="car-info">
      <img :src="car.img">
      <div>
        <h1>{{car.title}}</h1>
        <h2>车型：{{car.spec_info}}</h2>
        <h2>提车：{{store.zitititle}}</h2>
        <p>{{store.zitiaddress}}</p>
        <span class="dingjin">￥{{car.price}}</span>
      </div>
    </div>

    <div class="benefit" v-for="item in benefit">
      <span>{{item.ctag}}</span>
      <p>{{item.ctitle}}</p>
    </div>

    <div class="radio"><div class="on"></div>我已阅读并同意<router-link to="/article/5">《乐橙新车条款》</router-link></div>


    <div id="footer" slot="footer">
      订金：<span>￥{{car.price}}</span>
      <button class="next" @click="next">提交订单</button>
    </div>

  </app-layout>
</template>

<script>
export default {
  data() {
      return {
        name:'',
        phone:'',

        car:{},
        store:{},
        benefit:[]
      }
  },
  activated(){
    let user=this.$cache.user;
    this.name=user.name||'';
    this.phone=user.phone||'';
    this.getData();
  },
  methods:{
    async next(){
      if(!this.name){
        this.$toast('请填写购车人姓名');
      }else if(!this.phone){
        this.$toast('请填写购车人手机号码');
      }else if (!/^1[345789]\d{9}$/.test(this.phone.replace(/\s/g,''))) {
          this.$toast('手机号码格式有误，请检查');
      }else{
        let user=this.$cache.user,
          data=this.$sign({
            content:{
              orderType:'SG',
              mobile:user.phone,
              items:[{
                itemid:this.car.item_id,
                skuid:this.car.sku_id,
                num:1
              }],
              receiver_name:this.name,
              receiver_mobile:this.phone,
              ziti_id:this.$route.query.zid,
              totalfee:this.car.total_price
            }
        });

        let res= await this.$post('/CRM/api/commit.order.json', data);
        if (res.errcode === 0) {
          this.$cache.history.pop();
          this.$router.replace('/pay/'+res.content.no);
        }
      }
    },
    async getData(){
      let user=this.$cache.user,
          data={
            content:{
              mbeid:user.memberId,
              mobile:user.phone,
              sku_id:this.$route.query.sid,
              ziti_id:this.$route.query.zid
            }
        }
      let res= await this.$post('/mall26/cart-checkout.html', data);
      if (res.errcode === 0) {
        let con=res.content;
        this.car=con.items[0];
        this.benefit=con.goucheyouhui;
        this.store=con.ziti;
      }
    }
   
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#mall_orderCar{
  .mt1{margin-top:.08rem;}
  .red{color:$mainColor;}
  .part{display:block;padding:.1rem .2rem;background: #fff;overflow: hidden;zoom:1;min-height:.24rem;line-height:.24rem;border-bottom:$border;
    h1{color:$black;display: inline-block;width:.8rem;}
    input{width:2.45rem;}
  }

  .car-info{padding:.12rem .2rem .12rem .95rem;position: relative;font-size:$h3;background:#fff;line-height:.2rem;margin-bottom:.05rem;
    img{width:.6rem;height:.6rem;position: absolute;left:.2rem;top:.12rem;}
    p{color:$gray;padding-left:.36rem;}
    span{color:$mainColor;font-size:$h2;margin-top:.1rem;display: block;}
  }

  .benefit{background:#fff;padding:0 .2rem;line-height: .44rem;font-size:$h3;border-bottom:$border;display:block;
    span{border:1px solid $mainColor;color:$mainColor;border-radius:3px;padding:1px 3px;margin-right:.05rem;}
    p{display: inline-block;}
  }

  .radio{
    height:.2rem;padding:1px .2rem 1px .4rem;position:relative;margin-bottom:.14rem;font-size:.13rem;color:$lightBlack;margin-top:.1rem;
    div{position:absolute;width:.11rem;height:.11rem;top:.03rem;left:.2rem;border-radius:99px;border:1px solid $mainColor;}
    div.on{background:$mainColor;color:#fff;}
    div.on:before{content:'√';}
    a{color:$mainColor;}
  }

  #footer{height:.5rem;line-height: .5rem;background:#fff;padding-left:.2rem;font-size:$h2;border-top:$border;
    span{color:$mainColor;}
    button{float:right;
      &.next{background:$mainColor;height: 100%;width:1.1rem;color:#fff;}
      &.del{color:$mainColor;border:1px solid $mainColor;border-radius: 3px;height:.3rem;margin-top:.1rem;margin-right:.2rem;padding:0 .2rem;line-height: .3rem;}
    }
  }
  
}
</style>
