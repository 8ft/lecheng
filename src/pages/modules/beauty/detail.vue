<template>
  <app-layout id="beautyDetail">

    <mt-loadmore v-if="pageData.list&&pageData.list.length>0" :class="pulling?'dis':''" :auto-fill="false" @bottom-status-change="handleBottomChange" bottomPullText="" bottomDropText="" :bottom-method="loadDetailHtml" :bottom-all-loaded="detailLoaded" ref="loadmore">

      <!-- 轮播图 -->
      <div class="goodsImgs">
        <swiper :options="bannerSwiperOption" ref="goodsImg">
          <swiper-slide v-for="(item,index) in pageData.list[selected].list_image">
            <img :src="item" :data-src="index>1&&item" :class="index>1&&'swiper-lazy'">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

      <div class="goods-info">

        <div class="base">
          <h1>{{pageData.meirong_title}}</h1>
          <h2>{{pageData.meirong_descript}}</h2>
        </div>

        <ul class="sku">
          <li>
            <h1>选择规格<span>请根据您的车辆品牌进行选择</span></h1>
          </li>
          <li :class="{on:selected===index}" @click="selected=index" v-for="(item,index) in pageData.list">
            <h1>{{item.title}}</h1>
            <p>{{item.sub_title}}</p>
          </li>
        </ul>

        <router-link tag="div" class="arrow-link" :to="'/fourS?ids='+store_ids">
            <h1>服务门店</h1>
            <div>{{fourS}}</div>
        </router-link>

      </div>

      <div class="detail" v-if="detail==='doc'&&!detailLoaded"><h1>{{bottomPullText}}</h1></div>
      <div class="detail" v-if="detail==='doc'" v-html="detailHtml"></div>

    </mt-loadmore>

    <div v-if="pageData.list&&pageData.list.length>0" slot="footer" class="btns">
      <div class="left">
        <router-link tag="button" :to="'/onlineHelp?actUrl='+encodeURIComponent('https://static.meiqia.com/dist/standalone.html?_=t&eid=38740&groupid=846de8917f52c53f0207d5c7e1c7c5e4')"><img src="~assets/img/mall/icon_detail_tab_service.png"><span>客服</span></router-link>
      </div>

      <div class="middle">
          ￥{{pageData.list[selected].price}}
          <del>￥{{pageData.list[selected].mkt_price}}</del>
      </div>

      <div class="right">
        <button class="orange" @click="order">预约下单</button>
      </div>
    </div>

    <div v-if="pageData.list&&pageData.list.length===0" class="lc-error">
        <img src="~assets/img/mall/icon_goods_empty.png">
        <p>没有符合条件的商品</p>
    </div>
   
  </app-layout>
</template>

<script>

