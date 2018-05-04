<template>
    <app-layout id="carExhibition_orders">

        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
            
            <div class="record" v-for="(value,index) in listItems">

                <router-link :to="'/carExhibition/orderDetail?oid='+value.orderId">
                    <div class="top clearfix">
                        <h1>订单编号 <span>{{value.orderCode}}</span></h1>
                        <h2>{{desc[value.orderStatus]}}</h2>
                    </div>
                    <div class="center">
                        <img :src="value.orderIcon">
                        <p>{{value.orderName}}</p>
                        <h3>￥{{value.realAmount}}</h3>
                    </div>
                </router-link>
                <div class="bottom">
                    <p>下单时间：{{value.orderTime}}</p>

                    <div class="clearfix">
                        <button class="pay" v-on:click="pay(index,value.orderId)" v-if="value.orderStatus=='0'">立即支付</button>
                        <button v-on:click="cancel(index,value.orderId)" v-if="value.orderStatus=='0'">取消订单</button>
                        <button v-on:click="payBack(index,value.orderId)" v-if="value.orderStatus=='1'">申请退款</button>
                        <a href="tel:96358" v-if="value.orderStatus=='5'">联系客服</a>
                    </div>
                </div>

            </div>
            
        </div>

        <div v-if="nomore" class="nodata">没有数据咯</div>
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            desc:['待支付','已支付','已取消','退款中','退款已完成','退款失败','已使用'],
            pageNo:1,
            pageSize:10,
            nomore:false,
            loading:false,
            listItems:[]
        };
      },
      activated(){
        this.loadMore();
      },
      beforeRouteLeave (to,from,next){
        this.resetPage();
        next();
     },
      deactivated(){
        this.$indicator.close();
      },
      methods: {
        resetPage(){
          this.pageNo=1;
          this.pageSize=10;
          this.nomore=false;
          this.loading=false;
          this.listItems=[];
        },
        async loadMore() {
            if(!this.nomore&&!this.loading){
                this.loading=true;

                let d={content: {
                    memberId: this.$cache.user.memberId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    orderType:0
                }};

                let res=await this.$post('/CRM/wechatautoshow/orderList.json',d);
                if(res.errcode==0){
                    let list=res.content.orderList;
                    this.listItems=this.listItems.concat(list?list:[]);
                    if(res.content.totalPages<=this.pageNo){
                        this.nomore=true;
                    }else{
                        this.pageNo+=1;
                    }
                    this.loading=false;
                }
            }
        },
        async cancel(index,rid){
            let vm=this;
            vm.$messagebox.confirm('确定取消订单?', '提示').then(async function(){
                let d={content:{
                    orderId:rid
                }};

                let res=await vm.$post('/CRM/wechatautoshow/cancelOrder.json',d);
                if(res.errcode==0){
                    vm.listItems[index].orderStatus='2';
                }
            });
        },
        async payBack(index,rid){
            let vm=this;
            this.$messagebox.confirm('确定申请退款?', '提示').then(async function(){
                let d={content:{
                    orderId:rid
                }};

                let res=await vm.$post('/CRM/wechatautoshow/cancelOrder.json',d);
                if(res.errcode==0){
                    vm.listItems[index].orderStatus='3';
                }
            });
        },
        async pay(index,rid){
            let d={content:{
                openId:document.cookie.replace(/(?:(?:^|.*;\s*)openid\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                orderId:rid
            }};

            let res=await this.$post('/CRM/wechatautoshow/wxUnifiedOrder.json',d);
            if(res.errcode==0){
                let con=res.content,
                    vm=this;

                wx.chooseWXPay({
                    appId: con.appId,
                    timestamp:con.timeStamp,
                    nonceStr: con.nonceStr,
                    package: con.package, 
                    signType: 'MD5', 
                    paySign: con.paySign, 
                    success: function (res) {
                        vm.listItems[index].orderStatus='1';
                    }
                });
            }
        }
        
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #carExhibition_orders{
      .record{
          display:block;background:#fff;margin-top:.1rem;font-size:$h3;color:$gray;

          .top{border-bottom:$border;padding:.14rem .2rem;
              h1{float:left;display:inline-block;span{color:$black;margin-left:.1rem;}}
              h2{float:right;display:inline-block;}
          }

          .center{border-bottom:$border;padding:.14rem .8rem;position:relative;min-height:.5rem;
                p{color:$black;font-size:$h2;}
                img{display:block;position:absolute;left:.2rem;top:.14rem;width:.5rem;}
                h3{position:absolute;right:.2rem;top:.14rem;color:$mainColor;font-size:$h2;text-align:right;}
          }
          .bottom{padding:.1rem .2rem .14rem;
              div{
                  button,a{float:right;padding:0 .12rem;color:$gray;border:1px solid hsla(0,0%,93%,.6);font-size:$h2;border-radius:3px;line-height:.25rem;margin-top:.1rem;margin-left:.15rem;}
                  button.pay{border-color:$mainColor;color:$mainColor;}
              }
          }
      }
  }
</style>
