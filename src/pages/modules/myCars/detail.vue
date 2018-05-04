<template>
    <app-layout id="myCarsDetail">
        <div class="detail-box" :style="serviceCust ? '':'height:100%'">
            <div class="detail-top">
                <div class="card">
                    <img :src="carInfo.brandImgUrl" class="logo"/>
                    <div class="info">
                        <p>{{carInfo.licenseplate}}</p>
                        <div>{{carInfo.brandName}} {{carInfo.modelName}}</div>
                    </div>
                    <div class="edit" @click="editCar">
                        <img src="~assets/img/icon-edit.png"/>
                        <div>编辑</div>
                    </div>
                </div>
                <ul class="func">
                    <router-link tag="li" :to="'/myCars/repair/'+carId">
                        <img src="~assets/img/myCars/icon_mycar_repair@2x.png" />
                        <p>维修履历</p>
                    </router-link>
                    <router-link tag="li" :to="'/myCars/safe/'+carId">
                        <img src="~assets/img/myCars/icon_mycar_insurance@2x.png" />
                        <p>保险记录</p>
                    </router-link>
                    <li @click="goManual">
                        <img src="~assets/img/myCars/icon_mycar_note@2x.png" />
                        <p>保养手册</p>
                    </li>
                    <router-link tag="li" to="/carWiki">
                        <img src="~assets/img/myCars/icon_mycar_knowledge@2x.png" />
                        <p>用车百科</p>
                    </router-link>
                </ul>
            </div>
            <ul class="detail-cen">
                <li>
                    <div class="head" @click="goPeccancy">
                        <img src="~assets/img/myCars/icon_mycar_steward_traffic@2x.png" />
                        <span>违章提醒</span>
                        <div class="right" >
                            <span v-show="violation.queryViolationDate">查询更新时间：{{violation.queryViolationDate}}</span>
                            <span class="arrow"></span>
                        </div>
                    </div>
                    <div class="data" v-if="violation.queryViolationDate">
                        <li>
                            <p>未处理</p>
                            <div>{{violation.number}}</div>
                        </li>
                        <li>
                            <p>扣分</p>
                            <div>{{violation.fen}}</div>
                        </li>
                        <li>
                            <p>罚款</p>
                            <div>{{violation.money}}</div>
                        </li>
                    </div>
                    <div class="nodata" v-else @click="goPeccancy">快速查询全国违章信息</div>
                </li>   
                <li>
                    <div class="head" @click="goSetmaintain">
                        <img src="~assets/img/myCars/icon_mycar_steward_service@2x.png" />
                        <span>{{maintain.name}}</span>
                        <div class="right">
                            <span v-show="maintain.maintainKilometer">下次保养公里数{{maintain.maintainKilometer}}KM</span>
                            <img src="~assets/img/icon-edit.png"/>
                        </div>
                    </div>       

                    <div class="data" @click="goMaintain" v-if="maintain.maintainDayNum!==''">
                        <div class="surplus">
                            <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                            <span>距离下一次保养还有</span>
                        </div>
                        <div class="date"><span>{{maintain.maintainDayNum}}</span>天</div>
                    </div>
                    <div class="nodata" v-else @click="goSetmaintain">下次保养早知道</div>
                    
                </li> 
                <li>
                    <div class="head" @click="goSetsafe">
                        <img src="~assets/img/myCars/icon_mycar_steward_insurance@2x.png" />
                        <span>{{insurance.name}}</span>
                        <div class="right">
                            <img src="~assets/img/icon-edit.png"/>
                        </div>
                    </div>
                    <div class="data" @click="goSafe" v-if="insurance.insuranceDayNum!==''">
                        <div class="surplus">
                            <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                            <span>距离下一次续保还有</span>
                        </div>
                        <div class="date"><span>{{insurance.insuranceDayNum}}</span>天</div>
                    </div>
                    <div class="nodata" @click="goSetsafe" v-else>一键设置，永不脱保</div>
                </li> 
                <li>
                    <div class="head"  @click="goSetcheck">
                        <img src="~assets/img/myCars/icon_mycar_steward_check@2x.png" />
                        <span>{{annual.name}}</span>
                        <div class="right">
                            <img src="~assets/img/icon-edit.png"/>
                        </div>
                    </div>      
                    <div class="data" @click="goCheck" v-if='annual.annualStopDayNum!==""'>
                        <div class="surplus">
                            <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                            <span>距离下一次年检还有</span>
                        </div>
                        <div class="date"><span>{{annual.annualStopDayNum}}</span>天</div>
                    </div>
                    <div class="nodata" @click="goSetcheck" v-else>轻松设置，年检不再错过</div>
                </li>      
            </ul>
        </div>
        <div class="detail-fixed" v-if="serviceCust">
            <div class="nickname">
                <div class="head" @click="goServer" :style="serviceCust.scImgUrl ? {'background-image':'url('+serviceCust.scImgUrl+')'} : {'background-image':'url('+default_server+')'}"></div>
            </div>
            
            <div class="name">
                <p>{{serviceCust.scName}}</p>
                <div>{{serviceCust.scService4SName}}</div>
            </div>
            <!-- <a :href="'msg:'+serviceCust.scMobilePhone">
            <img src="~assets/img/myCars/message.png" class="phone"/>
            </a> -->
            <a :href="'tel:'+serviceCust.scMobilePhone">
            <img src="~assets/img/phone.png" class="phone"/>
            </a>
        </div>
    </app-layout>
