<template>
  <app-layout id="mall">
    <lc-search slot="header" work-for="mall" type="car" v-on:search="search"></lc-search>
  
    <!-- modulid 对应模版
              2:3图，左1右2
              3:一行多列，可滚动
              4:2行3列
              5:1列多行
              6:1列2行+1行1列
              7:广告
              8:轮播图
              9:快速入口
              10:5列多行
              11:4列多行
      -->
  
    <template v-for="mod in pageData">
  
      <!-- 标题 -->
      <div v-if="mod.head" class="area-title clearfix">
        <img :src="mod.head.leftimg">
        <p>{{mod.head.middletext}}</p>
        <a v-if="mod.head.rightdatatype&&mod.head.rightdatavalue" class="arrow" @click="next(mod.head.rightdatatype,mod.head.rightdatavalue)">
          <div>更多</div>
        </a>
      </div>
  
      <!-- 轮播图 -->
      <swiper class="bannerSwiper" v-if="mod.modulid===8" :options="bannerSwiperOption" ref="bannerSwiper">
        <swiper-slide v-for="(item,index) in mod.body">
          <a @click="next(item.datatype,item.datavalue)">
            <img :src="item.img" :data-src="index>1&&item.img" :class="index>1&&'swiper-lazy'">
          </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
  
      <!-- 快速入口 -->
      <ul v-if="mod.modulid===9" class="main-fn area">
        <li v-for="item in mod.body" v-if="item.datatype!=='goodsclass_salecar'">
          <a @click="next(item.datatype,item.datavalue)">
            <img :src="item.img">
            <h2>{{item.text}}</h2>
          </a>
        </li>
      </ul>
  
      <!-- 三图组合 -->
      <div v-if="mod.modulid===2" class="recommend area">
        <a v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
          <img :src="item.img">
        </a>
      </div>

       <!-- 左2右3 -->
      <div v-if="mod.modulid===6" class="recommend2 area">
        <a v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
          <img :src="item.img">
        </a>
      </div>
  
      <!-- banner/一列多行 -->
      <template v-if="mod.modulid===7||mod.modulid===5">
        <a v-for="item in mod.body" @click="next(item.datatype,item.datavalue)" class="ad area">
          <img :src="item.img">
        </a>
      </template>
  
      <!-- 一行多列 -->
      <template v-if="mod.modulid===3">
        <swiper class="newCar area" :options="newcarSwiperOption" ref="newcarSwiper">
          <swiper-slide v-for="item in mod.body">
            <a @click="next(item.datatype,item.datavalue)">
              <img v-lazy.appMain="item.img">
            </a>
          </swiper-slide>
        </swiper>
      </template>
  
      <!-- 5列多行 -->
      <template v-if="mod.modulid===10">
        <div class="sth-link n5 clearfix area">
          <a class="sth" v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
            <img v-lazy.appMain="item.img">
            <h1>{{item.text}}</h1>
          </a>
        </div>
      </template>
  
      <!-- 4列多行 -->
      <template v-if="mod.modulid===11">
        <div class="sth-link n4 clearfix area">
          <a class="sth" v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
            <img v-lazy.appMain="item.img">
            <h1>{{item.text}}</h1>
          </a>
        </div>
      </template>


      <!-- 3列多行 -->
      <template v-if="mod.modulid===4">
        <div class="sth-link n3 clearfix area">
          <a class="sth" v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
            <img v-lazy.appMain="item.img">
            <h1>{{item.text}}</h1>
          </a>
        </div>
      </template>
  
    </template>
  
    <div class="goods-list col2" v-if="goodsList.length>0">
      <img class="title" src="~assets/img/mall/icon_home_recommend.png">
  
      <router-link class="li" v-for="item in goodsList" :to="'/mall/cargoods/'+item.item_id">
        <img v-lazy.appMain="item.img">
        <div>
          <h1>{{item.title}}</h1>
          <h2>￥{{parseFloat(item.price)}}
            <del>￥{{parseFloat(item.mkt_price)}}</del>
          </h2>
        </div>
      </router-link>
  
    </div>
  
  </app-layout>
</template>

<script>

