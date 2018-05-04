<template>
    <app-layout id="myCarsSafe">
      
        <ul class="safe-cen" v-if="content.orderList&&content.orderList.length>0">
            <router-link tag="li" :to="'/myCars/safeDetail/'+item.orderId+'?insType='+item.insType" v-for="(item,index) in content.orderList">
                <div class="title" v-if="index==0">年度：{{item.year}}</div>
                <div class="title" v-if="content.orderList[index-1]&&item.year!=content.orderList[index-1].year">年度：{{item.year}}</div>
        
                <div class="head">
                    <span class="time">保单号：{{item.insNo}}</span>
                    <span class="reason soon" v-if="item.isValid=='即将生效'">{{item.isValid}}</span>
                    <span class="reason lose" v-else-if="item.isValid=='失效'">{{item.isValid}}</span>
                    <span class="reason" v-else="item.isValid=='有效'">{{item.isValid}}</span>
                </div>
                <div class="content">
                    <div class="item">
                        <span class="title">保险公司：</span>
                        <span class="deatils">{{item.insCompany}}</span> 
                    </div>
                    <div class="item">
                        <span class="title">险种类型：</span>
                        <span class="deatils">{{item.insType}}</span> 
                    </div>
                    <div class="item">
                        <span class="title">车牌号：</span>
                        <span class="deatils">{{item.licensePlate}}</span> 
                    </div>
                    <div class="item">
                        <span class="title">保单有效期：</span>
                        <span class="deatils">{{item.startTime}}至{{item.endTime}}</span> 
                    </div>
                </div>
            </router-link>
            
        </ul>
        
        <div  class="lc-error" v-else>
            <img src="~assets/img/error-empty.png">
            <p>空空如也~</p>
        </div>
    
    </app-layout>
</template>
<script>
    export default {
        data() {
            return{
                carId:'',
                content:'',
                orderList:[],

            }
        },
        activated(){
          this.carId=this.$route.params.carId,
          this.getData();
        },
        methods:{
            async getData () {
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        carId:this.carId
                    }
                };

                let res = await this.$post('/CRM/appinsuranceorder/insuranceOrderList.json',d);
                if(res.errcode==0){
                    
                    this.content=res.content;
                    
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #myCarsSafe{
        
        
        .safe-cen{
            
            li{
                background: #fff;
                margin: .05rem 0;
                > .title{
                    background: #f2f2f2;
                    height: .25rem;
                    line-height: .20rem;
                    color: #88888d;
                    padding: 0 5%
                }
                .head{
                    height: .4rem;
                    border-bottom: 1px solid #f2f2f2;
                    padding: 0 5%;
                    line-height: .4rem;
                    .time{
                        font-size: .15rem;
                        color: #47474f;
                    }
                    .reason{
                        font-size: .12rem;
                        color: #fff;
                        float: right;
                        height: .15rem;
                        line-height: .15rem;
                        padding: 0 .07rem;
                        background: #f39800;
                        border-radius: .15rem;
                        margin-top: .125rem
                    }
                    .reason.soon{
                        background: #e94816
                    }
                    .reason.lose{
                        background: #c9c9c9
                    }
                }
                .content{
                    padding: .13rem 5%;
                    .item{
                        font-size: .12rem;
                        color: #88888d;
                        margin-bottom: .09rem;
                        &:last-child{
                            margin-bottom: 0
                        }
                        .title{
                            display: inline-block;
                            width: .8rem
                        }
                        .deatils{
                            color: #55555d
                        }
                    }

                }
            }
            
        }
        
    }
</style>

