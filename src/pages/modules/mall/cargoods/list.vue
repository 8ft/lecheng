<template>
  <app-layout id="cargoodsList" class="goodsList" :subPage="openFilter">

    <lc-search slot="header" type="cargoods" :keyword="val" v-on:search="search">
      <div slot="right" :class="'switch '+(switchStyle?'':'cargoods')" v-on:click="switchStyle=!switchStyle"></div>
    </lc-search>
    
    <lc-filter slot="header" type="cargoods" :sort="sort" @update:sort="val => sort = val">
      <li :class="{'on':(hasFilter||openFilter)}" @click="switchFilter">筛选</li>
    </lc-filter>

    <div v-if="openFilter" slot="subPage" class="page-content filter">
        <h1>价格区间</h1>
        <div class="priceIn clearfix">
          <input type="tel" placeholder="最低价" v-model="filterData.pricestart">
          <span>—</span>
          <input type="tel" placeholder="最高价" v-model="filterData.priceend">
        </div>
        <h1>品牌</h1>
        <div class="brands" v-if="itemBrands.length>0">
          <span v-for="item in itemBrands" :class="{'on':filterData.selectedBrands.indexOf(item.brand_id)>=0}" @click="selectItemBrands(item.brand_id)">{{item.brand_name}}</span>
        </div>
    </div>

    <div v-if="openFilter" slot="footer" class="btns">
      <button @click="refreshFilter">重置</button>
      <button @click="switchFilter('confirm')">确定</button>
    </div>

    <div :class="'goods-list '+(switchStyle?'col2':'col1')" v-if="list.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
      <router-link class="li" v-for="item in list" :to="'/mall/cargoods/'+item.item_id">
        <img v-lazy.appMain="item.img">
        <div>
          <h1>{{item.title}}</h1>
          <p>{{item.sub_title}}</p>

          <h2>￥{{parseFloat(item.price)}}
            <del>￥{{parseFloat(item.mkt_price)}}</del>
          </h2>
        </div>
      </router-link>
    </div>

    <div v-if="list.length===0" class="lc-error">
        <img src="~assets/img/mall/icon_goods_empty.png">
        <p>没有符合条件的商品</p>
    </div>

  </app-layout>
</template>

<script>
import filter from 'components/mall/filter'
export default {
  components:{
    'lc-filter':filter
  },
  data() {
    return {
      cid:'',
      val:'',

      list:[],
      pageNo: 1,
      pageSize: 10,
      nomore: false,
      st:0,

      switchStyle:false,

      sort:'default',
      openFilter:false,
      itemBrands:[],

      filterDataCache:{},

      hasFilter:false,
      filterData:{
        pricestart:'',
        priceend:'',
        selectedBrands:[]
      }
      
    };
  },
  watch:{
    sort(val){
        this.refresh();
        this.loadMore();
    }
  },
  mounted(){
    eventBus.$on('updateFilterData',()=>{
        let data=this.filterData;
        if(data.pricestart||data.priceend||data.selectedBrands.length>0){
          this.hasFilter=true;
        }else{
          this.hasFilter=false;
        }
    });
  },
  activated(){
    if(this.list.length===0){
      let search=this.$route.query;

      this.cid=search.key||'';
      this.val=decodeURI(search.val||'');

      eventBus.$emit('updateFilterData');
      this.loadMore();

      if(this.itemBrands.length===0){
        this.getItemBrands();
      }
     
    }else if(this.st != 0) { 
      this.$el.children.appMain.scrollTop = this.st;
    }
  },
  beforeRouteLeave(to, from, next) {
    if(!/cargoods\//.test(to.path)){
      this.resetPage(next);
    }else{
      this.st = this.$el.children.appMain.scrollTop;
      next();
    }
  },
  methods:{
    refresh(){
      this.list=[];
      this.pageNo=1;
      this.nomore=false;
    },
    resetPage(callback){
      this.cid='';
      this.val='';

      this.list=[];
      this.pageNo=1;
      this.nomore=false;
      this.st=0;

      this.switchStyle=false;

      this.sort='default';
      this.openFilter=false;
      this.itemBrands=[];

      this.filterDataCache={};

      this.hasFilter=false;
      this.filterData={
        pricestart:'',
        priceend:'',
        selectedBrands:[]
      }

      callback();
    },
    switchFilter(action){
      if(action==='confirm'){
        eventBus.$emit('updateFilterData');
        this.filter();
      }else{
        if(this.openFilter){
          let cache=JSON.stringify(this.filterDataCache); 
          this.filterData=JSON.parse(cache);

          let data=this.filterData;
          if(data.pricestart||data.priceend||data.selectedBrands.length>0){
            this.hasFilter=true;
          }else{
            this.hasFilter=false;
          }

        }else{
          let data=JSON.stringify(this.filterData); 
          this.filterDataCache=JSON.parse(data);
        }
      }
      this.openFilter=!this.openFilter;
      eventBus.$emit('layout');
    },
    refreshFilter(){
      this.filterData={
        pricestart:'',
        priceend:'',
        selectedBrands:[]
      };
    },
    filter(){
      this.refresh();
      this.loadMore();
    },
    selectItemBrands(id){
      let index=this.filterData.selectedBrands.indexOf(id);
      if(index<0){
        this.filterData.selectedBrands.push(id);
      }else{
        this.filterData.selectedBrands.splice(index,1);
      }

      eventBus.$emit('updateFilterData');
    },
    search(data){
      this.refresh();
      this.val=data.keyword;
      this.loadMore();
    },
    async loadMore() {
        let vm=this;
        vm.nomore = true;
        let isCid=/^\d+$/.test(this.cid);

        let data = {
            content: {
              pageNo:vm.pageNo,
              pageSize:vm.pageSize,
              cat_id:isCid?vm.cid:'',
              brand_id:vm.filterData.selectedBrands.join(','),
              searchkey:vm.val||'',
              pricestart:vm.filterData.pricestart,
              priceend:vm.filterData.priceend,
              order:vm.sort==='default'?'':vm.sort,// 默认是sold (销量)、price_asc(升序）、price_desc (降序)  、rand随机maxRecordNum：返回的总数据条数
              coupon_id:vm.$route.query.cpid||'',
              itemtype:'cargoods'
            }
        };

        let res=await vm.$post('/mall26/itemlist.html', data);
        if (res.errcode === 0) {
          vm.list = vm.list.concat(res.content.list);
          if (res.content.totalPages > vm.pageNo) {
            vm.pageNo += 1;
            vm.nomore = false;
          }
        }
    },
    async getItemBrands() {
        let res=await this.$post('/mall26/cargoodsbrandlist.html');
        if (res.errcode === 0) {
          this.itemBrands = res.content.list;
        }
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsList.scss";
</style>









