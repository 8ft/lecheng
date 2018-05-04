<template>
    <app-layout id="helpRedHelp" v-if="content" :style="{'background':content.backgroundColor}">
        <div class="top" :style="{'background-image':'url('+content.mainImg+')'}">
            <img :src="content.topImg" class="icon-logo">
            <div class="action-box">
                <img :src="content.topAnimation" class="icon-action1 rotate-enter1">
                <img :src="content.topAnimation" class="icon-action1 fr rotate-enter2" >
            </div>
            <img  :src="content.mainAnimation" class="icon-cloud1">
            <img  :src="content.mainAnimation" class="icon-cloud2">
            <div class="rule-red-box">
                <div class="head">
                    <img :src="content.friendHeadImg||default_profile" alt="">
                    <p>{{content.friendNickname}}邀请你帮他拆红包</p>
                </div>
                <div class="progress-box">
                    <div class="progress-out">
                        <div class="progress-in"  :style="{'width':parseInt(content.openNumber/content.seedsAmount*100)+'%'}">
                            <img src="~assets/img/helpRed/icon_bag_supersmall_step.png" :class="content.openNumber==0?'unstart':content.openNumber==content.seedsAmount?'finish':''">
                            <div :class="content.openNumber==0?'unstart':content.openNumber==content.seedsAmount?'finish':''">已拆{{content.openNumber}}个</div>
                        </div> 
                    </div>
                </div>
                <ul class="name-ul" v-show="content.isHelp==1">
                    <li v-for="(item,index) in content.redEnvelopeList" >
                        <div class="nickname">
                            <img :src="item.helperHeadImg||default_profile" alt="">
                            <span>{{item.helperNickname}}</span>
                        </div>
                        <!-- <div class="time">{{item.helpTime}}</div> -->
                        <div class="score">
                            <span>+{{item.helpValue}}</span>
                            <img src="~assets/img/helpRed/icon_integral.png" alt="">
                        </div>
                    </li>
                    
                </ul>
                <div class="help-text" v-show="content.isHelp==1">你今日帮他拆得红包：<span>{{content.helpValue}}{{content.helpValueUnit}}</span><br/>快来领取自己的红包吧</div>
                <div class="help-text" v-show="content.isHelp==2">他今天有<span>{{content.seedsAmount}}</span>个红包，还有<span>{{content.unopenNumber}}</span>个红包需要助力<br/>快帮他拆一个吧</div>
                <img src="~assets/img/helpRed/button_help.png"  class="help-btn" v-show="content.isHelp==2" @click="openRed">
                <router-link :to="'/helpRed/'+$route.params.aid">
                    <img src="~assets/img/helpRed/button_popup02.png"  class="help-btn" v-show="content.isHelp==1">
                </router-link>
                <router-link :to="'/helpRed/'+$route.params.aid">
                    <div class="go-detail" v-show="content.isHelp==2">我也要去拆红包 ></div>
                </router-link>
                
            </div>
            <div class="bottom" v-show="article.articleContent">
                <div class="rule-box">
                    <div class="title-box">
                        <ul class="spot-ul">
                            <li class="one"></li>
                            <li class="two"></li>
                            <li class="three"></li>
                            <li class="one"></li>
                            <li class="two"></li>
                            <li class="three"></li>
                        </ul>
                        <span class="title ">活动说明</span>
                        <ul class="spot-ul">
                            <li class="three"></li>
                            <li class="two"></li>
                            <li class="one"></li>
                            <li class="three"></li>
                            <li class="two"></li>
                            <li class="one"></li>
                        </ul>
                    </div>
                    <div class="content" v-html="article.articleContent||''"></div>
                    <router-link :to="'/article/'+content.detailRuleId">
                        <div class="go-detail" >详细活动说明及活动规则 ></div>
                    </router-link>
                    
                </div>
            </div>
        </div>
        
        <div class="fixed-bg" :class="redbox==true?'scale-red':''">

            <div class="fixed-box">
                
                <div class="big-red" :class="helpCon.result==9?'success':'failure'">
                    <img src="~assets/img/helpRed/icon_login_close.png" class="close" @click="redbox=false">
                    <div class="title">
                        <p class="title1">{{helpCon.resultPref}}</p>
                        <div class="title2">{{helpCon.resultDesc}}</div>
                    </div>
                    <div class="icon-box">
                        <img :src="helpCon.friendHeadImg||default_profile" alt="">
                        <p>{{helpCon.friendNickname}}</p>
                    </div>
                </div>
                <div class="btn see"  v-if="helpCon.result==9" @click="redbox=false"></div>

                <router-link :to="'/helpRed/'+$route.params.aid" v-else>
                    <img src="~assets/img/helpRed/button_popup02.png"  class="btn">
                </router-link>
            </div>
            
        </div>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                default_profile: require('assets/img/default_user.png'),
                content:null,
                helpCon:{},
                redbox:false,
                article:''
            }
        },
        activated(){
            if(this.$route.query.mbeId==this.$cache.user.memberId){
                this.$router.replace({path: '/helpRed/'+this.$route.params.aid,params:{aid:this.$route.params.aid}})
                return
            }
            this.getData()
        },
        methods:{
            async getData(){
                let d={
                    content: {
                        activityId: this.$route.params.aid,
                        mbeId:this.$route.query.mbeId,
                        helperId:this.$cache.user.memberId||'',

                    }
                };
                let res = await this.$post('/CRM/wechatRedEnvelope/friendsRedEnvelope.json',d);
                if(res.errcode==0){
                    this.content=res.content
                    if(res.content.briefRuleId){
                        this.getArticle(res.content.briefRuleId)
                    }
                    this.$utils.setAppTitle(this.content.topTitle||' ');
                    let shareData = {
                        share_title: this.content.shareTitle,
                        share_desc: this.content.shareDesc,
                        share_img: this.content.shareImg,
                        share_url: location.origin+'/wxwap?#/helpRed/help/'+this.$route.params.aid+'?mbeId='+this.$route.query.mbeId
                    }

                    this.$utils.shareConfig(shareData);
                }
            },
            openRed(){
                this.$login(async ()=>{
                    if(this.content.status==1){
                        this.$toast('活动未开始')
                    }else if(this.content.status==3){
                        this.$toast('活动已满额')
                    }else if(this.content.status==4){
                        this.$toast('活动已结束')
                    }else if(this.content.status==2){
                        let d={
                            content: {
                                activityId: this.$route.params.aid,
                                mbeId:this.$route.query.mbeId,
                                helperId:this.$cache.user.memberId||'',

                            }
                        };
                        let res = await this.$post('/CRM/wechatRedEnvelope/friendsHelp.json',d);
                        if(res.errcode==0){
                            this.getData();
                            this.helpCon=res.content;
                            this.redbox=true
                        }else{
                            this.$toast(res.msg)
                        }
                    }
                })
                
            },
            async getArticle(id) {
                let data={content: {
                    id: id
                }};
                let res=await this.$post('/CRM/apparticle/queryArticleDetail.json',data);
                if(res.errcode==0){
                    let con=res.content;

                    con.articleContent=con.articleContent.replace(/data-src/g,'src');
                    this.article=res.content;
                }
            }
        }
    }
