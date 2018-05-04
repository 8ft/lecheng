<template>
<app-layout id="me">
    <div class="header-bg">
        <div class="info-box">
            <router-link tag="div" class="head" :style="{'background-image':'url('+defaultHead+')'}" to="/me/account"></router-link>
            <router-link tag="div" class="name" to="/me/account">{{nickname}}</router-link>
            <div class="progress-box">
                <div class="full">
                    <div class="progress" :style="{'width':percent+'%'}"></div>
                </div>
                <div class="num">{{$cache.user.growthPoint}}/{{$cache.user.growthPoint+$cache.user.growthPoint2NextLevel}}</div>
            </div>
            <div class="card-box">
                <router-link to="/me/memberRights" class="mycard">
                    <img src="~assets/img/me/label_personal_puka@2x.png" v-if="$cache.user.level.includes('普卡')">
                    <img src="~assets/img/me/label_personal_yinka@2x.png" v-else-if="$cache.user.level.includes('银卡')">
                    <img src="~assets/img/me/label_personal_jinka@2x.png" v-else-if="$cache.user.level.includes('金卡')">
                    <img src="~assets/img/me/label_personal_zuanshika@2x.png" v-else-if="$cache.user.level.includes('钻石')">
                    <span>{{$cache.user.level}}会员权益<span class="arrow"></span></span>
                </router-link>
                <router-link  class="mycard" :to="'/spMall/somePage?url='+encodeURIComponent(privilegeUrl)" v-if="privilegeUrl!=''">
                    <img src="~assets/img/me/icon_personal_quanyi@2x.png" style="height:.13rem;margin-left: .05rem;">
                    <span>限量特权<span class="arrow"></span></span>
                </router-link>
            </div>

        </div>
        <ul class="package-box">
            <router-link tag="li" to="/money">
                <img src="~assets/img/me/icon_personal_coupon@2x.png">
                <div>余额</div>
            </router-link>
            <router-link tag="li" to="/point">
                <img src="~assets/img/me/icon_personal_integral@2x.png">
                <div>积分</div>
            </router-link>
            <router-link tag="li" to="/myCoupons/1">
                <img src="~assets/img/me/icon_personal_money@2x.png">
                <div>卡券</div>
            </router-link>
            <router-link tag="li" to="/package">
                <img src="~assets/img/me/icon_personal_package@2x.png">
                <div>套餐</div>
            </router-link>
        </ul>
    </div> 


    <div class="myOrders">
    
        <router-link tag="li" class="all" to="/orders">
            <img src="~assets/img/me/order.png">
            <span class="text">我的订单</span>
            <div class="right">查看全部订单<span class="arrow"></span></div>
        </router-link>

        <div class="parts">
            <router-link to="/orders?status=1">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pay"></use>
                </svg>
                <div>待付款</div>
            </router-link>

           <router-link to="/orders?status=2">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-ongoing"></use>
                </svg>
                <div>进行中</div>
            </router-link>

            <router-link to="/orders?status=3">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-receive"></use>
                </svg>
                <div>待收货</div>
            </router-link>

            <router-link to="/orders?status=4">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment"></use>
                </svg>
                <div>待评价</div>
            </router-link>

            <a @click.stop="$utils.downLoad($messagebox,'请下载APP', '微信版暂无此功能')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pay"></use>
                </svg>
                <div>售后/退款</div>
            </a>
        </div>

    </div>


    <ul class="squared-box">
       
        <router-link tag="li" to="/mall/cart">
            <img src="~assets/img/me/squared_icon9.png">
            <p>我的购物车</p>
        </router-link>

        <router-link tag="li" to="/mall/collection">
            <img src="~assets/img/me/squared_icon10.png">
            <p>我的收藏</p>
        </router-link>

        <router-link tag="li" to="/spMall/duiba">
            <img src="~assets/img/me/squared_icon3.png">
            <p>积分商城</p>
        </router-link>

        <router-link tag="li" to="./myCars">
            <img src="~assets/img/me/squared_icon1.png">
            <p>我的车库</p>
        </router-link>

        <router-link tag="li" to="/carWiki">
            <img src="~assets/img/home/module_icon7.png">
            <p>用车百科</p>
        </router-link>
        
        <router-link tag="li" to="/invite">
            <img src="~assets/img/me/squared_icon4.png">
            <p>邀请有礼</p>
        </router-link>

        <router-link tag="li" to="/recommendBuyers">
            <img src="~assets/img/me/squared_icon5.png">
            <p>推荐买车</p>
        </router-link>

        <router-link tag="li" :to="'./helpCenter?actUrl='+encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/forApp/help_center.html')">
            <img src="~assets/img/me/squared_icon8.png">
            <p>客服中心</p>
        </router-link>
    </ul>

