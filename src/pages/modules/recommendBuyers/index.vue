<template>
    <app-layout id="recommendBuyers">

            <div class="header">
                <div id="rank" :style="'background:'+pageData.backgroundColor">
                    <swiper class="dis" :options="option" ref="ranking">
                        <swiper-slide v-for="item in pageData.recommendRankList">
                            <div>{{item.ranking}}</div>
                            <img :src="item.memberHeadPortrait||default_profile">
                            <h1><span>{{item.memberName}}</span>推荐{{item.recommendAmount}}单</h1>
                        </swiper-slide>
                    </swiper>
                    <router-link to="/recommendBuyers/rank">排行榜 ></router-link>
                </div>
            </div>


            <img class="banner" :src="pageData.image">


            <div class="part rule">
                <router-link class="title arrow-link" :to="'/article/'+pageData.activityRuleId">奖励规则<span>查看规则详情</span></router-link>
                <div class="html" v-html="pageData.rewardRuleContent">
                    
                </div>
                <button @click="Recommend">立即推荐</button>
            </div>


            <div class="part">
                <router-link class="title arrow-link" to="/recommendBuyers/records">我的奖励金<span>查看明细</span></router-link>
                <div class="totle">
                    <router-link tag="div" to="/recommendBuyers/records"><h1>已推荐</h1><h2>{{pageData.recommendAmount}}人</h2></router-link>
                    <router-link tag="div" to="/recommendBuyers/rewards"><h1>已奖励</h1><h2>{{pageData.rewardAmount}}元</h2></router-link>
                </div>
            </div>

    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            default_profile:require('assets/img/default_user.png'),
            pageData:[],
            option: {
                notNextTick: true,
                direction: 'vertical',
                slidesPerView: 1,
                autoplay: 1,
                speed: 2000,
                loop: true
            }
        };
      },
      computed: {
        swiper() {
            return this.$refs.ranking.swiper;
        }
      },
      activated(){
        this.getData();
      },
      methods: {
        Recommend(){
            switch(this.pageData.activityStatus){
                case '0':
                    this.$messagebox.alert('活动未开始');
                break;
                case '1':
                    this.$router.push('./recommendBuyers/recommend');
                break;
                case '2':
                    this.$messagebox.alert('活动已满额');
                break;
                case '3':
                    this.$messagebox.alert('活动已结束');
                break;
            }
        },
        async getData() {
            let data={content: {
                memberId: this.$cache.user.memberId
            }};

            let res=await this.$post('/CRM/wechatrecommendbuycar/activityInfo.json',data);
            if(res.errcode==0){
                let con=res.content;

                this.pageData=con;
                if (this.swiper) { this.swiper.init(); }

                let shareData = {
                    share_title:con.title ,
                    share_desc:con.shareDetail,
                    share_img:con.shareImage,
                    share_url: con.shareUrl||location.origin+'/wxwap?#/recommendBuyers'
                };

                if(con.shareLimit==0){
                    this.$utils.shareConfig(shareData);
                }

                this.$cache.recommendBuyersShareData=shareData;
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #recommendBuyers{
        .part{background:#fff;margin-bottom:.05rem;
            .title{color:$black;line-height: .4rem;text-indent: .2rem;border-bottom:$border;display:block;
                span{float:right;color:$gray;font-size:$h3;margin-right:.32rem;text-indent: 0;}
            }
        }

        #rank{height:.45rem;overflow: hidden;zoom:1;color:#fff;padding:.1rem .2rem 0;@include box;
            .swiper-container{height:100%;width:73%;background:rgba(0,0,0,.6);border-radius:4px 0 0 4px;
                .swiper-slide{padding:0 .12rem 0 .7rem;position:relative;line-height:.45rem;
                    &.me{color:$mainColor;}
                    div{position:absolute;left:.12rem;width:.2rem;text-align: left;}
                    img{width:.3rem;height:.3rem;border-radius:99px;position:absolute;left:.32rem;top:.075rem;}
                    h1{text-align:right;width:1.63rem;
                        span{float:left;max-width:1rem;@include txtOverflow;}
                    }
                }
            }
            a{display: block;height:100%;width:27%;line-height:.45rem;font-size:$h2;@include transColor_t2b(#ff8e0f,#ff5b02);text-align:center;border-radius:0 4px 4px 0;}
        }

        .banner{height: 1.425rem;}

        .rule{padding-bottom:.2rem;
            .html{padding:.1rem .2rem;}
            button{display: block;width:3.35rem;margin:0 auto;line-height:.4rem;font-size:$h2;color:#fff;@include transColor_t2b(#ff8e0f,#ff5b02);text-align:center;border-radius:99px;}
        }

       .totle{
           @include box;margin:.05rem 0 0;background:#fff;padding:10px 0;color:black;text-align:center;
           div{
               @include flex;
               h1{font-size:$h2;color:$gray;}
               h2{color:$mainColor;padding-top:.05rem;}
           }
           div:nth-of-type(2){border-left:$border;border-right:$border;}
       }
  }

</style>
