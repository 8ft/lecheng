'use strict'

let doc = window.document;
let docEl = doc.documentElement;
let tid;

let refreshRem = function () {
    let width = docEl.clientWidth;
    if (width > 540) {
        width = 540;
    }
    let rem = width / 375;
    docEl.style.fontSize = 100 * rem + 'px';
}

window.addEventListener('resize', function () {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
}, false);
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }
}, false);
refreshRem();

export default {
    jsBridge: function (data) {
        let url = 'jsbridge::' + JSON.stringify(data),
            iframe = document.createElement('iframe');

        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.display = 'none';
        iframe.src = url;

        document.body.appendChild(iframe);
        setTimeout(function () {
            iframe.remove();
        }, 100);
    },

    downLoad(mbox,title,msg){
        mbox.confirm(msg,title).then(async function(){
            location.href="https://a.app.qq.com/o/simple.jsp?pkgname=com.enjoyauto.lecheng";
        });
    },

    goNative(page,data,redirectUrl){
        this.jsBridge({
            type: "goNative",
            data: {
                page:page,
                val:data,
                redirectUrl:redirectUrl
            }
        });
    },

    shareConfig: function (obj,action) {
        let data = obj || {
            share_title: '盈众乐橙服务平台',
            share_desc: '',
            share_img: location.origin + '/CRM/WeChat/App/static/img/login_logo.png',
            share_url: location.href.replace(location.search,'?')
        }

        if (isLecheng) {
            let shareData = {
                type: "share",
                data: {
                    action:action||'config',
                    title: data.share_title,
                    desc: data.share_desc,
                    imgUrl: data.share_img,
                    link: data.share_url
                }
            }
            this.jsBridge(shareData);
        } else if (/MicroMessenger/.test(navigator.userAgent)) {
            wx.ready(function () {
                wx.showMenuItems({
                    menuList: [
                      'menuItem:share:appMessage',
                      'menuItem:share:timeline',
                      'menuItem:favorite'
                    ]
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: data.share_title,
                    link: data.share_url,
                    imgUrl: data.share_img,
                    success: function () {
                        data.callback && data.callback();
                    }
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: data.share_title,
                    desc: data.share_desc,
                    link: data.share_url,
                    imgUrl: data.share_img,
                    success: function () {
                        data.callback && data.callback();
                    }
                });
            });
        }
    },

    setAppTitle: function (title) {
        document.title = title
        let mobile = navigator.userAgent.toLowerCase()
        if (/iphone|ipad|ipod/.test(mobile)) {
            let iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.setAttribute('src', '/CRM/WeChat/App/static/title.txt')
            let iframeCallback = function () {
                setTimeout(function () {
                    iframe.removeEventListener('load', iframeCallback)
                    document.body.removeChild(iframe)
                }, 0)
            }
            iframe.addEventListener('load', iframeCallback)
            document.body.appendChild(iframe)
        }
    },

    encrypt(con){
        const publicKey="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoK/x3oHE" +
            "MyawA8/XKJQrM21tBffeNiQHIWJ8a10TdkjPB21j/t05KLmfR6XYzAshIH3cA1w6kHYNTT60GVIUXU/v1uOHM" +
            "atpNfqh38/VUlxgenVUE3iX97WWiPj1+hpvXRwO4yGnC0kgqoQrwO6bQRdfyrWFLyBld+dKoYA1uj28eSnd8N" +
            "PNE7LQq7c6p42mlgFU3HhbsZxKT9HeGrnfJKDTB4/myTrExdWofWNfWPURPju/VYMBZt2ZJMBA7+XSykqIxUl" +
            "2NO+YFcdKa4PTqn/R6pMX8fj3fXNx+ieNUqf/RBO1DWb/Vd2xjY6+8TdHzuFuNndmNvsiVEBJvntFNQIDAQAB";

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        
        return encrypt.encrypt(con)
    },

    getUrlParam: function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|#|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(unescape(r[2]));
        return '';
    },

    addCookie: function (name, value, time) {
        let cookieString = name + "=" + escape(value);
        cookieString += ';path=/;';
        let date = new Date();
        if (time) {
            date.setTime(date.getTime() + this.getExpires(time));
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
        document.cookie = cookieString;
    },

    getCookie: function (name) {
        let reg = new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        let result = document.cookie.replace(reg, "$1");
        if (result !== '') {
            return result;
        } else {
            return null;
        }
    },

    delCookie: function (name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
    },

    getExpires: function (str) {
        let num = str.substring(1, str.length) * 1;
        let type = str.substring(0, 1);
        if (type == "m") {
            return num * 60 * 1000;
        } else if (type == "h") {
            return num * 60 * 60 * 1000;
        } else if (type == "d") {
            return num * 24 * 60 * 60 * 1000;
        }
    },

    ls: {
        isSupport: window.localStorage ? true : false,
        set: function (name, val) {
            if (this.isSupport) {
                if (typeof (val) === 'object') {
                    val = JSON.stringify(val);
                }
                window.localStorage[name] = val;
            }
        },
        get: function (name) {
            if (this.isSupport) {
                let val = window.localStorage[name];

                try {
                    return JSON.parse(val);
                } catch (e) {
                    return val;
                }
            }
        },
        del: function (name) {
            if (this.isSupport) {
                window.localStorage.removeItem(name);

            }
        },
        clear: function () {
            if (this.isSupport) {
                window.localStorage.clear();

            }
        }
    }
}




