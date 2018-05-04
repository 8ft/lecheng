<template>
  <app-layout id="happyGo" v-if="pageData" :style="'background:'+pageData.bg">

    <div slot="aside" v-if="isfixed" class="float-btn">
      <router-link id="toCart" :to="'/spMall/somePage?url='+encodeURIComponent('http://www.lechengclub.com/wap/cart.html')"><img src="~assets/img/happyGo/cart.png"></router-link>
      <img id="toTop" v-on:click="toTop" src="~assets/img/happyGo/toTop.png">
    </div>

    <div slot="aside" v-if="pageData.toolBar&&isfixed" :class="'highway'+(isfixed?' fixed':'')" :style="'background:linear-gradient(to bottom,'+pageData.toolBar.bg.from+' 0%,'+pageData.toolBar.bg.to+' 100%);'">
      <div v-for="item in area" v-on:click="go(item.en)" :style="curArea===item.en?('background:#fff;color:'+pageData.toolBar.color):''">{{item.cn}}<br>分会场</div>
    </div>
  
    <div class="header">
        <img class="banner" :src="pageData.header">
        <img class="banner" :src="pageData.banner">
        
        <router-link v-if="pageData.rank&&rank.length>0" id="toRank" to="/invite">
          <swiper class="bannerSwiper dis" :options="option" ref="ranking">
            <swiper-slide v-for="item in rank" v-html="(item.ranking<10?'&nbsp;'+item.ranking:item.ranking)+'&nbsp;'+item.name"></swiper-slide>
          </swiper>

          <div class="btn">邀请送好礼</div>
        </router-link>

        <router-link id="toLottery" :to="'/lottery?aid='+pageData.lotteryId">
          <img class="wheel" src="~assets/img/happyGo/circle.png">
          <img :class="'indicator'+(isfixed?'':' reset')" src="~assets/img/happyGo/indicator.png">
          <div class="btn">点我抽大奖</div>
        </router-link>

        <router-link id="rule" to="/happyGo/rule">活动规则</router-link>
    </div>

    <div id="highway" v-if="pageData.toolBar" class="highway" :style="'background:linear-gradient(to bottom,'+pageData.toolBar.bg.from+' 0%,'+pageData.toolBar.bg.to+' 100%);'">
      <div v-for="item in area" v-on:click="go(item.en)" :style="curArea===item.en?('background:#fff;color:'+pageData.toolBar.color):''">{{item.cn}}<br>分会场</div>
    </div>

    <template v-if="pageData.coupon.show">
      <!-- 领优惠券 -->
      <img id="coupon" class="area-title" src="~assets/img/happyGo/1.png">
      <div class="area coupon">
        <img v-for="item in pageData.coupon.list" v-on:click="takeCoupon(item.id)" :src="item.img" >
      </div> 
    </template>


    <!-- 爱车专场 -->
    <img id="icar" class="area-title" src="~assets/img/happyGo/2.png">
    <div class="area icar">
      <router-link v-for="item in pageData.car.list" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)"><img v-lazy.happyGo="item.img"></router-link>
    </div>
    <div class="box-more">
      <router-link v-for="item in pageData.car.more" class="more" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)">{{item.name}}</router-link>
    </div>


    <!-- 车品专场 -->
    <img id="carItem" class="area-title" src="~assets/img/happyGo/3.png">
    <div class="area carItem">
      <router-link v-for="item in pageData.carItem.list" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)"><img v-lazy.happyGo="item.img"></router-link>
    </div> 
    <router-link class="more" :to="'/spMall/somePage?url='+encodeURIComponent(pageData.carItem.more)">查看更多汽车用品</router-link>


    <!-- 积分专场 -->
    <img id="point" class="area-title" src="~assets/img/happyGo/4.png">
    <div class="area point">
      <div>
        <router-link v-for="item in pageData.point.left" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)"><img v-lazy.happyGo="item.img"></router-link>
      </div>
      <router-link class="right" :to="'/spMall/somePage?url='+encodeURIComponent(pageData.point.right.url)"><img v-lazy.happyGo="pageData.point.right.img"></router-link>
    </div> 
    <router-link class="more" :to="'/spMall/somePage?url='+encodeURIComponent(pageData.point.more)">查看更多积分商品</router-link>


    <!-- 保养美容 -->
    <img id="maintenance" class="area-title" src="~assets/img/happyGo/5.png">
    <div class="area maintenance">
      <router-link v-for="item in pageData.maintenance.list" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)"><img v-lazy.happyGo="item.img"></router-link>
    </div> 
    <router-link class="more" :to="'/spMall/somePage?url='+encodeURIComponent(pageData.maintenance.more)">查看更多保养美容</router-link>


    <!-- 保险延保 -->
    <img id="insurance" class="area-title" src="~assets/img/happyGo/6.png">
    <div class="area insurance">
      <router-link v-for="item in pageData.insurance.list" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)"><img v-lazy.happyGo="item.img"></router-link>
    </div> 
    <router-link class="more" :to="'/spMall/somePage?url='+encodeURIComponent(pageData.insurance.more)">查看更多保险延保</router-link>


    <!-- 异业合作专场 -->
    <img id="yiye" class="area-title" src="~assets/img/happyGo/8.png">
    <div class="area icar">
      <router-link v-for="item in pageData.yiye.list" :to="'/spMall/somePage?url='+encodeURIComponent(item.url)"><img v-lazy.happyGo="item.img"></router-link>
    </div> 
    <router-link class="more" :to="'/spMall/somePage?url='+encodeURIComponent(pageData.yiye.more)">查看更多合作伙伴</router-link>

    
    <img class="footer" style="margin-top:.2rem;" src="/CRM/WeChat/App/static/img/happyGo/9.png">
    <img class="footer" src="/CRM/WeChat/App/static/img/happyGo/7.png">

    <div id="download" class="footer">
      <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.enjoyauto.lecheng">立即下载</a>
    </div>
        
  
  </app-layout>
