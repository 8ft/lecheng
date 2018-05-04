<template>
  <app-layout id="orders">

      <div class="order-type" slot="aside"><span :class="{active:showTypes}" @click="showTypes=!showTypes">{{selectedType.name==='全部'?'我的订单':selectedType.name}}</span></div>
      <mt-popup v-model="showTypes" position="top" style="width:100%;" slot="aside">
          <div class="types">
              <div v-for="item in types" @click="selectedType=item;showTypes=false;" :class="{on:selectedType.id===item.id}">{{item.name}}</div>
          </div>
      </mt-popup>

      <mt-navbar slot="header" v-model="curStatus">
        <mt-tab-item v-for="(item,index) in status" :id="index">{{item}}</mt-tab-item>
      </mt-navbar>

      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
          <order-li v-if="item" v-for="item in list" :data="item"></order-li>
      </div>

  </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                curStatus:0,
                status:['全部','待付款','进行中','待收货','待评价'],

                types:[],
                selectedType:{id:'', name:'全部'},
                showTypes:false,

                st:0,
                pageNo:1,
                pageSize:15,
                list: [],
                nomore:false
            }
        },
        watch: {
            curStatus(val) {
                this.resetPage();
                this.loadMore();
            },
            selectedType(val){
                this.resetPage();
                this.loadMore();
            }
        },
        mounted(){
            eventBus.$on('updateOrder',()=> {
                this.update();
            });
        },
        activated(){
            if(this.list.length===0){
                this.curStatus=parseInt(this.$route.query.status||0);
                this.loadMore();
            }else if(this.st!=0){
                this.$el.children.appMain.scrollTop = this.st;
            }
        },
        beforeRouteLeave (to,from,next){
            if(!/(orders|pay|comment|shipping)/.test(to.path)){
                this.resetPage();
            }else{
                this.st = this.$el.children.appMain.scrollTop;
            }
            next();
        },
        methods:{
            resetPage(){
                this.st=0;
                this.pageNo=1;
                this.list=[];
                this.nomore=false;
            },
            async update() {
                if(this.st===0){
                    this.st=this.$el.children.appMain.scrollTop;
                }
                
                let data=this.$sign({
                        content: {
                            orderType: this.selectedType.id,
                            pageNo:1,
                            pageSize:this.pageSize*this.pageNo,
                            status:this.curStatus||''
                        }
                    });

                let res=await this.$post('/CRM/api/query.order.page.json',data);
                if(res.errcode==0){
                    let list=res.content.orderList;
                    this.list=[].concat(list?list:[]);

                    this.$nextTick(function () {
                        this.$el.children.appMain.scrollTop = this.st;
                    });
                }
            },
            async loadMore() {
                if(!this.nomore){
                    this.nomore=true;

                    let data=this.$sign({
                        content: {
                            orderType: this.selectedType.id,
                            pageNo:this.pageNo,
                            pageSize:this.pageSize,
                            status:this.curStatus||''
                        }
                    });

                    let res=await this.$post('/CRM/api/query.order.page.json',data);
                    
                    if(res.errcode==0){
                        let con=res.content;
                        if(this.types.length===0){this.types=con.orderTypeList;}
                        this.list=this.list.concat(res.content.orderList);
                        if(res.content.totalPages>this.pageNo){
                            this.pageNo+=1;
                            this.nomore=false;
                        }
                    }

                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #orders{top:.41rem;
        .types{padding: .2rem .2rem .08rem!important;
            div{border: $border;border-radius:.03rem;display:inline-block;width:1rem;line-height:.3rem;text-align: center;box-sizing:border-box;margin-bottom:.12rem;font-size:$h3;color:#55555D;
                &:nth-of-type(3n-1){margin:0 .175rem;}
                &.on{color:$mainColor;border-color:$mainColor;}
            }
        }
        .order-type{position:fixed;top:0;left:0;right:0;text-align: center;line-height: .4rem;background:#fff;border-bottom:$border;z-index: 206;
            span{
                &::after{content:'';width:0;height:0;border:.05rem solid transparent;border-bottom:0;border-top-color:$gray;display:inline-block;vertical-align: .025rem;margin-left:.05rem;}
                &.active::after{border:.05rem solid transparent;border-top:0;border-bottom-color:$gray;}
            }
        }
        .mint-popup{padding-top: .41rem;z-index: 205!important;}
        .v-modal{z-index: 204!important;}
    }
</style>

