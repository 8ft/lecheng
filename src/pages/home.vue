<template>
  <app-layout id="home">

      <div slot="header" class="area-weather">
        <router-link class="area" to="/weather/area">{{city}}</router-link>

        <router-link to="/weather">
          <swiper class='weather' :options="wetherSwiper" ref="wether">
            <swiper-slide v-if="weather">
                <img :src="weather.curWeatherPic">
                {{weather.nightTemp}}°C-{{weather.dayTemp}}°C
            </swiper-slide>
            <swiper-slide v-if="weather"> 
                {{weather.washCarTitle}}洗车
            </swiper-slide>
          </swiper>
        </router-link>

      </div>

      <swiper class="my-cars" :options="carSwiper">

        <swiper-slide class="card" v-for="(item,index) in carList" >
          <img :src="item.carImgUrl" class="logo" @click="goDetail(item.carId)"/>
          <div class="info" @click="goDetail(item.carId)">
              <p>{{item.licenseplate}}</p>
              <div>{{item.modelName}}</div>
          </div>
          
          <div class="edit" v-if="item.serviceCustId" @click="goServer(item,'detail')">
              <img src="~assets/img/home/titile_home_car_advisor@2x.png"/>
              <div class="head-box">
                <div class="head" :style="item.scImgUrl ? {'background-image':'url('+item.scImgUrl+')'}:{'background-image':'url('+default_server+')'}"></div>
                <span>{{item.serviceCustName}}</span>
              </div>
          </div>
          
          <div class="edit" v-else @click="goServer(item,'list?action=update')">
              <img src="~assets/img/home/titile_home_car_advisor@2x.png"/>
              <div class="head-box">
                <img src="~assets/img/home/icon_home_car_addadvisor@2x.png">
                <span>添加顾问</span>
              </div>
          </div>
        </swiper-slide>

        <swiper-slide class="card" >
            <router-link class="add-box"  to="/bindCar">
                <img src='~assets/img/home/icon_home_car_addcar@2x.png' class="add"/>
                <span>添加爱车</span>
            </router-link>
        </swiper-slide>

        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>

      <ul class="main-fn" style="margin:0">
        <li><router-link to="/maintenance"><img src="~assets/img/home/mainFn_maintenance.png?t=1"><h2>维保预约</h2></router-link></li>
        <li @click="$utils.downLoad($messagebox,'请下载APP', '微信版暂无此功能')"><img src="~assets/img/home/mainFn_clean.png?t=1"><h2>去洗车</h2></li>
        <li><router-link to="/beauty"><img src="~assets/img/home/mainFn_beauty_hot.png?t=1"><h2>爱美容</h2></router-link></li>
        <li><router-link to="/peccancy"><img src="~assets/img/home/mainFn_peccancy.png?t=1"><h2>违章查询</h2></router-link></li>
        <!-- <li><router-link :to="'./sos?actUrl='+encodeURIComponent('/CRM/static/pages/others/activity/sos/index.html')"><img src="~assets/img/home/mainFn_sos.png?t=1"><h2>一键救援</h2></router-link></li> -->
      </ul>

      <div class="module-box">
          <ul class="clearfix">
            <!-- <li>
              <img src="~assets/img/home/module_icon1.png">
              <div>每日签到</div>
            </li> -->
            <router-link tag="li" to="/coupon">
              <img src="~assets/img/home/module_icon2.png">
              <div>领券中心</div>
            </router-link>
            <!-- <li>
              <img src="~assets/img/home/module_icon3.png">
              <div>加油充值</div>
            </li> -->
            <li>
              <a href="http://www.yixinusedcar.com:6061/Home/buycarlist?isapp=1">
                <img src="~assets/img/home/module_icon5.png">
                <div>二手好车</div>
              </a>
            </li>
            <li @click="goManual">
              <img src="~assets/img/home/module_icon6.png">
              <div>保养手册</div>
            </li>
            <router-link tag="li" to="/carWiki">
              <img src="~assets/img/home/module_icon7.png">
              <div>用车百科</div>
            </router-link>
            <li>
              <a href="https://www.che300.com/yzlc">
                <img src="~assets/img/home/module_icon4.png">
                <div>爱车评估</div>
              </a>
            </li>
            <li>
              <a href="http://common.diditaxi.com.cn/general/webEntry?maptype=baidu&channel=1301">
                <img src="~assets/img/home/module_icon10.png">
                <div>滴滴打车</div>
              </a>
            </li>
            <li>
              <a href="https://h5.edaijia.cn/app/index.html?from=01051443">
                <img src="~assets/img/home/module_icon11.png">
                <div>代驾服务</div>
              </a>
            </li>
            <router-link tag="li" :to="'/helpCenter?actUrl='+encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/forApp/help_center.html')">
              <img src="~assets/img/home/module_icon8.png">
              <div>客服中心</div>
              
            </router-link>
          </ul>

          <!-- <swiper-slide class="module-ul">
            <li>
              <img src="~assets/img/home/module_icon9.png">
              <div>出行查询</div>
            </li>
            
          </swiper-slide> -->
      </div>
      

  </app-layout>
