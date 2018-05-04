<template>
    <app-layout id="lottery" :style="'background:'+bgColor">

        <header style="position: relative;">
            <img class="banner" :src="banner">
            <div id="player" v-if="player>0">已有{{player}}人参与</div>
            <div id="times">
                <img src="~assets/img/lottery/icon_gift.png">您有
                <span>{{remainChance}}</span>次机会</div>
            <div id="shareTips" v-if="shareTips!==''">{{shareTips}}</div>
        </header>


        <div id="turntable">

            <div v-for="(item,index) in neons" :key="'neon'+item.dir" :class="'neon '+item.dir">
                <div v-for="(neon,i) in item.val" :key="'neon'+index+i"><i :class="(neon===1&&'on')+(running?' blink':'')"></i></div>
            </div>

            
            <div class="middle">
                <ul class="center">
                    <li v-for="(item,index) in prizeList" :key="item.prizeCode" :id="index===4?'run':''" :class="prizeId[index]===curPosition?'focus':''" v-on:click="start(index)">
                        <img v-if="index!==4" :src="item.prizeImg">
                        <img v-if="index===4" src="~assets/img/lottery/start.png">
                    </li>
                </ul>
            </div>

            <!-- 中奖名单 -->
            <swiper class="dis" id="lucky_list" :options="swiperOption" ref="winners">
                <swiper-slide v-for="(item,index) in winner" :key="'win'+index">
                    <p class="swiper-slide">恭喜{{item.memberName}} 获得 {{item.prizeName}}</p>
                </swiper-slide>
            </swiper>
        </div>


        <div id="actions">
            <img class="invite" v-on:click="invite" src="~assets/img/lottery/button_invite.png">
            <router-link :to="'./lottery/records?aid='+aid"><img src="~assets/img/lottery/button_record.png"></router-link>
        </div>


        <img class="title" src="~assets/img/lottery/t1.png">
        <div class="rule" v-html="guidelines"></div>

        <img class="title" src="~assets/img/lottery/t2.png">
        <div class="rule" v-html="rule"></div>

        <img class="title" src="~assets/img/lottery/t3.png">
        <div class="rule" v-html="prizeDetail"></div>

        <img class="title" src="~assets/img/lottery/t4.png">
        <div class="rule" v-html="receiveAttention"></div>

        <div class="guanzhu">
            <img src="/CRM/WeChat/App/static/img/lottery/code_weixin.png">
            <p>长按识别二维码</p>
            <p>关注“盈众乐橙服务平台”微信公众号</p>
        </div>

        <img class="title" src="~assets/img/lottery/t5.png">
        <div class="rule" v-html="attention"></div>

        <div class="guanzhu">
            <img src="/CRM/WeChat/App/static/img/lottery/code_app.png">
            <p>长按识别二维码</p>
            <p>下载“盈众乐橙汇”APP</p>
        </div>

        <img class="title" style="margin-bottom:0;" src="~assets/img/lottery/t6.png">


        <mt-popup v-model="fail" :closeOnClickModal="false">
            <img class="type" src="~assets/img/lottery/icon_popup_lose.png">
            <h1>很遗憾未中奖</h1>
            <p>换个姿势再来一次？</p>
            <button v-on:click="initPopup">点击返回</button>
            <button v-on:click="invite">邀请好友抽奖</button>
        </mt-popup>

        <mt-popup v-model="win" :closeOnClickModal="false">
            <img src="~assets/img/lottery/icon_popup_prize.png">
            <h1>恭喜中奖啦</h1>
            <p>抽中 {{prize.prizeName}}</p>
            <button v-on:click="initPopup">点击返回</button>
            <button v-on:click="next">立即领取</button>
        </mt-popup>

        <img v-if="wxInvite" src="/CRM/WeChat/App/static/img/invite.png" class="invite-tip" v-on:click="wxInvite=false">

        
    </app-layout>
</template>


<script>

