/**
 * 内部统计
 */

'use strict'

const env = process.env.NODE_ENV;
const isDev=(env === 'development');

const platform=getPlatform();

function getPlatform() {
    const userAgentInfo = navigator.userAgent;
    const Agents = ["Android","iPhone","Windows Phone"];

    let platform='';
    for (let i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
                platform=Agents[i];
            break;
        }
    }

    if(isLecheng){
        platform+='【APP】';
    }else{
        platform+='【WEB】';
    }

    return platform;
}


const install = function (Vue) {
    
    Vue.$statistics= Vue.prototype.$statistics = async function (page) {
        if(!isDev){
            let data = {
                content: {
                    platform:platform,
                    pageId: page||'',
                    mbeId:Vue.$cache.user.memberId||''
                }
            };
            let res = await Vue.$post('/CRM/appothers/commonApi.json', data);
        }
    }
}

module.exports = {
    install
};






