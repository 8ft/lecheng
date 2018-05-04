<template>
    <app-layout id="myCarsCheckRemind">
        <router-link slot="aside" :to="'/myCars/setCheckRemind/'+carId">
            <div class="checkRemind-edit">编辑</div>
        </router-link>
        <div class="card">
            <div class="head">下次年检到期时间为：{{annualStopDate}}，还有：</div>
            <div class="content">
                <div class="time-box">
                    <div class="time"><span>{{content.annualStopDayNum}}</span> 天</div>
                    <div class="type">
                        <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                        <span>下次年检类型：{{content.carAnnualName}}</span>
                    </div>
                </div>
                <div class="explain" v-if="content.isNewCarAnnual==0">请在到期前90天内，携带相关材料前往检验机构参加安全技术检测！</div>
                <div class="explain" v-if="content.isNewCarAnnual==1">请在到期前90天内，携带相关材料到车管所领取检验标识！</div>
            </div>
        </div>
        <div class="recommend"><div>年检说明</div></div>
        <!-- <iframe :src="content.url" width="100%" height="100%"></iframe> -->
        <ul class="list-box">
            <li class="title" >车辆年检根据车辆的登记注册时长，分为六年内新车年检和上线年检（超过六年）</li>
            <li>
                <div class="head">六年内新车年检</div>
                <div class="details"><span>定义：</span>所谓的“6年免检”，是指汽车注册登记6年以内的非营运车和其他小型、微型载客汽车（面包车、7座和7座以上车辆除外），可免去上线检验。但免检并不等于免审，在6年免检期间，车主每2年仍要提供交强险凭证、车船税纳税或免征证明，向公安交管部门申领检验标志。</div>
            </li>
            <li>
                <div class="head">上线年检</div>
                <div class="details"><span>定义：</span>上线检测，又叫机动车安全技术检测，是指对汽车进行各项指标的检测，检验合格方可发放年检标志。汽车过了6年免检期，就需要进行上线检测。验车一般包括：尾气检测、车身外观检验、车身底盘检验、速度检验、轮重制动检验、前照灯光强检验、汽车侧滑偏移量检验等等。</div>
            </li>
        </ul>
        
    </app-layout>
</template>
<script>
    export default {
        data() {
            return{
                carId:'',
                content:'',
                annualStopDate:'',
                mustBeItemList:[],
                feasibiityItemList:[],
                needCheckItemList:[]
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

                let res = await this.$post('/CRM/appgarage/getAnnualDetail.json',d);
                if(res.errcode==0){
                    this.content=res.content;
                    let arr=this.content.annualStopDate.split('-')
                    this.annualStopDate=arr[0]+'年'+arr[1]+'月'+arr[2]+'日'
                }
            }
            
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    .checkRemind-edit{
        color: #fff;
        font-size: .15rem;
        position: fixed;
        z-index: 204;
        right: 5%;
        top: 0;
        height: .4rem;
        line-height: .4rem;
    }
    #myCarsCheckRemind{
        .card{
            width: 90%;
            margin: .18rem 5% 0;
            .head{
                height: .4rem;
                background: orangered;
                color: #fff;
                line-height: .4rem;
                text-align: center;
                font-size: .12rem;
                border-radius: 6px 6px 0 0;
            }
            .content{
                border-radius: 0 0 6px 6px;
                .time-box{
                    padding:.03rem 0;
                    border-bottom: 1px dashed #d2d2d2;
                    .time{
                        text-align: center;
                        color: #88888d;
                        font-size: .12;
                        span{
                            color: #c9c9c9;
                            font-size: .6rem;
                        }
                    }
                    .type{
                        @include box;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: .1rem;
                        img{
                            height: .15rem;
                        }
                        span{
                            color: #22222e;
                            font-size: .12rem;
                            margin-left:.05rem
                        }
                    }
                }
                .explain{
                    color: #88888d;
                    font-size: .12rem;
                    padding:.1rem .19rem;
                    line-height: .18rem
                }
            }
        }
        .recommend{
            height: .52rem;
            color: #88888d;
            font-size: .12rem;
            text-align: center;
            div{
                position: relative;
                display: inline-block;
                margin:.1rem .1rem;
                height: .32rem;
                line-height: .32rem;
                &::before{
                    content: '';
                    position: absolute;
                    width: .49rem;
                    height: 1px;
                    background: #88888d;
                    left: -.59rem;
                    top: .15rem;
                }
                &::after{
                    content: '';
                    position: absolute;
                    width: .49rem;
                    height: 1px;
                    background: #88888d;
                    right: -.59rem;
                    top: .15rem;
                }
            }
            
        }
        .list-box{
            padding: 0 5%;
            background: #fff;
            li{
                padding-top: .15rem;
                
                &:last-child{
                    border:0;
                    padding-bottom: .15rem;
                }
                .head{
                    color: #22222e;
                    margin-bottom: .15rem;
                    font-size: .15rem;
                    @include box;
                    align-items: center;
                    span{
                        font-size: .12rem;
                        color: #fff;
                        height: .15rem;
                        line-height: .15rem;
                        padding: 0 .07rem;
                        border-radius: .15rem;
                        margin-left: .08rem;
                    }
                }
                .details{
                    color: #88888d;
                    font-size: .12rem;
                    line-height: .2rem;
                    span{
                        color: #22222e;
                    }
                } 
                
            }
            li.title{
                font-size: .15rem;
                color: #22222e;
                padding-bottom: .15rem;
                border-bottom: 1px solid #f2f2f2;
            }
        }
    }
</style>
