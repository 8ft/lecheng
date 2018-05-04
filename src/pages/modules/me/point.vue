<template>
    <app-layout id="myPoint">
           
        <div class="mpBox">
            <div>
                <h1>我的积分</h1>
                <p>{{con.integralBalance}}</p>
            </div>
            <ul>
                <li>
                    <h2>可用积分</h2>
                    <p>{{con.availableIntegral}}</p>
                </li>
                <li>
                    <h2>即将过期积分</h2>
                    <p>{{con.willExpireIntegral}}</p>
                </li>
                <li>
                    <h2>冰冻积分</h2>
                    <p>{{con.freezingIntegral}}</p>
                </li>
            </ul>
        </div>
        <div class="title">
            <img src="~assets/img/me/point.png" alt="">
            <span>积分明细</span>
        </div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="type0">全部</mt-tab-item>
            <mt-tab-item id="type1">收入</mt-tab-item>
            <mt-tab-item id="type2">支出</mt-tab-item>
        </mt-navbar>

        <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
            <li v-for="value in listItems">
                <label>{{value.item}}</label>
                <div>{{value.date}}</div>
                <span>{{value.amount}}</span>
            </li>
            <div  class="lc-error" v-show="listItems.length==0">
                <img src="~assets/img/error-empty.png">
                <p>抱歉，暂无数据</p>
            </div>
        </ul>
        <div slot="footer" class="nextOne">
            <router-link tag="div" class="market" to="/spMall/duiba">
                <img src="~assets/img/me/point_market.png" alt="">
                <span>积分商城</span>
            </router-link>
        </div>
        

    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            pageNo:1,
            pageSize:20,
            nomore:false,
            loading:false,
            selected:'type0',
            con:[],
            listItems:[]
        };
      },
      watch: {
        selected(val) {
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
          this.pageSize=20;
          this.nomore=false;
          this.loading=false;
          this.listItems=[];
        },
        async loadMore() {
            if(!this.nomore&&!this.loading){
                this.loading=true;
                let d={content: {
                    memberId:this.$cache.user.memberId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    type:this.selected.substr(-1)
                }};

                let res=await this.$post('/CRM/appmembermgcust/queryIntegralDetail.json',d);
                if(res.errcode==0){
                    this.con=res.content;
                    let list=res.content.detail;
                    this.listItems=this.listItems.concat(list?list:[]);

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
    #myPoint{
        .market{
            background: #31a6be;
            color: #fff;
            display: flex;
            align-items: center;
            width: 90%;
            margin-left: 5%;
            height: .4rem;
            margin-top: .1rem;
            border-radius: 6px;
            justify-content: center;
            img{
                height: .22rem;
                margin-right: .1rem
            }
        }
        .title{
            height: .3rem;
            background: #fff;
            border-bottom: 1px solid rgba(237, 237, 237, 0.8);
            font-size: .12rem;
            display: flex;
            align-items: center;
            padding-left: .2rem;
            img{
                height: .15rem;
                margin-right: .08rem;
            }
        }
        .list{
            height: calc(100% - 2.44rem - 3px);
            background: #f2f2f2;
            overflow:auto;
            li{position:relative;background:#fff;
                div,span{position:absolute;right:.14rem;top:.1rem;font-size:$h4;color:lightgray;}
                span{top:auto;bottom:.1rem;color:$mainColor;font-size:$h3;}
            }
        }
        
        .mint-navbar{
            position: relative;
        }
        .mint-navbar .mint-tab-item {
            border-right: 1px solid #f1f1f1 !important;
            border-bottom: 1px solid #f1f1f1;
            padding: 0;
            height: .44rem;
            .mint-tab-item-label{
                font-size: .15rem;
                line-height: .44rem;
            }
            &::last-child{
                border-right: 0;
            }
            &.is-selected{
                border-bottom: 3px solid $mainColor;
            }
        }
    }
</style>
