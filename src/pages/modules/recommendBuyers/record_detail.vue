<template>
    <app-layout id="recommendBuyersRecordDetail">

            <div class="part status">
                <h1>推荐订单编号:{{pageData.recommendCode}}</h1>
                <ul>
                    <li class="on"><div></div><p><img src="~assets/img/orders/step/submit.png">提交推荐</p></li>

                    <template v-if="pageData.statusList&&pageData.statusList[0].status!=='91'">
                        <li :class="{on:['30','40','50','60'].includes(pageData.statusList[0].status)}"><div></div><p><img src="~assets/img/orders/step/arrive.png">已到店</p></li>
                        <li :class="{on:['40','50','60'].includes(pageData.statusList[0].status)}"><div></div><p><img src="~assets/img/orders/step/finishcar.png">已订车</p></li>
                        <li :class="{on:pageData.statusList[0].status=='60'}"><div></div><p><img src="~assets/img/orders/step/finish.png">完成发奖</p></li>
                    </template>

                    <li class="on" v-else><div></div><p><img src="~assets/img/orders/step/cancel.png">已取消</p></li>
                </ul>
            </div>

            <div class="part steps">
                <div v-show="index<3||showMoreStatus" v-for="(item,index) in pageData.statusList">
                    <h1>{{item.detail}}</h1>
                    <p>{{item.statusReason}}</p>
                    <span>{{item.statusTime}}</span>
                </div>
                <p v-if="pageData.statusList&&pageData.statusList.length>3" :class="{more:true,on:showMoreStatus}" @click="showMoreStatus=!showMoreStatus">{{showMoreStatus?'点击收起订单状态':'点击查看更多订单状态'}}</p>
            </div>

            <div class="part info">
                <div><label>推荐时间:</label>{{pageData.recommendTime}}</div>
                <div><label>推荐客户:</label>{{pageData.customerName}}</div>
                <div><label>客户电话:</label><span>{{pageData.customerPhone}}</span></div>
                <div><label>推荐门店:</label>{{pageData.recommendInfo}}</div>
                <div><label>销售顾问:</label>{{pageData.consultant}}</div>
                <div><label>意向车型:</label>{{pageData.intentionCarSeries}}</div>
            </div>
        
    </app-layout>
</template>

<script>
    export default {
      name:'ex-recommendBuyersRecordDetail',
      data() {
        return {
            showMoreStatus:false,
            pageData:[]
        };
      },
      mounted(){
          this.getData();
      },
      methods: {
        async getData() {
            let data={content: {recommendId:this.$route.params.id}};

            let res=await this.$post('/CRM/wechatrecommendbuycar/myRecommendDetail.json',data);
            if(res.errcode==0){
                this.pageData=res.content;
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #recommendBuyersRecordDetail{
      .part{display:block;padding:.1rem .2rem;background: #fff;font-size:$h3;border-bottom:$border;}

      .status{
            ul{@include box;padding:.24rem 0 .1rem;
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
        }

      .steps{
          div{border-left:1px solid #f1f1f1;padding-left:14px;position:relative;
            &::before{content:'';display:block;width:10px;height:10px;background: lightgray;border-radius:99px;position:absolute;left:-5px;top:0;}
            h1{color:$black;line-height:$h3;margin-bottom:.05rem;}
            p{color:$gray;margin-bottom:.05rem;}
            span{display:block;color:lightgray;font-size:$h4;padding-bottom:.24rem;}
          }

          div:first-of-type{
              &::before{background: $mainColor;}
              h1{color:$mainColor;}
          }

          div:last-of-type{border-left:none;}

          .more{color:$gray;position: relative;width:1.35rem;margin:0 auto;
            &::after{position:absolute;content:'';width:0;height:0;right:0;bottom:50%;margin-bottom:-.025rem;border:.05rem solid transparent;border-bottom:0;border-top-color:#fff;}
            &::before{position:absolute;content:'';width:0;height:0;right:0;bottom:50%;margin-bottom:-.035rem;border:.05rem solid transparent;border-bottom:0;border-top-color:$black;}
          }
          .more.on{
            &::after{position:absolute;content:'';width:0;height:0;right:0;top:50%;margin-top:-.005;border:.05rem solid transparent;border-top:0;border-bottom-color:#fff;}
            &::before{position:absolute;content:'';width:0;height:0;right:0;top:50%;margin-top:-.015rem;border:.05rem solid transparent;border-top:0;border-bottom-color:$black;}
          }
      }

      .info{margin-top:.05rem;
          div{position:relative;padding-left:.9rem;height:.2rem;line-height:.2rem;font-size:$h3;
            label{position: absolute;left:0;top:0;color:$gray;}
            span{color:$mainColor;}
          }
      }
  }
</style>
