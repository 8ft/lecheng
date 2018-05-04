<template>
    <app-layout id="helpRed" v-if="content"  :style="{'background':content.backgroundColor}">

        <div class="top" :style="{'background-image':'url('+content.mainImg+')'}">
            <img :src="content.topImg" class="icon-logo">
            <div class="action-box">
                <img :src="content.topAnimation" class="icon-action1 rotate-enter1">
                <img :src="content.topAnimation" class="icon-action1 fr rotate-enter2" >
            </div>
            <img  :src="content.mainAnimation" class="icon-cloud1">
            <img  :src="content.mainAnimation" class="icon-cloud2">
            <div class="red-package">
                <img src="/CRM/WeChat/App/static/img/helpRed/icon_bag_all.png" class="package">
                <div class="btn-box"  @click="takeRed">
                    <img src="~assets/img/helpRed/button_start_bg.png" class="btn-bg">
                    <img src="~assets/img/helpRed/button_start_light.png" class="btn-light" >
                    <img src="~assets/img/helpRed/button_start_word.png" class="btn-word" >
                    
                </div> 
                
                <img :src="content.prizeImg" class="prize">
            </div>
            <div class="red-box" >
                <div class="title">已经有<span>{{content.joinNumber}}</span>人抢到红包</div>
                <div class="name-list" ref="nameList" >
                    <ul ref="nameUl" :style="nameList.length>0?{'animation-duration':(ulwidth+listwidth)/50+'s'}:''">
                        <li v-for="(item,index) in nameList">{{'恭喜'+item.helperName+'助力'+item.memberName+'获得'+item.prizeName+'红包'}}</li>
                    </ul>
                </div>
                
            </div>

        </div>
        <div class="bottom">
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
        <div class="fixed-bg"  :class="redbox==true?'scale-red':''">
            <div class="fixed-box" >
                <div class="big-red">
                    <div class="title">
                        <p class="title1">{{seedsCon.resultPref}}</p>
                        <div class="title2">{{seedsCon.resultDesc}}</div>
                    </div>
                    <div class="icon-box">
                        <img :src="seedsCon.img||default_profile" alt="">
                        <p>{{seedsCon.nickname}}</p>
                    </div>
                </div>
                <router-link :to="'/helpRed/myRed/'+$route.params.aid">
                    <img src="~assets/img/helpRed/button_popup03.png"  class="btn">
                </router-link>
            </div>
            
        </div>
    </app-layout>