export default {
    data() {
        return {
            runBtn:require('assets/img/lottery/start.png'),

            mid: this.$cache.user.memberId,
            aid:this.$route.query.aid,
            addInfo:'',

            running:false,
            speed :50, //初始速度
            lastSteps : 40, //得到结果到停下所需走的默认路程
            curPosition:-1, //当前位置
            endPosition:-1,
            lastCount :0, //得到结果后的计数
            
            tid:-1,
            state: '',
            banner: '',
            bgColor: '#fff',
            player: 0,
            isShared: false,
            remainChance: '',
            shareTips:'',

            prize:{},
            prizeList:[],
            prizeId:[
                0,1,2,
                7,'run',3,
                6,5,4
            ],
            prizePosition:{},
            neons:[
                {position:'top',dir:'',val:[1,0,1,0,1,0,1]},
                {position:'left',dir:'v',val:[0,1,0,1,0,1]},
                {position:'right',dir:'v',val:[0,1,0,1,0,1]},
                {position:'bottom',dir:'',val:[0,1,0,1,0,1,0]}
            ],
            winner:[],

            guidelines:'',
            rule:'',
            prizeDetail:'',
            receiveAttention:'',
            attention:'',

            wxInvite:false,
            fail:false,
            win:false,

            st: 0,
            swiperOption: {
                notNextTick: true,

                autoplay: 1,
                speed: 8000,
                centeredSlides: true,
                loop: true
            },

            shareData:{}
        };
    },
    computed: {
      swiper() {
        return this.$refs.winners.swiper
      }
    },
    activated() {
        if(isLecheng){
            let appShare = {
                type: "share",
                data: { action: 'hide' }
            }
            this.$utils.jsBridge(appShare);
        }
        
        this.getRemainChance();
        if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
    },
    beforeRouteLeave(to, from, next) {
        this.st =this.$el.children.appMain.scrollTop;
        this.initPopup();
        this.initTable();
        next();
    },
    methods: {
        invite(){
            if(isLecheng){
                let data=this.shareData,
                    shareData = {
                        type: "share",
                        data: {
                            action: 'call',
                            title: data.share_title,
                            desc: data.share_desc,
                            imgUrl: data.share_img,
                            link: data.share_url
                        }
                    };

                this.$utils.jsBridge(shareData);
                this.shareForChance();
            }else{
                this.wxInvite=true;
            }
        },
        run(){
            let vm=this;
            if(vm.endPosition>=0){

               setTimeout(() => {
                    if(vm.lastCount < vm.lastSteps){
                        vm.lastCount+=1;

                        if (vm.lastCount > vm.lastSteps-14) { //减速
                            vm.speed += vm.lastCount;
                        } else {
                            vm.speed += 1;
                        }

                        if(vm.curPosition===7){
                            vm.curPosition=0;
                        }else{
                            vm.curPosition++;
                        }
                        vm.run();
                    }else{
                        vm.finished();
                    }
               },vm.speed); 

            }else{
                vm.tid=setInterval(() => {
                    if(vm.curPosition===7){
                        vm.curPosition=0;
                    }else{
                        vm.curPosition++;
                    }
                },vm.speed);
            }
            
        },
        async start(index){
            if(index===4&&!this.running){
                this.running=true;
                this.run();

                let data = { content: { memberId: this.mid, activityId: this.aid } };
                let res=await this.$post('/CRM/wechatluckydraw/luckyDrawAction.json', data);

                if (res.errcode === 0) {
                    let con=res.content;
                    switch (con.result) {
                        case '0':
                        case '1':
                            this.prize=con;
                            this.remainChance=con.remainChance;

                            let endPosition = this.prizePosition[con.prizeCode];

                            clearInterval(this.tid);
                            this.lastSteps += (endPosition - this.curPosition);

                            this.endPosition=endPosition;

                            this.run();
                
                            break;
                        case '2':
                            this.$messagebox.alert('今天抽奖次数已用完');
                            this.initTable(true);
                            break;
                        case '3':
                            this.$messagebox.alert('活动不存在');
                            this.initTable(true);
                            break;
                        case '4':
                            this.$messagebox.alert('活动未开始');
                            this.initTable(true);
                            break;
                        case '5':
                            this.$messagebox.alert('活动已满额');
                            this.initTable(true);
                            break;
                        case '6':
                            this.$messagebox.alert('活动已结束');
                            this.initTable(true);
                            break;
                        case '7':
                            this.$messagebox.alert('奖品已抽完');
                            this.initTable(true);
                            break;
                        case '8': //活动已结束 
                            this.$messagebox.alert('今日奖品已抽完，请明日再来');
                            this.initTable(true);
                            break;
                    }
                    
                } else if (res.errcode === 2) {
                    this.$messagebox.alert('服务器繁忙，请稍后再试哦');
                    this.initTable(true);
                }

            }
        },
        finished(){
            this.initTable();

            let type=this.prize.prizeType;

            switch (type) {
                case '0': //积分奖品
                case '6': //自提奖品三填写信息为空，无须填写 以及展示兑换码
                case '7': //虚拟奖品二填写信息为空，无须填写
                    this.addInfo='';
                    this.win=true;
                    break;
                case '1': //实物奖品  需要填写收货人姓名，电话，地址
                case '2': //虚拟奖品一 需要填写收货人姓名 ，电话
                case '3': //自提奖品 
                case '5': //自提奖品一 需要填写收货人姓名，电话 以及展示兑换码
                case '8': //无奖品
                    this.addInfo='&pid='+this.prize.drawId+'&type='+type;
                    this.win=true;
                    break;
                case '4': //无奖品
                    this.fail=true;
                    break;
            }
          
        },
        next(){
            if(this.addInfo===''){
                this.initPopup();
            }else{
                let to='/lottery/addInfo?aid='+this.aid+this.addInfo;
                this.$router.push(to);
            }
        },
        initTable(error){
            clearTimeout(this.tid);
            this.running=false;
            this.endPosition = -1;
            this.speed = 50;
            this.lastCount = 0;
            this.lastSteps = 40;
            if(error){this.curPosition=-1;}
        },
        initPopup() {
            this.initTable();

            this.fail=false;
            this.win=false;
            this.addInfo='';
        },
        async getRemainChance() {
            let data = { content: { memberId: this.mid, activityId: this.aid } };
            let res=await this.$post('/CRM/wechatluckydraw/getRemainChance.json', data);

            if (res.errcode === 0) {

                let con = res.content,
                    state = con.result;
                this.state = state;

                if (state === '1') {
                    this.$messagebox.alert('活动不存在');
                } else {
                    this.getPrizes();
                    this.getLastWiners();
                    this.$utils.setAppTitle(con.activityTitle);

                    this.bgColor = con.backgroudColor;
                    this.banner = con.activityImg;
                    this.isShared = con.isShared;
                    this.player = con.joinNumber;
                    this.remainChance = con.remainChance||'0';
                    this.shareTips = con.shareTips;

                    this.guidelines=con.guidelines.replace(/[\r\n]/g, "<br>");
                    this.rule=con.rule.replace(/[\r\n]/g, "<br>");
                    this.prizeDetail=con.prizeDetail.replace(/[\r\n]/g, "<br>");
                    this.receiveAttention=con.receiveAttention.replace(/[\r\n]/g, "<br>");
                    this.attention=con.attention.replace(/[\r\n]/g, "<br>");

                    if(con.shareLimit==0){

                        this.shareData={
                            share_title: con.activityTitle,
                            share_desc: con.shareDetail,
                            share_img: con.shareImg,
                            share_url: con.shareUrl||(location.origin+'/wxwap/?#/lottery?aid=' + this.aid),
                            callback: this.shareForChance
                        };
                        var shareData=this.shareData;
                        if(!isLecheng){
                            wx.ready(function () {
                                //分享到朋友圈
                                wx.onMenuShareTimeline({
                                    title: shareData.share_title,
                                    link: shareData.share_url,
                                    imgUrl: shareData.share_img,
                                    success: function () {
                                        shareData.callback && shareData.callback();
                                    }
                                });
                                //分享给朋友
                                wx.onMenuShareAppMessage({
                                    title: shareData.share_title,
                                    desc: shareData.share_desc,
                                    link: shareData.share_url,
                                    imgUrl: shareData.share_img,
                                    success: function () {
                                        shareData.callback && shareData.callback();
                                    }
                                });
                            });
                        }

                    }else if(!isLecheng){
                        wx.ready(function(){
                            wx.hideOptionMenu();
                        })
                    }

                }
            } 
        },
        async getPrizes(){
            let data = { content: {activityId: this.aid } };
            let res=await this.$post('/CRM/wechatluckydraw/getPrizeList.json', data);

            if (res.errcode === 0) {
                let list=res.content.prizeList;
                list.splice(4,0,'');
                this.prizeList=list;

                let li;
                for(let i=0;i<list.length;i++){
                    li=list[i];
                    if(i!==4){
                        this.prizePosition[li.prizeCode]=this.prizeId[i];
                    }
                }
            } 
        },
        async getLastWiners(){
            let data = { content: {recordSize:20,activityId: this.aid } };
            let res=await this.$post('/CRM/wechatluckydraw/getLatestWinRecord.json', data);

            if (res.errcode === 0) {
                this.winner=res.content.recordList;
                this.swiper.init()
            } 
        },
        async shareForChance() {
            if (this.isShared == '0') {
                let data = { content: { memberId: this.mid, activityId: this.aid } };
                let res=await this.$post('/CRM/wechatint/sharecount.json', data);

                let ecode = res.errcode;
                if (ecode == '0') {
                    this.remainChance = parseInt(this.remainChance) + 1;
                } else if (ecode == '1') {
                    this.isShared = '1';
                }
            }
        }

    }
}
</script>



