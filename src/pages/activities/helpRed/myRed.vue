<template>
    <app-layout id="helpRedMyRed" v-if="content" :style="{'background':content.backgroundColor}">
        <div class="top" :style="{'background-image':'url('+content.myEnvelopeImg+')'}">
            <div>
                <p class="p1">今日到手红包<span>{{content.memberAward}}</span>{{content.memberAwardUnit}}</p>
                <p class="p2">今天还有{{content.unopenNumber}}个红包没打开，快去呼朋唤友吧</p>
            </div>
            
        </div>
        <div class="center-box" :style="content.showGoods==2?'padding-bottom:.23rem':''">
            <div class="myred-box">
                <ul>
                    <li class="red" v-for="(item,index) in content.redEnvelopeList" :class="item.isOpen==1?'open':'close'">
                        <div class="num" v-show="item.isOpen==1">
                            <p>获得</p>
                            <p>{{item.prizeName}}</p>
                        </div>
                        <div class="help-name" v-show="item.isOpen==1">
                            <p>{{item.nickname}}</p>
                            <p>帮你拆开</p>
                        </div>
                        <div class="btn" v-show="item.isOpen==2" @click="shareBtn">求打开</div>
                        <img src="~assets/img/helpRed/icon_mark.png" class="icon-mark" v-show="item.best==1">
                    </li>
                    
                </ul>
                <div class="prompt">{{content.seedsIssueType==1?'每天都':'活动期间共'}}有{{content.seedsAmount}}次机会，1个好友只能帮你拆1次</div>
                <div class="share-btn1 scale-rotate" @click="shareBtn"></div>
                <!-- <img src="~assets/img/helpRed/button_share.png"  class="share-btn"   @click="shareBtn"> -->
                <router-link :to="'/helpRed/record/'+$route.params.aid">
                    <div class="goredlist">查看历史红包记录 ></div>
                </router-link>
                
            </div>
        </div>
        <div class="bottom" v-show="content.showGoods==1">
            <div class="title-box">
                <ul class="spot-ul">
                    <li class="one"></li>
                    <li class="two"></li>
                    <li class="three"></li>
                    <li class="one"></li>
                    <li class="two"></li>
                    <li class="three"></li>
                </ul>
                <span class="title ">{{content.goodsTitle}}</span>
                <ul class="spot-ul">
                    <li class="three"></li>
                    <li class="two"></li>
                    <li class="one"></li>
                    <li class="three"></li>
                    <li class="two"></li>
                    <li class="one"></li>
                </ul>
            </div>
            <div class="score-box">
                <div class="box1">
                    <div class="box2">
                        <router-link :to="'/spMall/somePage?url='+encodeURIComponent(content.exchangeImgLink1)">
                            <img :src="content.exchangeImg1" class="score1">
                        </router-link>
                        
                        <div class="box3">
                            <router-link :to="'/spMall/somePage?url='+encodeURIComponent(content.exchangeImgLink2)">
                                <img :src="content.exchangeImg2" class="score2">
                            </router-link>
                            <router-link :to="'/spMall/somePage?url='+encodeURIComponent(content.exchangeImgLink3)">
                                <img :src="content.exchangeImg3" class="score3">
                            </router-link>
                        </div>
                    </div>
                    <router-link :to="'/spMall/somePage?url='+encodeURIComponent(content.exchangeImgLink4)">
                        <img :src="content.exchangeImg4" class="score4">
                    </router-link>
                </div>
                <router-link :to="'/spMall/somePage?url='+encodeURIComponent(content.exchangeImgLink5)">
                    <img :src="content.exchangeImg5"  class="score5">
                </router-link>
            </div>
        </div>
        <div class="share-bg" v-show="shareTip" @click="shareTip=false">
            <img src="/CRM/WeChat/App/static/img/helpRed/pic_share.png">
        </div>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                shareTip:false, //是否显示分享页面
                content:null,
            }
        },
        activated(){
            this.getData()
        },
        methods:{
            async getData(){
                let d={
                    content: {
                        activityId: this.$route.params.aid,
                        mbeId:this.$cache.user.memberId,
                    }
                };
                let res = await this.$post('/CRM/wechatRedEnvelope/myRedEnvelope.json',d);
                if(res.errcode==0){
                    this.content=res.content
                    if (!isLecheng) {
                        this.shareText()
                    }  
                }          
            },
            shareText(){
                let shareData = {
                    share_title: this.content.shareTitle,
                    share_desc: this.content.shareDesc,
                    share_img: this.content.shareImg,
                    share_url: location.origin+'/wxwap?#/helpRed/help/'+this.$route.params.aid+'?mbeId='+this.$cache.user.memberId
                }
                this.$utils.shareConfig(shareData,'call');
            },
            shareBtn(){
                if (isLecheng) {
                    this.shareText()
                }else{
                    this.shareTip=true
                }
            }
        }
    }