</template>

<script>

export default {
  data() {
    return {
      area:[
        {en:'icar',cn:'爱车'},
        {en:'carItem',cn:'汽车用品'},
        {en:'point',cn:'积分'},
        {en:'maintenance',cn:'保养美容'},
        {en:'insurance',cn:'保险延保'},
        {en:'yiye',cn:'合作伙伴'}
      ],
      curArea:'',

      pageData: '',
      rank:[],
      couponId:'',

      isfixed:false,
      st: -1,

      share:null,

      option:{
        notNextTick: true,
        direction : 'vertical',
        slidesPerView:5,
        autoplay: 1,
        speed: 2000,
        loop: true
      }
    
    };
  },
  mounted() {
     this.getPageData();
  },
  computed: {
    swiper() {
        return this.$refs.ranking.swiper;
    }
  },
  activated() {
      if(this.pageData){
        this.setScroll();
        this.swiper.init();
        this.$utils.shareConfig(this.share);
      }
  },
  beforeRouteLeave(to, from, next) {
    this.st = this.$el.children.appMain.scrollTop;

    if(/spMall/.test(to.path)){
      this.$utils.addCookie('st',this.st,'m5');
    }else{
      this.$utils.delCookie('st');
    }
    next();
  },
  methods: {
    toTop(){
      this.st=0;
      this.$el.children.appMain.scrollTop=0;
    },
    go(val){
        document.getElementById(val).scrollIntoView();
        this.curArea=val;
    },
    async takeCoupon(id){
      if(id){this.couponId=id;}

      let user=this.$cache.user;
      if(user.phone){

        let data = {content:{
          mbeid:user.memberId,
          mobile:user.phone,
          sid:this.pageData.coupon.sid,
          coupon_id:this.couponId
        }};
        let res=await this.$post('/topapp/api/getcouponcode.html', data);
        if(res.errcode===0){
          this.$toast(res.content.msg);
        }

      }else{
        this.login();
      }

    },
    async getPageData() {
      
      let res=await this.$post('/CRM/wechatCarnival/readFile.json');
        
      if(res.errcode===0){
        let con=res.content.articleContent;
        this.pageData =con;
        this.setScroll();

        if(con.rank){
          this.getRank();
        }

        //分享内容
        let share=con.share,
            shareData = {
            share_title: share.title,
            share_desc: share.desc,
            share_img: share.img,
            share_url: location.href.split('?')[0]
        }
        this.share=shareData;
        this.$utils.shareConfig(shareData);
      }
    },
    async getRank(){
        let d={
          content:{
            pageNo:1,
            pageSize:10,
            rankType:2
          }
        };
      
        let res=await this.$post('/CRM/appinvitation/invitationRank.json',d);
        
        if(res.errcode===0){
          this.rank =res.content.rankingList;
          if(this.swiper){this.swiper.init();}
        }
    },
    setScroll(){
      this.$nextTick(function () {
        let vm=this,
            h=document.getElementById('highway').offsetHeight;
        
        this.$el.children.appMain.onscroll = function() {
          if(document.getElementById('yiye').getBoundingClientRect().top<=h){
            vm.curArea='yiye';
            vm.isfixed=true;
          }else if(document.getElementById('insurance').getBoundingClientRect().top<=h){
            vm.curArea='insurance';
            vm.isfixed=true;
          }else if(document.getElementById('maintenance').getBoundingClientRect().top<=h){
            vm.curArea='maintenance';
            vm.isfixed=true;
          }else if(document.getElementById('point').getBoundingClientRect().top<=h){
            vm.curArea='point';
            vm.isfixed=true;
          }else if(document.getElementById('carItem').getBoundingClientRect().top<=h){
            vm.curArea='carItem';
            vm.isfixed=true;
          }else if(document.getElementById('icar').getBoundingClientRect().top<=h){
            vm.curArea='icar';
            vm.isfixed=true;
          }else{
            vm.curArea='';
            vm.isfixed=false;
          }
        };

        let st=this.$utils.getCookie('st');
        if (this.st >= 0) { 
          this.$el.children.appMain.scrollTop = this.st; 
          this.$utils.delCookie('st');
        }else if(st){
            this.st=st;
            this.$el.children.appMain.scrollTop=st;
        }

      });
    },
    async login() {
      if (isLecheng) {

        let url=location.href;

        if(location.search){
          url+='&LechengLogin';
        }else{
          url+='?LechengLogin';
        }

        let appLogin = {
          type: "goNative",
          data: {
            page: "login",
            redirectUrl: url
          }
        }
        this.$utils.jsBridge(appLogin);

      } else {
        let data = {
          content: {
            openid:this.$utils.getCookie('openid'),
          }
        };

        let res=await this.$post('/CRM/wechatcfg/getinfo.json', data);
        if (res.errcode == 0) {

          let con = res.content;
          if (con.isBinding) {
            if (con.isSetPwd) {
              this.$cache.user.memberId = con.mbeId;
              this.getUserInfo(con.mbeId);
            } else {
              this.$router.push('/setPwd');
            }
          } else {
            this.$router.push('/signUp');
          }
        } else if (res.errcode == 3) {//openid过期
          this.$utils.delCookie('openid');
          let state = location.href.split('&from=')[0].split('code=')[0].replace(/:/g, 'lc0').replace(/\//g, 'lc1').replace(/\?/g, 'lc2').replace(/\=/g, 'lc3').replace(/&/g, 'lc4'),
            redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65478e169956c988&redirect_uri=' + encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/App/auth_redirect.html') +
              '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
          location.replace(redirect_uri);
        }
      }
    },
    async getUserInfo(memberId) {
      //是否需要获取用户基本信息
      if (!this.$cache.user.name) {

        let data = {
          content: {
            memberId: memberId,
            source: "WeChat"
          }
        };

        let res=await this.$post('/CRM/appmembermgcust/querymemberinfo.json', data);
        if (res.errcode == 0) {
          this.$cache.user = res.content;
          this.takeCoupon();
        } 
      } 
    }
  
  }
}
</script>