</template>
<script>
    export default {
      data() {
        return {
            carId:'',
            carInfo:'',
            violation:'',
            maintain:'',
            insurance:'',
            annual:'',
            serviceCust:'',
            default_server:require('assets/img/default_user.png')
        }
      },
      
      activated(){
          this.carId=this.$route.params.carId
          this.getData();
      },
      methods: {
        async getData () {
            let d={
                content: {
                    memberId: this.$cache.user.memberId,
                    carId:this.carId
                }
            };

            let res = await this.$post('/CRM/appgarage/getGarageList.json',d);
            if(res.errcode==0){
               this.carInfo=res.content.carInfo;
               this.violation=res.content.violation;
               this.maintain=res.content.maintain;
               this.insurance=res.content.insurance;
               this.annual=res.content.annual;
               this.serviceCust=res.content.serviceCust;
            }
        },
        goServer(){
            this.$cache.car.carId=this.carId;
            this.$cache.fourS={
                id:this.carInfo['4sStoreId'],
                name:this.carInfo['4sStoreName']
            };
            this.$cache.server={
                id:this.serviceCust.scId,
                name:this.serviceCust.scName
            };

            this.$router.push('/server/detail');
        },
        goPeccancy(){
            
            let content={},
                other={},
                data=this.violation.carInf;

                content.licenseplate=data.licenseplate;
                content.licenseplatePrefix=data.licenseplatePrefix;
                content.ecode=data.engineno||'';
                content.vcode=(/systemdefault/.test(data.carframeno)||!data.carframeno)?'':data.carframeno;
                
                content.city_name=data.cityName;
                content.province=data.provinceCode;

                content.brandId=data.brandId||'';
                content.seriesId=data.seriesId||'';
                content.modelId=data.modelId||'';

                other.iCar=data.iCar;
                other.img=data.carImgUrl||'';
                other.seriesName=data.seriesName||'';
                other.modelName=data.modelName||'';

                this.$cache.peccancy={content:content,other:other};
                this.$router.push('/peccancy/add');

        },
        goManual(){
            this.$cache.urlquery={}
            this.$cache.urlquery.carId=this.carId;
            this.$router.push({path:'/manual'})
        },
        goSetmaintain(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.maintain));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/setMaintainRemind/'+this.carId,params:{carId:this.carId}})
        },
        goMaintain(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.maintain));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/maintainRemind/'+this.carId,params:{carId:this.carId}})
        },
        goSetsafe(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.insurance));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/setSafeRemind/'+this.carId,params:{carId:this.carId}})
        },
        goSafe(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.insurance));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/safeRemind/'+this.carId,params:{carId:this.carId}})
        },
        goSetcheck(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.annual));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/setCheckRemind/'+this.carId,params:{carId:this.carId}})
        },
        goCheck(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.annual));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/checkRemind/'+this.carId,params:{carId:this.carId}})
        },
        editCar(){
            let carInfo=this.carInfo;
            carInfo.carId=this.carId;

            let serviceCust=this.serviceCust;
            if(serviceCust){
                this.$cache.server={
                    id:serviceCust.scId,
                    name:serviceCust.scName
                };
            }

            this.$cache.fourS={
                id:carInfo['4sStoreId'],
                name:carInfo['4sStoreName']
            }

            let bid=carInfo.brandId;
            if(bid){
                this.$cache.brand={
                    bid:bid,
                    sid:carInfo.seriesId||'',
                    mid:carInfo.modelId||'',
                    name:carInfo.brandName+carInfo.seriesName+carInfo.modelName
                }
            }

            this.$cache.car=carInfo;
            this.$router.push({path: '/bindCar'})
        }
      }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #myCarsDetail{
        .detail-box{
            height: calc(100% - .55rem);
            overflow: auto;
            padding-bottom: .31rem;
            box-sizing: border-box
        }
        .detail-top{
            height: 1.655rem;
            padding: .2rem 5% 0;
            background: $mainColor;
            .card{
                background: #fff;
                width: 100%;
                height: .855rem;
                margin: 0;
                box-sizing: border-box;
                @include box;
                align-items: center;
                .logo{
                    width: .48rem;
                    height: .48rem;
                    margin: 0 .15rem;
                }
                .info{
                    @include flex;
                    margin-right: .1rem;
                    p{
                        color: #231815;
                        font-size: .18rem
                    }
                    div{
                        font-size: .12rem;
                        color: #86878c;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }
                .edit{
                    height: .25rem;
                    width: .53rem;
                    box-sizing: border-box;
                    border-left: 1px solid #dfdfdf;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    img{
                        width: .15rem;
                        height: .15rem;
                    }
                    div{
                        font-size: .12rem;
                        color: #86878c;
                        margin-top: .05rem;
                    }
                }
            }
            .func{
                @include box;
                margin-top: .18rem;
                justify-content: space-between;
                padding: 0 .04rem;
                li{
                    color: #fff;
                    text-align: center;
                    font-size: .12rem;
                    img{
                        width: .3rem;
                        height: .3rem;
                    }
                }
            }
        }
        .detail-cen{
            padding:0 5%;
            > li{
                background: #fff;
                border-radius: 4px;
                margin-top: .15rem;
                .head{
                    @include box;
                    height: .4rem;
                    padding-right: .15rem;
                    align-items: center;
                    border-bottom: 1px dashed #d2d2d4;
                    > img{
                    width: .2rem;
                    height: .2rem; 
                    margin: 0 .1rem;
                    }
                    > span{
                        font-size: .15rem;
                        color: #22222d;
                    }
                    .right{
                        flex: 1;
                        text-align: right;
                        color: #88888d;
                        font-size: .12rem;
                        .arrow{
                            position:relative;
                            margin-right: .06rem;
                            margin-left: .1rem;
                            top: .01rem;
                            &::after{position:absolute;content:'';width:0;height:0;top: 0;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                            &::before{position:absolute;content:'';width:0;height:0;top: 0;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                        }
                        img{
                            width: .15rem;
                            height: .15rem;
                            vertical-align: top;
                            margin-left: .1rem;
                        }
                    }
                }
                .nodata{
                    padding: .1rem .19rem;
                    font-size: .15rem;
                    color: #88888d;
                    text-align: left
                }
                .data{
                   padding: .17rem 0;
                   @include box; 
                   li{
                       @include flex;
                       text-align: center;
                       border-right: 1px solid #dfdfdf;
                       &:last-child{
                           border-right: 0
                       }
                       p{
                           color: #88888d;
                           font-size: .15rem;
                       }
                       div{
                           color: #e84816;
                           font-size: .18rem;
                           margin-top: .05rem
                       }
                   }
                   .surplus{
                       display: flex;
                       align-items: center;
                       align-self: flex-start;
                       img{
                           width: .13rem;
                           margin-left: .19rem;
                           margin-right: .08rem
                       }
                       span{
                           color: #88888d;
                           font-size: .15rem
                       }
                   }
                   .date{
                        margin-right: .15rem;
                        color: #88888d;
                        text-align: right;
                        flex: 1;
                        position: relative;
                        top: -.08rem;
                        height: .36rem;
                        span{
                            font-size: .45rem;
                            color: #c9c9c9;
                            margin-right: .1rem
                        }
                   }
                }
            }
            
            
        }
        .detail-fixed{
            height: .55rem;
            background: #fff;
            @include box;
            align-items: center;
            .nickname{
                background: url("~assets/img/myCars/icon_muycar_guwen@2x.png") no-repeat;
                background-size: 100% 100%;
                height: .55rem;
                width: 1.25rem;
                .head{
                    height: .4rem;
                    width: .4rem;
                    border-radius: 50%;
                    margin-top: .075rem;
                    float: right;
                    margin-right: .08rem;
                    background-size: cover;
                    background-position-y: 50%;
                }
            }
            .name{
                margin: 0 .16rem;
                flex: 1;
                p{
                    color: #22222d;
                    font-size: .15rem
                }
                div{
                    font-size: .12rem;
                    color: #88888d;
                    margin-top: .02rem;
                }
            }
            .phone{
                height: .3rem;
                width: .3rem;
                border-radius: 50%;
                margin-right: .2rem;
            }
        }
    }
</style>





