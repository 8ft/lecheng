'use strict'

import MD5 from 'js-md5'

const SECRET={
    common:'09LDZK#$!KEQ',
    pay:'76f5d3cb319d403c95cb85a7c081b65f',
    sms:'xpRB51&RhmCY'
};

const install = function (Vue) {
    
    Vue.$sign=Vue.prototype.$sign =function(data,type){

        let obj=data,
            str='';
            
        Object.keys(obj).forEach(function(key){
            let val=obj[key];
            if(typeof val==='object'){
                str+=(key+'='+JSON.stringify(val)+'&');
            }else{
                str+=(key+'='+val+'&');
            }
        });

        let secret;
        secret=SECRET[type]||SECRET.common;

        let sign;
        sign=MD5(str+'SECRET='+secret).toLowerCase();
        obj.sign=sign;

        if(type!=='sms'){
            obj.userToken=Vue.$cache.token;
            // obj.userToken="J9gEgMGW2jE42ar19lPr2CDbulxpoigMNNZSckLZ5Nkcw5LSSKXCIga30JiBpzUuSQf5qN2IrHKVW1MIbAU_PwcXLUhMY5Y9boCekjGAiZ3bQKJd$1sCClBm$$FFvwJx2DOCN1FM$onXcnvTLNdEgTATAS61W0vm_slt10xgrkw=";
        }

        return obj;
    }


    
}

module.exports = {
    install
};