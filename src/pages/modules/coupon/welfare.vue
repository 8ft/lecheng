<template>
  <app-layout id="coupon_welfare">
        <div class="content">
            <li v-if="content!=''">
                <div class="left">
                    <div class="text">
                        <img src="~assets/img/coupon/icon_coupon_pic_general.png" alt="">
                        <div class="blue" v-if="type==1">优惠券</div>
                        <div class="yellow" v-else>乐橙券</div>
                        
                    </div>
                    
                    <div class="coupon-box">
                        <p>{{content.name}}</p>
                        <div><span :class="{blue:type==1,yellow:type==2||type==3}" style="font-size: 0.13rem;margin: 0px;">¥</span><span :class="{blue:type==1,yellow:type==2||type==3}">{{content.couponAmt}}</span><em v-if="content.thresholdType==2">满任意金额可用</em><em v-else>满{{content.thresholdAmt}}元可用</em></div>
                    </div>
                </div>
                <div class="right" :class="{blue:type==1,yellow:type==2||type==3}" @click="receive(content.id)">
                    <div class="btn">立即领取</div>
                </div>
            </li>
            <router-link to="/myCoupons/1" class="coupon-link">我的优惠券 >></router-link>
        </div>
        <div class="explain">
            <div class="title">活动说明</div>
            <p>1.点击“立即领取”按钮，领取成功后购买商品或线下门店消费项目时使用，即可享受优惠。</p>
            <p>2.在盈众乐橙汇-我的优惠券，可查看已领取的优惠券。</p>
            <p>3.因商品参与其他活动等原因，付款时优惠券可能无法使用，此时商品最终成交价以您实际付款时提示金额为准</p>
            <p>4.线下使用券请到指定门店消费使用。</p>
            <p>5.获取、或使用优惠券时存在违规行为，将取消用户领取资格、撤销违规交易且收回全部优惠券，必要时追究法律责任。</p>
        </div>
  </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                type:this.$route.query.type,
                content:'',
                isShared:this.$route.query.isShared,
                schemeId:this.$route.params.id,
            }
        },
        
        activated(){
            //分享内容
            this.getData()
            
            
        },
        methods:{
            async getData(){
                let d={
                    content: {
                        schemeId:this.$route.params.id,
                        type:this.type,
                    }
                };
                let res = await this.$post('/couponSys/appcoupon/detail.json',d);
                if(res.errcode==0){
                    if(this.isShared==1){
                        let shareData = {
                            share_title: this.content.name,
                            share_desc: '点击领取即可使用，下载“盈众乐橙汇”APP领取更多神券',
                            share_img: location.origin + '/CRM/WeChat/App/static/img/coupon/icon_coupon_pic_general.png',
                            share_url: location.origin+'/wxwap?#/coupon/welfare/'+this.schemeId+'?type='+this.type+'&isShared=1'
                        }
                        this.$utils.shareConfig(shareData);
                    }
                    this.content=res.content;
                    
                }else{
                    this.$toast(res.msg)
                }
            },
            async receive(id){
                this.$login(async ()=>{
                    let res;
                    if(this.type==1){
                        let d={
                            content: {
                                memberId: this.$cache.user.memberId,
                                id:id,
                                receiveType:1
                            }
                        };
                        res = await this.$post('/couponSys/appcoupon/receiveOnCoupon.json',d);
                    }else {
                        let d={
                            content: {
                                memberId: this.$cache.user.memberId,
                                id:id
                            }
                        };
                        res = await this.$post('/couponSys/appcoupon/receive.json',d);
                    }
                    
                    if(res.errcode==0){
                        
                        this.$toast('领取成功')
                    }else{
                        this.$toast(res.msg)
                    }
                })
                
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #coupon_welfare{
        font-size: .12rem;
        .content{
            background: url('/CRM/WeChat/App/static/img/coupon/welfare_bg.png') no-repeat;
            background-size: 100% 100%;
            width: 100%;
            height: 3.25rem;
            position: relative;
            li{
                position: absolute;
                top: 1.39rem;
                width: 90%;
                height: .97rem;
                margin-left: 5%;
                background: #fff;
                border-radius: 4px;
                display: flex;
                .left{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    .text{
                        img{
                            width: .55rem;
                            height: .55rem;
                            margin: 0 .12rem;
                        }
                        div{
                            font-size: .12rem;
                            line-height: .12rem;
                            text-align: center;
                            &.blue{
                                    color: #44aae5;
                            }
                            &.yellow{
                                color: #e94816
                            }
                        }
                    }
                    
                    .coupon-box{
                        height: .75rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        flex: 1;
                        margin-right: .08rem;
                        p{
                            font-size: .13rem;
                            word-break: break-all;
                            color: #22222d;
                            margin-top: .02rem;
                        }
                        div{
                            span{
                                font-size: .24rem;
                                margin-right: .03rem;
                                font-weight: 600;
                                &.blue{
                                    color: #44aae5;
                                }
                                &.yellow{
                                    color: #e94816
                                }
                            }
                            em{
                                    font-style: normal;
                            }
                        }
                    }
                }
                .right{
                    width: .9rem;
                    height: 100%;
                    
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    &.blue{
                        background: url('~assets/img/coupon/background_coupon_shopping_right.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.yellow{
                        background: url('~assets/img/coupon/background_coupon_shopping_right_yellow.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    
                    img{
                        width: .48rem;
                        // margin-top: .1rem;
                    }
                    .btn{
                        font-size: .15rem;
                        height: .2rem;
                        line-height: .2rem;
                        padding: 0 .08rem;
                        display: inline-block;
                        text-align: center;
                        color: #fff;
                    }
                }
            }
            .coupon-link{
                color: #fff;
                text-align: center;
                position: absolute;
                bottom: .35rem;
                text-decoration: underline;
                left: 50%;
                transform: translateX(-50%);
                font-size: .16rem;
            }
        }
        .explain{
            position: relative;
            width: 90%;
            margin-left: 5%;
            border:1px solid #565658;
            box-sizing: border-box;
            border-radius: 10px;
            margin-top: .21rem;
            padding: .17rem .13rem;
            .title{
                font-weight: 500;
                color: #e94816;
                font-size: .15rem;
                width: .9rem;
                text-align: center;
                background: #f2f2f2;
                position: absolute;
                left: 50%;
                top: -.11rem;
                transform: translateX(-50%);
            }
            p{
                line-height: .2rem;
            }
        }
    }
</style>
