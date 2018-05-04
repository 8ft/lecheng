<template>
    <app-layout id="manualDetail">
        <router-link :to="'/manual/chooseCars/'+carId" >
            <div class="car-detail">
                <img :src="carInfo.brandImgUrl" class="logo"/>
                <div class="info">
                    <p>{{carInfo.licensePlate}}</p>
                    <div>{{carInfo.brandName}}  {{carInfo.cartypeName}}</div>
                </div>
                <div class="right">
                    <span class="arrow"></span>
                </div> 
            </div>
        </router-link>
        
        <div class="car-mileage" v-show="intervalKilometer!=''">
            <div class="top">
                <span>当前里程</span>
                <div class="edit" @click="showPopup=true">
                    <span>{{kilometer}}km</span>
                    <img src="~assets/img/icon-edit.png" />
                </div>
            </div>
            <div class="center">
                <img src="~assets/img/manual/pic_mileage@2x.png" alt="">
                <div class="mileage-div">
                    <swiper  class="" ref="mySwiper" style="height:100%" :options="swiperOption" :not-next-tick="notNextTick">
                        <swiper-slide v-for="(item,index) in list" >{{item}}</swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
        <template v-if="intervalKilometer!=''">
            <div class="dashed"></div>
            <ul class="list-box" >
                <li class="title" style="color:#e84816">必须保养的项目（{{mustBeItemList.length}}项）</li>
                <li v-for="(item,index) in mustBeItemList" @click="goDetails(item.url)">
                    <img :src="item.itemIcon"/>
                    <span>{{item.itemName}}</span>
                    <div class="right">
                        <span>查看详情</span>
                        <span class="arrow"></span>
                    </div>       
                </li>
            </ul>
            
            <ul class="list-box">
                <li class="title">可做的养护项目（{{feasibiityItemList.length}}项）</li>
                <li v-for="(item,index) in feasibiityItemList" @click="goDetails(item.url)">
                    <img :src="item.itemIcon"/>
                    <span>{{item.itemName}}</span>
                    <div class="right">
                        <span>查看详情</span>
                        <span class="arrow"></span>
                    </div>
                </li>
            </ul>
            <ul class="list-box">
                <li class="title">需要进行检查的项目（{{needCheckItemList.length}}项）</li>
                <li v-for="(item,index) in needCheckItemList" @click="goDetails(item.url)">
                    <img :src="item.itemIcon"/>
                    <span>{{item.itemName}}</span>
                    <div class="right">
                        <span>查看详情</span>
                        <span class="arrow"></span>
                    </div>
                </li>
            </ul>
        </template>
        <div  class="mileage-empty" v-else>
            <img src="~assets/img/error-empty.png">
            <p>暂无所选车辆保养手册</p>
        </div>
        
        <div slot="footer" class="nextOne">
            <router-link to="/maintenance">
                <div class="btn" >立即预约享优惠</div>
            </router-link>
        </div>
        
        <div class="manual-bg" slot="aside" v-show="showPopup">
            <div class="manual-popup">
                <div class="close" @click="showPopup=false">×</div>
                <div class="title">设置公里数</div>
                <input type="text" v-model="inputNum" @keyup="keyUpnum(inputNum)"/>
                <div class="btn" @click="saveKilometer">保 存</div>
            </div>
        </div>
    </app-layout>
