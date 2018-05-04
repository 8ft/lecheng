'use strict'

import axios from 'axios'

const env = process.env.NODE_ENV;
const isDev=(env === 'development' || location.host === 'ceshi.lechengclub.com');

const install = function (Vue) {
    let httpArr = [];

    axios.interceptors.request.use(config => {
        return config
    }, error => {
        return Promise.reject(error)
    })

    axios.interceptors.response.use(response => {
        return response
    }, error => {
        return Promise.resolve(error.response)
    })

    function getUrl(url) {
       if (isDev) {
            // if(url.includes('wechatRedEnvelope')){
                // return 'http://192.168.21.108:8080' + url;
            // }else 

            // if(url.includes('couponSys')){
            //     return 'http://192.168.21.215:8080' + url;

            // if(url.includes('unifiedorder')){
            //     return 'http://192.168.21.99:18001' + url;
            // }else{
                return 'https://ceshi.lechengclub.com' + url;
            // }
            
        }else{
            return url;
        }
    }

    function checkStatus(response) {
        // 如果http状态码正常，则直接返回数据
        if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
            
            let serverDate=response.headers.date,
                resData=response.data;
            resData.serverDate=serverDate;

            return resData
        }
        // 异常状态下，把错误信息返回去
        return {
            status: -404,
            msg: '网络异常'
        }
    }

    function checkCode(res) {
        // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
        if (res.status === -404) {
            Vue.$toast(res.msg);
        }
        if (res.errcode && res.errcode != 0) {
            let msg = res.msg;
            if (msg == 'fail') { msg = '今日抽奖次数已送完'; }
            Vue.$toast(msg ? msg : ('错误：' + res.errcode));
        }

        httpArr.pop();
        if (httpArr.length === 0) { Vue.$indicator.close(); }

        return res
    }

    Vue.$post = Vue.prototype.$post = function (url, data) {
        let newUrl = getUrl(url);
        if (httpArr.length === 0) { Vue.$indicator.open(); }
        httpArr.push(1);

        return axios({
            method: 'post',
            url:newUrl,
            data: JSON.stringify(data),
            timeout: 20000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).then(
            (res) => {
                return checkCode(res)
            })
    }


    Vue.$get = Vue.prototype.$get = function (url, params) {
        let newUrl = getUrl(url);
        if (httpArr.length === 0) { Vue.$indicator.open(); }
        httpArr.push(1);

        return axios({
            method: 'get',
            url:newUrl,
            params, // get 请求时带的参数
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).then(
            (res) => {
                return checkCode(res)
            })
    }

    Vue.$postForm = Vue.prototype.$postForm = function (url, data) {
        let newUrl = getUrl(url);
        if (httpArr.length === 0) { Vue.$indicator.open(); }
        httpArr.push(1);

        return axios({
            method: 'post',
            url:newUrl,
            data: data,
            timeout: 100000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).then(
            (res) => {
                return checkCode(res)
            })
    }

}


module.exports = {
    install
};