<style lang="scss">
  @import "~assets/css/var.scss";


  #happyGo {
    a{display:inline-block;}
    img{display:block;}
    .header{
        position:relative;padding-top:.5rem;
        .banner:nth-of-type(1){position:absolute;top:0;left:0;right:0;z-index: 1;}
        .banner:nth-of-type(2){height:4.45rem;}

        #toRank{position: absolute;width:.85rem;padding-top:.05rem;bottom:.66rem;left:.2rem;border-radius:8px 8px 20px 20px;color:#fff;background: rgba(0,0,0,.4);
          .swiper-container{height: .95rem;font-size:$h3;margin-bottom:.05rem;width:80%;@include txtOverflow;}
          .btn{height:.3rem;line-height:.3rem;border-radius:99px;@include transColor_t2b(#d300ff,#7601ff);border-bottom:2px solid #6002d5;text-align:center;}
        }

        #toLottery{position: absolute;width:.85rem;height:.98rem;bottom:.66rem;right:.2rem;color:#fff;text-align:center;
          .wheel{width:100%;position:absolute;bottom:.13rem;animation:rotate 3s 0s linear infinite;}
          .indicator{width:.2rem;height:.26rem;position:absolute;top:.245rem;left:.325rem;}
          .indicator.reset{z-index: 2;}
          .btn{position:absolute;bottom:0;left:0;right:0;height:.3rem;line-height:.3rem;border-radius:99px;@include transColor_t2b(#fec303,#ff6b11);border-bottom:2px solid #d04701;}
        }

        @keyframes rotate{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}

        #rule{color:#fff;position:absolute;top:.6rem;right:.1rem;}
    }

    .highway{@include box;height:.5rem;font-size:$h3;
      div{@include flex;text-align:center;border-right:1px solid rgba(255,255,255,.5);color:#fff;line-height: .15rem;padding:.1rem 0;}
      div:last-of-type{border:none;}
      &.fixed{position:fixed;top:0;left:0;right:0;z-index:4;}
    }

    .area,.box-more{@include box;width:3.55rem;margin:0 auto;
      a{border-radius:4px;margin-bottom:.05rem;
        img{width:100%;height:100%;border-radius:4px;background:#fff;}
      }
    }
    .area-title{width:100%;padding:.18rem 0;margin:0 auto;}

    .more{display:block;width:3.55rem;height:.4rem;line-height:.4rem;text-align:center;background:#fff;color:black;margin:0 auto;border-radius:4px;}
    .box-more{margin-bottom:0;
      .more{width:1.75rem;
        &:nth-of-type(1){margin-right:.05rem;color:#00b6e4;}
        &:nth-of-type(2){color:#f4455a;}
      }
    }

    .icar {
      a{width:1.75rem;height:2.05rem;
        &:nth-of-type(even){margin-right:.05rem;}
        &:nth-of-type(1){width:100%;height:1.5rem;}
      }
    }

    .carItem{
      a{width:1.15rem;height:2rem;}
      a:nth-of-type(3n-1){margin:0 .05rem .05rem;}
    }

    // .coupon{color:#fff;text-align:center;
    //   div{
    //     width:1.1rem;height:.55rem;margin-bottom:0;background: #fff;border-radius:4px;box-sizing: border-box;padding:.025rem .375rem .025rem .025rem;overflow: hidden;background:url('~assets/img/happyGo/coupon.png') no-repeat center;background-size:100% 100%;
    //     h1{font-size:$h4;line-height: .125rem;padding:0 .04rem;box-sizing: border-box;@include txtOverflow;background:#ff6e00;border-radius: 99px;display: inline-block;max-width:100%;}
    //     h2{font-size:.18rem;line-height: .2rem;}
    //     p{font-size:$h4;line-height: .125rem;@include txtOverflow;}
    //   }
    //   div:nth-of-type(3n-1){margin:0 .125rem;}
    //   div:nth-last-of-type(n+4){margin-bottom:.125rem;}
    // }

    .coupon{
      img{width:1.1rem;height:.55rem;margin-bottom:0;display:inline-block;}
      img:nth-of-type(3n-1){margin:0 .125rem;}
      img:nth-last-of-type(n+4){margin-bottom:.125rem;}
    }

    .point{
      div{@include box;width:2.35rem;margin-right:.05rem;
        a{width:1.15rem;height:1rem;}
        a:nth-of-type(1){width:100%;}
        a:nth-of-type(2){margin-right:.05rem;}
      }

      .right{width:1.15rem;height:2.05rem;}
    }

    .maintenance{
      a{width:100%;height:1.3rem;}
    }

    .insurance{
      a{width:1.75rem;height:2.05rem;}
      a:nth-of-type(odd){margin-right:.05rem;}
    }

    .footer{width:3.55rem;margin:0 auto .1rem;}

    #download{position: relative;height:1rem;
        background:url('/CRM/WeChat/App/static/img/happyGo/download_logo.png') no-repeat top center;background-size:100%;
        a{position: absolute;display: block;width:1rem;height:.28rem;bottom:.18rem;left:1.05rem;border-radius:99px;background:#ff6605;color:#fff;text-align: center;line-height: .28rem;}
    }

    .float-btn{position:absolute;bottom:.2rem;right:.2rem;width:1.02rem;height:.5rem;z-index:999;overflow:hidden;zoom:1;
      img{width:.5rem;height:.5rem;}
      #toCart{float: left;}
      #toTop{float:right;}
    }
  }
</style>