<style lang="scss">
@import "~assets/css/var.scss";
#lottery {color:#fff;

    header{font-size:$h3;
        .banner{min-height:3.2rem;}
        #times{width:46%;position:relative;margin:0 auto .1rem;height:.3rem;line-height:.3rem;padding:0 .1rem 0 .43rem;box-sizing:border-box;background: rgba(0,0,0,.3);border-radius:99px;text-align:center;
            img{width:.33rem;position:absolute;left:.1rem;bottom:0;}
            span{color:#ffe000;font-size:.16rem;margin:0 .02rem;}
        }
        #shareTips,#player{text-align: center;font-size:$h3;line-height:.15rem;padding:0 3%;}
        #player{margin-bottom:.15rem;display: none;
            span{color:#ffe000;margin:0 .05rem;}
        }
    }

    #turntable{position:relative;width:3.5rem;margin:.15rem auto;background: rgba(0,0,0,.3);border-radius:8px;box-sizing:border-box;padding:.1rem;
        .middle{border:.15rem solid #e9463a;box-sizing:border-box;background:#e9463a;border-radius:8px;}
        #lucky_list{height:.2rem;line-height:.2rem;margin-top:.1rem;font-size:.11rem;overflow:hidden;white-space:nowrap;text-align:right;}

        .center{@include box;width:100%;border-radius:8px;background:#b01e23;
            li{display:inline-block;width:.92rem;height:.67rem;box-sizing:border-box;background:#fdeeee;border-radius:8px;border:.06rem solid #fdeeee;margin-left:.06rem;margin-top:.06rem;}
            li.focus{border-color:#ff8500;}
            li#run{border:none;}
            li:nth-of-type(n+7){margin-bottom: .06rem;}
            img{width:100%;height:100%;display:block;}
        }
        

        .neon{@include box;box-sizing:border-box;width:100%;height:.35rem;padding:.1rem .15rem;position:absolute;top:0;left:0;
            div{position:relative;@include flex;height:.15rem;}
            i{display:block;width:.09rem;height:.09rem;background:#ea6c69;border-radius:99px;position:absolute;top:50%;margin-top:-.045rem;left:50%;margin-left:-.045rem;}
            i.on{background:#f5d536;}

            &.v{width:.35rem;height:100%;padding:.15rem .1rem .45rem;@include flexDir(column);}
            &:nth-of-type(3){left:auto;right:0;}
            &:nth-of-type(4){top:auto;bottom:.3rem;}
        }
  
        .blink{-webkit-animation:blink 1s infinite;animation:blink 1s infinite;}
        .on.blink{-webkit-animation-delay:.5s;animation-delay:.5s;}

        @keyframes blink{0%,100%{background:#ea6c69;}
        50%{background:#f5d536;}}

        .swiper-wrapper{-webkit-transition-timing-function:linear;-moz-transition-timing-function:linear;-ms-transition-timing-function:linear;-o-transition-timing-function:linear;transition-timing-function:linear;margin:0 auto;}
    }

    #actions{text-align:center;margin:.3rem auto;}
    #actions img{width:37%;margin-right:8%;}
    #actions img:last-child{margin-right:0;}

    .title{display:block;width:100%;margin:.15rem auto;}
    .rule{padding:0 3% .3rem;color:#fff;font-size:.11rem;list-style-position:inside;line-height:.24rem;}
    .rule p{padding-left:.2rem;position:relative;}
    .rule p span{position:absolute;left:0;top:0;}

    .guanzhu{text-align:center;font-size:$h4;line-height:.18rem;margin-bottom:.3rem;}
    .guanzhu img{width:26%;margin:0 auto .05rem;display:block;}


    .mint-popup{width:2.8rem;box-sizing:border-box;background:#fff2e1;border-radius:12px;text-align:center;padding:0 .14rem .18rem;overflow:hidden;zoom:1;color:#843922;
        img{width:2.1rem;margin:0 auto;}
        h1{font-size:.2rem;font-weight:600;margin-bottom:.12rem;}
        p{margin-bottom:.08rem;}
        button{color:#fff;width:1.2rem;height:.36rem;border-bottom:.03rem solid #dd7206;margin-top:.12rem;border-radius:8px;display:block;}
        button:nth-of-type(1){float:left;background:#ff9302;}
        button:nth-of-type(2){float:right;background:#e9453b;border-color:#cb1718;}
    }
}

</style>