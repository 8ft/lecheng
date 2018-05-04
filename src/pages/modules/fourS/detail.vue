<template>
  <app-layout id="storeDetail">
    
    <div class="bannerSwiper">
      <template v-if="pageData['4sImgUrl']">
        <swiper :options="bannerSwiperOption" ref="bannerSwiper">
          <swiper-slide v-for="(img,index) in pageData['4sImgUrl']">
              <img :src="img" :data-src="index>1&&img" :class="index>1&&'swiper-lazy'">
          </swiper-slide>
        </swiper>
        <div class="pagination">{{activeIndex}}/{{pageData['4sImgUrl'].length}}</div>
      </template>
    </div>

    <div class="store">
        <h1>
          {{pageData['4sStoreName']}}
          <div :class="{on:intro}" @click="intro=!intro">简介</div>
        </h1>
        <p class="intro" v-show="intro">{{pageData['4sStoreDescribe']}}</p>
        <div class="brands">
            <img v-for="item in pageData['4SBrandList']" :src="item.brandIcon">
        </div>
        <lc-rate disabled v-model="pageData.compScore"></lc-rate>
        <a :href="'tel:'+pageData['4sStorePhone']"></a>
    </div>

    <router-link class="part addr clearfix" :to="'/map?lat='+pageData['4sStoreDimension']+'&lng='+pageData['4sStoreLongitude']"><p>{{pageData['4sStoreAddr']}}</p><span>{{getDistance(pageData['4sStoreLongitude'],pageData['4sStoreDimension'])}}</span></router-link>

    <div class="part">
        <h1 class="title">车主活动</h1>

        <template v-if="acts.length>0">
            <a :href="item.linkUrl" class="act" v-for="(item,index) in acts" v-show="index<3||showMoreActs">
                <img :src="item.imgUrl">
                <h2>{{item.title}}</h2>
                <label class="red" v-if="item.superscript">{{item.superscript}}</label>
                <label class="orange" v-for="label in item.typeName.split(',')">{{label}}</label>
                <p class="time">{{item.startTime+'至'+item.endTime}}</p>
                <p class="area">{{item.areaName}}</p>
            </a>
            <div v-if="acts.length>3" :class="{more:true,on:showMoreActs}" @click="showMoreActs=!showMoreActs">{{showMoreActs?'收起':'展开'}}</div>
        </template>

        <div style="padding:.2rem 0;text-align:center;font-size:.12rem;color:gray;" v-else>活动正在筹备中，请持续关注我们哦~</div>
        
    </div>

    <div class="part" v-if="mallData.list_car&&mallData.list_car.length>0">
        <h1 class="title">全部车型 <span style="margin-left:.1rem;font-size:.12rem;color:gray;">共{{mallData.list_car.length}}款</span></h1>
        <swiper :options="carSwiperOption" ref="carSwiper" class="cars">
            <swiper-slide v-for="i in Math.ceil(mallData.list_car.length/6)">
                  <router-link :to="'/mall/car/'+item.item_id" v-for="item in mallData.list_car.slice((i-1)*6,6*i)">
                    <img :src="item.img">
                    <p>{{item.cat_name}}</p>
                  </router-link>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>

    <div class="part" v-if="mallData.list_cargoods&&mallData.list_cargoods.body.length>0">
        <h1 class="title">精选车品<router-link v-if="mallData.list_cargoods.body.length>2" :to="'/stores/cargoods/'+subShopId">更多 ></router-link></h1>
    </div>

    <div class="goods-list col2" style="padding:0 .05rem;" v-if="mallData.list_cargoods">
      <router-link class="li" v-for="(item,index) in mallData.list_cargoods.body" :to="'/mall/cargoods/'+item.extra.item_id" v-if="index<2">
        <img v-lazy.appMain="item.extra.img">
        <div>
          <h1>{{item.extra.title}}</h1>
          <h2>￥{{parseFloat(item.extra.price)}}
            <del>￥{{parseFloat(item.extra.mkt_price)}}</del>
          </h2>
        </div>
      </router-link>
    </div>

    <div class="part server" v-if="pageData.serviceCust&&pageData.serviceCust.length>0">
        <h1 class="title">服务顾问</h1>
        <swiper :options="serverSwiperOption" ref="serverSwiper">
          <swiper-slide v-for="item in pageData.serviceCust" @click.native="goServerDetail(item.id,item.name)">

              <div class="profile">
                <img v-lazy.appMain="item.imgUrl||serverProfile">
              </div>
              <div>{{item.name}}</div>

          </swiper-slide>
        </swiper>
    </div>

    <div class="part appraise" v-if="pageData.appraiseInfo">
        <h1 class="title">车主点评<router-link :to="$route.path+'/comments'">共{{pageData.appraiseInfo.appraiseNum}}条 ></router-link></h1>
        <div class="score">
          <div class="general">
              <div>{{pageData.compScore}}</div>
              总体点评
          </div>
          <div class="detail">
              <div><label>服务质量</label><lc-rate disabled v-model="pageData.qualScore"></lc-rate></div>
              <div><label>服务效率</label><lc-rate disabled v-model="pageData.effiScore"></lc-rate></div>
              <div><label>服务态度</label><lc-rate disabled v-model="pageData.attiScore"></lc-rate></div>
          </div>
        </div>
        <div class="comment" v-for="item in comments">
            <img class="profile" :src="item.memberHeadPortrait||profile">
            <h2><span>{{item.memberName}}</span>{{item.appraiseTime}}</h2>
            <lc-rate disabled v-model="item.compScore"></lc-rate>
            <p>{{item.appraise||''}}</p>
            <div class="imgs clearfix" v-if="item.appraiseImg.length>0">
                <img v-for="img in item.appraiseImg" v-lazy.appMain="img">
            </div>
            <div class="reply" v-if="item.merchantReply!==''">{{item.merchantReply}}</div>
        </div>
        <router-link class="all" :to="$route.path+'/comments'">查看全部点评 ></router-link>
    </div>

    <div slot="footer" class="btns">
      <div class="left">
        <router-link tag="button" :to="'/beauty?id='+id"><img src="~assets/img/icon_detail_tab_service@2x.png"><span>美容</span></router-link>
        <button @click="next('/testDrive')"><img src="~assets/img/icon_detail_tab_drive@2x.png"><span>试驾</span></button>
        <router-link tag="button" :to="'/sos?actUrl='+encodeURIComponent('/CRM/static/pages/others/activity/sos/index.html')"><img src="~assets/img/icon_detail_tab_help@2x.png"><span>救援</span></router-link>
      </div>

      <div class="right">
          <button class="orange" @click="next('/maintenance')">维保预约</button>
      </div>
    </div>
    
      
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          id:'',
          subShopId:'',
          myLocation:'',
          profile:require('assets/img/default_user.png'),
          serverProfile:require('assets/img/default_server.png'),

          st:0,
          pageData:{},
          mallData:{},
          intro:false,

          acts:[],
          showMoreActs:false,

          comments:[],

          activeIndex:0,
          bannerSwiperOption: {
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            speed: 500,
            loop: true,
            lazyLoading: true,
            lazyLoadingOnTransitionStart: true,
            onSlideChangeStart: (swiper)=>{
                this.activeIndex=swiper.realIndex+1;
            }
          },

          carSwiperOption:{
            pagination: '.cars .swiper-pagination'
          },

          serverSwiperOption: {
            slidesPerView: 5.2,
            freeMode: true
          }

        }
      },
      mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
      },
      activated(){
        if(!this.id){
            this.id=this.$route.params.id;
            this.getData();
            this.getMallData();
        }
        if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
      },
      beforeRouteLeave(to,from,next){
        if(/stores$/.test(to.path)){
          this.resetPage();
        }else{
          this.st = this.$el.children.appMain.scrollTop;
        }
        next();
      },
      methods:{
        resetPage(){
          this.id='';
          this.myLocation='';

          this.st=0;
          this.pageData={};
          this.mallData={};
          this.intro=false;
          
          this.acts=[];
          this.showMoreActs=false;

          this.comments=[];
          this.activeIndex=0;
        },
        async getData() {
            let data={content:{
                '4sStoreId':this.id,
                queryType:3
              }
            }
            let res=await this.$post('/CRM/appfourspoint/queryService4SDetail.json',data);
            if(res.errcode==0){
              
                let con=res.content;
                this.pageData=con;
                this.acts=con.activityInfo.activityList;
                this.comments=con.appraiseInfo.appraiseList;

                let shareData = {
                        share_title: con['4sStoreName'],
                        share_desc: con['4sStoreDescribe'],
                        share_img: con['4sImgUrl'][0],
                        share_url: location.origin+'/wxwap?#/stores/'+this.id
                    };
                this.$utils.shareConfig(shareData);
            }
        },
        async getMallData() {
            let data={content:{crmid:this.id}};
            let res=await this.$post('/mall26/foursshopgoodslist.html',data);
            
            if(res.errcode==0){
                this.mallData=res.content;
                this.subShopId=res.subshopid;
            }
        },
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        },
        goServerDetail(id,name){
          this.$cache.server={
            id:id,
            name:name
          }
          this.$router.push('/server/detail');
        },
        next(path){
          this.$cache.fourS={
            id:this.pageData['4sStoreId'],
            name:this.pageData['4sStoreName']
          }
          this.$router.push(path);
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #storeDetail{
      .part{background:#fff;margin-bottom:.05rem;
        .title{color:$black;line-height: .35rem;text-indent: .2rem;border-bottom:$border;font-size:$h2;position: relative;
          a{float:right;margin-right:.2rem;font-size:$h3;color:$gray;}
        }
      }

      .bannerSwiper {height: 2.5rem;position: relative;
        .swiper-container{height:100%;}
        img{width:100%;height:100%;display: block;}
        .pagination{position: absolute;left:.1rem;bottom:.1rem;color:#fff;z-index: 2;padding:0 .1rem 0 .3rem;line-height:.2rem;border-radius: 99px;background:rgba(0,0,0,.6) url('~assets/img/icon-img.png') no-repeat .1rem center;background-size:.14rem .11rem;}
      }
      
      .store{display:block;position: relative;padding:.1rem .2rem .2rem;background: #fff;margin-bottom:0;
          h1{color:$black;
            div{display:inline-block;border:$border;border-radius:99px;line-height:.18rem;padding:0 .07rem 0 .22rem;color:$gray;font-size:$h3;background:url('~assets/img/intro.png') no-repeat .08rem center;background-size:.11rem .12rem;
              &:after{display:inline-block;vertical-align:middle;margin-left:.03rem;content:'';width:0;height: 0;border:.05rem solid transparent;border-bottom:0;border-top-color:$gray;}
              &.on:after{border:.05rem solid transparent;border-top:0;border-bottom-color:$gray;}
            }
          }
          .intro{color:$gray;font-size:$h3;margin:.05rem 0;line-height: .2rem;}
          .brands{height: .2rem;
              img{width:.2rem;height:.2rem;margin-right:.05rem;}
          }
          a{position:absolute;bottom:.225rem;right:.2rem;display: block;width:.3rem;height: .3rem;background:url('~assets/img/phone.png') no-repeat center;background-size:100%;}
      }

      .addr{display:block;font-size:$h4;color:$gray;border-top:$border;padding:.1rem .5rem .1rem .2rem;position: relative;
          &:after{content:'';position:absolute;right:0;top:0;width:.5rem;height: 100%;background: url('~assets/img/indicator.png') no-repeat center;background-size:.16rem .16rem;}
          p{width:70%;@include txtOverflow;float: left;}
          span{float:right;}
      }

      .cars{padding-bottom:.15rem;
        .swiper-slide{
          a{display: block;float:left;width:33.3333%;text-align:center;padding:.15rem .15rem .1rem;box-sizing: border-box;box-sizing: border-box;font-size:$h3;color:$black;
            img{width:100%;}
          }
        }
        .swiper-pagination-bullets{bottom:.05rem!important;}
        .swiper-pagination-bullet{background:#c7c7c7!important;width:5px!important;height:5px!important;margin:0 3px!important;border-radius:0!important;}
        .swiper-pagination-bullet-active{background:#89888e!important;}
      }

      .server{
        .swiper-container{padding:.1rem .2rem;}
        .swiper-slide{text-align:center;font-size:$h3;
          .profile{display:inline-block;width:.45rem;height:.45rem;border-radius:50%;overflow: hidden;
            img{width:100%;margin-top:-.08rem;}
          }
        }
      }

      .more{color:$gray;position: relative;margin:0 auto;line-height:.4rem;font-size:$h3;text-align:center;
        &::after{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.025rem;border:.05rem solid transparent;border-bottom:0;border-top-color:#fff;}
        &::before{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.035rem;border:.05rem solid transparent;border-bottom:0;border-top-color:$black;}
      }
      .more.on{
        &::after{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.035;border:.05rem solid transparent;border-top:0;border-bottom-color:#fff;}
        &::before{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.015rem;border:.05rem solid transparent;border-top:0;border-bottom-color:$black;}
      }

      .act{display:block;padding:.15rem .2rem .15rem 1.05rem;position: relative;font-size:$h3;color:$gray;overflow: hidden;line-height:.15rem;border-bottom:$border;
          img{width:.7rem;height:.7rem;position: absolute;left:.2rem;top:.15rem;}
          h2{color:$black;@include txtOverflow;}
          label{display:inline-block;color:#fff;padding:0 .05rem;margin:.05rem .05rem .05rem 0;font-size:$h4;
            &.red{background:$red;}
            &.orange{background:$orange;}
          }
          p:before{content:'';width:.10rem;height:.10rem;display: inline-block;vertical-align: middle;margin-right:.05rem;}
          .time:before{background:url('~assets/img/icon_card_detail_time.png') no-repeat center;background-size: contain;}
          .area:before{background:url('~assets/img/icon_card_detail_address.png') no-repeat center;background-size: contain;}
      }

      .appraise{
        .all{display:block;text-align: center;line-height: .4rem;font-size:$h3;color:$gray;border-top:$border;}
      } 

      .score{@include box;padding:.1rem .2rem;border-bottom:$border;align-items:center;font-size:$h3;
        .general{text-align:center;div{color:$mainColor;font-size:.2rem;}}
        .detail{padding-left:.3rem;
          div:nth-last-of-type(n+2){margin-bottom:.05rem;}
          label{margin-right:.2rem;}
        }
      }

      .comment{position: relative;padding:.1rem .2rem .1rem .6rem;color:$gray;line-height:.2rem;font-size:$h4;
        .profile{position: absolute;top:.1rem;left:.2rem;width:.3rem;height:.3rem;border-radius: 50%;border:$border;}
        h2{text-align:right;span{float:left;color:$black;}}
        .imgs img{width:.5rem;height:.5rem;float: left;margin-right:.05rem;}
        .reply{padding:0 .1rem;border-radius: .03rem;border:$border;background:#f9f9f9;margin-top:.1rem;}
      }

      .btns{height:.45rem;background:#fff;overflow: hidden;zoom:1;
        button{box-sizing: border-box;height:.45rem;}
        .left{width:1.5rem;@include box;float:left;
          button:nth-of-type(n+1){border-right:$border;}
          button{width:.5rem;border-top:$border;position: relative;
            div,img{width:.2rem;height:.2rem;display: block;margin:0 auto;}
            span{font-size:$h4;color:$gray;}
          }
        }

        .right{width:2.25rem;float:right;@include box;
            button{@include flex;color:#fff;
              &.yellow{background:#f29600;}
              &.orange{background:#ea6000;}
              &.dis{background:#c9c9c9;width:2.25rem;line-height: .45rem;color:#fff;text-align:center;}
            }
        }
      }

  }
</style>