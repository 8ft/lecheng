<template>
  <app-layout id="storeComments">

        <mt-navbar slot="header" v-model="selected">
            <mt-tab-item id="10">全部({{totle}})</mt-tab-item>
            <mt-tab-item id="11">好评({{good}})</mt-tab-item>
            <mt-tab-item id="12">差评({{bad}})</mt-tab-item>
        </mt-navbar>

        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
            <div class="comment" v-for="item in comments">
                <img class="profile" :src="item.memberHeadPortrait||profile">
                <h2><span>{{item.memberName}}</span>{{item.appraiseTime}}</h2>
                <lc-rate disabled v-model="item.compScore"></lc-rate>
                <p>{{item.appraise||''}}</p>
                <div class="imgs clearfix" v-if="item.appraiseImg.length>0">
                    <img v-for="img in item.appraiseImg" v-lazy.appMain="img">
                </div>
                <div class="reply" v-if="item.merchantReply!==''">{{item.merchantReply}}</div>
            </div>
        </div>
      
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          profile:require('assets/img/default_user.png'),
          comments:[],

          totle:'0',
          good:'0',
          bad:'0',

          selected:'10',
          pageNo:1,
          pageSize:20,
          nomore:false
        }
      },
      watch:{
          selected(){
            this.pageNo=1;
            this.nomore=false;
            this.comments=[];
            this.loadMore();
          }
      },
      activated(){
          this.loadMore();
      },
      beforeRouteLeave(to,from,next){
        if(/stores/.test(to.path)){
          this.resetPage();
        }
        next();
      },
      methods:{
        async loadMore() {
            if(!this.nomore){
                this.nomore=true;

                let data={content:{
                        foursId:this.$route.params.id,
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        queryType:this.selected
                    }
                };
                let res=await this.$post('/CRM/appbespeak/queryAppraiseInfoWithReply.json',data);
                if(res.errcode==0){
                    let con=res.content;

                    if(this.pageNo===1){
                        this.totle=con.totalRecords;
                        this.good=con.highPraiseRecords;
                        this.bad=con.badPraiseRecords;
                    }

                    this.comments=this.comments.concat(con.appraiseList||[]);
                    if(con.totalPages>this.pageNo){
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
  #storeComments{
      .part{background:#fff;margin-bottom:.05rem;}

      .comment{position: relative;padding:.1rem .2rem .1rem .6rem;color:$gray;line-height:.2rem;font-size:$h4;background:#fff;
        .profile{position: absolute;top:.1rem;left:.2rem;width:.3rem;height:.3rem;border-radius: 50%;border:$border;}
        h2{text-align:right;span{float:left;color:$black;}}
        .imgs img{width:.5rem;height:.5rem;float: left;margin-right:.05rem;}
        .reply{padding:.05rem .1rem;border-radius: 3rem;border:$border;background:$lightGray;}
      }

  }
</style>