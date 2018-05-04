<template>
    <app-layout id="orderDetail" v-if="detail.no">   

        <!-- 订单状态 -->
        <order-status :data="detail.statusInfo"></order-status>
        
        <!-- 物流信息 -->
        <order-trail class="mt" :no="detail.no" :status="detail.statusInfo.status" :data="detail.trackInfo"></order-trail>



        <template v-for="mod in curModule">

                <!-- 【1】收货地址 -->
                <lc-address v-if="mod===1" class="mt" :readOnly="true" :data="detail.receiverInfo"></lc-address>

                <!-- 【2】商品列表 -->
                <div v-if="mod===2" class="mt">
                    <order-goods v-for="mod in detail.proList" :data="mod"></order-goods>
                </div>

                <!-- 【3】门店 -->
                <order-store v-if="mod===3" class="mt" :data="detail.storeInfo"></order-store>

                <!-- 【4】商品 -->
                <order-goods v-if="mod===4" class="mt" :type="detail.statusInfo.orderType" :data="detail.proInfo"></order-goods>

                <!-- 【5】优惠 -->
                <template v-if="mod===5&&detail.proInfo">
                    <order-benefit class="mt" v-for="item in detail.proInfo.discountList" :data="item"></order-benefit>
                </template>

                <!-- 【6】二维码 -->
                <order-qrcode v-if="mod===6" class="mt" :status="detail.statusInfo.status" :cdkey="detail.orderInfo.cdkey" :code="detail.orderInfo.qrcode"></order-qrcode>  

                <!-- 【7】联系门店 -->
                <store-info v-if="mod===7" class="mt" :data="detail.storeInfo"></store-info>






                
                <!-- 【10】车品/异业快递 订单信息 -->
                <template v-if="mod===10">
                    <info-box class="mt">
                        <div><label>商品总额：</label>￥{{detail.orderInfo.totalamt}}</div>
                        <div><label>优惠券：</label>-￥{{detail.orderInfo.couponamt}}</div>
                        <div><label>运费：</label>￥{{detail.orderInfo.freight||0}}</div>
                    </info-box>
                    <info-box :totle="detail.orderInfo.otherText">
                        <div><label>订单编号：</label>{{detail.no}}</div>
                        <div><label>下单时间：</label>{{detail.createTime}}</div>
                        <div><label>支付方式：</label>{{detail.orderInfo.payMethod}}</div>
                        <div><label>配送方式：</label>{{detail.orderInfo.deliveryMode}}</div>
                    </info-box>
                </template>

                <!-- 【11】维保订单信息 -->
                <template v-if="mod===11">
                    <div v-if="detail.bespeakInfo" class="date-info mt">
                        <h1>预约信息<span>{{detail.bespeakInfo.serviceTypeName}}</span></h1>
                        <h2>{{detail.bespeakInfo.setmealName}}</h2>
                        <store-discount :discount="detail.bespeakInfo.discount" :isMin="false"></store-discount>
                    </div>
                    <info-box v-if="detail.bespeakInfo">
                        <div><label>预约时间：</label>{{detail.bespeakInfo.arrivalTime}}</div>
                        <div><label>服务顾问：</label>{{detail.bespeakInfo.bespeakConsultantName}}&nbsp;&nbsp;<a :href="'tel:'+detail.bespeakInfo.bespeakConsultantPhone">{{detail.bespeakInfo.bespeakConsultantPhone}}</a></div>
                        <div><label>预约状态：</label>{{detail.bespeakInfo.bespeakStatus}}</div>
                        <div><label>付款方式：</label>{{detail.bespeakInfo.paymentMethod}}</div>
                    </info-box>

                    <info-box class="mt" title="服务信息" v-if="detail.serviceInfo.serviceTime">
                        <div><label>服务时间：</label>{{detail.serviceInfo.serviceTime}}</div>
                        <div><label>服务顾问：</label>{{detail.serviceInfo.serviceConsultantName}}</div>
                        <div><label>服务类型：</label>{{detail.serviceInfo.serviceTypeName}}</div>
                        <div><label>订单金额：</label>{{detail.serviceInfo.orderAmount}}</div>
                        <div><label>服务状态：</label>{{detail.serviceInfo.serviceStatus}}</div>
                    </info-box>
                    <info-box class="mt" title="车辆信息">
                        <div><label>车型：</label>{{detail.bespeakCarInfo.carText}}</div>
                        <div><label>车牌号：</label>{{detail.bespeakCarInfo.licenseplate}}</div>
                        <div v-if="detail.bespeakCarInfo.kilometers"><label>公里数：</label>{{detail.bespeakCarInfo.kilometers}}</div>
                        <div><label>送修人：</label>{{detail.bespeakCarInfo.repairPersonName}}</div>
                        <div><label>手机号码：</label>{{detail.bespeakCarInfo.repairPersonPhone}}</div>
                    </info-box>
                    <info-box>
                        <div><label>订单编号：</label>{{detail.no}}</div>
                        <div><label>下单时间：</label>{{detail.createTime}}</div>
                    </info-box>
                </template>

                <!-- 【12】试驾订单信息 -->
                <template v-if="mod===12">
                    <info-box title="试驾信息" class="mt">
                        <div><label>试驾车型：</label>{{detail.testDriveInfo.carText}}</div>
                        <div><label>试驾门店：</label>{{detail.testDriveInfo.storeName}}</div>
                        <div v-if="detail.testDriveInfo.salerName"><label>销售顾问：</label>{{detail.testDriveInfo.salerName}}&nbsp;&nbsp;<a :href="'tel:'+detail.testDriveInfo.salerPhone">{{detail.testDriveInfo.salerPhone}}</a></div>
                        <div><label>我的姓名：</label>{{detail.testDriveInfo.custName}}</div>
                        <div><label>我的手机：</label>{{detail.testDriveInfo.custPhone}}</div>
                        <div><label>预约时间：</label>{{detail.testDriveInfo.subscribeTime}}</div>
                        <div v-if="detail.testDriveInfo.remark"><label>我的留言：</label>{{detail.testDriveInfo.remark}}</div>
                    </info-box>
                    <info-box>
                        <div><label>订单编号：</label>{{detail.no}}</div>
                        <div><label>下单时间：</label>{{detail.createTime}}</div>
                    </info-box>
                </template>

                <!-- 【13】门店购车订单信息 -->
                <template v-if="mod===13">
                    <info-box class="mt">
                        <div><label>销售顾问：</label>{{detail.orderInfo.salesConsultantName}}&nbsp;&nbsp;<a :href="'tel:'+detail.orderInfo.salesConsultantPhone">{{detail.orderInfo.salesConsultantPhone}}</a></div>
                        <div v-if="detail.orderInfo.carText"><label>购买车型：</label>{{detail.orderInfo.carText}}</div>
                    </info-box>
                    <info-box class="mt">
                        <div><label>客户姓名：</label>{{detail.orderInfo.customerName}}</div>
                        <div><label>购车方式：</label>{{detail.orderInfo.shoppingWay}}</div>
                        <div v-if="detail.orderInfo.licenseplate"><label>车牌号：</label>{{detail.orderInfo.licenseplate}}</div>
                    </info-box>
                    <info-box>
                        <div><label>订单编号：</label>{{detail.no}}</div>
                        <div><label>下单时间：</label>{{detail.createTime}}</div>
                    </info-box>

                    <p class="tip">温馨提示:本门店购车订单通知提醒仅供您作为购车时的参考,详细订单流程请以线下门店实际发生为准!</p>
                </template>

                <!-- 【14】新车订单信息 -->
                <template v-if="mod===14">
                    <div class="nc-contact clearfix">
                        <h1>购车联系人</h1>
                        <p>{{detail.orderInfo.custName}}<a :href="'tel:'+detail.orderInfo.custPhone">{{detail.orderInfo.custPhone}}</a></p>
                    </div>

                    <info-box class="mt">
                        <div><label>订单编号：</label>{{detail.no}}</div>
                        <div><label>下单时间：</label>{{detail.createTime}}</div>
                        <div><label>支付方式：</label>{{detail.orderInfo.payMethod}}</div>
                        <div><label>配送方式：</label>{{detail.orderInfo.deliveryMode}}</div>
                    </info-box>
                </template>

                <!-- 【15】美容/异业自提 订单信息 -->
                <template v-if="mod===15">
                    <info-box class="mt">
                        <div><label>商品总额：</label>￥{{detail.orderInfo.totalamt}}</div>
                        <div><label>优惠券：</label>-￥{{detail.orderInfo.couponamt}}</div>
                    </info-box>
                    <info-box :totle="detail.orderInfo.otherText">
                        <div><label>订单编号：</label>{{detail.no}}</div>
                        <div><label>下单时间：</label>{{detail.createTime}}</div>
                        <div><label>支付方式：</label>{{detail.orderInfo.payMethod}}</div>
                        <div><label>配送方式：</label>{{detail.orderInfo.deliveryMode}}</div>
                    </info-box>
                </template>



        </template>
        


        <!-- 联系客服 -->
        <div class="call clearfix">
            <router-link :to="'/onlineHelp?actUrl='+encodeURIComponent('https://static.meiqia.com/dist/standalone.html?_=t&eid=38740&groupid=846de8917f52c53f0207d5c7e1c7c5e4')">在线客服</router-link>
            <a href="tel:96358">电话客服</a>
        </div>

        <!-- 操作栏 -->
        <order-action-bar slot="footer" v-if="![5,6,7].includes(detail.statusInfo.status)&&!(detail.statusInfo.status===2&&['XC','MG'].includes(detail.statusInfo.orderType))&&detail.statusInfo.state!==39" :data="detail.statusInfo" :orderNo="detail.no"></order-action-bar>
      
    </app-layout>
