<template>
    <app-layout id="helpRedRecord" >
        <div class="top" slot="header">
            <div class="nav">
                <p>累计红包</p>
                <div>{{openNumber}}</div>
            </div>
            <div class="nav">
                <p>共获{{memberAwardUnit}}</p>
                <div>
                    <span>{{memberAward}}</span>
                    <img src="~assets/img/helpRed/icon_integral.png" alt="">
                </div>
            </div>
        </div>
        <ul class="red-list" v-if="listItems.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
            <li v-for="(item,index) in listItems">
                <div class="left">
                    <p>{{item.createTime}}</p>
                    <div>{{item.helperName}}</div>
                </div>
                <div class="right">
                    <span>+{{item.prizeValue}}</span>
                    <img src="~assets/img/helpRed/icon_integral.png" alt="">
                </div>
            </li>
        </ul>
        <div  class="lc-error" v-else>
            <img src="~assets/img/red-empty.png">
            <p>暂无红包，要加油哦~</p>
        </div>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                pageNo:1,
                pageSize:10,
                loading:false,
                listItems:[],
                openNumber:0,
                memberAward:0,
                memberAwardUnit:''
            }
        },
        activated(){ 
            this.resetPage()
            this.loadMore();
        },
        methods:{
            resetPage(){
                this.pageNo=1;
                this.pageSize=10;
                this.loading=false;
                this.listItems=[];
            },
            async loadMore() {
                if(!this.loading){
                    this.loading=true;
                    let d={
                        content: {
                            activityId:this.$route.params.aid,
                            mbeId: this.$cache.user.memberId,
                            pageNo:this.pageNo,
                            pageSize:this.pageSize,
                            
                        }
                    };
                    let res=await this.$post('/CRM/wechatRedEnvelope/redEnvelopeRecord.json',d);
                    if(res.errcode==0){
                        this.memberAwardUnit=res.content.memberAwardUnit
                        this.openNumber=res.content.openNumber
                        this.memberAward=res.content.memberAward
                        let list=res.content.memberRecordList;
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
    #helpRedRecord{
        font-size: .12rem;
        .top{
            background: #fff;
            
            height: .7rem;
            .nav{
                display: flex;
                align-items: center;
                justify-content:center;
                flex-direction: column;
                text-align: center;
                width: 50%;
                height: 100%;
                float: left;
                p{
                    color: #88888d;
                    margin-bottom:.06rem
                }
                div{
                    color: #e94816;
                    font-size: .18rem;
                    img{
                        width: .09rem;
                        margin-right: -.05rem;
                    }
                }
            }
        }
        .red-list{
            margin-top:.05rem;
            background: #fff;
            li{
                padding: 0 5%;
                height: .65rem;
                border-bottom:1px solid #f2f2f2;
                display: flex;
                align-items: center;
                .left{
                    -webkit-box-flex: 1;
                    flex: 1;
                    
                    p{
                        margin-bottom: .05rem;
                        color: #88888d
                    }
                    div{
                        font-size: .15rem;
                        color: #22222d
                    }
                }
                .right{
                    width: 1rem;
                    text-align: right;
                    float: right;
                    font-size: .18rem;
                    color: #e94816;
                    img{
                        width: .09rem;
                    }
                }
            }
        }
    }
</style>
