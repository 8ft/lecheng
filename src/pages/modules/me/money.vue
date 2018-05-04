<template>
  <app-layout id="meBalance">
        <div class="top">
            <p class="title">余额账户（元）</p>
            <div class="money">¥ <span>{{balance||0}}</span></div>
        </div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="selected0">全部</mt-tab-item>
            <mt-tab-item id="selected1">收入</mt-tab-item>
            <mt-tab-item id="selected2">支出</mt-tab-item>
        </mt-navbar>
        <ul class="navbar-ul" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
            <li v-for="(item,index) in listItems">
                <div class="left">
                    <div class="title">{{item.title}}</div>
                    <div class="time">{{item.datetime}}</div>
                </div>
                <div class="right" v-if="item.type==1">+{{item.amt}}</div>
                <div class="right" v-else>-{{item.amt}}</div>
            </li>
            
            <div  class="lc-error" v-show="listItems.length==0">
                <img src="~assets/img/error-empty.png">
                <p>暂无账户明细</p>
            </div>
        </ul>
        
        <!-- <div slot="footer" class="nextOne"><div class="btn">充值</div></div> -->
  </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                selected:'selected0',
                pageNo:1,
                pageSize:20,
                loading:false,
                balance:0,
                listItems:[]
            }
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
        deactivated(){
            this.$indicator.close();
        },
        methods: {
            resetPage(){
                this.pageNo=1;
                this.pageSize=20;
                this.loading=false;
                this.listItems=[];
            },
            async loadMore() {
                if(!this.loading){
                    this.loading=true;
                    let d={
                        content: {
                            memberId: this.$cache.user.memberId,
                            pageNo:this.pageNo,
                            pageSize:this.pageSize,
                            type:this.selected.substr(-1)
                        }
                    };
                    let res=await this.$post('/CRM/appmembermgcust/accountBalance.json ',d);
                    if(res.errcode==0){
                        this.balance=res.content.balance;
                        let list=res.content.detail;
                        this.listItems=this.listItems.concat(list?list:[]);

                        if(res.content.totalPages>this.pageNo){
                            this.pageNo += 1;
                            this.loading = false;
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #meBalance{
        .top{
            height: 1.33rem;
            background: $mainColor;
            padding:0 5%;
            color: #fff;
            margin-bottom: .05rem;
            .title{
                font-size: .15rem;
                padding: .2rem 0; 
            }
            .money{
                font-size: .25rem;
                span{
                    font-size: .45rem;
                    position: relative;
                    top: .02rem;
                }
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
        .navbar-ul{
            height: calc(100% - 1.82rem - 1px);
            overflow: auto;
            li{
                height: .40rem;
                padding: .125rem 5%;
                background: #fff;
                border-bottom: 1px solid #f1f1f1;
                display: flex;
                justify-content: space-between;
                .left{
                    .title{
                        font-size: .15rem;
                        color: #22222d;
                    }
                    .time{
                        font-size: .12rem;
                        color: #88888d;
                        margin-top: .08rem;
                    }
                }
                .right{
                    font-size: .15rem;
                    color: $mainColor
                }
            }
        }
        
    }
</style>