</template>
<script>
    import Status from 'components/orders/status'
    import Trail from 'components/orders/trail'
    import Addr from 'components/common/address'
    import Goods from 'components/orders/goods'
    import InfoBox from 'components/orders/infoBox'
    import Store from 'components/orders/store'
    import Benefit from 'components/orders/benefit'
    import QrCode from 'components/orders/qrCode'
    import Discount from 'components/stores/discount'
    export default {
        components:{
            'order-status':Status,
            'order-trail':Trail,
            'lc-address':Addr,
            'order-goods':Goods,
            'info-box':InfoBox,
            'order-store':Store,
            'order-benefit':Benefit,
            'order-qrcode':QrCode,
            'store-discount':Discount
        },
        data(){
            return{
                detail:{},

                curModule:[],
                modules:{
                    'CP':[1,2,10],
                    'WB':[3,11],
                    'SJ':[3,12],
                    'NC':[4,5,6,7,14],
                    'MR':[3,4,6,15],
                    'MG':[3,13],
                    'YY':{
                        express:[1,4,10],
                        ziti:[4,6,7,15]
                    }
                }
            }
        },
        mounted(){
            eventBus.$on('updateOrder',()=> {
                this.getData();
            });
        },
        activated(){
            if(!this.detail.no){
                this.getData();
            }
        },
        beforeRouteLeave (to,from,next){
            if(!/map/.test(to.path)){
                this.resetPage();
            }
            next();
        },
        methods:{
            resetPage(){
               this.curModule=[];
               this.detail={};
            },
            async getData () {
                let data=this.$sign({
                    content: {
                        no: this.$route.params.id
                    }
                });
                let res = await this.$post('/CRM/api/query.order.code.json',data);

                if(res.errcode==0){
                    let con=res.content,
                        info=con.statusInfo,
                        type=info.orderType
                    if(type==='YY'){
                        if(info.deliveryCode===1){
                            this.curModule=this.modules.YY.express;
                        }else{
                            this.curModule=this.modules.YY.ziti;
                        }
                    }else{
                        this.curModule=this.modules[type];
                    }
                    this.detail=con;
                    eventBus.$emit('layout');
                }
            } 
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #orderDetail{
        .mt{margin-top: .05rem;}
        .tip{padding:.1rem .2rem 0;font-size:$h3;color:$gray;}

        .date-info{position: relative;min-height:.4rem;background:#fff;padding:.185rem .2rem .1rem;border-bottom:$border;background:#fff url('~assets/img/orders/bg.png') repeat-x top left;background-size:.235rem .085rem;
            h1{color: $black;span{margin-left:.2rem;}}
            h2{font-size:$h3;color:$gray;width:70%;@include txtOverflow;margin-top: .05rem;}
            .store-discount{top:.185rem;}
        }

        .nc-contact{color:$black;background:#fff;padding:0 .2rem;line-height:.44rem;
            h1{float: left;}
            p{float:right;}
            span{margin-left:.1rem;}
        }

        .call{padding:.15rem .2rem .4rem;
            a{display: block;width:1.6rem;height:.3rem;line-height:.3rem;border:1px solid #c9c9c9;border-radius: .03rem;float:left;text-align: center;
                &::before{content:'';display: inline-block;width:.2rem;height:.2rem;background:url('~assets/img/mall/icon_order_button_online.png') no-repeat center;background-size:100%;vertical-align:middle;margin-right:.05rem;}
            }
            a:nth-of-type(2){float:right;
                &::before{background-image:url('~assets/img/mall/icon_order_button_phone.png');}
            }
        }
    }
</style>
