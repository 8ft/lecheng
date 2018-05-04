<template>
    <app-layout id="packageDetail">
        <div class="package-ul">
            <li  :style="content.frequency==0 ? {'background':'#fafafa'} : ''">
                <div class="top" :style="content.frequency==0 ? {'background':'#c9c9c9'} : ''">
                    <div class="progress">
                        <div class="full" :style="{'width':content.frequency/content.totalnumber*100+'%'}"></div>
                    </div>
                    <div class="num">剩余<span>{{content.frequency}}</span>次</div>
                    <div class="round" :style="content.frequency==0 ? {'background':'#c9c9c9'} : ''"></div>
                </div>
                <div class="content">
                    <div class="left">
                        <div class="title">{{content.setmealName}}</div>
                        <div class="door"><img src="~assets/img/package/icon_vip_detail_notice@2x.png" alt=""><span>适用门店：{{content['4sStoreName']}}</span></div>
                        <div class="time"><img src="~assets/img/package/icon_vip_detail_time@2x.png" alt="">有效期至{{content.dateTime}}</div>
                    </div>
                </div>
            </li>
            <div class="explain-box" style="border-bottom:1px dashed #dfdfdf">
                <div class="title">套餐明细：</div>
                <ul>
                    <li v-for="(item,index) in content.detail"><div class="tick"></div>{{item.itemName}}</li>
                </ul>
            </div>
            <div class="explain-box">
                <div class="title">使用说明：</div>
                <ul style="margin-left:.02rem">
                    <li>1、本套餐不可拆分消费</li>
                    <li>2、使用更高的机油或配件需要补差价</li>
                    <li>3、使用本套餐需要提前一天预约</li>
                </ul>
            </div>
        </div>
        <div class="recommend"><div>套餐购买/使用</div></div>
        <ul class="product-ul">
            <li v-for="(item,index) in content.listUseproduct">
                <div class="left">
                    <p>{{item.itemTitle}}</p>
                    <div>订单号：{{item.orderCode}}</div>
                </div>
                <div class="right">
                    <p>{{item.frequency}}次</p>
                    <div>{{item.billDate}}</div>
                </div>
            </li>
        </ul>
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            content:''
        }
      },
      activated(){
          this.content=this.$cache.urlquery;
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #packageDetail{
      .package-ul{
          padding:.17rem 5% 0;
          box-sizing: border-box;
          background: #fff;
          >li{
              display: block;
              border-radius: 4px;
              box-shadow: 2px 2px 8px 0px #c9c9c9;
              width: 100%;
              background: #fff5e6;
              .top{
                  position: relative;
                  border-radius: 4px 4px 0 0;
                  background:#ff9600;
                  width: 90%;
                  height: .38rem;
                  padding:0 5%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  color: #fff;
                  font-size: .12rem;
                  .round{
                      position: absolute;
                      width: .35rem;
                      height: .25rem;
                      border-radius: 50%;
                      right: 0.26rem;
                        bottom: -.09rem;
                        z-index: 1;
                        background: #ff9600;
                  }
                  .progress{
                      width: 2.08rem;
                      height: .1rem;
                      border-radius: .1rem;
                      background: #fff;
                      position: relative;
                      .full{
                          position: absolute;
                          background: #ffca7f;
                          height: .1rem;
                          border-radius: .1rem;
                          width: 50%;
                      }
                  }
                  .num{
                      position: relative;
                      z-index: 2;
                      span{
                        transform: scale(2.2);
                        display: inline-block;
                        padding: 0 .12rem;
                    }
                  }
              }
              .content{
                  padding-bottom: .13rem;
                  width: 90%;
                  margin-left: 5%;
                  display: flex;
                  justify-content: space-between;
                  color: #22222d;
                  .left{
                      width: 100%;
                      flex:1;
                      font-size: .12rem;
                      
                      .title{
                          font-size: .15rem;
                          margin-top: .11rem;
                          text-overflow: ellipsis;
                          overflow: hidden;
                          white-space: nowrap;
                      }
                      .door{
                          margin-top: .11rem;
                          margin-left: .17rem;
                          line-height: .18rem;
                          width: 70%
                      }
                      .time{
                          margin-left: .17rem;
                          margin-top: .12rem;
                      }
                      img{
                          height: .12rem;
                          width: .12rem;
                          vertical-align: text-top;
                          margin-left: -.12rem;
                          position: relative;
                          left: -.05rem;
                      }
                  }
                  .btn{
                      height: .21rem;
                      width: .65rem;

                      color: #ff9600;
                      font-size: .12rem;
                      line-height: .21rem;
                      text-align: center;
                      border-radius: .21rem;
                      align-self: flex-end;
                      margin-bottom: 0;
                  }
              }
          }
          .explain-box{
              display: flex;
              padding:.15rem 0 .1rem;
              color: #696969;
              font-size: .12rem;
              .title{
                  color: #22222d;
                  margin-right: .05rem
              }
              ul{
                  li{
                      margin-bottom: .05rem;
                      display: flex;
                      align-items: center;
                      .tick{
                        margin-right: .07rem;
                        position: relative;
                        width: .13rem;
                        height: .13rem;
                        border-radius: 50%;
                        background: #a9ce52;
                        padding: 0;
                        &::after{position:absolute;content:'';width:.06rem;height:2px;top: .06rem;left:.05rem;transform: rotate(-50deg);background: #fff}
                        &::before{position:absolute;content:'';width:.04rem;height:2px;top: .07rem;left:.03rem;transform: rotate(40deg);background: #fff}
                    }
                  }
              }
          }
      }
      .recommend{
        height: .52rem;
        color: #22222d;
        font-size: .15rem;
        text-align: center;
        div{
            position: relative;
            display: inline-block;
            margin:.1rem .1rem;
            height: .32rem;
            line-height: .32rem;
            &::before{
                content: '';
                position: absolute;
                width: 1rem;
                height: 1px;
                background: #dfdfdf;
                left: -1.1rem;
                top: .15rem;
            }
            &::after{
                content: '';
                position: absolute;
                width: 1rem;
                height: 1px;
                background: #dfdfdf;
                right: -1.1rem;
                top: .15rem;
            }
        }
        
      }
      .product-ul{
          li{
              padding: 0 5%;
              height: .65rem;
              background: #fff;
              border-bottom: 1px solid #f2f2f2;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .left{
                  p{
                      font-size: .15rem;
                      color: #22222d
                  }
                  div{
                      font-size: .12rem;
                      color: #88888d;
                      margin-top: .05rem
                  }
              }
              .right{
                  text-align: right;
                  p{
                      font-size: .15rem;
                      color: $mainColor;
                  }
                  div{
                      font-size: .12rem;
                      color: #88888d;
                      margin-top: .05rem
                  }
              }
          }
      }
  }
</style>
