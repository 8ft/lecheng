<template>
  <app-layout id="clsNewCar">
  
    <lc-search slot="header" work-for="mall" type="car" v-on:search="search"></lc-search>
      
      <ul class="sth-link n5 clearfix area">
        <li class="sth" v-for="item in brands" @click="next('',item.cat_id)">
          <img :src="item.cat_logo">
          <h1>{{item.cat_name}}</h1>
        </li>
      </ul>

      <ul class="priceIn clearfix">
        <li v-for="item in price" @click="next('','',item.price_start,item.price_end)">{{item.title}}</li>
      </ul>

      <div class="newCarSep">
          <span></span>
          <h1>新车推荐</h1>
      </div>

      <div class="goods-list col2" v-if="goodsList.length>0">
        <router-link class="li" v-for="item in goodsList" :key="item.datavalue" :to="'/mall/car/'+item.item_id">
          <img v-lazy.mall="item.img">
          <div>
            <h1>{{item.title}}</h1>
            <p>{{item.sub_title}}</p>
            <h3>指导价：<span>￥{{parseFloat(item.zdstart_price)}}-{{parseFloat(item.zdend_price)}}万</span></h3>
          </div>
        </router-link>
      </div>
  
  </app-layout>

</template>

<script>
export default {
  data() {
    return {
      brands:[],
      price:[],

      goodsList:[],
      st:0,
      itemLink: this.$cache.itemLink
    };
  },
  mounted() {
    this.getData();
    this.loadMore();
  },
  methods:{
    search(data){
      this.$router.push('/mall/car?val='+data.keyword);
    },
    next(val,key,priceFrom,priceTo){
      let query='';

      if(val){query+=('val='+val+'&');}
      if(key){query+=('key='+key+'&');}
      if(priceFrom){query+=('pf='+priceFrom+'&');}
      if(priceTo){query+=('pt='+priceTo+'&');}

      this.$router.push('/mall/car?'+query);
    },
    async getData(){
      let res=await this.$post('/mall26/newcar-category.html', {});
      if(res.errcode===0){
        this.brands=res.content.brand;
        this.price=res.content.price;
      }
    },
    async loadMore(){
      let data = { content: { type: 'carclass', maxRecordNum: 20, pageNo: 1 ,pageSize:20} };
      let res = await this.$post('/mall26/itemlist.html', data);

      if(res.errcode===0){
        let list =res.content.list;
        this.goodsList=this.goodsList.concat(list);
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#clsNewCar {
    .priceIn{padding:.2rem;background:#fff;
        li{display: block;float:left;padding:.05rem .1rem;margin:0 .15rem .12rem 0;border:$border;text-align:center;font-size:$h3;color:$gray;}    
    }
    .newCarSep{
        text-align: center;color:$black;height:.5rem;line-height:.5rem;position:relative;
        h1{position:absolute;top:0;left:50%;margin-left:-.36rem;width:.72rem;z-index:2;background: #f2f2f2;}
        span{display:inline-block;height:0;border-top:1px solid #c9c9c9;width:2.06rem;vertical-align: middle;}
    }
}
</style>
