<template>
    <app-layout id="recommendBuyersRecords">

        <page-switch slot="header" :items="switchPages" :active="0"></page-switch>

        <mt-navbar slot="header" v-model="selected">
            <mt-tab-item id="status0">全部</mt-tab-item>
            <mt-tab-item id="status1">待审核</mt-tab-item>
            <mt-tab-item id="status2">推荐中</mt-tab-item>
            <mt-tab-item id="status3">已发奖 </mt-tab-item>
            <mt-tab-item id="status4">已取消 </mt-tab-item>
        </mt-navbar>


        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
            
            <div class="record" v-for="(value,index) in list">

                <router-link :to="'./records/'+value.recommendId">
                    <div class="box">
                        <div>
                            <h1>{{value.customerName}}</h1>
                            <p>{{value.customerPhone}}</p>
                        </div>
                        <div>
                            <h2>{{desc[value.widlyStatus]}}</h2>
                            <p>{{value.statusTime}}</p>
                        </div>
                    </div>
                </router-link>
                <div class="box">
                    <div><p>{{value.recommendInfo}}</p></div>

                    <div>
                        <button v-on:click="cancel(index,value.recommendId)" v-if="value.widlyStatus=='1'">取消推荐</button>
                        <p v-if="value.timeDifference!==''&&value.widlyStatus=='2'&&value.timeDifference>0"><span>{{value.timeDifference}}</span>天后逾期失效</p>
                        <p v-if="value.timeDifference!==''&&value.widlyStatus=='2'&&value.timeDifference<=0"><span>今日即将过期</span></p>
                    </div>
                </div>

            </div>
            
        </div>

        <div v-if="nomore" class="nodata">没有数据咯</div>
        
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            switchPages:[
                {name:'推荐记录',path:'/recommendBuyers/records'},
                {name:'奖励记录',path:'/recommendBuyers/rewards'}
            ],
            desc:['全部','待审核','推荐中','已发奖','已取消'],
            st:0,
            pageNo:1,
            pageSize:10,
            nomore:false,
            loading:false,
            selected:'status0',
            list:[]
        };
      },
      watch: {
        selected(val) {
            this.resetPage();
            this.loadMore();
        }
      },
      activated(){
           if(this.st!=0){
              document.getElementsByClassName('page-content')[0].scrollTop=this.st;
          }else{
              this.loadMore();
          }
      },
      beforeRouteLeave (to,from,next){
        if(to.path=='/recommendBuyers'){
            this.resetPage();
        }else{
            this.st = this.$el.children.appMain.scrollTop;
        }
        next();
     },
      methods: {
        resetPage(){
          this.st=0;
          this.pageNo=1;
          this.pageSize=10;
          this.nomore=false;
          this.loading=false;
          this.list=[];
        },
        cancel(index,rid){
            this.$messagebox.confirm('确定取消推荐?', '提示').then(async ()=>{

                if(this.st===0){
                    this.st=this.$el.children.appMain.scrollTop;
                }

                let d={content:{
                    memberId:this.$cache.user.memberId,
                    recommendId:rid
                   }};

                let res=await this.$post('/CRM/wechatrecommendbuycar/cancelRecommend.json',d);
                if(res.errcode==0){
                   this.update();
                }
            });
        },
        async update() {
            if(this.st===0){
                this.st=this.$el.children.appMain.scrollTop;
            }
            
            let data={
                    content:{
                        memberId:this.$cache.user.memberId,
                        pageSize:this.pageSize*this.pageNo,
                        pageNo:1,
                        widlyStatus:this.selected.substr(-1)
                    }
                };

            let res=await this.$post('/CRM/wechatrecommendbuycar/getMyRecommendList.json',data);
            if(res.errcode==0){
                let list=res.content.recommendList;
                this.list=[].concat(list||[]);

                this.$nextTick(function () {
                    this.$el.children.appMain.scrollTop = this.st;
                });
            }
        },
        async loadMore() {
            if(!this.nomore&&!this.loading){
                this.loading=true;

                let data={content: {
                    memberId: this.$cache.user.memberId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    widlyStatus:this.selected.substr(-1)
                }};

                let res=await this.$post('/CRM/wechatrecommendbuycar/getMyRecommendList.json',data);
                if(res.errcode==0){
                    let list=res.content.recommendList;
                    this.list=this.list.concat(list?list:[]);
                    if(res.content.totalPages<=this.pageNo){
                        this.nomore=true;
                    }else{
                        this.pageNo+=1;
                    }
                    this.loading=false;
                }
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #recommendBuyersRecords{
      .record{
          display:block;padding:.14rem .20rem 0;line-height:.40rem;background:#fff;margin-top:.05rem;
          .box{
              @include box;
              &:nth-of-type(1){border-bottom:$border;}
              div{
                  @include flex;
                  &:nth-child(2){text-align: right;}
                  h1,h2{line-height:.15rem;}
                  h2{text-align:right;color:$mainColor;}
                  p{color:$gray;font-size:$h3;span{color:$mainColor;}}
                  button{float:right;padding:0 5px;color:$gray;border:1px solid lightgray;font-size:$h3;border-radius:4px;line-height:.20rem;margin-top:.09rem;}
              }
          }
      }
  }
</style>
