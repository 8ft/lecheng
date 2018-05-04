<template>
  <app-layout id="carDetail" class="goodsDetail">

    <mt-loadmore :class="pulling?'dis':''" :auto-fill="false" @bottom-status-change="handleBottomChange" bottomPullText="" bottomDropText="" :bottom-method="loadDetailHtml" :bottom-all-loaded="detailLoaded" ref="loadmore">


      <!-- 轮播图 -->
      <div class="goodsImgs">
        <swiper v-if="pageData.images" :options="bannerSwiperOption" ref="goodsImg">
          <swiper-slide v-for="(item,index) in pageData.images">
            <img :src="item" :data-src="index>1&&item" :class="index>1&&'swiper-lazy'">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>


      <div class="goods-info">
        <div class="base">
          <h1>{{pageData.title}}</h1>
          <h2>{{pageData.sub_title}}</h2>

          <div class="price">
            <div class="dingjin">￥{{parseFloat(pageData.price)}}</div>
            <div>指导价:<span>￥{{parseFloat(pageData.zdpricestart)+'-'+parseFloat(pageData.zdpriceend)}}万</span></div>
          </div>
        </div>

        <div v-if="pageData.itemproperty" class="arrow-link profit" @click="showProfitsDetail=true">
          <div v-for="(item,index) in pageData.itemproperty" v-if="index<3">{{item.ctitle}}</div>
        </div>

        <a :href="item.curl" :class="{'benefit':true,'arrow-link':item.curl}" v-for="item in pageData.goucheyouhui">
          <span>{{item.ctag}}</span>
          <p>{{item.ctitle}}</p>
        </a>

        <template v-if="pageData.status!=='kucunbuzu'&&pageData.status!=='xiajia'&&skus.length>0">
          <div class="arrow-link" @click="openSku" style="margin-top:.1rem;">
            <h1>车型分类</h1>
            <div>{{selectedCar>=0?skus[selectedCar].name:''}}</div>
          </div>

          <div class="arrow-link" @click="openStore">
            <h1>提车门店</h1>
            <div>{{selectedStore.id?selectedStore.title:''}}</div>
          </div>
        </template>

        <div class="steps clearfix">
          <h1>购车说明</h1>
          <img src="/CRM/WeChat/App/static/img/mall/pic_detail_car_process.png">
        </div>
      </div>

      <mt-navbar v-model="detail">
        <mt-tab-item id="doc">图文详情</mt-tab-item>
        <mt-tab-item id="qa">常见问题</mt-tab-item>
      </mt-navbar>

      <div class="detail" v-if="detail==='doc'&&!detailLoaded"><h1>{{bottomPullText}}</h1></div>
      <div class="detail" v-if="detail==='doc'" v-html="detailHtml"></div>
      <div class="detail" v-if="detail==='qa'" v-html="pageData.shop_request"></div>

    </mt-loadmore>


    <div slot="footer" class="btns">
        <router-link class="left" tag="button" :to="'/onlineHelp?actUrl='+encodeURIComponent('https://static.meiqia.com/dist/standalone.html?_=t&eid=38740&groupid=846de8917f52c53f0207d5c7e1c7c5e4')"><img src="~assets/img/mall/icon_detail_tab_service.png"><span>客服</span></router-link>
        <button class="left"><a href="tel:96358"><img src="~assets/img/mall/icon_detail_tab_phone.png"><span>96358</span></a></button>
        <button class="left"><div :class="{on:pageData.itemCollect}" @click="collect"></div><span>收藏</span></button>

      <div class="right">
        <template v-if="!['kucunbuzu','xiajia'].includes(pageData.status)">
          <router-link tag="button" class="yellow" :to="'/testDrive?id='+gid">预约试驾</router-link>
          <button class="orange" @click="orderCar('order')">立即订车</button>
        </template>
        <button class="dis" v-if="pageData.status==='kucunbuzu'">库存不足</button>
        <button class="dis" v-if="pageData.status==='xiajia'">已下架</button>
      </div>
    </div>

    <mt-popup slot="aside" v-model="showProfitsDetail" position="bottom" style="width:100%;">
      <div class="profitsDetail">
        <h1>权益服务</h1>

        <ul class="page-content">
          <li v-for="item in profitsDetail">
            <h2>{{item.title}}</h2>
            <p>{{item.content}}</p>
          </li>
        </ul>
      </div>
    </mt-popup>

    <mt-popup slot="aside" v-model="showCarSku" position="bottom" style="width:100%;">
      <div class="carSku">
        <h1>选择车型</h1>

        <ul class="page-content">
          <li :class="{on:selectedCar===index}" v-for="(item,index) in skus" @click="selectSku(index,item.sku_id)">
            <h2>{{item.name}}</h2>
            <p>指导价：<span>￥{{parseFloat(item.zdprice)}}万</span></p>
          </li>
        </ul>

      </div>
    </mt-popup>

    <mt-popup slot="aside" v-model="showStores" position="bottom" style="width:100%;">
      <div class="fourS">
        <h1>提车4S店</h1>

        <ul class="page-content">
          <li v-for="item in stores.city">
            <h3>{{item}}</h3>
            <store-info v-for="store in stores[item]" :selected="selectedStore.id===store.id" @select="selectStore(store)" :data="{name:store.title,address:store.address,lat:store.lat,lng:store.lng,phone:store.tel}"></store-info>
          </li>
        </ul>
        
      </div>
    </mt-popup>

  </app-layout>
</template>

<script>

