<template>
  <app-layout id="cargoodsDetail" class="goodsDetail">

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
            <div>
              ￥{{parseFloat(pageData.price)}}
            </div>
          </div>
        </div>

        <div v-if="pageData.itemproperty" class="arrow-link profit" @click="showProfitsDetail=true">
          <div v-for="(item,index) in pageData.itemproperty" v-if="index<3">{{item.ctitle}}</div>
        </div>

        <div class="coupon-popup">
            <div class="arrow-link switch" @click="showCoupon=true">
              <h1 class="has-icon">领取优惠券</h1>
            </div>
        </div>

        <div v-if="pageData.status!=='kucunbuzu'&&pageData.status!=='xiajia'&&hasStore" class="arrow-link" @click="openSku('')">
          <h1>{{skusName.length>0?'已选： '+skusName.join(' ')+' '+amount+'件':'请选择数量规格'}}</h1>
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
        <button class="left" v-if="!pageData.isfastbuy" @click="goCart"><img src="~assets/img/mall/icon_detail_tab_shoppingcart.png"><span>购物车</span><i>{{pageData.cartcount>=100?'99+':pageData.cartcount}}</i></button>
        <button class="left"><div :class="{on:pageData.itemCollect}" @click="collect"></div><span>收藏</span></button>

        <div class="right">
          <template v-if="!['kucunbuzu','xiajia'].includes(pageData.status)">
            <button class="yellow" @click="openSku('cart')" v-if="!pageData.isfastbuy">加入购物车</button>
            <button class="orange" @click="openSku('order')">立即购买</button>
          </template>
          <button class="dis" v-if="pageData.status==='kucunbuzu'">库存不足</button>
          <button class="dis" v-if="pageData.status==='xiajia'">已下架</button>
        </div>
    </div>

    <take-coupon slot="aside" :gid="gid" v-model="showCoupon"></take-coupon>

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


    <mt-popup slot="aside" v-model="showSku" position="bottom" style="width:100%;" v-if="!['kucunbuzu','xiajia'].includes(pageData.status)">
      <div v-if="pageData.images" class="sku">
          <img class="goodsImg" :src="pageData.images[0]">
          <span class="price">￥{{parseFloat(skuIds[skus.join('_')].price)}}</span>
          <p class="tip">请选择商品规格</p>
          <div class="page-content">
              <template v-if="pageData.spec">   
                <div v-for="(item,index) in pageData.spec.specName">
                  <h1>{{item.name}}</h1>
                  <span :class="skus[index]===child.spec_value_id?'on':''" v-for="child in item.child" @click="selectSku(index,child.spec_value_id,child.spec_value)">{{setSkuName(index,child.spec_value_id,child.spec_value)}}</span>
                </div>
              </template>

              <div>
                <h1>数量</h1>
                <div class="amount">
                  <button @click="amount>1?amount=amount-1:''">-</button>
                  <input type="tel" v-model="amount">
                  <button @click="amount=amount+1">+</button>
                </div>
              </div>
          </div>

          <div class="next">
            <template v-if="!['kucunbuzu','xiajia'].includes(pageData.status)&&hasStore">
              <button class="yellow" @click="addToCart" v-if="!pageData.isfastbuy&&!next">加入购物车</button>
              <button class="orange" @click="order" v-if="!pageData.isfastbuy&&!next">立即购买</button>

              <button class="ok" @click="confirm" v-if="pageData.isfastbuy||next">确 认</button>
            </template>

            <button class="dis" v-if="pageData.status==='kucunbuzu'||!hasStore">库存不足</button>
            <button class="dis" v-if="pageData.status==='xiajia'">已下架</button>
          </div>
          
      </div>
    </mt-popup>

    

  </app-layout>
</template>

<script>
import TakeCoupon from 'components/coupon/take'
export default {
  components:{
      'take-coupon':TakeCoupon,
  },
  data() {
    return {
      //通用
        gid:'',
        amount:1,
        pageData: {},
        next:'',

        cart:[],

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

        showCoupon:false,

        //车品
        showSku:false,
        skus:[],//选中的sku id
        defaultSkusName:[],
        skusName:[],//选中的sku名称
        skuIds:{},//sku 组合id
        hasStore:true,
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
    amount(val){
      if(val===''||val<=0){this.amount=1;}
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
    if(!/(order|signUp)$/.test(to.path)){
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
        this.showSku=false;
        let path='/mall/order?sid='+this.skuIds[this.skus.join('_')].id+'&num='+this.amount;
        if(this.pageData.zitilist){
          path+='&zid='+this.pageData.zitilist[0].id;
        }
        this.$router.push(path);
    },
    resetPage(callback){
      this.gid='';
      this.amount=1;
      this.pageData={};
      this.next='';
      this.detail='doc';
      this.detailHtml='';
      this.detailLoaded=false;
      this.bottomPullText='上拉查看图文详情';
      
      this.showProfitsDetail=false;
      this.profitsDetail=[];

      this.showCoupon=false;

      this.showSku=false;
      this.skus=[];
      this.defaultSkusName=[];
      this.skusName=[];
      this.skuIds={};

      callback();
    },
    openSku(next){
      this.$login(()=>{
          this.next=next;
          this.showSku=true;
      });
    },
    selectSku(index,id,name){
        this.skus.splice(index,1,id);
        this.skusName.splice(index,1,name);
        this.hasStore=this.skuIds[this.skus.join('_')].hasStore;
    },
    goCart(){
      this.$router.push('/mall/cart');
    },
    addToCart(){
      this.$login(async ()=>{
          let user=this.$cache.user,
            data={
              content:{
                sku_id:this.skuIds[this.skus.join('_')].id,
                quantity:this.amount,
                mbeid:user.memberId,
                mobile:user.phone
              }
          }
          let res= await this.$post('/mall26/cart-add.html', data);
          if (res.errcode === 0) {
            this.pageData.cartcount+=this.amount;
            this.showSku=false;
            this.$toast('已加入购物车');
          }
      });
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
    setSkuName(index,id,name){
      if(!this.skusName[index]&&this.skus[index]==id){
        this.skusName[index]=name;
      }
      return name;
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
            
            let ids=spec.specSku,
              defaultSkus=[],
              skuIds={},
              ii;

            for(let i=0;i<ids.length;i++){
              ii=ids[i];

              if(ii.store>0){
                skuIds[ii.spec_id]={
                    id:ii.sku_id,
                    price:ii.price,
                    hasStore:true
                  };

                if(defaultSkus.length===0){
                  defaultSkus=ii.spec_ids;
                }
              }else{
                skuIds[ii.spec_id]={
                    id:ii.sku_id,
                    price:ii.price,
                    hasStore:false
                };
              }
            }

            let skus=spec.specName,
              defaultSkusName=[],
              ci,
              cij;

            for(let i=0;i<skus.length;i++){
              ci=skus[i].child;
              for(let j=0;j<ci.length;j++){
                cij=ci[j];
                if(defaultSkus.includes(cij.spec_value_id)){
                  defaultSkusName.push(cij.spec_value);
                }
              }
            }

            this.skus=defaultSkus;
            this.defaultSkusName=defaultSkusName;
            this.skusName=defaultSkusName;
            this.skuIds=skuIds;
        }
        this.pageData=con;
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsDetail.scss";
  @import "~assets/css/coupon/popup.scss";
</style>