export default {
  data() {
    return {
      pageData: {},
      goodsList: [],
      st: 0,
      bannerSwiperOption: {
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        speed: 500,
        loop: true,
        lazyLoading: true,
        lazyLoadingOnTransitionStart: true,
        pagination: '.bannerSwiper .swiper-pagination'
      },
      newcarSwiperOption: {
        slidesPerView: 3.7,
        freeMode: true
      },
      itemLink: this.$cache.itemLink
    };
  },
  mounted() {
    this.getPageData();
  },
  activated() {
    if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
  },
  beforeRouteLeave(to, from, next) {
    this.st = this.$el.children.appMain.scrollTop;
    next();
  },
  methods: {
    search(data){
      this.$router.push('/mall/'+data.type+'?val='+data.keyword);
    },
    next(type,value){
      switch(type){
        case 'url':
          if(/duiba/.test(value)){
            this.$router.push('/spMall/somePage?url='+encodeURIComponent(value.replace('?LechengMallSign','')));
          }else{
            location.href=value;
          }
        break;

        case 'goodsclass_car':
          this.$router.push('/mall/car?key='+value);
        break;

        case 'goodsclass_cargoods':
          this.$router.push('/mall/cargoods?key='+value);
        break;

        case 'channel_testdrive':
          this.$router.push('/testDrive/brands');
        break;

        default:
          this.$router.push(this.itemLink[type]+value);
        break;
      }
    },
    async getPageData () {
      let data = { content: { platform: "mweb" } };
      let res = await this.$post('/mall26/index.html', data);

      if (res.errcode === 0) {
        this.pageData = res.content.list;
        this.loadMore();
      }
    },
    async loadMore () {
      let data = { content: { type: 'mallindex', maxRecordNum: 20, pageNo: 1 ,pageSize:20} };
      let res = await this.$post('/mall26/itemlist.html', data);

      if (res.errcode === 0) {
        let list = res.content.list;
        this.goodsList = this.goodsList.concat(list);
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
 #mall {
    .area{margin:0 auto .06rem;}
    .area-title{padding:0 .2rem;height:.36rem;line-height:.36rem;background: #fff;border-bottom:$border;font-size:$h3;
      img{display:block;width:.6rem;height:.15rem;float: left;margin-top:.105rem; }
      p{float:left;@include txtOverflow;width:1.8rem;margin-left:.2rem;color:$black;}
      a{float:right;}
      .arrow div{padding-right:.1rem;
        &::after{top:.11rem;}
        &::before{top:.11rem;}
      }
    }
    .bannerSwiper {height: 1.68rem;img{width:100%;height:100%;display: block;}}
    .main-fn{padding:.15rem .2rem;img{width:.4rem;}}
    .recommend {
      position:relative;height:2rem;
      a{
        position:absolute;box-sizing:border-box;display: block;
        img{width:100%;height:100%;display: block;}
        &:nth-of-type(1){width:40%;top:0;left:0;height:100%;border-right:.01rem solid #fff;}
        &:nth-of-type(2){width:60%;top:0;right:0;height:50%;border-bottom:.01rem solid #fff;}
        &:nth-of-type(3){width:60%;bottom:0;right:0;height:50%;}
      }
    }
    .recommend2 {
      position:relative;height:2.79rem;
      a{
        position:absolute;box-sizing:border-box;display: block;width:50%;
        img{width:100%;height:100%;display: block;}
        &:nth-of-type(1){top:0;left:0;height:1.86rem;border-right:$border;border-bottom:$border;}
        &:nth-of-type(2){top:0;right:0;height:.93rem;border-bottom:$border;}
        &:nth-of-type(3){top:.93rem;right:0;height:.93rem;border-bottom:$border;}
        &:nth-of-type(4){bottom:0;left:0;height:.93rem;border-right:$border;}
        &:nth-of-type(5){bottom:0;right:0;height:.93rem;}
      }
    }
    .ad{display: block;width:100%;height:.75rem;img{display: block;width:100%;height: 100%;}}
    .newCar .swiper-slide{border-right:$border;box-sizing: border-box;img{width:100%;display: block;}}
  }
</style>