</app-layout>
</template>
<script>
export default {
  data() {
    return {
      percent: 0,
      privilegeUrl: "",
      defaultHead: "",
      nickname: ""
    };
  },
  mounted() {
    this.percent =
      this.$cache.user.growthPoint /
      (this.$cache.user.growthPoint + this.$cache.user.growthPoint2NextLevel) *
      100;
    if (this.$cache.user.level.includes("普卡")) {
      this.privilegeUrl = this.$cache.user.privilegePuKaUrl;
    } else if (this.$cache.user.level.includes("银卡")) {
      this.privilegeUrl = this.$cache.user.privilegeYinKaUrl;
    } else if (this.$cache.user.level.includes("金卡")) {
      this.privilegeUrl = this.$cache.user.privilegeJinKaUrl;
    } else if (this.$cache.user.level.includes("钻石")) {
      this.privilegeUrl = this.$cache.user.privilegeZuanShiKaUrl;
    }
  },
  activated() {
    this.nickname = this.$cache.user.nickname;
    this.defaultHead =
      this.$cache.user.headImgUrl || require("assets/img/default_user.png");
  },
  methods: {}
};
</script>
<style lang="scss">
@import '~assets/css/var.scss';

#me{
    .header-bg{width:100%;height:2.5rem;background:url('/CRM/WeChat/App/static/img/me/pic_personal.jpg') center no-repeat;background-size:100% 100%;color:#fff;position:relative;

    .info-box{text-align:center;padding-top:.22rem;
      .head{height:.6rem;width:.6rem;border-radius:50%;border:2px solid #fff;box-sizing:border-box;margin:auto;background-size:cover;background-position:center;}
      .name{font-size:.15rem;margin-top:.05rem;}

      .progress-box{display:flex;align-items:center;font-size:.12rem;justify-content:center;margin-top:.15rem;
        .full{margin-right:.1rem;position:relative;height:.05rem;width:1.1rem;background:#fff;border-radius:.05rem;overflow:hidden;
          .progress{position:absolute;width:50%;height:100%;background:$mainColor;border-radius:.05rem;}}}

      .card-box{display:flex;justify-content:center;
        .mycard{display:flex;align-items:center;
          height:.23rem;background:#2e2e30;border-radius:.23rem;padding:0 .03rem;font-size:.12rem;margin:.1rem;
          img{width:.16rem;border-radius:50%;margin-right:.05rem;}
          .arrow{position:relative;top:.01rem;margin-right:.1rem;margin-left:.05rem;
            &::after{position:absolute;content:'';width:0;height:0;top:0;right:-.04rem;border:.06rem solid transparent;border-right:0;border-left-color:#2e2e30;}
            &::before{position:absolute;content:'';width:0;height:0;top:0;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}}}}}

    .package-box{display:flex;background:#424143;position:absolute;bottom:0;left:0;width:100%;height:.6rem;
      li{display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1;text-align:center;
        img{width:.25rem;height:.25rem;}
        div{font-size:.12rem;margin-top:.05rem;}}}}

  .myOrders{margin:.1rem 0;
        .all{background:#fff;height:.5rem;display:flex;align-items:center;justify-content:space-between;font-size:.15rem;padding:0 .2rem;
            img{height:.19rem;margin-right:.1rem;}
            .text{color:#22222d;}
            .right{flex:1;text-align:right;color:#88888d;
                .arrow{position:relative;margin-left:.08rem;top:.01rem;
                    &::after{position:absolute;content:'';width:0;height:0;top:0;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                    &::before{position:absolute;content:'';width:0;height:0;top:0;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                }
            }
        }

        .parts{@include box;border-top:$border;background: #fff;color:$gray;padding:.15rem 0;
            a{@include flex;text-align:center;
                div{line-height: .1rem;font-size:$h4;margin-top:.1rem;}
            }
        }
    }

  .squared-box{display:flex;background:#fff;font-size:.15rem;color:#22222d;flex-wrap:wrap;
    li{display:flex;flex-direction:column;justify-content:center;align-items:center;width:33.33%;height:.88rem;border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;box-sizing:border-box;
      img{height:.3rem;margin-bottom:.05rem;}}}}

</style>
