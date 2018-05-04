<template>
    <app-layout id="invite">
        <div class="header">
            <div id="rank">
                <swiper v-if="list" class="dis" :options="option" ref="ranking">
                    <swiper-slide v-for="item in list" :class="item.isMe==='1'?'me':''">
                        <div>{{item.ranking}}</div>
                        <img :src="item.icon?item.icon:default_profile">
                        <h1>{{item.name}}{{item.isMe==='1'?'(您)':''}}<span>{{item.rewardAmount}}</span></h1>
                    </swiper-slide>
                </swiper>
                <router-link to="./invite/rank">排行榜></router-link>
            </div>

            <router-link id="rule" to="./invite/rule">活动规则</router-link>
            <button v-on:click="invite">立即邀请</button>
        </div>

        <div class="totle">
            <div><h1>邀请人数</h1><h2>{{pageData.invitedNumber}}人</h2></div>
            <div><h1>累计积分</h1><h2>{{pageData.rewardIntegral}}积分</h2></div>
        </div>

        <ul v-if="pageData&&pageData.invitationRecordList.length>0" class="list">
            <li v-for="item in pageData.invitationRecordList">
                <img :src="item.inviteeHeadPortrait?item.inviteeHeadPortrait:default_profile">
                <h1>{{item.inviteeMemberName}}<span>{{item.eventType}}</span></h1>
            </li>
        </ul>

        <div v-if="pageData&&pageData.invitationRecordList.length<=0" class="nodata">暂无好友加入，赶快邀请更多好友吧</div>

        <img v-if="wxInvite" src="/CRM/WeChat/App/static/img/invite.png" class="invite-tip" v-on:click="wxInvite=false">

    </app-layout>
</template>

<script>

export default {
    data() {
        return {
            default_profile: require('assets/img/default_user.png'),
            pageData: '',
            wxInvite: false,
            list: [],

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
    activated() {
        this.getData();
        this.getRank();
    },
    deactivated() {
        this.$indicator.close();
    },
    methods: {
        invite() {
            if (isLecheng) {
                let shareData = {
                    type: "share",
                    data: {
                        action: 'call',
                    }
                }
                this.$utils.jsBridge(shareData);
            } else {
                this.wxInvite = true;
            }
        },
        beforeRecommend() {
            switch (this.listItems.activityStatus) {
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
            let d = {
                content: {
                    memberId: this.$cache.user.memberId,
                    pageNo: 1,
                    pageSize: 50
                }
            };
            let res=await this.$post('/CRM/appinvitation/invitationRecord.json', d);
            if (res.errcode == 0) {
                let con = res.content;
                this.pageData = con;

                //分享内容
                let share = con.invitationInfo,
                    shareData = {
                        share_title: share.invitationTitle,
                        share_desc: share.invitationDetail,
                        share_img: share.invitationImg,
                        share_url: share.invitationUrl + '?icode=' + this.$cache.user.memberId
                    }
                this.$utils.shareConfig(shareData);
            } 
        },
        async getRank() {
            let d = {
                content: {
                    memberId:this.$cache.user.memberId,
                    pageNo: 1,
                    pageSize: 10,
                    rankType: "2"
                }
            };

            let res=await this.$post('/CRM/appinvitation/invitationRank.json', d);
            if (res.errcode == 0) {
                this.list = res.content.rankingList;
                if (this.swiper) { this.swiper.init(); }
            } 
        }
    }
}
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #invite{
      .header{padding-top:3.28rem;box-sizing:border-box;height: 4.3rem;background:url('/CRM/WeChat/App/static/img/invite/bg.jpg') no-repeat top center;background-size:100%;text-align:center;position:relative;
        #rule{padding:0 .2rem;border-radius: 99px;background: rgba(0,0,0,.2);color:#fff;line-height: .3rem;margin-bottom:.1rem;display: inline-block;}
        button{margin:0 auto;color:black;height:.4rem;width:3.35rem;background: #ffcb00;border-radius: 4px;line-height: .4rem;}
      
        #rank{width:3.37rem;height:.45rem;border-radius:6px;overflow: hidden;zoom:1;color:#fff;position:absolute;top:.2rem;left:.2rem;
            .swiper-container{height:100%;width:2.45rem;float:left;background:rgba(0,0,0,.6);border-radius:6px 0 0 6px;
                .swiper-slide{padding:0 .12rem 0 .7rem;position:relative;line-height:.45rem;
                    &.me{color:$mainColor;}
                    div{position:absolute;left:.12rem;width:.2rem;text-align: left;}
                    img{width:.3rem;height:.3rem;border-radius:99px;position:absolute;left:.32rem;top:.075rem;}
                    h1{text-align:left;width:1.63rem;
                        span{float:right;&:before{content:'';display: inline-block;margin-right:.05rem;width:.09rem;height:.09rem;background:url('~assets/img/invite/coin.png') no-repeat top center;background-size:100%;}}
                    }
                }
            }
            a{display: block;height:100%;width:.92rem;line-height:.45rem;font-size:$h2;font-weight:600;@include transColor_t2b(#ff8e0f,#ff5b02);float:right;text-align:center;}
        }
      
      }
      
       .totle{
           @include box;background:#fff;padding:10px 0;color:black;text-align:center;margin-bottom:.05rem;
           div{
               @include flex;
               h1{font-size:$h2;}
               h2{color:$mainColor;padding-top:.05rem;}
           }
           div:nth-of-type(2){border-left:$border;border-right:$border;}
       }

       li{
           padding:0 .2rem 0 .7rem;position:relative;line-height:.44rem;border-bottom:$border;
           img{width:.3rem;height:.3rem;border-radius:99px;position:absolute;left:.2rem;top:.07rem;}
           h1{
               span{float:right;color:$gray;}
           }
       }
  }

</style>
