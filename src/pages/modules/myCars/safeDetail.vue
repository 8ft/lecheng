<template>
    <app-layout id="myCarsSafeDetail">
        <div class="safeDetail-box">
            <div class="list-box">
                <div class="item">
                    <p>{{content.insType}}保单号</p>
                    <div>{{content.insNo}}</div>
                </div>
            </div>
            <div class="list-box">
                <div class="item">
                    <p>被保人</p>
                    <div>{{content.InsureName}}</div>
                </div>
                <div class="item">
                    <p>投保人</p>
                    <div>{{content.policyholderName}}</div>
                </div>
            </div>
            <div class="list-box">
                <div class="item">
                    <p>投保保险公司</p>
                    <div>{{content.insCompany}}</div>
                </div>
            </div>
            <div class="list-box">
                <div class="item">
                    <p>保险期限</p>
                    <div>{{content.startTime}} 至 {{content.endTime}}</div>
                </div>
            </div>
            <div class="list-box">
                <div class="item">
                    <p>车牌号</p>
                    <div>{{content.licensePlate}}</div>
                </div>
                <div class="item">
                    <p>车架号</p>
                    <div>{{content.carFrameno}}</div>
                </div>
            </div>
            <div class="list-box">
                <div class="item">
                    <p>{{content.insType}}保费</p>
                    <div>{{content.insSum}}</div>
                </div>
                <div class="item">
                    <p>保单状态</p>
                    <div>{{content.isValid}}</div>
                </div>
            </div>
            <div class="detailed-title">投保明细</div>
            <div class="list-box" style="height:.44rem;">
                <div class="item detailed">
                    <p>险种名称</p>
                </div>
                <div class="item detailed">
                    <p>保险金额</p>
                </div>
                <div class="item detailed">
                    <p>保费</p>
                </div>
            </div>
            <div class="list-box" style="height:.44rem;" v-for="(item,index) in content.insDetail">
                <div class="item detailed">
                    <div>{{item.insName}}</div>
                </div>
                <div class="item detailed">
                    <div>{{item.insAmount}}</div>
                </div>
                <div class="item detailed">
                    <div>{{item.premium}}</div>
                </div>
            </div>
            <div class="prompt">温馨提示：本保险记录由盈众汽车与保险公司对接而得，不包含非通过盈众汽车渠道购买的保险单，如果信息与实际不符合，请拨打盈众乐橙会员服务热线：96358。</div>
        </div>
    
        <div slot="footer" class="nextOne" style="background:#f2f2f2"><a class="btn" :href="'tel:'+content.insuranceHotline"><img src="~assets/img/myCars/icon_detail_button_phone@2x.png" />盈众保险投保热线</a></div>
    <!-- <div  class="lc-error">
            <img src="~assets/img/error-empty.png">
            <p>暂无保单信息</p>
        </div> -->
    
    </app-layout>
</template>
<script>
    export default {
        data() {
            return{
                orderId:'',
                insType:'',
                content:'',
            }
        },
        activated(){
          this.orderId=this.$route.params.orderId,
          this.insType=this.$route.query.insType,
          this.getData();
        },
        methods:{
            async getData () {
                let d={
                    content: {
                        orderId: this.orderId,
                        insType:this.insType
                    }
                };

                let res = await this.$post('/CRM/appinsuranceorder/insuranceOrderDetail.json',d);
                if(res.errcode==0){
                    this.content=res.content;
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #myCarsSafeDetail{
        .safeDetail-box{
            .list-box{
                height: .5rem;
                background: #fff;
                border-bottom: 1px solid #f2f2f2;
                display: flex;
                .item{     
                    display: flex;
                    flex:1;
                    justify-content: center !important;
                    flex-direction: column;
                    text-indent: .15rem;
                    border-right: 1px solid #f2f2f2;
                    &:last-child{
                        border:0
                    }
                    p{
                        color: #22222d;
                        font-size: .12rem;
                    }
                    div{
                        color: #88888d;
                        font-size: .12rem;
                        margin-top: .03rem;
                    }
                }
                .detailed{
                    text-indent: 0;
                    p{
                        font-size: .15rem;
                        text-align: center
                    }
                    div{
                        padding: 0 10%;
                        margin: 0;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        text-align: center
                    }
                    
                }
            }
            .prompt{
                color: #88888d;
                font-size: .12rem;
                margin-top: .55rem;
                padding: 0 5%;
            }
            .detailed-title{
                height: .3rem;
                line-height: .3rem;
                color: #88888d;
                font-size: .12rem;
                padding-left: .15rem;
            }
        }
        .nextOne img{
            height: .2rem;
            width: .2rem;
            vertical-align: middle;
            margin-top: -.045rem;
            margin-right: .1rem;
        }
        
    }
</style>