export default {
  data() {
    return {
        store_ids:'',
        gid:'',
        pageData: {},
        selected:0,
        fourS:'',

        pulling:false,
        detail:'doc',
        detailHtml:'',
        detailLoaded:false,
        bottomPullText:'上拉加载图文详情',

        bannerSwiperOption: {
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            speed: 500,
            loop: true,
            lazyLoading: true,
            lazyLoadingOnTransitionStart: true,
            pagination: '.swiper-pagination'
        },
        
    };
  },
  computed: {
    swiper() {
      return this.$refs.goodsImg.swiper
    }
  },
  watch:{
    selected(val){
      this.getStoreIds();
      this.refresh();
    }
  },
  activated() {
    if(!this.gid){
      let id=this.$route.params.id;
      this.gid=id;
      this.getPageData();
    }else if(this.st!=0){
        this.fourS=this.$cache.fourS.name;
        this.$el.children.appMain.scrollTop = this.st;
    }
  },
  beforeRouteLeave(to,from,next){
    this.st = this.$el.children.appMain.scrollTop;
    if(!/(order|fourS)$/.test(to.path)){
      this.resetPage();
    }
    next();
  },
  methods: {
    refresh(){
      this.detail='doc';
      this.detailHtml='';
      this.detailLoaded=false;
      this.bottomPullText='上拉加载图文详情';
      this.$nextTick(function () {
        this.swiper.init();
      });
      this.fourS='';
      this.$cache.fourS={};
    },
    resetPage(){
      this.gid='';
      this.pageData={};
      this.detail='doc';
      this.detailHtml='';
      this.detailLoaded=false;
      this.bottomPullText='上拉加载图文详情';
      this.fourS='';
      this.$cache.fourS={};
    },
    loadDetailHtml(){
      this.detailLoaded=true;
      this.detailHtml=this.pageData.list[this.selected].wap_desc;
      this.$refs.loadmore.onBottomLoaded();
      this.pulling=false;
    },
    handleBottomChange(status){
      if(!this.detailLoaded){
        if(status==='pull'){
          this.pulling=false;
          this.bottomPullText='上拉加载图文详情';
        }else{
          this.pulling=true;
          this.bottomPullText='释放查看图文详情';
        }
      }
    },
    getStoreIds(){
      let data=this.pageData.list[this.selected].subshop,
        ids=[];
      for (let i = 0; i < data.length; i++) {
          ids.push(data[i].crmid);
      }
      this.store_ids=ids.join('_');
    },
    order(){
      if(this.fourS){
        let item=this.pageData.list[this.selected],
          sid=this.$cache.fourS.id,
          store=item.subshop.filter(data=>data.crmid==sid);

        this.$router.push('/beauty/order?id='+item.item_id+'&sid='+item.sku_id+'&zid='+store[0].id);
      }else{
        this.$toast('请选择服务门店');
      }
    },
    async getPageData () {
      let user=this.$cache.user,
        data = {
          content:{
            item_id:this.gid,
            mbeid:user.id,
            mobile:user.phone
          }
        };

      let res = await this.$post('/mall26/itemdetail.html', data);

      if (res.errcode === 0) {
        let con=res.content,
          share=con.share;

        this.pageData=con;
        
        let shareData={
            share_title:share.title,
            share_desc:share.desc,
            share_img:share.img,
            share_url:share.url||location.origin+'/wxwap?#/beauty/detail/'+this.gid
        }
        this.$utils.shareConfig(shareData);

        if(con.list.length>0){
          this.getStoreIds();
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
 #beautyDetail {
    .goodsImgs{height: 3.75rem;}
    .swiper-slide {img{width:100%;height:100%;display: block;}}
    .goods-info{margin-bottom:.1rem;
      .base{padding:.2rem .2rem .1rem;background: #fff;
        h1{color:$black;margin-bottom:.1rem;}
        h2{font-size:$h3;color:$mainColor;}
      }

      .sku{background:#fff;margin:.05rem 0;
        li{border-bottom: $border;padding:0 .5rem 0 .2rem;
          &:nth-of-type(n+2){background: url('~assets/img/icon_list_select.png') no-repeat 95% .145rem;background-size:.2rem .2rem;}
          &:nth-of-type(n+2).on{background-image:url('~assets/img/icon_list_select_pressed.png'); }  
        }
        h1{color:$black;line-height:.44rem;span{font-size:$h3;color:$gray;margin-left: .1rem;}}
        p{color:$gray;font-size:$h3;margin-bottom: .1rem;line-height: .2rem;}
      }

      .arrow-link{background: #fff;height:.44rem;line-height: .44rem;padding:0 .2rem;border-bottom:$border;overflow: hidden;zoom: 1;
        h1{color:$black;display: inline-block;}
        div{float:right;color:$gray;margin-right:.1rem;max-width:2.3rem;@include txtOverflow;}
      }
    }
   
    .detail{background: #fff;
      h1{text-align: center;line-height: .5rem;}
      img{width:100%;display: block;}}

    .btns{height:.45rem;background:#fff;overflow: hidden;zoom:1;
      button{box-sizing: border-box;height:.45rem;}
      .left{width:.5rem;@include box;float:left;
        button:nth-of-type(n+1){border-right:$border;}
        button{width:.5rem;border-top:$border;position: relative;
          div,img{width:.2rem;height:.2rem;display: block;margin:0 auto;}
          div{background: url('~assets/img/mall/icon_detail_tab_collect.png') no-repeat center;background-size:100%;}
          div.on{background-image: url('~assets/img/mall/icon_detail_tab_collect_pressed.png');}
          span{font-size:$h4;color:$gray;}
          i{position: absolute;top:0rem;right:0;padding:0 .05rem;border-radius: 99px;background: red;color:#fff;line-height:.16rem;font-size:$h4;}
        }
      }

      .middle{width:2.05rem;line-height: .45rem;float: left;text-indent:.1rem;color:$mainColor;border-top:$border;
        del{color:$gray;font-size:$h3;}
      }

      .right{width:1.2rem;float:right;@include box;
          button{@include flex;color:#fff;
            &.yellow{background:#f29600;}
            &.orange{background:#ea6000;}
            &.dis{background:#c9c9c9;width:2.25rem;line-height: .45rem;color:#fff;text-align:center;}
          }
      }
    }
  }
</style>