</template>
<script>
    
    export default {
        data() {
            return {
                default_profile: require('assets/img/default_user.png'),
                nameList:[],
                redbox:false,
                content:null,
                article:'',
                seedsCon:{},
                ulwidth:this.$refs.nameUl?this.$refs.nameUl.offsetWidth:0,
                listwidth:this.$refs.nameList?this.$refs.nameList.offsetWidth:0
            }
        },
        activated() {
            this.getData()
        },
        methods:{
            async getData(){
                console.log(this.$cache.user)
                let d={
                    content: {
                        activityId: this.$route.params.aid,
                        mbeId:this.$cache.user.memberId||'',
                        recordSize:'',

                    }
                };
                let res = await this.$post('/CRM/wechatRedEnvelope/getHomePageInfo.json',d);
                if(res.errcode==0){
                    if(res.content.todayGetSeeds==1){
                        this.$router.replace({path: '/helpRed/myRed/'+this.$route.params.aid,params:{aid:this.$route.params.aid}})
                        return
                    }
                    this.content=res.content;
                    this.getArticle(res.content.briefRuleId)
                    this.nameList=res.content.recordList||[]
                    this.$nextTick(()=>{
                        this.setKeyframe()
                    })
                    this.$utils.setAppTitle(this.content.shareTitle);
                    let shareData = {
                        share_title: this.content.shareTitle,
                        share_desc: this.content.shareDesc,
                        share_img: this.content.shareImg,
                        share_url: location.origin+'/wxwap?#/helpRed/'+this.$route.params.aid
                    }
                    this.$utils.shareConfig(shareData);
                }
                
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
            },
            setKeyframe(){
                this.ulwidth=this.$refs.nameUl.offsetWidth;
                this.listwidth=this.$refs.nameList.offsetWidth;
                var styleElement = document.getElementById('styles_js');
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.type = 'text/css';
                    styleElement.id = 'styles_js';
                    document.getElementsByTagName('head')[0].appendChild(styleElement);
                }
                var newStyle=`@keyframes run-name {
                                0% {
                                    transform:translateX(0);
                                    -webkit-transform:translateX(0);
                                }
                                100% {
                                    transform:translateX(-${this.ulwidth+this.listwidth}px);
                                    -webkit-transform:translateX(-${this.ulwidth+this.listwidth}px);
                                }
                            }`
                styleElement.appendChild(document.createTextNode(newStyle));
            },
             takeRed(){
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
                                mbeId:this.$cache.user.memberId,

                            }
                        };
                        let res = await this.$post('/CRM/wechatRedEnvelope/getSeeds.json',d);
                        if(res.errcode==0){
                            this.seedsCon=res.content;
                            this.redbox=true
                        }else{
                            this.$toast(res.msg)
                        }
                    }
                });
                
                
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #helpRed{

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
                    background: url('/CRM/WeChat/App/static/img/helpRed/bg_popup_open.png') no-repeat;
                    background-size:100% 100%;
                    .title{
                        text-align: center;
                        color: #e94816;
                        font-weight: 600;
                        padding: 0 .4rem;
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
                margin-top: .2rem;
                position: relative;
                left: 50%;
                transform: translateX(-50%)
                
            }
            
        }
        .page-content{
            overflow-x: hidden
        }
        font-size: .12rem;
        .top{
            background-repeat: no-repeat;
            
            background-size: 100% 100%;
            width: 100%;
            height: 6rem;
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
                animation: left-action1 3s infinite 1s linear alternate;
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
                animation: left-action2 3s infinite 2s linear alternate;
            }
            @keyframes left-action2 {
                0% {
                    transform:translateX(0);
                }
                100% {
                    transform:translateX(.3rem);
                }
            }
            .red-package{
                .package{
                    position: absolute;
                    width: 100%;
                    right: 0;
                    top: 1.92rem;
                }
                .btn-box{
                    position: absolute;
                    top: 3.28rem;
                    left: 50%;
                    
                    .btn-bg{
                        position: absolute;
                        width: 1.25rem;
                        top: 0;
                        left: 0;
                        transform: translateX(-50%);
                        // animation: scale-btn 1s infinite linear alternate;
                    }
                    .btn-light{
                        position: absolute;
                        width: 1.25rem;
                        top: 0;
                        left: 0;
                        transform: translateX(-50%);
                        animation: rotate-light 1.2s infinite linear ;
                    }
                    @keyframes rotate-light {
                        0% {
                            transform:translateX(-50%) rotate(0deg);
                        }
                        50% {
                            transform:translateX(-50%) rotate(190deg);
                        }
                        100% {
                            transform:translateX(-50%) rotate(190deg);
                        }
                    }
                    .btn-word{
                         position: absolute;
                         width: .925rem;
                         height: .36rem;
                         left: 50%;
                         top: .445rem;
                         transform: translateX(-50%);
                         animation: rotate-word 2s infinite linear ;
                    }
                    @keyframes rotate-word {
                        0% {
                            transform:translateX(-50%) scale(1);
                        }
                        3% {
                            transform:translateX(-50%) scale(0.8);
                        }
                        6% {
                            transform:translateX(-50%) scale(1);
                        }
                        24% {
                            transform:translateX(-50%) scale(1);
                        }
                        26% {
                            transform:translateX(-50%) rotate(-3deg);
                        }
                        28% {
                            transform:translateX(-50%) rotate(0deg);
                        }
                        30% {
                            transform:translateX(-50%) rotate(3deg);
                        }
                        32% {
                            transform:translateX(-50%) rotate(0deg);
                        }
                        34% {
                            transform:translateX(-50%) rotate(-3deg);
                        }
                        36% {
                            transform:translateX(-50%) rotate(0deg);
                        }
                        38% {
                            transform:translateX(-50%) rotate(3deg);
                        }
                        40% {
                            transform:translateX(-50%) rotate(0deg);
                        }
                        100% {
                            transform:translateX(-50%) rotate(0deg);
                        }
                    }
                    
                }
                
                
                .prize{
                    width: 100%;
                    position: absolute;
                    top: 4.36rem;
                }
            }
            .red-box{
                color: #fff;
                width: 94%;
                margin-left: 3%;
                height: .6rem;
                background: rgba(117,0,0,.5);
                position: absolute;
                bottom: -.1rem;
                border-radius: .1rem;
                box-sizing: border-box;
                padding: .1rem .2rem;
                .title{
                    text-align: center;
                    position: relative;
                        display: inline-block;
                    left: 50%;
                    transform: translateX(-50%);
                    span{
                        margin: 0.04rem;
                        font-size: .13rem;
                        font-weight:600;
                        color: #fff600
                    }
                    &::before{
                        content: '';
                        width: .25rem;
                        height: 0px;
                        border-top: 1px solid #fff;
                        position: absolute;
                        top: .08rem;
                        margin-left: -.3rem;
                    }
                    &::after{
                        @extend ::before;
                        right: -.3rem;
                    }
                }
                .name-list{
                        width: 100%;
                        height: .16rem;
                        line-height: .16rem;
                        overflow-x: hidden;
                        position: relative;
                        margin-top: .08rem;
                    ul{
                        position: absolute;
                        animation: run-name 100s infinite linear;
                        white-space: nowrap;
                        left: 100%;
                        min-width:100%;
                        li{
                            display: inline-block;
                            padding-right: .5rem;
                        }
                    }
                    // @keyframes run-name {
                    //     0% {
                    //         transform:translateX(0);
                    //     }
                    //     100% {
                    //         transform:translateX(-1000px);
                    //     }
                    // }
                }
                
            }
        }
        .bottom{
            padding: .33rem 0;
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
</style>