export default {
  data() {
    return {
        gid:'',
        pageData: {},
        next:'',

        pulling:false,
        detail:'doc',
        detailHtml:'',
        detailLoaded:false,
        bottomPullText:'上拉查看图文详情',

        showProfitsDetail:false,
        profitsDetail:[],

        bannerSwiperOption: {
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            speed: 500,
            loop: true,
            lazyLoading: true,
            lazyLoadingOnTransitionStart: true,
            pagination: '.swiper-pagination'
        },

        skus:[],
        showCarSku:false,
        selectedCar:0,
        stores:{},
        showStores:false,
        selectedStore:{}
    };
  },
  computed: {
    swiper() {
      return this.$refs.goodsImg.swiper
    }
  },
  watch:{
    showProfitsDetail(val){
      if(val&&this.profitsDetail.length===0){
        this.getProfitsDetail();
      }
    },
    showStores(val){
      if(!val){
        if(this.next==='order'&&this.selectedStore.id){
          this.orderCar();
        }
        this.next='';
      }
    }
  },
  mounted(){
    eventBus.$on('loggedIn', ()=>{
      this.getPageData();
    });
  },
  activated() {
    if(!this.gid){
      let id=this.$route.params.id;
      this.gid=id;
      this.getPageData();
    }
  },
  beforeRouteLeave(to,from,next){
    if(!/(order|orderCar|signUp|map)$/.test(to.path)){
      this.resetPage(next);
    }else{
      next();
    }
  },
  methods: {
    confirm(){
      switch (this.next) {
        case 'cart':
            this.addToCart();
        break;
        case 'order':
          this.order();
        break;
        default:
          this.showSku=false;
          break;
      }
    },
    order(){
        this.$router.push('/mall/order?sid='+this.skuIds[this.skus.join('_')].id+'&num='+this.amount);
    },
    orderCar(next){
      if(next){this.next=next;}

      if(this.selectedCar<0){
        this.showCarSku=true;
      }else if(!this.selectedStore.id){
        this.showStores=true;
      }else{
        let car=this.skus[this.selectedCar],
          store=this.selectedStore;
        this.$router.push('/mall/orderCar?sid='+car.sku_id+'&zid='+store.id);
      }
    },
    resetPage(callback){
      this.gid='';
      this.pageData={};
      this.next='';
      this.detail='doc';
      this.detailHtml='';
      this.detailLoaded=false;
      this.bottomPullText='上拉查看图文详情';
      
      this.showProfitsDetail=false;
      this.profitsDetail=[];

      this.skus=[];
      this.showCarSku=false;
      this.selectedCar=0;
      this.stores={};
      this.showStores=false;
      this.selectedStore={};

      callback();
    },
    openSku(){
      this.$login(()=>{
        this.showCarSku=true;
      });
    },
    openStore(){
      this.$login(()=>{
        this.showStores=true;
      });
    },
    selectSku(index){
        this.selectedCar=index;
        this.showCarSku=false;
    },
    selectStore(store){
      this.selectedStore=store;
      this.showStores=false;
    },
    collect(){
      this.$login(async ()=>{
        if(this.pageData.itemCollect){
          let user=this.$cache.user,
            data={
              content:{
                item_id:this.gid,
                mbeid:user.memberId,
                mobile:user.phone
              }
          }
          let res= await this.$post('/mall26/collectremove.html', data);
          if (res.errcode === 0) {
            this.pageData.itemCollect=false;
          }
        }else{
          let user=this.$cache.user,
            data={
              content:{
                item_id:this.gid,
                mbeid:user.memberId,
                mobile:user.phone
              }
          }
          let res= await this.$post('/mall26/collect.html', data);
          if (res.errcode === 0) {
            this.pageData.itemCollect=true;
          }
        }
      });
    },
    async getProfitsDetail(){
      let data=[],
          profits=this.pageData.itemproperty;
      for (let i = 0; i < profits.length; i++) {
        data.push(profits[i].pkid);
      }

      let res = await this.$post('/mall26/itemright.html', {content:{right_id:data.join(',')}});
      if (res.errcode === 0) {
        this.profitsDetail = res.content.list;
      }
    },
    loadDetailHtml(){
      this.detailLoaded=true;
      this.detailHtml=this.pageData.wap_desc;
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
    async getCart () {
      let user=this.$cache.user,
        data = {
          content:{
            mbeid:user.memberId||'',
            mobile:user.phone||''
          }
        };

      let res = await this.$post('/mall26/cart-list.html', data);
      if (res.errcode === 0) {
        this.cart = res.content.cartData.items;
      }
    },
    async getPageData () {
      let user=this.$cache.user,
        data = {
          content:{
            item_id:this.gid,
            mbeid:user.memberId||'',
            mobile:user.phone||''
          }
        };

      let res = await this.$post('/mall26/itemdetail.html', data);

      if (res.errcode === 0) {

        let con=res.content;
       
        let shareData={
            share_title:con.title,
            share_desc:con.sub_title,
            share_img:con.images[0],
            share_url:location.origin+'/wxwap?#'+this.$route.fullPath
        }
        this.$utils.shareConfig(shareData);

        let spec=con.spec;
        if(spec){

            let skus=spec.specName[0].child,
              ids=spec.specSku,
              carSku=[];

            for(let i=0;i<skus.length;i++){
              ids[i]['name']=skus[i].spec_value;
              carSku.push(ids[i]);
            }
            
            let fourS=con.zitilist,
                fi,
                stores={
                  city:[]
                };

            for(let i=0;i<fourS.length;i++){
              fi=fourS[i]
              if(stores.city.includes(fi.cityname)){
                stores[fi.cityname].push(fi);
              }else{
                stores.city.push(fi.cityname);
                stores[fi.cityname]=[fi];
              }
            }

            this.skus=carSku;
            this.stores=stores;
        }

        this.pageData = con;
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsDetail.scss";
</style>
