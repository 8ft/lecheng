<template>
  <app-layout id="classes">
  
    <lc-search slot="header" work-for="mall" type="cargoods" v-on:search="search"></lc-search>
  
    <ul>
      <li v-for="(item,index) in main" :key="item.cat_id" :class="cur===index?'selected':''" v-on:click="getSub(index,item.cat_id)">{{item.cat_name}}</li>
    </ul>

    <div slot="aside" v-for="(item,index) in sub" :key="item.catid" v-if="cur>=0&&cur===index" class="page-content cls-con">
      <div v-if="item.banner" @click="go(item.banner.datatype,item.banner.datavalue)">
        <img class="ad" :src="item.banner.img">
      </div>
      <div class="sth-link n3 clearfix area">
        <a class="sth" v-on:click="next(c.cat_id)" v-for="c in item.list" :key="c.cat_id"><img :src="c.cat_logo"><h1>{{c.cat_name}}</h1></a>
      </div>
    </div>
  
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      main:[],
      sub:[],
      cur:-1,
      st:0,
      itemLink: this.$cache.itemLink
    };
  },
  mounted() {
    this.getMain();
  },
  methods:{
    search(data){
      this.$router.push('/mall/'+data.type+'?val='+data.keyword);
    },
    go(type,value){
      switch(type){
        case 'url':
          location.href=value;
        break;

        case 'goodsclass_car':
          this.$router.push('/mall/car?key='+value);
        break;

        case 'goodsclass_cargoods':
          this.$router.push('/mall/cargoods?key='+value);
        break;

        default:
          this.$router.push(this.itemLink[type]+value);
        break;
      }
    },
    next(key){
      this.$router.push('/mall/cargoods?key='+key);
    },
    async getMain() {
      let data =  {content:{returntype:"single"}};
      let res=await this.$post('/mall26/cargoods-category.html', data);
        
      if(res.errcode===0){
        let list=res.content.list;
        this.main = list;
        
        let sub=this.sub;
        for(let i=0;i<list.length;i++){
          sub.push([]);
        }

        this.cur<0&&this.getSub(0,list[0].cat_id);
      }
    },
    async getSub(index,val){
      if(this.sub[index].length<1){
        let data =  {content:{cat_id:val,returntype:"single"}};
        let res=await this.$post('/mall26/cargoods-category.html', data);
          
        if(res.errcode===0){
          this.sub[index]=res.content;
          this.cur=index;
        }
      }else{
        this.cur=index;
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#classes{
    main{width:26%;text-align:center;float:left;
        li{line-height:.5rem;background: transparent;}
        li.selected{color:$mainColor;border-left:3px solid $mainColor;background: #fff;}
    }

    .cls-con{width:74%;background: #fff;padding:.18rem .16rem;box-sizing:border-box;float:left;
        .ad{width:100%;height:1.09rem;display:block;background: $gray;margin-bottom:.1rem;}
    }

    .n3{margin-bottom:.25rem;
      .sth{width:.7rem;border:none;&:nth-of-type(3n-1){margin:0 .175rem;}}}
}
</style>
