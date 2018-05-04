<template>
    <app-layout id="carExhibition_orderDetail">

        <div class="part">
            <h1>订单编号 <span>{{data.orderCode}}</span></h1>
            <div class="box status" v-if="data.orderStatus=='0'||data.orderStatus=='1'||data.orderStatus=='6'">
                <div class="on"><p></p><span>待支付</span></div>
                <div :class="(data.orderStatus=='1'||data.orderStatus=='6')&&'on'"><p></p><span>已支付</span></div>
                <div :class="data.orderStatus=='6'&&'on'"><p></p><span>已使用</span></div>
            </div>

            <div class="box status" v-if="data.orderStatus=='2'">
                <div class="on"><p></p><span>待支付</span></div>
                <div class="on"><p></p><span>已取消</span></div>
            </div>

            <div class="box status" v-if="data.orderStatus=='3'">
                <div class="on"><p></p><span>待支付</span></div>
                <div class="on"><p></p><span>已支付</span></div>
                <div class="on"><p></p><span>退款中</span></div>
                <div><p></p><span>退款已完成</span></div>
            </div>

            <div class="box status" v-if="data.orderStatus=='4'||data.orderStatus=='5'">
                <div class="on"><p></p><span>待支付</span></div>
                <div class="on"><p></p><span>已支付</span></div>
                <div class="on"><p></p><span>退款中</span></div>
                <div class="on"><p></p><span>{{data.orderStatus=='4'?'退款已完成':'退款失败'}}</span></div>
            </div>

        </div>

        <div class="part">

            <div class="box base">
                <img :src="data.icon">
                <p>{{data.name}}</p>
                <h3>￥{{data.realAmount}}<br><span>x1</span></h3>
            </div>

            <div class="detail">
                <p><span>下单时间：</span>{{data.orderTime}}</p>
                <p><span>姓名：</span>{{data.signUpName}}</p>
                <p><span>手机号：</span>{{data.signUpPhone}}</p>
                <p><span>车型：</span>{{data.carInfo}}</p>
                <p v-if="data.consultantName"><span>推荐顾问：</span>{{data.consultantName}}</p>
                <p v-if="data.consultantFoursName"><span>顾问所属4S店：</span>{{data.consultantFoursName}}</p>
            </div>
            
        </div>

        <div class="link" v-if="data.showOtherActivity==='1'" @click="go(data.otherActivityUrl)">
            <img :src="data.otherActivityImgUrl">
        </div>

        <!-- &&!(data.orderStatus==='0'||data.orderStatus==='2') -->

        <div slot="footer" class="box part actions" v-if="data.orderStatus=='0'||data.orderStatus=='1'||data.orderStatus=='5'">
            <p>总计：<span>￥{{data.realAmount}}</span></p>

            <div class="clearfix">
                <button class="pay" v-on:click="pay(data.orderId)" v-if="data.orderStatus=='0'">立即支付</button>
                <button v-on:click="cancel(data.orderId)" v-if="data.orderStatus=='0'">取消订单</button>
                <button v-on:click="payBack(data.orderId)" v-if="data.orderStatus=='1'">申请退款</button>
                <a href="tel:96358" v-if="data.orderStatus=='5'">联系客服</a>
            </div>
        </div>
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            data:{},
        };
      },
      activated(){
        this.getDetail();
      },
      deactivated(){
        this.data={};
        this.$indicator.close();
      },
      methods: {
        go(url){
            if(/wxwap/.test(url)){
                this.$router.push(url.split('#')[1]);
            }else{
                location.href=url;
            }
        },
        async getDetail(){

            let d={content: {
                orderId: this.$route.query.oid
            }};

            let res=await this.$post('/CRM/wechatautoshow/orderDetail.json',d);
            if(res.errcode==0){
                this.data=res.content;
            }
        },
        async cancel(oid){
            let vm=this;
            vm.$messagebox.confirm('确定取消订单?', '提示').then(async function(){
                let d={content:{
                    orderId:oid
                }};

                let res=await vm.$post('/CRM/wechatautoshow/cancelOrder.json',d);
                if(res.errcode==0){
                    vm.data.orderStatus='2';
                }
            });
        },
        async payBack(oid){
            let vm=this;
            vm.$messagebox.confirm('确定申请退款?', '提示').then(async function(){
                let d={content:{
                    orderId:oid
                }};

                let res=await vm.$post('/CRM/wechatautoshow/cancelOrder.json',d);
                if(res.errcode==0){
                    vm.data.orderStatus='3';
                }
            });
        },
        async pay(oid){
            let d={content:{
                openId: document.cookie.replace(/(?:(?:^|.*;\s*)openid\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                orderId:oid
            }};

            let res=await this.$post('/CRM/wechatautoshow/wxUnifiedOrder.json',d);
            if(res.errcode==0){
                let con=res.content,
                    vm=this;

                wx.chooseWXPay({
                    appId: con.appId,
                    timestamp:con.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: con.nonceStr, // 支付签名随机串，不长于 32 位
                    package: con.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: con.paySign, // 支付签名
                    success: function (res) {
                        vm.data.orderStatus='1';
                    }
                });
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #carExhibition_orderDetail{
      #appMain{padding-bottom:.55rem!important;}

      .part{display:block;background:#fff;margin-top:.1rem;font-size:$h3;color:$gray;
            h1{line-height:.45rem;padding-left:.2rem;border-bottom:1px solid hsla(0,0%,93%,.6);font-size:$h2;span{color:$black;}}
      }

      .box{@include box;padding:.14rem .2rem;}

        .left{@include flex(5);}
        .right{@include flex;text-align: right;}

      .status{padding:.24rem 0 .1rem;
          div{@include flex;text-align:center;color:$gray;position:relative;
            &:first-of-type{p{left:auto;right:0;width:50%;}}
            &:last-of-type{p{width:50%;}}
            p{display:block;height:1px;width:100%;background:hsla(0,0%,93%,.8);position: absolute;top: 0;left:0;}
            span{position:relative;display:inline-block;padding-top:.2rem;
                &::before{content:'';width:.08rem;height:.08rem;background:hsla(0,0%,93%,.8);border-radius:99px;position:absolute;top:-.04rem;left:50%;margin-left:-.04rem;}
            }
          }
          div.on{
            color:$mainColor;
            p{background-color:$mainColor;}
            span::before{background:$mainColor;}
          }
      }

      .base{border-bottom:$border;padding:.14rem .8rem;position:relative;min-height:.5rem;
            p{color:$black;font-size:$h2;}
            img{display:block;position:absolute;left:.2rem;top:.14rem;width:.5rem;}
            h3{position:absolute;right:.2rem;top:.14rem;color:$mainColor;font-size:$h2;text-align:right;span{color:#88888d;font-size:$h3;}}
        }

      .detail{
            padding:.1rem .2rem;
            p{padding-left:1rem;position:relative;margin-bottom:.08rem;line-height:.16rem;min-height:.16rem;}
            span{color:$gray;position:absolute;left:0;top:0;}
      }

      .link{margin:.2rem auto;
          img{width:100%;}
      }
      

      .actions{width:100%;box-sizing:border-box;font-size:$h2;align-items: center;margin:0;
            p{@include flex;display:block;span{color:$mainColor;}}
            div{@include flex(2);}
            button,a{display:block;float:right;padding:0 .1rem;color:$gray;border:1px solid hsla(0,0%,93%,.6);font-size:$h2;border-radius:3px;line-height:.25rem;margin-left:.15rem;}
            button.pay{border-color:$mainColor;color:$mainColor;}
       }
  }
</style>
