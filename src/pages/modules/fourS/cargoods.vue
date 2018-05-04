<template>
  <app-layout id="mall_collection">

      <div v-if="list.length===0" class="lc-error">
          <img src="~assets/img/mall/icon_goods_empty.png">
          <p>暂无商品</p>
      </div>

      <div v-else class="goods-list col1" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
          
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

  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      nomore: false,
      st:0,

      list:[]
    }
  },
  activated(){
    if(this.list.length<=0){
      this.loadMore();
    }else if (this.st != 0) {
      this.$el.children.appMain.scrollTop = this.st; 
    }
  },
  beforeRouteLeave(to, from, next) {
    if(/stores/.test(to.path)){
      this.resetPage();
    }else{
      this.st = this.$el.children.appMain.scrollTop;
    }
    next();
  },
  methods:{
    resetPage(){
      this.pageNo=1;
      this.nomore=false;
      this.list=[];
    },
    async loadMore(){
      if(!this.nomore){
        this.nomore=true;
     
        let user=this.$cache.user,
          data={
            content:{
              subshop_id:this.$route.params.id,
              itemtype:'cargoods',
              pageNo:this.pageNo,
              pageSize:this.pageSize
            }
          }
          let res= await this.$post('/mall26/itemlist.html', data);
          if (res.errcode === 0) {
            let con=res.content;

            this.list =this.list.concat(con.list);
            if (con.totalPages > this.pageNo) {
              this.pageNo += 1;
              this.nomore = false;
            }
          }
        }
    }
   
  }
}
</script>