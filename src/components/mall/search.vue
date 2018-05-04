<template>

  <div class="lc-search">


    <div ref="searchBar" :class="{'head':true,'active':active}">
        <form class="input" action="javascript:return true;" v-on:submit.prevent="search">
          <img src="~assets/img/mall/icon_home_title_search.png">
          <input ref="input" type="search" autocomplete="off" placeholder="搜索关键词" v-model="userInput" v-on:focus="active=true">
          <div class="clear" v-show="active" v-on:click="userInput='';$refs.input.focus();"><span>X</span></div>
        </form>

        <button class="cancel" v-show="active" v-on:click="cancel">取消</button>

        <div v-show="!active">
          <slot name="right"></slot>
        </div>
    </div>




    <div class="body" v-show="active" :style="'height:'+bodyHeight + 'px;top:'+bodyTop+'px;'+(hasTabBar?'padding-bottom:.5rem;':'padding-bottom:0;')">
      <div class="page-content">
          <mt-navbar v-if="$route.path==='/mall'" v-model="selected">
            <mt-tab-item id="car">新车</mt-tab-item>
            <mt-tab-item id="cargoods">车品</mt-tab-item>
          </mt-navbar>

          <template v-if="selected&&data[selected].hot.length>0">
            <h1>热门搜索</h1>
            <ul class="hot-search">
              <li v-on:click="quickSearch(item.ctitle)" v-for="item in data[selected].hot">{{item.ctitle}}</li>
            </ul>
          </template>

          <div>
            <h1>历史搜索</h1>
            <template v-if="selected&&data[selected].history.length>0">
              <ul v-for="(item,index) in data[selected].history" class="history-search">
                <li><div v-on:click="quickSearch(item)">{{item}}</div><button v-on:click="delHistory(index)">X</button></li>
              </ul>

              <button class="clearHistory" v-on:click="clearHistory">清除历史记录</button>
            </template>

            <h1 v-if="selected&&data[selected].history.length===0" style="text-align:center;">没有搜索记录</h1>
          </div>
        </div>
    </div>

  </div>
</template>

<script>
export default {
  name:'lc-search',

  props:{
    workFor:{
      type:String,
      default:'mall'
    },
    keyword:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:''
    }
  },
  
  data() {
    return {
      bodyHeight: 0,
      bodyTop:0,
      hasTabBar:false,

      active:false,
      key:'',
      userInput:'',
      selected:'',
      data:{
        car:{hot:[],history:[]},
        cargoods:{hot:[],history:[]}
      }
    };
  },
  watch:{
    '$route'(to, from) {
      this.active=false;
    },
    selected(val){
      if(val&&this.data[val].hot.length===0){this.getHot(val);}
      this.data[val].history=(this.$utils.ls.get(val+'SearchHistory')||[]).reverse();
    },
    active(val){
      if(val&&this.selected){
        this.data[this.selected].history=(this.$utils.ls.get(this.selected+'SearchHistory')||[]).reverse();
      }
    },
    keyword(val){
      this.key=val;
      this.userInput=val;
    },
    type(val){
      if(val){
          if(this.workFor==='mall'){
            this.selected=this.type;
          }
      }
    }
  },
  mounted() {
    let barHeight=this.$refs.searchBar.clientHeight;
    this.bodyTop=barHeight;
    this.bodyHeight = window.innerHeight-barHeight;

    if(this.$route.meta.hasTabBar){
      this.hasTabBar=true;
    }

    if(this.workFor==='mall'){
      this.selected=this.type;
      this.getHot(this.type);
    }
  },
  
  methods:{
      async getHot(type){
        let data = {
              content: {
                type:type
              }
            };

        let res=await this.$post('/mall26/searchconf.html', data);
        if (res.errcode === 0) {
          if(type==='car'){
            this.data.car.hot=res.content.list;
          }else{
            this.data.cargoods.hot=res.content.list;
          }
        }
      },
      cancel(){
        this.userInput=this.key;
        this.active=false;
      },
      quickSearch(keyword){
        this.key=keyword;
        this.userInput=keyword;
        this.search();
      },
      search(){
        let keyword=this.userInput,
            type=this.selected+'SearchHistory',
            ls=this.$utils.ls.get(type)||[];

        ls.indexOf(keyword)<0&&ls.push(keyword);
        this.$utils.ls.set(type,ls);
        
        this.$refs.input.blur();
        this.active=false;
      
        this.$emit('search', {type:this.selected,keyword:keyword});
      },
      delHistory(i){
        this.data[this.selected].history.splice(i,1);
        this.$utils.ls.set(this.selected+'SearchHistory',this.data[this.selected].history);
      },
      clearHistory(){
        this.data[this.selected].history=[];
        this.$utils.ls.del(this.selected+'SearchHistory');
      }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  .lc-search{background: #fff;

      .head{height:.48rem;box-sizing:border-box;border-bottom:$border;background:#fff;@include box;align-items:center;justify-content:center;
        .input{display:block;background:#f2f2f2;border:$border;box-sizing:border-box;height:.32rem;border-radius:99px;padding:0 .35rem;font-size:$h2;width:3.2rem;position:relative;overflow: hidden;
          img{width:.16rem;height:.16rem;position: absolute;left:.12rem;top:.08rem;}
          input{width:100%;height:100%;}
          input::-webkit-input-placeholder{color:#c9c9c9;}
          input[type="search"]::-webkit-search-cancel-button{display: none;}
          .clear{width:.35rem;height:100%;position:absolute;right:0;top:0;text-align:center;
            span{display:inline-block;text-align:center;width:.18rem;height: .18rem;line-height:.18rem;background: $lightGray;color:#fff;border-radius: 99px;font-size:.1rem;margin-top: .06rem;}
          }
        }
        
        &.active{
          .input{width:2.8rem;}
          .cancel{line-height: .48rem;width:.3rem;color:$mainColor;margin-left:.1rem;}
        }
        
      }

      .body{position: absolute;top:0;left:0;width:100%;background:#f2f2f2;box-sizing:border-box;z-index: 204;
        .mint-navbar{padding:0 25%;}
        .mint-tab-item{border:none!important;}
        .mint-tab-item-label{display: inline;font-size: .14rem!important;padding-bottom:.05rem;}
        .mint-navbar .mint-tab-item.is-selected .mint-tab-item-label{border-bottom: 2px solid;}

        h1{padding:.1rem .2rem;background: #fff;border-top: $border;}
        .hot-search{
          padding:.1rem .2rem 0;background: #fff;margin-bottom:.06rem;
          li{display:inline-block;padding:.05rem .1rem;font-size:$h3;border:$border;border-radius: 3px;color:$gray;margin:0 .1rem .1rem 0;}
        }

        .history-search{background: #fff;font-size:$h3;color:$gray;
          li{display: block;position: relative;line-height:.44rem;border-top:$border; padding:0 .5rem 0 .2rem;
            button{position: absolute;right:0;top:0;color:$gray;width:.5rem;}
          }
        }

        .clearHistory{display:block;background: #fff;width:86%;margin:.2rem auto;line-height: .44rem;border-radius: 5px;}
      }

  }
</style>