</template>
<script>
    export default {
        
        data(){
            return{
                carId:'',
                list:[],
                kilometer:'',
                intervalKilometer:'',
                showPopup:false,
                mustBeItemList:[],
                feasibiityItemList:[],
                needCheckItemList:[],
                carInfo:'',
                inputNum:'',
                isMount:true,
                notNextTick: true,
                swiperOption: {
                    slidesPerView : 3,
                    centeredSlides : true,
                    watchSlidesProgress:true,
                    onTransitionEnd:(swiper) =>{
                        this.kilometer=(swiper.realIndex+1)*this.intervalKilometer;
                        this.getData(this.kilometer); 
                    },
                    
                }
            }
        },
        beforeMount(){
            this.carId=this.$cache.urlquery.carId;
            this.getData(this.kilometer); 
        },
        beforeRouteEnter(to,from,next){
            
            if(/chooseCars/.test(from.path)){
                next(vm=>{
                    vm.carId=vm.$cache.urlquery.carId;
                    vm.kilometer=vm.intervalKilometer
                    vm.getData(vm.kilometer); 
                    vm.swiper.slideTo(0, 300, false)
                    
                })
            }else{
                
                
                next()
            } 
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            }

        },
        activated(){
            
        },
        methods:{
            keyUpnum(num){
                if(num){
                    this.inputNum=num.replace(/\D/g,'')
                }

            },
            async getData (num) {
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        carId:this.carId,
                        kilometer:num
                    }
                };

                let res = await this.$post('/CRM/appmaintenance/getMaintenanceInfo.json',d);
                if(res.errcode==0){
                    this.carInfo=res.content.carInfo
                    this.mustBeItemList=res.content.mustBeItemList;
                    this.feasibiityItemList=res.content.feasibiityItemList;
                    this.needCheckItemList=res.content.needCheckItemList;
                    this.showPopup=false;
                    this.inputNum='',
                    this.intervalKilometer=res.content.intervalKilometer;
                    this.Kilometer=res.content.Kilometer;

                    if(!this.isMount) return
                    this.kilometer=this.intervalKilometer
                    for(let i=1;i<=60;i++){
                        this.list.push(this.intervalKilometer*i)
                    }
                    this.isMount=false
                }
            },
            saveKilometer(){
                this.kilometer=this.inputNum
                this.getData(this.kilometer);

                let num=Math.ceil(this.kilometer/5000);
                this.swiper.slideTo(num-1, 300, false)
            },
            
            goDetails(url){
                let search=url.split('?#')[1]
                this.$router.push(search)
          
            }

        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #manualDetail{   
        .swiper-slide{
            line-height: .6rem;
            text-align: center;
        }
        .swiper-slide-prev{
            color:#88888d !important;
            & + .swiper-slide{
                color:#88888d
            }
        }
        .swiper-slide-active{
            color: orangered !important
        }
        .swiper-slide-next{
            color: #f29600 !important;
            &  + .swiper-slide{
                color: #f29600
            }
        }
        .manual-bg{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, .5);
            z-index: 300;
            .manual-popup{
                width: 84%;
                height: 1.94rem;
                background: #fff;
                border-radius: 6px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                .close{
                    position: absolute;
                    font-size: .2rem;
                    color: #c9c9c9;
                    right: 0;
                    width: .20rem;
                    height: .20rem;
                    text-align: center;
                    line-height: .20rem;
                    padding: .1rem;
                }
                .title{
                    color: #22222d;
                    font-size: .18rem;
                    text-align: center;
                    margin-top: .25rem;
                }
                input{
                    height: .4rem;
                    width: 68%;
                    margin: .22rem auto;
                    margin-left: 16%;
                    border: 1px solid #dfdfdf;
                    box-sizing: border-box;
                    border-radius: 4px;
                    text-align: center;
                }
                .btn{
                    height: .4rem;
                    width: 1.3rem;
                    background: orangered;
                    color: #fff;
                    font-size: .15rem;
                    text-align: center;
                    margin: auto;
                    line-height: .4rem;
                    border-radius: .4rem;
                }
            }
        }
        .car-detail{
            height: .8rem;
            background: #fff;
            padding: 0 5%;
            @include box;
            align-items: center;
            margin-bottom: .05rem;
            .logo{
                width: .52rem;
                height: .52rem;
                margin-right: .15rem
            }
            .info{
                @include flex;
                margin-right: .1rem;
                width: 2.4rem;
                p{
                    color: #231815;
                    font-size: .15rem;
                    margin-bottom: .08rem
                }
                div{
                    font-size: .12rem;
                    color: #86878c;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
            .right{
                text-align: right;
                color: #88888d;
                font-size: .12rem;
                .arrow{
                    position:relative;
                    margin-right: .06rem;
                    margin-left: .1rem;
                    top: .01rem;
                    &::after{position:absolute;content:'';width:0;height:0;top: 0;right:-5px;border:6px solid transparent;border-right:0;border-left-color:#fff;}
                    &::before{position:absolute;content:'';width:0;height:0;top: 0;border:6px solid transparent;border-right:0;border-left-color:#999;}
                }
            }
            
        }
        .car-mileage{
            padding: .12rem 0;
            background: #fff;
            .top{
                @include box;
                justify-content: space-between;
                align-items: center;
                padding: 0 5%;
                >span{
                    font-size: .15rem;
                    color: #22222d
                }
                .edit{
                    color: orangered;
                    font-size: .13rem;
                    img{
                        width: .15rem;
                        height: .15rem;
                        vertical-align: top;
                        margin-left: .03rem
                    }
                }
            }
            .center{
                margin-top: .18rem;
                
                img{
                    width: 100%;
                }
                .mileage-div{
                    overflow: hidden;
                    height: .4rem;
                    margin-top: -.2rem;
                    font-size: .12rem;
                }
            }
        }
        .mileage-empty{
            text-align: center;
            img{
                width: .8rem;
                margin: .65rem auto .15rem;
            }
            p{
                font-size: .15rem;
                color: #c9c9c9
            }
        }
        .list-box{
            margin-bottom:.05rem;
            li{
                background: #fff;
                height: .45rem;
                border-bottom: 1px solid #f2f2f2;
                line-height: .45rem;
                padding: 0 5%;
                font-size: .12rem;
                @include box;
                align-items: center;
                
                .right{
                    flex: 1;
                    text-align: right;
                    color: #88888d;
                    font-size: .12rem;
                    .arrow{
                        position:relative;
                        margin-right: .06rem;
                        margin-left: .1rem;
                        top: .02rem;
                        &::after{position:absolute;content:'';width:0;height:0;top: 0;right:-5px;border:6px solid transparent;border-right:0;border-left-color:#fff;}
                        &::before{position:absolute;content:'';width:0;height:0;top: 0;border:6px solid transparent;border-right:0;border-left-color:#999;}
                    }
                    > span{
                        color: #c9c9c9
                    }
                }
                > img{
                    height: .25rem;
                    width: .25rem;
                    margin-right: .15rem;
                }
                > span{
                    color: #888d8d
                }
            }
            li.title{
                font-size: .15rem;
                color: #22222e
            }
        }
        .dashed{
            padding: 0 5%;
            height: 1px;
            background: #fff;
            position: relative;
            &::before{
                content: '';
                width: 90%;
                border-top: 1px dashed #d2d2d4;
                position: absolute;
                left: 5%;
            }
        }
    }
</style>

