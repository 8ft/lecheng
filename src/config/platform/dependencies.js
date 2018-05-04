
const env = process.env.NODE_ENV;
const isDev=(env === 'development');

export default {


  async getUserInfo (Vue, tm, memberId, next) {
    
    if (!Vue.$cache.user.name) {

      let data = {
        content: {
          memberId:memberId,
          source: "WeChat"
        }
      };

      let res = await Vue.$post('/CRM/appmembermgcust/querymemberinfo.json', data);

      if (res.errcode == 0) {
        Vue.$cache.user = res.content;
        this.geolocation(Vue, tm, next);
      }

    } else {
      this.geolocation(Vue, tm, next);
    }
  },



  async login (Vue, tm, next, toPath) {
    if (isLecheng) {
      let appLogin = {
        type: "goNative",
        data: {
          page: "login",
          redirectUrl: location.href
        }
      }
      Vue.$utils.jsBridge(appLogin);

    } else {
      
      let data = {
        content: {
          openid: Vue.$utils.getCookie('openid'),
        }
      };

      let res = await Vue.$post('/CRM/wechatcfg/getinfo.json', data);

      if (res.errcode == 0) {
        let con = res.content;
        if (con.isBinding) {
          if (con.isSetPwd) {
            Vue.$cache.token = con.userToken;
            this.getUserInfo(Vue, tm, con.mbeId, next);
          } else {
            this.geolocation(Vue, tm, next, '/setPwd', toPath);
          }
        } else {
          this.geolocation(Vue, tm, next, '/signUp', toPath);
        }
      } else if (res.errcode == 3) {//openid过期
        Vue.$utils.delCookie('openid');
        let state = location.href.split('&from=')[0].split('code=')[0].replace(/:/g, 'lc0').replace(/\//g, 'lc1').replace(/\?/g, 'lc2').replace(/\=/g, 'lc3').replace(/&/g, 'lc4'),
          redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65478e169956c988&redirect_uri=' + encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/App/auth_redirect.html') +
            '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
        location.replace(redirect_uri);
      }
    }
  },



  geolocation(Vue, tm, next, newPath, toPath){
    if(tm.geolocation&&!Vue.$cache.location.lat){
      let $this=this;
      if(isDev){
        Vue.$cache.location={lng:118.038466,lat:24.480229};
        document.body.lastChild.remove();
        $this.updatePageInfo(Vue, tm, next, newPath, toPath);
        return
      }
      
      Vue.$Geo.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
              Vue.$cache.location=r.point;
              document.body.lastChild.remove();
              $this.updatePageInfo(Vue, tm, next, newPath, toPath);
          }
      },{enableHighAccuracy: true})

    }else{
      this.updatePageInfo(Vue, tm, next, newPath, toPath);
    }
  },

  

  updatePageInfo: function (Vue, tm, next, newPath, toPath) {

    if(['/home','/stores','/mall','/me'].includes(tm.path)){
      this.$cache.fourS={};
      this.$cache.server={};
      this.$cache.car={};
      this.$cache.date={};  
      this.$cache.salesConsultant={};
    }

    let title = tm.resetTitle;
    if (title) {
      Vue.$utils.setAppTitle(title);
    } else if (document.title !== '盈众乐橙服务平台') {
      Vue.$utils.setAppTitle('盈众乐橙服务平台');
    }

    let page = Vue.$cache.page;
    page.hasTabBar = tm.hasTabBar;
    page.title = tm.title;
    page.hasSearch = tm.hasSearch;

    Vue.$indicator.close();
    // Vue.$statistics();

    if (newPath) {
      Vue.$cache.entry = toPath;
      next({
        path: newPath
      });
    } else {
      next();
    }
  }

};


