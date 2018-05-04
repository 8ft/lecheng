<template>
    <app-layout id="myCarsRepair">
        <template v-if="content.recordNumber>0">
            <div class="repair-box" >
                <ul class="repair-top">
                    <li>
                        <p>最后入店</p>
                        <div>{{content.lastIntoStore}}</div>
                    </li>
                    <li>
                        <p>公里数</p>
                        <div>{{parseInt(content.kilometers)}}KM</div>
                    </li>
                    <li>
                        <p>维修记录数</p>
                        <div>{{content.recordNumber}}</div>
                    </li>
                </ul>
                <ul class="repair-cen">
                    <li v-for="(item,index) in content.recordList">
                        <div class="head">
                            <span class="time">{{item.date}}</span>
                            <span class="time" style="margin-left:.2rem">{{parseInt(item.kilometers)}}KM</span>
                            <span class="reason">{{item.orderType}}</span>
                        </div>
                        <div class="content">
                            <div class="item">
                                <span>维修项目：</span>{{item.repairContents}}
                            </div>
                            <div class="item">
                                <span>维修材料：</span>{{item.repairMaterials}}
                            </div>
                        </div>
                    </li>
                    
                </ul>
            </div>
            <div class="repair-prompt" >温馨提示: 本维保历史所包含的记录内容由盈众汽车与各品牌厂商对接而得，仅供您作为爱车养护的参考，如有信息不符、记录遗漏等疑问请拨打盈众乐橙会员服务热线：96358</div>
        </template>
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
                content:''
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
                        carId:this.carId
                    }
                };

                let res = await this.$post('/CRM/appconsumeorder/maintenanceRecord.json',d);
                if(res.errcode==0){
                    this.content=res.content;
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #myCarsRepair{
        .repair-box{
            min-height: 100%;
            padding-bottom: 1.2rem;
            box-sizing: border-box
        }
        .repair-top{
            padding: .2rem 0;
            padding-top:.15rem;
            background: $mainColor;
            @include box;
            li{
                @include flex;
                text-align: center;
                height: .25rem;
                border-right: 1px solid #fff;
                &:last-child{
                    border:0
                }
                p{
                    color: #ffc89f;
                    font-size: .12rem;
                    margin-top: -.06rem;
                }
                div{
                    color: #fff;
                    font-size: .15rem;
                    margin-top: .04rem;
                }
            }
        }
        .repair-cen{
            
            li{
                margin-bottom: .05rem;background: #fff;
                .head{
                    height: .4rem;
                    border-bottom: 1px solid #f2f2f2;
                    padding: 0 5%;
                    line-height: .4rem;
                    .time{
                        font-size: .12rem;
                        color: #47474f;
                    }
                    .reason{
                        font-size: .12rem;
                        color: #e84816;
                        float: right
                    }
                }
                .content{
                    padding: .13rem 5%;
                    .item{
                        font-size: .12rem;
                        color: #88888d;
                        line-height: .17rem;
                        margin: .02rem 0;
                        span{
                            color: #22222d
                        }
                    }

                }
            }
            
        }
        .repair-prompt{
            padding: 0 5%;
            font-size: .12rem;
            color: #88888d;
            margin-top: -.68rem;
        }
    }
</style>