</script>
<style lang="scss">
    #helpRedMyRed{
        font-size: .12rem;
        .share-bg{
            position: fixed;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,.7);
            left: 0;
            top: 0;
            z-index: 100;
            img{
                position: absolute;
                width: 2.05rem;
                height: 1.55rem;
                right: .45rem;
                top: .15rem;
            }
        }
        .top{
            background: url('/CRM/WeChat/App/static/img/helpRed/pic_toppic.png') no-repeat;
            background-size: 100% 100%;
            width: 100%;
            height: 3.25rem;
            div{
                text-align: center;
                color: #e94816;
                font-weight: 600;
                padding-top: .85rem;
                .p1{
                    font-size: .15rem;
                    margin-bottom: .05rem;
                    span{
                        margin: 0 .1rem;
                        font-size: .25rem;
                    }
                }
            }
        }
        .center-box{
            margin-top: -1rem;
            .myred-box{
                background: #fff;
                width: 3.55rem;
                margin-left: .1rem;
                text-align: center;
                border-radius: .1rem;
                box-shadow: 0px 0px 12px 2px #fae1df inset;
                padding: .1rem .2rem .2rem;
                box-sizing: border-box;
                ul{
                    overflow: auto;
                    .red{
                        width: .9rem;
                        height: 1.17rem;
                        float: left;
                        margin-right: .21rem;
                        margin-bottom: .08rem;
                        position: relative;
                        margin-top: .1rem;
                        .icon-mark{
                            position: absolute;
                            width: .45rem;
                            height:.45rem;
                            top: -.1rem;
                            right: -.1rem;
                        }
                        &:nth-child(3n){
                            margin-right: 0
                        }
                        &.open{
                            background: url('~assets/img/helpRed/icon_bag_small_open.png')  no-repeat;
                            background-size: 100% 100%;
                            .num{
                                margin-top: .05rem;
                                p{
                                    font-size: .15rem;
                                    color: #e94816;
                                    font-weight: 500;
                                    line-height: .19rem;
                                    span{
                                        font-size: .17rem;
                                    }
                                }
                            }
                            .help-name{
                                color: #fff;
                                position: absolute;
                                bottom: .04rem;
                                line-height: .15rem;
                                text-align: center;
                                width: 100%;
                                p{
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                        &.close{
                            background: url('~assets/img/helpRed/icon_bag_small_close.png') no-repeat;
                            background-size: 100% 100%;
                            .btn{
                                color: #fff;
                                position: absolute;
                                bottom: .07rem;
                                line-height: .23rem;
                                text-align: center;
                                width: .7rem;
                                height: .23rem;
                                background: url('~assets/img/helpRed/button_bag_small.png') no-repeat;
                                background-size: 100% 100%;
                                left: 50%;
                                transform: translateX(-50%)
                            }
                        }
                        
                    }
                }
                .prompt{
                    margin-top: .1rem;
                    color: #55555d;
                }
                .share-btn1{
                    width: 2.9rem;
                    height: .43rem;
                    margin: .18rem auto;
                    background:url('~assets/img/helpRed/button_share.png') no-repeat;
                    background-size: 100% 100%;
                    display: block;
                    position: relative;
                    animation: scale-rotate 2.6s infinite linear ;
                }
                @keyframes scale-rotate {
                    0% {
                        transform:scale(0.85);
                    }
                    80% {
                        transform:scale(0.85);
                    }
                    82% {
                        transform:scale(1);
                    }
                    85% {
                        transform:rotate(-2deg);
                    }
                    86% {
                        transform:rotate(0deg);
                    }
                    87% {
                        transform:rotate(2deg);
                    }
                    88% {
                        transform:rotate(0deg);
                    }
                    89% {
                        transform:rotate(-2deg);
                    }
                    90% {
                        transform:rotate(0deg);
                    }
                    91% {
                        transform:rotate(2deg);
                    }
                    92% {
                        transform:rotate(0deg);
                    }
                    93% {
                        transform:rotate(-2deg);
                    }
                    94% {
                        transform:rotate(0deg);
                    }
                    95% {
                        transform:rotate(2deg);
                    }
                    96% {
                        transform:rotate(0deg);
                    }
                    100% {
                        transform:rotate(0deg);
                    }
                }
                .goredlist{
                    color: #e94816;
                    text-decoration: underline;
                }
            }
        }
        .bottom{
            padding-bottom: .23rem;
            .title-box{
                text-align: center;
                margin: .2rem 0;
                .spot-ul{
                    display: inline-block;
                    width: .24rem;
                    height: .2rem;
                    font-size: 0;
                    box-sizing: border-box;
                    padding:.02rem 0;
                    li{
                        margin: .02rem;
                        display:inline-block;
                        width: .04rem;
                        height: .04rem;
                        border-radius: 99%;
                        &.one{
                            background: rgba(255,255,255,.2);
                        }
                        &.two{
                            background: rgba(255,255,255,.4);
                        }
                        &.three{
                            background: rgba(255,255,255,.6);
                        }
                    }
                }
                .title{
                    line-height: .2rem;
                    vertical-align: top;
                    color: #fff;
                    font-size: .15rem;
                    font-weight: 600;
                    margin:0 .12rem
                }
            }
            .score-box{
                font-size: 0;
                width: 3.55rem;
                margin-left: .1rem;
                .box1{
                    display: flex;
                }

                .score1{
                    width: 2.35rem;
                    height: 1rem;
                    margin-bottom: .05rem;
                }
                .score2{
                    width: 1.15rem;
                    height: 1rem;
                }
                .score3{
                    width: 1.15rem;
                    height: 1rem;
                    margin-left: .05rem;
                }
                .score4{
                    width: 1.15rem;
                    height: 2.05rem;
                    margin-left: .05rem;
                }
                .score5{
                    width: 100%;
                    height: .4rem;

                    margin-top: .05rem;
                }
            }
        }
    }
</style>
