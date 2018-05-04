'use strict'

import Base from './base'
import Np from 'number-precision'
import Http from './http'
import Cache from './cache'
import User from './user'
import IconFont from './iconfont'
import Statistics from './statistics'
import Sign from './sign'

const install = function (Vue) {
    Vue.$utils=Vue.prototype.$utils = Base;
    Vue.$np=Vue.prototype.$np = Np;
    Vue.$cache=Vue.prototype.$cache = Cache;

    Vue.$BMap=Vue.prototype.$BMap=new BMap.Map("baiduMap");
    Vue.$Geo=Vue.prototype.$Geo=new BMap.Geolocation();

    Vue.use(Http);
    Vue.use(User);
    Vue.use(Statistics);
    Vue.use(Sign);
}

export default{
    install
}


