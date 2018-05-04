<template>
    <app-layout id="inviteRank">
        <div slot="header">
            <!-- <div class="switch"><div :class="type==='1'?'on':''" v-on:click="type='1'">日榜</div><div :class="type==='2'?'on':''" v-on:click="type='2'">总榜</div></div> -->
            <div class="stars">
                <div>
                    <img :src="list[1]&&list[1].icon?list[1].icon:default_profile">
                    <img src="~assets/img/invite/r2.png">
                    <template v-if="list[1]">
                        <h1>{{list[1].name}}{{list[1].isMe==='1'?'(您)':''}}</h1>
                        <p>{{list[1].rewardAmount}}</p>
                    </template>
                    <template v-if="!list[1]">
                        <h1>虚席以待</h1>
                        <p>0</p>
                    </template>
                </div>
                <div>
                    <img :src="list[0]&&list[0].icon?list[0].icon:default_profile">
                    <img src="~assets/img/invite/r1.png">
                    <template v-if="list[0]">
                        <h1>{{list[0].name}}{{list[0].isMe==='1'?'(您)':''}}</h1>
                        <p>{{list[0].rewardAmount}}</p>
                    </template>
                    <template v-if="!list[0]">
                        <h1>虚席以待</h1>
                        <p>0</p>
                    </template>
                </div>
                <div>
                    <img :src="list[2]&&list[2].icon?list[2].icon:default_profile">
                    <img src="~assets/img/invite/r3.png">
                    <template v-if="list[2]">
                        <h1>{{list[2].name}}{{list[2].isMe==='1'?'(您)':''}}</h1>
                        <p>{{list[2].rewardAmount}}</p>
                    </template>
                    <template v-if="!list[2]">
                        <h1>虚席以待</h1>
                        <p>0</p>
                    </template>
                </div>
            </div>
        </div>


        <template v-if="list.length>0">
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
                <li v-for="item in list" v-if="item.ranking>3&&item.ranking<=50" :class="item.isMe==='1'?'me':''">
                    <div>{{item.ranking}}</div>
                    <img :src="item.icon?item.icon:default_profile">
                    <h1>{{item.name}}{{item.isMe==='1'?'(您)':''}}<span>{{item.rewardAmount}}</span></h1>
                </li>
            </ul>
            <div v-if="nomore" class="nodata">{{list.length>=50?'到底啦!只显示前50名用户排名信息':'没有数据咯'}}</div>
        </template>

        <div slot="footer" class="nextOne" v-if="winnerUrl"><router-link class="btn" :to="'./winner/?actUrl='+winnerUrl">查看中奖用户</router-link></div>
    </app-layout>
</template>


<script>
    export default {
      data() {
        return {
            default_profile:require('assets/img/default_user.png'),
            winnerUrl:'',
            pageNo:1,
            pageSize:50,
            nomore:false,
            loading:false,
            type:'2',
            list:[]
        };
      },
      watch: {
        type(val) {
            this.resetPage();
            this.loadMore();
        }
      },
      activated(){
        this.loadMore();
      },
      methods: {
        resetPage(){
          this.pageNo=1;
          this.pageSize=50;
          this.nomore=false;
          this.loading=false;
          this.list=[];
        },
        async loadMore() {
            if(!this.nomore&&!this.loading){
                this.loading=true;

                let d={content: {
                    memberId:this.$cache.user.memberId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    rankType:this.type
                }};

                let res=await this.$post('/CRM/appinvitation/invitationRank.json',d);
                if(res.errcode==0){
                    let con=res.content;
                    this.winnerUrl=con.showWinnerUrl;

                    let rlist=con.rankingList;
                    this.list=this.list.concat(rlist?rlist:[]);
                    if(this.list.length>=50||con.totalPages<=this.pageNo){
                        this.nomore=true;
                    }else{
                        this.pageNo+=1;
                        this.loading=false;
                    }
                }
            }
        }
      }
    }
</script>


<style lang="scss">
    @import "~assets/css/var.scss";
    #inviteRank{padding-top:2.2rem;
        header{position:absolute;top:0;left:0;right:0;padding-top:.14rem;box-sizing:border-box;width:100%;height:2.2rem;background:url('/CRM/WeChat/App/static/img/invite/hbg.jpg') no-repeat top center;background-size:100%;
            .switch{@include box;overflow:hidden;width:1.7rem;height:.27rem;margin:0 auto;line-height: .26rem;text-align:center;color:#fff;border-radius:99px;border:1px solid #fff;
                div{@include flex;}
                div.on{background: #fff;color:#e84816;}
            }

            .stars{@include box;text-align:center;color:#fff;position:absolute;left:0;right:0;bottom:.15rem;align-items:flex-end;
                div{@include flex;position:relative;overflow:hidden;padding-top:.02rem;
                    img:nth-of-type(1){width:.6rem;height:.6rem;border-radius:99px;}
                    img:nth-of-type(2){width:.8rem;height:.76rem;position:absolute;top:0;left:50%;margin-left:-.4rem;}
                    h1{margin:.16rem auto .08rem;@include txtOverflow;max-width:80%;}
                    p:before{content:'';display: inline-block;margin-right:.05rem;width:.09rem;height:.09rem;background:url('~assets/img/invite/coin.png') no-repeat top center;background-size:100%;}
                }
                div:nth-of-type(2){
                    img:nth-of-type(1){width:.7rem;height:.7rem;border-radius:99px;}
                    img:nth-of-type(2){width:.92rem;height:.9rem;position:absolute;top:0;left:50%;margin-left:-.46rem;}
                }
            }
        }

        .page-content{padding:.1rem;
            ul{border-radius:4px;overflow: hidden;
            li{padding:0 .2rem 0 .85rem;position:relative;line-height:60px;border-bottom:$border;
                &.me{color:$mainColor;}
                div{position:absolute;left:.2rem;width:.24rem;}
                img{width:.3rem;height:.3rem;border-radius:99px;position:absolute;left:.44rem;top:.15rem;}
                    h1{
                        span{float:right;
                          &:before{content:'';display: inline-block;margin-right:.05rem;width:.09rem;height:.09rem;background:url('~assets/img/invite/coin.png') no-repeat top center;background-size:100%;}
                        }
                        
                    }
                }
            }
        }
    }
</style>