</template>
<script>
  export default {
    data(){
      return{
        default_server:require('assets/img/default_server.png'),
        city:'厦门市',
        weather:'',
        carList:[],

        carSwiper: {
          slidesPerView:1,
          spaceBetween:8,
          pagination: '.swiper-pagination'
        },

        wetherSwiper: {
          notNextTick: true,
          direction: 'vertical',
          slidesPerView: 1,
          autoplay: 1,
          speed: 2000,
          loop: true
        }
      }
    },
    computed: {
        swiper() {
            return this.$refs.wether.swiper;
        }
    },
    mounted(){
      eventBus.$on('cityChanged',(city)=> {
        this.city=city;
        this.$cache.city=city;
        this.getWeather();
      });

      eventBus.$on('userInfoUpdated',()=> {
        this.getData();
      });

      this.getCity();
      this.getData();
    },
    activated(){
      if (this.swiper) { this.swiper.init(); }
    },
    methods:{
      getCity(){
        let vm=this,
          myLocation=vm.$cache.location,
          myGeo = new BMap.Geocoder(),
          point = new BMap.Point(myLocation.lng,myLocation.lat);

        myGeo.getLocation(point, function(rs){
            let city = rs.addressComponents.city||'厦门市';
            vm.city=city;
            vm.$cache.city=city;
            vm.getWeather();
        });
      },
      async getData () {
        let data={content: {memberId: this.$cache.user.memberId}},
          res = await this.$post('/CRM/appmembermgcust/queryCarList.json',data);

        if(res.errcode==0){
            this.carList=res.content.carList;
        }
      },
      async getWeather(){
        let data={content: {city: this.city}},
          res = await this.$post('/CRM/appothers/carToRemindWeather.json',data);

        if(res.errcode==0){
          let con=res.content,
            wether={
            arr:[con.f1,con.f2,con.f3,con.f4,con.f5,con.f6,con.f7],
            city:con.city
          }
          this.weather=con.f1;
          this.$cache.weather=wether;

          if (this.swiper) { this.swiper.init(); }
        }
      },
      goDetail(carId){
        this.$router.push({path: '/myCars/detail/'+carId,params:{carId:carId}})
      },
      goServer(car,page){
        this.$cache.car=car;
        this.$cache.fourS={
          id:car['4sStoreId'],
          name:car['4sStoreName']
        };
        this.$cache.server={
          id:car.serviceCustId,
          name:car.serviceCustName
        };

        let path='/server/'+page;
        this.$router.push(path);
      },
      goManual(){
        if(this.carList.length>0){
          this.$cache.urlquery={};
          this.$cache.urlquery.carId=this.carList[0].carId;
          this.$router.push({path:'/manual'});
        }else{
          this.$router.push({path:'/bindCar'});
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "~assets/css/var.scss";
  #home{
    .area{position: absolute;top:0;left:0;width:.7rem;line-height:.4rem;text-align: left;font-size: .12rem;z-index: 204;color:#fff;text-indent:.2rem;
      &::before{content: '';width: 0;height: 0;border-right: .04rem solid transparent;border-left: .04rem solid transparent;border-top: .05rem solid #fff;position: absolute;right:0;top: 50%;margin-top:-.02rem;}}

    .weather{position: absolute;top:.1rem;right:.2rem;height:.2rem;text-align: right;font-size: .1rem;z-index: 204;color:#fff;
      .swiper-slide{line-height: .2rem;
        img{width: .2rem;height:.2rem;vertical-align:text-bottom;}}}

    .my-cars{
      background:$mainColor;text-align: center;padding:.05rem .2rem;
      .card{@include box;background: #fff;height: .75rem;margin: 0;box-sizing: border-box;align-items: center;text-align: left;opacity: .8;transition:opacity .3s ease-out;
        .logo{width: .48rem;height: .48rem;margin: 0 .15rem;}

        .add-box{text-align:center;display:block;width:100%;height:100%;padding:.25rem 0;box-sizing:border-box;
          img{width: .25rem;height:.25rem;vertical-align: top;}
          span{color: $mainColor;font-size: .15rem;margin-left: .08rem;font-weight: 700;line-height: .25rem;}}

        .info{@include flex;margin-right: .1rem;white-space: nowrap;overflow: hidden;
            p{color: #231815;font-size: .18rem}
            div{font-size: .12rem;color: #86878c;text-overflow: ellipsis;overflow: hidden;margin-top: .03rem;}}
        
        .edit{height: .43rem;width: .98rem;padding-left: .15rem;box-sizing: border-box;border-left: 1px solid #dfdfdf;display: flex;flex-direction: column;justify-content: center;
            img{align-self: flex-start;width: .65rem}
            .head-box{font-size: 0;color: #86878c;margin-top: .04rem;position: relative;top: .04rem;
                img{width: .2rem;height: .2rem;border-radius: 50%;float: left;}
                .head{width: .2rem;height: .2rem;border-radius: 50%;float: left;background-position: center;background-size: cover;}
                span{color: #22222d;font-size: .1rem;line-height: .2rem;margin-left: .05rem;}}}
      }

      .swiper-slide-active{opacity: 1;}
      .swiper-pagination{position: relative;bottom:auto;left:auto;border: 1px solid #fff;display: inline-block;width:auto;margin: .08rem auto;border-radius: 99px;line-height: 3px;}
      .swiper-pagination-bullet{border-radius: 0;margin:0;height:3px;vertical-align: bottom;background:#fff;opacity: 1;}
      .swiper-pagination-bullet-active{border-radius:100%;background:$mainColor!important;}
    }

    .module-box{background: #fff;margin-top: .05rem;
        li{text-align: center;font-size: .12rem;line-height:.15rem;color: #000;width:25%;height: .65rem;border-right:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;box-sizing: border-box;background: #fff;float:left;
          img{height: .25rem;margin: .08rem auto .05rem;}
          &:nth-of-type(4n){border-right:0;}}
    }

  }
</style>
