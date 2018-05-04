<template>
    <app-layout id="myCarsSafeRemind">
        <router-link slot="aside" :to="'/myCars/setSafeRemind/'+carId">
            <div class="safeRemind-edit">编辑</div>
        </router-link>
        <div class="card">
            <div class="head">下次保险到期时间为：{{insuranceDate}}，还有：</div>
            <div class="content">
                <div class="time"><span>{{content.insuranceDayNum}}</span> 天</div>
                <div class="explain">
                    <div class="contact">
                        <div class="date">请在到期前30天内，联系保险公司办理！</div>
                        <div class="phone">盈众保险投保热线<span>{{content.insurancePhone}}</span></div>
                    </div>
                    <a :href="'tel:'+content.insurancePhone" class="img-box">
                        <img src="~assets/img/myCars/button_mycar_phone@2x.png"/>
                    </a>
                </div>
            </div>
        </div>
        <div class="recommend"><div>保险套餐说明</div></div>
        <!-- <iframe :src="content.url" width="100%" height="100%"></iframe> -->
        <ul class="list-box">
            <li class="title" >哪种保险套餐更适合我？</li>
            <li>
                <div class="head">大众型套餐<span style="background:#91cd53">适合大众人群</span></div>
                <div class="details">车损、三责50万、盗抢、车上人员1万、玻璃、划痕、自然、不计免赔（车损）、不计免赔（三责）、不计免赔（盗抢）、不计免赔（车上人员）</div>
            </li>
            <li>
                <div class="head">经济型套餐内容<span style="background:#f19601">适合老司机</span></div>
                <div class="details">车损、三责50万、盗抢、车上人员1万、玻璃、划痕、自然、不计免赔（车损）、不计免赔（三责）、不计免赔（盗抢）、不计免赔（车上人员）</div>
            </li>
            <li>
                <div class="head">豪华型套餐内容<span style="background:#e94716">适合新车、豪车</span></div>
                <div class="details">车损、三责50万、盗抢、车上人员1万、玻璃、划痕、自然、不计免赔（车损）、不计免赔（三责）、不计免赔（盗抢）、不计免赔（车上人员）</div>
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
                insuranceDate:''
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

                let res = await this.$post('/CRM/appgarage/getInsuranceDetail.json',d);
                if(res.errcode==0){
                    this.content=res.content;

                    let arr=this.content.insuranceDate.split('-');
                    this.insuranceDate=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    .safeRemind-edit{
        color: #fff;
        font-size: .15rem;
        position: fixed;
        z-index: 204;
        right: 5%;
        top: 0;
        height: .4rem;
        line-height: .4rem;
    }
    #myCarsSafeRemind{
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
                .time{
                    text-align: center;
                    color: #88888d;
                    font-size: .12;
                    padding:.05rem 0;
                    border-bottom: 1px dashed #d2d2d2;
                    span{
                        color: #c9c9c9;
                        font-size: .6rem;
                    }
                }
                .explain{
                    color: #88888d;
                    font-size: .12rem;
                    height: .65rem;
                    @include box;
                    align-items: center;
                    .contact{
                        @include flex;
                        padding: 0 .2rem;
                        color: #88888d;
                        @include box;
                        align-items: center;
                        .phone{
                            margin-top: .05rem;
                            color: #23212e;
                            span{
                                color: #ea4913;
                                padding-left:.13rem
                            }
                        }
                    }
                    .img-box{
                        height: .25rem;
                        width: .64rem;
                        border-left: 1px solid #dfdfdf;
                        @include box;
                        justify-content: center;
                        img{
                            width: .21rem;
                            margin: auto
                        }
                    }
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
                padding: .15rem 0;
                border-bottom: 1px solid #f2f2f2;
                &:last-child{
                    border:0
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
                } 
                
            }
            li.title{
                font-size: .15rem;
                color: #22222e
            }
        }
    }
</style>
