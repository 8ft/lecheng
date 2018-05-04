<template>
  <app-layout id="orderPaid" v-if="detail.no">
    
    <div class="base">
        <img src="/CRM/WeChat/App/static/img/mall/icon_submit_ok.png">

        <h1>{{titles[type]}}</h1>
        <p>{{tips[type]}}</p>

        <div>
            <button @click="next('/orders/'+detail.no)">查看订单</button>
            <button v-if="recommend" @click="next('/mall')">继续购物</button>
            <a v-else href="tel:96358">联系客服</a>
        </div>
    </div>

    <div v-if="recommend" class="sep">
        <span></span>
        <h1>您可能还会买</h1>
    </div>

    <div class="goods-list col2" v-if="recommend&&goodsList.length>0">
        <router-link class="li" v-for="item in goodsList" :to="'/mall/cargoods/'+item.item_id">
            <img v-lazy.appMain="item.img">
            <div>
            <h1>{{item.title}}</h1>
            <h2>￥{{item.price}}
                <del>￥{{item.mkt_price}}</del>
            </h2>
            </div>
        </router-link>
    </div>
  
  </app-layout>

</template>

<script>
export default {
  data() {
    return {
        type:'',
        recommend:false,
        detail:{},
        goodsList:[],
        titles:{
            'WB':'订单提交成功',
            'SJ':'订单提交成功',

            'MR':'订单支付成功',
            'NC':'订单支付成功',
            'TJ':'订单支付成功',
            'CP':'订单支付成功',
            'YY':'订单支付成功',
            'YY-express':'订单支付成功'
        },
        tips:{
            'WB':'请准时到店进行维保服务',
            'MR':'请凭兑换码到店服务',
            'NC':'我们将尽快与您取得联系，请保持电话畅通',
            'TJ':'我们将尽快与您取得联系，请保持电话畅通',
            'CP':'您的包裹将很快寄出',
            'SJ':'到店试驾时，请带好本人驾驶证',
            'YY':'请凭兑换码到店服务',
            'YY-express':'您的包裹将很快寄出'
        }
    };
  },
  activated(){
    if(!this.detail.no){
        this.getData();
    }
  },
  beforeRouteLeave (to,from,next){
    if(!/cargoods/.test(to.path)){
        this.resetPage();
    }
    next();
  },
  methods:{
    resetPage(){
        this.type='';
        this.recommend=false;
        this.detail={};
    },
    next(to){
        let history=this.$cache.history,
            index=history.indexOf(to);

        if(index>=0){
            let len=history.length-1;
            this.$router.go(-(len-index));
        }else{
            this.$cache.history.pop();
            this.$router.replace(to);
        }
    },
    async getData() {
        let data=this.$sign({
                content:{
                    no:this.$route.params.id
                }
            });

        let res=await this.$post('/CRM/api/query.payedInfo.json',data);
        if(res.errcode==0){
            let con=res.content,
                info=con.statusInfo,
                type=info.orderType;

            if(info.deliveryCode===1){
                type='YY-express';
            }

            this.detail=con;
            this.type=type;

            if(['CP','NC','TJ','YY-express'].includes(type)){
                this.recommend=true;
                this.getRecommend();
            }
        }
    },
    async getRecommend () {
      let data = { content: { type: 'orderfinish', maxRecordNum: 20, pageNo: 1 ,pageSize:10} };
      let res = await this.$post('/mall26/itemlist.html', data);

      if (res.errcode === 0) {
        this.goodsList = res.content.list;
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#orderPaid {
    .base{text-align: center;background:#fff;padding:.2rem;
        img{width:.9rem;margin-bottom:.1rem;}
        h1{font-size:$h2;color:$black;margin-bottom:.1rem;}
        h2{font-size:$h3;margin-bottom:.1rem;span{color:$mainColor;}}
        p{font-size:$h3;color:$gray;margin-bottom:.2rem;}
        button,a{width:1.3rem;height:.3rem;line-height:.3rem;border:$border;display:inline-block;vertical-align: middle;color:$gray;}
        button{margin-right:.15rem;}
    }
    .sep{
        text-align: center;color:$black;height:.5rem;line-height:.5rem;position:relative;
        h1{position:absolute;top:0;left:50%;margin-left:-.51rem;width:1.02rem;z-index:2;background: #f2f2f2;}
        span{display:inline-block;height:0;border-top:1px solid #c9c9c9;width:2.06rem;vertical-align: middle;}
    }
}
</style>
