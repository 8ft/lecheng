import common from './dependencies'

const env = process.env.NODE_ENV

module.exports = function (Vue, router) {

  let pAll = [];
  updateOpenid && pAll.push(getOpenid());

  router.beforeEach((to, from, next) => {

    Promise.all(pAll).then(function () {
      let tm = to.meta,
        fm = from.meta,
        tms = tm.share,
        fms = fm.share;
      
      //友盟统计
      _czc.push(["_trackPageview","/wxwap?#"+to.fullPath+"【"+(tm.resetTitle||tm.title)+"】","/wxwap?#"+from.fullPath+"【"+((fm.resetTitle||fm.title)||'微信直接打开')+"】"]); 

      //微信JSSDK
      if (env === 'production') { wxConfig(fms, tms); }

      //是否需要登录
      if (tm.requireAuth === undefined&&!Vue.$cache.user.memberId) {
        common.login(Vue, tm, next, to.fullPath);
      } else {
        common.geolocation(Vue, tm, next);
      }

    });

  });


  async function wxConfig(fms, tms) {
    let wxData = {
      content: {
        url: encodeURIComponent(location.href.split('#')[0])
      }
    };

    let res = await Vue.$post('/CRM/wechatcfg/getcfg.json', wxData);
    if (res.errcode == 0) {
      var con = res.content;
      wx.config({
        // debug:true,
        appId: con.appid,
        timestamp: con.timestamp,
        nonceStr: con.nonceStr,
        signature: con.signature,
        jsApiList: ['chooseWXPay','onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideOptionMenu','showOptionMenu']
      });

      wx.ready(function () {
        wx.hideOptionMenu();
        wx.showMenuItems({
          menuList: [
            'menuItem:share:appMessage',
            'menuItem:share:timeline',
            'menuItem:favorite'
          ]
        });
        
        if (fms && tms === undefined) {//重置分享内容
          Vue.$utils.shareConfig();
        } else if (tms === false) {//不可分享，隐藏按钮
          wx.hideOptionMenu();
        }
      });

    }
  }


  function getOpenid() {
    return new Promise(async function (resolve) {
      let data = {
        content: {
          code: Vue.$utils.getUrlParam('code'),
        }
      };

      let res = await Vue.$post('/CRM/wechatcfg/getopenid.json', data);
      if (res.errcode == 0) {
        let openid = res.content.openid;
        Vue.$utils.addCookie('openid', openid,'d60');
        Vue.$utils.addCookie('lastVersion', version,'d60');
      }
      resolve();

    });
  }

}
