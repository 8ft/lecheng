<template>
    <app-layout id="meMemberRights">
        <div class="meMember-card">
            <div class="card-bg" :class="cardtype">
                <div class="top">
                    <div class="head" :style="{'background-image':'url('+defaultHead+')'}"></div>
                    <div class="right">
                        <div class="name-box">
                            <div class="name">{{$cache.user.nickname}}</div>
                            <div class="type">{{$cache.user.level}}会员</div>
                        </div>
                        <div class="distance" v-if="$cache.user.growthPoint2NextLevel==0">您已升级为钻石卡会员</div>
                        <div class="distance" v-else>距离下一级还差{{$cache.user.growthPoint2NextLevel}}个成长值</div>
                        <div class="progress-box">
                            <div class="all-line">
                                <div class="line" :style="{'width':progress+'%'}"></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('普卡')}"></div></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('银卡')}"></div></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('金卡')}"></div></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('钻石')}"></div></div>
                            </div>
                            <ul>
                                <li>普卡</li>
                                <li>银卡</li>
                                <li>金卡</li>
                                <li>钻石</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div>当前成长值<span class="num">{{$cache.user.growthPoint}}</span></div>
                    <div>成长值排名：<span>{{$cache.user.custNum-$cache.user.ranking}}</span>名</div>
                </div>
            </div>
        </div>
        <div class="rights-box">
            <div class="title">{{$cache.user.level}}会员权益</div>
            <ul class="rights-ul">
                <router-link tag="li" :to="'./rightDetail?actUrl='+encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/forApp/vip_rights_detail.html?rid='+item.rid+'&grade='+grade)"  v-for="(item,index) in rightsList" v-show="cardNum>=item.type">
                    <img :src="item.img" alt="">
                    <p>{{item.title}}</p>
                    <div>{{item.con1}}<br/>{{item.con2}}</div>
                </router-link> 
            </ul>
        </div>
        <!-- <div class="recommend" v-show="iframeUrl!=''"><div>限量特权</div></div>
        <iframe v-show="iframeUrl!=''" :src="iframeUrl" id="iframe" frameborder="0"   @load="iframeLoad"></iframe> -->
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                cardtype:'',
                cardNum:0,
                progress:0,
                iframeUrl:'',
                grade:'',
                rightsList:[
                    {
                        img:require('assets/img/me/icon_member_benefit_integral@2x.png'),
                        rid:0,
                        title:'积分回馈',
                        con1:'小积分',
                        con2:'购豪礼',
                        type:0
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_help@2x.png'),
                        rid:1,
                        title:'道路救援',
                        con1:'全省区域',
                        con2:'省心服务',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_vip@2x.png'),
                        rid:9,
                        title:'贵宾礼遇',
                        con1:'让你尽享',
                        con2:'尊贵体验',
                        type:2
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_birthday@2x.png'),
                        rid:2,
                        title:'生日服务',
                        con1:'生日祝福',
                        con2:'为您庆生',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_car@2x.png'),
                        rid:8,
                        title:'代步服务',
                        con1:'便利出行',
                        con2:'专享特权',
                        type:2
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_health@2x.png'),
                        rid:3,
                        title:'健康养生',
                        con1:'您的健康',
                        con2:'我们呵护',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_slowlife@2x.png'),
                        rid:4,
                        title:'休闲文化',
                        con1:'感受城市',
                        con2:'慢节奏',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_food@2x.png'),
                        rid:5,
                        title:'玩乐餐饮',
                        con1:'吃喝玩乐',
                        con2:'美妙生活',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_easylife@2x.png'),
                        rid:6,
                        title:'便民生活',
                        con1:'悉心关照',
                        con2:'点点滴滴',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_activity@2x.png'),
                        rid:7,
                        title:'专属活动',
                        con1:'带给您',
                        con2:'不一样的体验',
                        type:1
                    }
                    
                ],
                defaultHead:this.$cache.user.headImgUrl||require('assets/img/default_user.png')
            }
        },
        activated(){
            if(this.$cache.user.level.includes('普卡')){
                this.cardtype="card0"
                this.cardNum=0;
                this.progress=this.$cache.user.growthPoint/500*100*(1/3);
                
                this.iframeUrl=this.$cache.user.privilegePuKaUrl;
                this.grade=251
            }else if(this.$cache.user.level.includes('银卡')){
                this.cardtype="card1"
                this.cardNum=1;
                this.progress=100*(1/3)+((this.$cache.user.growthPoint-500)/8500)*100*(1/3);
                this.iframeUrl=this.$cache.user.privilegeYinKaUrl
                this.grade=252
            }else if(this.$cache.user.level.includes('金卡')){
                this.cardtype="card2"
                this.cardNum=2;
                this.progress=100*(2/3)+((this.$cache.user.growthPoint-9000)/13000)*100*(1/3);
                this.iframeUrl=this.$cache.user.privilegeJinKaUrl
                this.grade=253
            }else if(this.$cache.user.level.includes('钻石')){
                this.cardtype="card3"
                this.cardNum=3;
                this.progress=100;
                this.iframeUrl=this.$cache.user.privilegeZuanShiKaUrl
                this.grade=254
            }
        },
        methods:{
            iframeLoad(){
                document.getElementById("iframe").height=0;
                document.getElementById("iframe").height=document.body.clientHeight
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #meMemberRights{
        .meMember-card{
            padding: .4rem 5%;
            .card-bg{
                width: 100%;
                height: 1.6rem;
                
                background-repeat:no-repeat; 
                background-size: 100% 100%;
                color: #fff;
                font-size: .12rem;
                .top{
                    padding: .12rem 0 .1rem;
                    display: flex;
                    .head{
                        width: .5rem;
                        height: .5rem;
                        box-sizing: border-box;
                        border: 2px solid #fff;
                        border-radius: 50%;
                        margin-left:.2rem;
                        margin-right:.15rem;
                        background-size: cover;
                        background-position: center
                    }
                    .right{
                        flex: 1;
                        margin-right: .15rem;
                        .name-box{
                            display: flex;
                            justify-content: space-between;
                            .name{
                                font-size: .18rem;
                            }
                            .type{
                                color: #fff;
                                height: .22rem;
                                background: rgba(0,0,0,.3);
                                padding: 0 .15rem;
                                line-height: .22rem;
                                border-radius: .22rem;
                            }
                        }
                        .distance{
                            margin-top: .08rem;
                        }
                        .progress-box{
                            margin-top: .12rem;
                            margin-left: .1rem;
                            position: relative;
                            .all-line{
                                position: relative;
                                display: flex;
                                justify-content: space-between;
                                height:1px;
                                width: 2.08rem;
                                
                                .round{
                                    width:.05rem;
                                    height: .05rem;
                                    border-radius: 50%;                               
                                    margin-top: -.025rem;
                                    position: relative;
                                    .animate{
                                        position: absolute;
                                        width:.05rem;
                                        height: .05rem;
                                        border-radius: 50%;
                                        animation: scaleami 1.5s infinite linear;
                                    }
                                    @keyframes scaleami {
                                        0%{
                                            transform: scale(1);
                                            opacity: .8;
                                        }
                                        100%{
                                            transform: scale(2.5);
                                            opacity: .3;
                                        }
                                    }
                                }
                                .line{
                                    position: absolute;
                                    max-width: 100%;
                                    height: 100%;
                                    width: 0%;
                                    left: 0;
                                    top: 0;
                                }
                            }
                            ul{
                                margin-left: -.1rem;
                                width: 2.27rem;
                                display: flex;
                                justify-content: space-between;
                                margin-top: .05rem;
                                li{

                                }
                            }
                        }
                    }
                }
                .bottom{
                    padding: 0 .2rem;
                    height: .48rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .num{
                        vertical-align: middle;
                        font-size: .18rem;
                        margin-left: .05rem
                    }
                }
            }
            .card0{
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_puka@2x.png');
                .all-line{
                    background: #fea03e;
                    opacity: .5;
                }
                .line{
                    background: #fff;
                }
                .round{
                    background: #fff;
                    .animate{
                        background: #fff;
                    }
                }
                

            }
            .card1{
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_yinka@2x.png');
                color: #88888d;
                .all-line{
                    background: #d4d4d6;
                    opacity: .5;
                }
                .line{
                    background: #88888d;
                }
                .round{
                    background: #88888d;
                    .animate{
                        background: #88888d;
                    }
                }
            }
            .card2{
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_jinka@2x.png');
                .all-line{
                    background: #d6bb86;
                }
                .line{
                    background: #957029;
                }
                .round{
                    background: #957029;
                    .animate{
                        background: #957029;
                    }
                }
            }
            .card3{
                .all-line{
                    background: #fff;
                }
                .line{
                    background: #fff;
                }
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_zuanshika@2x.png');
                .round{
                    background: #fff;
                    .animate{
                        background: #fff;
                    }
                }
            }
        }
        .rights-box{
            box-shadow: 0px -30px 30px 0px #dfdfdf;
            background: #fff;
            color: #000;
            .title{
                font-size: .15rem;
                padding: .15rem 5%;
            }
            .rights-ul{
                display: flex;

                flex-wrap: wrap;
                li{
                    width: 25%;
                    font-size: 0;
                    text-align: center;
                    margin-bottom: .15rem;
                    img{
                        width: .5rem;
                        height: .5rem;
                        border-radius: 50%;
                        box-sizing: border-box;
                        border: 1px solid #c9c9c9;
                    }
                    p{
                        font-size: .12rem;
                        margin: .04rem 0
                    }
                    div{
                        color: #88888d;
                        font-size: .1rem;
                        line-height: .12rem;
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
                    width: .5rem;
                    height: 1px;
                    background: #22222d;
                    left: -.6rem;
                    top: .15rem;
                }
                &::after{
                    content: '';
                    position: absolute;
                    width: .5rem;
                    height: 1px;
                    background: #22222d;
                    right: -.6rem;
                    top: .15rem;
                }
            }
        }
        iframe{
            width: 100%
        }
    }
</style>

