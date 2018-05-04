import common from './dependencies'

module.exports = function (Vue, router) {

    let cur_mid = Vue.$cache.user.memberId,
        new_mid = Vue.$utils.getUrlParam('memberId');

    if (!cur_mid|| cur_mid !== new_mid) {
        Vue.$cache.user.memberId = new_mid;
    }

    router.beforeEach((to, from, next) => {
        let tm = to.meta,
            fm = from.meta;
        
        //友盟统计
        _czc.push(["_trackPageview","/wxwap?#"+to.fullPath+"【"+(tm.resetTitle||tm.title)+"】","/wxwap?#"+from.fullPath+"【"+((fm.resetTitle||fm.title)||'APP直接打开')+"】"]); 

        
        if (tm.share === false) {
            Vue.$utils.shareConfig(null,'hide');
        }

        if (tm.requireAuth === undefined) {

            let mid=Vue.$cache.user.memberId;
            if (!mid) {
                let url = location.href,
                    s=location.search;

                s?s += '&LechengLogin':s += '?LechengLogin';

                Vue.$utils.goNative('login',null,url.replace(location.search,s));
            } else {
                common.getUserInfo(Vue, tm, mid, next)
            }

        } else {
            common.updatePageInfo(Vue, tm, next);
        }

    });

}
