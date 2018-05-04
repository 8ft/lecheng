<template>
    <app-layout id="recommendRank">

        <mt-navbar v-model="selected" slot="header">
            <mt-tab-item id="recommend">推荐排行榜</mt-tab-item>
            <mt-tab-item id="reward">奖励排行榜</mt-tab-item>
        </mt-navbar>

        <ul v-show="selected=='recommend'" class="list">
            <li v-for="item in pageData.recommendRankList" :class="{me:item.memberId==$cache.user.memberId}">
                <div>{{item.ranking}}</div>
                <img :src="item.memberHeadPortrait||default_profile">
                <h1>{{item.memberName}}<span>{{item.recommendAmount}}单</span></h1>
            </li>
        </ul>

        <ul v-show="selected=='reward'" class="list">
            <li v-for="item in pageData.rewardRankList" :class="{me:item.memberId==$cache.user.memberId}">
                <div>{{item.ranking}}</div>
                <img :src="item.memberHeadPortrait||default_profile">
                <h1>{{item.memberName}}<span>{{item.rewardAmount}}元</span></h1>
            </li>
        </ul>

        <div class="myData" slot="footer">
            <div>{{selected==='recommend'?pageData.recommendRanking:pageData.rewardRanking}}</div>
            <img :src="pageData.memberHeadPortrait||default_profile">
            <h1>{{pageData.memberName}}（您）</h1>
            <span>{{selected==='recommend'?pageData.recommendAmount+'单':pageData.rewardAmount+'元'}}</span>
        </div>

    </app-layout>
</template>


<script>
    export default {
      data() {
        return {
            default_profile:require('assets/img/default_user.png'),
            selected:'recommend',
            pageData:{}
        };
      },
      mounted(){
        this.getData();
      },
      methods: {
        async getData() {
            let d={content: {
                memberId:this.$cache.user.memberId
            }};

            let res=await this.$post('/CRM/wechatrecommendbuycar/memberRankInfo.json',d);
            if(res.errcode==0){
                this.pageData=res.content;
            }
        }
      }
    }
</script>


<style lang="scss">
    @import "~assets/css/var.scss";
    #recommendRank{padding-top:2.2rem;
        .mint-navbar{padding:0 .2rem;}
        .list{border-radius:5px;width:94%;margin:.1rem auto 0;}
        li{
            padding:0 .2rem 0 .85rem;position:relative;line-height:60px;border-bottom:$border;
            div{position:absolute;left:.2rem;width:.24rem;}
            img{width:.3rem;height:.3rem;border-radius:99px;position:absolute;left:.44rem;top:.15rem;}
            h1{span{float:right;}}
            &.me{color:$mainColor;}
        }

        .myData{color:$mainColor;background:#fff;box-shadow: 0 0 4px #999;padding:0 .2rem;position:relative;line-height:60px;
            *{display:inline-block;}
            div{margin-right:.1rem;}
            img{width:.3rem;height:.3rem;border-radius:99px;display: inline-block;vertical-align: middle;margin-right:.1rem;}
            span{float:right;}
        }
    }
</style>