</script>
<style lang="scss">
    #helpRedHelp{
        .page-content{
            overflow-x: hidden
        }
        .fixed-bg{
             z-index: 100;
            position: fixed;
            width: 100%;
            height: 101%;
            top: 50%;
            left: 50%;
            background: rgba(0,0,0,.7);
            transform: translate(-50%,-50%) scale(0);
            transition:transform 0.2s;
             &.scale-red{
                transform: translate(-50%,-50%) scale(1);
            }
            .fixed-box{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                
                .big-red{
                    position: relative;
                    width: 2.8rem;
                    height: 3.08rem;
                    &.success{
                        background: url('/CRM/WeChat/App/static/img/helpRed/bg_popup_open.png') no-repeat;
                        background-size:100% 100%;
                    }
                    &.failure{
                        background: url('/CRM/WeChat/App/static/img/helpRed/bg_popup_open_failure.png') no-repeat;
                        background-size:100% 100%;
                    }
                    .close{
                        position: absolute;
                        z-index: 1;
                        width:.3rem;
                        height: .3rem;
                        right: .1rem;
                        top: -.25rem;
                    }
                    .title{
                        text-align: center;
                        color: #e94816;
                        font-weight: 600;
                        padding: 0 .38rem;
                        padding-top: .48rem;
                        font-size: .15rem;
                        
                        .title1{
                            font-size: .22rem;
                            margin-bottom: .05rem;
                        }
                        .title2{
                            line-height: .22rem;
                        }
                    }
                    .icon-box{
                        text-align: center;
                        position: absolute;
                        left: 50%;
                        bottom: .3rem;
                        transform: translateX(-50%);
                        img{
                            margin-bottom: .07rem;
                            width: .45rem;
                            height: .45rem;
                            border-radius: 50%;
                        }
                        p{
                            color: #fff;
                            font-size: .13rem;
                        }
                    }
                }
            }
            .btn{
                width: 2rem;
                height: .43rem;
                background-size: 100% 100%;
                margin-top: .2rem;
                position: relative;
                left: 50%;
                transform: translateX(-50%)
                
            }
            .see{
                background-image:url('~assets/img/helpRed/button_next.png')
            }
        }
        .top{
            background-repeat: no-repeat;
            background-position: top center;
            width: 100%;
            background-size: contain;
            min-height: 6rem;
            position: relative;
            .icon-logo{
                z-index: 10;
                position: absolute;
                width: 100%
            }
            .action-box{
                position: absolute;
                width: 96%;
                left: 2%;
                top: .4rem;
                .icon-action1{
                    width: .35rem;
                }
                .rotate-enter1 {
                    position: relative;
                    animation: rotate-action1 1.5s infinite linear alternate;
                    transform-origin: center top
                }
                @keyframes rotate-action1 {
                    0% {
                        transform:rotate(10deg);
                    }
                    100% {
                        transform:rotate(-10deg);
                    }
                }
                .rotate-enter2 {
                    position: relative;
                    animation: rotate-action2 1.5s infinite linear alternate;
                    transform-origin: center top
                }
                @keyframes rotate-action2 {
                    0% {
                        transform:rotate(-10deg);
                    }
                    
                    100% {
                        transform:rotate(10deg);
                    }
                }
            }
            .icon-cloud1{
                position: absolute;
                width: .45rem;
                top: 1.35rem;
                right: -.2rem;
                animation: left-action1 3s infinite linear alternate;
            }
            @keyframes left-action1 {
                0% {
                    transform:translateX(0);
                }
                100% {
                    transform:translateX(-.3rem);
                }
            }
            .icon-cloud2{
                position: absolute;
                width: .45rem;
                top: 2.35rem;
                left: -.2rem;
                animation: left-action2 3s infinite linear alternate;
            }
            @keyframes left-action2 {
                0% {
                    transform:translateX(0);
                }
                100% {
                    transform:translateX(.3rem);
                }
            }
            .rule-red-box{
                font-size: 0;
                background: #fff;
                width: 94%;
                margin-left: 3%;
                margin-bottom: .15rem;
                top: 2.2rem;
                position: relative;
                border-radius: .1rem;
                box-shadow: 0px 0px 12px 2px #f9dedc inset;
                padding: .2rem .27rem;
                box-sizing: border-box;
                .head{
                    text-align: center;
                    img{
                        width: .45rem;
                        height: .45rem;
                        border-radius: 50%;
                    }
                    p{
                        font-size: .15rem;
                        margin-top: .08rem;
                    }
                }
                .progress-box{
                    position: relative;
                    margin-top: .2rem;
                    margin-bottom: .4rem;
                    .progress-out{
                        position: relative;
                        width: 100%;
                        height: .25rem;
                        border-radius: .25rem;
                        background: #fce6d2; 
                        .progress-in{
                            position: relative;
                            width: 50%;
                            height: 100%;
                            border-radius: .25rem;
                            background: linear-gradient(#ff6f37, #f95d33,#f2462e); 
                            img{
                                position: absolute;
                                width: .46rem;
                                height: .5rem;
                                right: -.2rem;
                                bottom: -.08rem;
                                &.finish{
                                    right: -.08rem 
                                }
                                &.unstart{
                                    left: -.08rem 
                                }
                            }
                            div{
                                color: #e94816;
                                font-size: .12rem;
                                position: absolute;
                                right: -.2rem;
                                bottom: -.27rem;
                                min-width: .46rem;
                                text-align: center;
                                &.finish{
                                    right: 0rem
                                }
                                &.unstart{
                                    left: 0rem
                                }
                            }
                        }
                        
                        
                    }
                }
                .name-ul{
                    border-radius: .1rem;
                    overflow: auto;
                    li{
                        font-size: .12rem;
                        height: .44rem;
                        background: #fff5ec;
                        margin-bottom:1px;
                        display: flex;
                        display: -webkit-box;
                        align-items: center;
                        padding: 0 .12rem;
                        box-sizing: border-box;
                        // justify-content: space-between;
                        .nickname{
                            width: 1.5rem;
                            display: flex;
                            align-items: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            img{
                                width: .3rem;
                                height: .3rem;
                                border-radius: 50%;
                                vertical-align: middle;
                            }
                            span{
                                color:#22222d;
                                margin-left: .05rem;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                        .time{
                            color: #88888d;
                            flex: 1;
                            -webkit-box-flex: 1 
                        }
                        .score{
                            flex: 1;
                            -webkit-box-flex: 1;
                            text-align: right;
                            span{
                                color: #e94816;
                                font-size: .15rem;
                            }
                            img{
                                width: .09rem;
                                height: .09rem;
                            }
                        }
                    }
                }
                .help-text{
                    font-size: .12rem;
                    color: #55555d;
                    text-align: center;
                    line-height: .2rem;
                    margin: .1rem 0;
                    span{
                        color: #e94816
                    }
                }
                .help-btn{
                    width: 2rem;
                    height: .43rem;
                    margin: 0 auto;
                    position: relative;
                    left: 50%;
                    transform: translateX(-50%)
                }
                .go-detail{
                    color: #e94816;
                    font-size: .15rem;
                    text-decoration: underline;
                    margin-top: .15rem;
                    text-align: center;
                }
            }
            .bottom{
                padding: .33rem 0;
                position: relative;
                top: 2rem;
                .rule-box{
                    background: #fff;
                    width: 94%;
                    margin-left: 3%;
                    
                    border-radius: .1rem;
                    box-shadow: 0px 0px 12px 2px #fae1df inset;
                    padding: .2rem .25rem;
                    box-sizing: border-box;
                    .title-box{
                        text-align: center;
                        margin-bottom: .2rem;
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
                                    background: #fdece7;
                                }
                                &.two{
                                    background: #f8c8b9;
                                }
                                &.three{
                                    background: #f4a38a;
                                }
                            }
                        }
                        .title{
                            line-height: .2rem;
                            vertical-align: top;
                            color: #e94816;
                            font-size: .15rem;
                            font-weight: 600;
                            margin:0 .12rem
                        }
                    }
                    .content{
                        img{
                            max-width: 100%;
                        }
                    }
                    .go-detail{
                        color: #e94816;
                        font-size: .12rem;
                        text-decoration: underline;
                        margin-top: .2rem;
                        text-align: center;
                    }
                }
            }
        }
        
    }
</style>

