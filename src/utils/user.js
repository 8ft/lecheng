'use strict'

const install = function (Vue) {

    Vue.$login = Vue.prototype.$login = async function (callback) {
        if (Vue.$cache.user.memberId) {
            callback();
        } else {

            if (isLecheng) {
                let url = location.href,
                    s=location.search;

                if (s) {
                    s += '&LechengLogin';
                } else {
                    s += '?LechengLogin';
                }

                let appLogin = {
                    type: "goNative",
                    data: {
                        page: "login",
                        redirectUrl: url.replace(location.search,s)
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
                            getUserInfo(con.mbeId,callback);
                        } else {
                            Vue.$router.push('/setPwd');
                        }
                    } else {
                        Vue.$router.push('/signUp');
                    }

                } else if (res.errcode == 3) {//openid过期
                    Vue.$utils.delCookie('openid');
                    let state = location.href.split('&from=')[0].split('code=')[0].replace(/:/g, 'lc0').replace(/\//g, 'lc1').replace(/\?/g, 'lc2').replace(/\=/g, 'lc3').replace(/&/g, 'lc4'),
                        redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65478e169956c988&redirect_uri=' + encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/App/auth_redirect.html') +
                            '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
                    location.replace(redirect_uri);
                }
            }
        }
    }

    async function getUserInfo(memberId,callback) {

        let data = {
            content: {
                memberId: memberId,
                source: 'WeChat'
            }
        };

        let res = await Vue.$post('/CRM/appmembermgcust/querymemberinfo.json', data);
        if (res.errcode == 0) {
            Vue.$cache.user = res.content;
            eventBus.$emit('loggedIn');
            callback();
        }
    }

}

module.exports = {
    install
};






