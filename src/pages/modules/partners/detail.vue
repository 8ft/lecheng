<template>
  <app-layout id="partnerDetail">
    
    <div class="bannerSwiper">
      <template v-if="pageData.imgList">
        <swiper :options="bannerSwiperOption" ref="bannerSwiper">
          <swiper-slide v-for="(img,index) in pageData.imgList">
              <img :src="img" :data-src="index>1&&img" :class="index>1&&'swiper-lazy'">
          </swiper-slide>
        </swiper>
        <div class="pagination">{{activeIndex}}/{{pageData.imgList.length}}</div>
      </template>
    </div>

    <div class="store">
        <h1>
          {{pageData.name}}
          <div :class="{on:intro}" @click="intro=!intro">简介</div>
        </h1>
        <p class="intro" v-show="intro">{{pageData.description}}</p>
        <lc-rate disabled v-model="pageData.star"></lc-rate>

        <a :href="'tel:'+pageData.phone1"></a>
    </div>

    <router-link class="part addr clearfix" :to="'/map?lat='+pageData.dimension+'&lng='+pageData.longitude"><p>{{pageData.address}}</p><span>{{getDistance(pageData.longitude,pageData.dimension)}}</span></router-link>

    <div class="part">
        <h1 class="title">商家活动</h1>

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

    <div v-if="mallData.head" class="area-title clearfix">
      <img :src="mallData.head.leftimg">
      <p>{{mallData.head.middletext}}</p>
      <router-link v-if="mallData.head.rightdatatype&&mallData.head.rightdatavalue" class="arrow" :to="'/partners/goods/'+mallData.head.rightdatavalue">
        <div>更多</div>
      </router-link>
    </div>

    <div class="goods-list col2" style="padding:0 .05rem;" v-if="mallData.body">
      <router-link class="li" v-for="(item,index) in mallData.body" :to="'/mall/cargoods/'+item.extra.item_id" v-if="index<2">
        <img v-lazy.appMain="item.extra.img">
        <div>
          <h1>{{item.extra.title}}</h1>
          <p>{{item.extra.sub_title}}</p>
          <h2>￥{{parseFloat(item.extra.price)}}
            <del>￥{{parseFloat(item.extra.mkt_price)}}</del>
          </h2>
        </div>
      </router-link>
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
            <div class="imgs clearfix" v-if="item.appraiseImg.length>0"></div>
            <div class="reply" v-if="item.merchantReply!==''">{{item.merchantReply}}</div>
        </div>
        <router-link class="all" :to="$route.path+'/comments'">查看全部点评 ></router-link>
    </div>
      
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          id:'',
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
        if(/partners$/.test(to.path)){
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
                id:this.id,
                dimension:this.$cache.location.lat||'24.501821',
                longitude:this.$cache.location.lng||'118.143012'
              }
            }
            let res=await this.$post('/CRM/appcoopbusi/querycoopbusidetail.json',data);
            if(res.errcode==0){
                let con=res.content;
                this.pageData=con;
                // this.acts=con.activityInfo.activityList;
                // this.comments=con.appraiseInfo.appraiseList;
            }
        },
        async getMallData() {
            let data={content:{crmid:this.id,type:'businesspartner'}};
            let res=await this.$post('/mall26/foursshopgoodslist.html',data);
            
            if(res.errcode==0){
                this.mallData=res.content.list;
            }
        },
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #partnerDetail{
      .part{background:#fff;margin-bottom:.05rem;
        .title{color:$black;line-height: .35rem;text-indent: .2rem;border-bottom:$border;font-size:$h2;position: relative;
          a{float:right;margin-right:.2rem;font-size:$h3;color:$gray;}
        }
      }

      .bannerSwiper {height: 2.5rem;position: relative;
        .swiper-container{height:100%;}
        img{width:100%;height:100%;display: block;}
        .pagination{position: absolute;right:.1rem;bottom:.1rem;color:#fff;z-index: 2;padding:0 .1rem 0 .3rem;line-height:.2rem;border-radius: 99px;background:rgba(0,0,0,.6) url('~assets/img/icon-img.png') no-repeat .1rem center;background-size:.14rem .11rem;}
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

      .area-title{padding:0 .2rem;height:.36rem;line-height:.36rem;background: #fff;border-bottom:$border;font-size:$h3;
        img{display:block;width:.6rem;height:.15rem;float: left;margin-top:.105rem; }
        p{float:left;@include txtOverflow;width:1.8rem;margin-left:.2rem;color:$black;}
        a{float:right;}
        .arrow div{padding-right:.1rem;
          &::after{top:.11rem;}
          &::before{top:.11rem;}
        }
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
        .reply{padding:.05rem .1rem;border-radius: 3rem;border:$border;background:$lightGray;}
      }

  }
</style>