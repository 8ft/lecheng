 <template>
 <app-layout id="lotteryRecords">

    <header style="position: relative;">
        <img class="banner" :src="banner">
    </header>

    <template v-for="item in list">
        <div class="time"><span>{{item.winTime}}</span></div>
        <div class="record">
            <div class="box"><h2 class="flex">奖项</h2><h2 class="flex2">奖品</h2></div>
            <div class="box"><span class="flex">{{item.prizeLevel}}</span><span class="flex2">{{item.prizeName}}</span></div>

            <template v-if="item.isWriteEnable==='0'&&'12358'.match(item.prizeType)">
                <div class="box"><h2 class="flex">收件信息</h2></div>
                <div class="addr">
                    <div><span class="flex">收件人：{{item.receiverName}}</span><span class="flex">联系电话：{{item.receiverNumber}}</span></div>
                    <p v-if="item.prizeType==='1'">收货地址：{{item.receiverAddress}}</p>
                </div>
            </template>
            
            <div v-if="item.isWriteEnable==='0'&&'3568'.match(item.prizeType)" class="exchangeCode clearfix">
                <h1><i>i</i>兑换码：{{item.cdkey}}</h1>
                <p v-if="item.ticketTip" v-html="resolveTip(item.ticketTip)"></p>
            </div>

            <div v-if="item.prizeType==='0'" class="exchangeCode clearfix">
                <p v-if="item.ticketTip" v-html="resolveTip(item.ticketTip)"></p>
            </div>

            <div class="error clearfix" v-if="item.isWriteEnable==='1'"><h1><i>!</i>还未添加领奖信息</h1><router-link :to="'./addInfo?aid='+aid+'&pid='+item.drawId+'&type='+item.prizeType">添加领奖信息</router-link><p>*恭喜您获奖，请添加真实完整的领奖信息，因未填写或填写错误引起的奖品无法寄送收到，活动主办方有权不再补发奖品。</p></div>
        </div>
    </template>

    <p v-if="banner&&list.length<=0" id="nothing">你还未中奖，要加油哦！</p>
        
 </app-layout>
 </template>
 
<script>
export default {
    data() {
        return {
            mid: this.$cache.user.memberId,
            aid: this.$route.query.aid,
            banner:'',
            list:[],
            st: 0
        };
    },
    activated() {
        this.getList();
        if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
    },
    beforeRouteLeave(to, from, next) {
        this.st = this.$el.children.appMain.scrollTop;
        next();
    },
    methods: {
        async getList(){
            let res=await this.$post('/CRM/wechatluckydraw/queryWinPrizeInfo.json',{content:{memberId:this.mid,activityId:this.aid}});

            if (res.errcode === 0) {
                this.banner=res.content.recordImg;
                if(parseInt(res.content.recordSize)>0){
                    this.list=res.content.recordList;
                }
            } 
        },
        resolveTip(tip){
            return tip.replace(/[\r\n]/g,"<br>");
        }
    }
}
</script>

 <style lang="scss">
 @import "~assets/css/var.scss";
 
    #lotteryRecords{background: #fff;color:#753823;padding-bottom:.3rem;
        #nothing{text-align:center;margin-top:.3rem;font-size:$h3;}
        .time{text-align: center;span{display: inline-block;background: rgba(0,0,0,.3);color:#fff;padding:.03rem .05rem;border-radius:.05rem;font-size:$h4;margin:.25rem auto .15rem;}}
        .record{width:90%;margin:0 auto;border:1px solid #753823;line-height:.3rem;font-size:$h3;
        
            div{padding:0 .1rem;
                &:nth-of-type(odd){background:#ffeacb;}
                h2{font-size:.14rem;}
            }

            .box{@include box;}

            .flex{@include flex;}
            .flex2{@include flex(2)}

            .addr{padding-bottom:.05rem;
                div{@include box;padding:0;background:#fff;:nth-child(2){text-align:right;}}
                p{line-height: .2rem;width:100%;}
            }

            .exchangeCode{position:relative;padding-bottom:.05rem;
                h1{font-size:$h3;font-weight:600;color:#72af2d;}
                i{display:inline-block;width:.12rem;line-height:.12rem;border-radius:99px;background:#72af2d;color:#fff;text-align:center;font-weight:600;margin-right:.05rem;}
                p{margin-top:.05rem;line-height:.2rem;}
            }

            .error{position:relative;color:#d42a1c;padding-bottom:.05rem;
                h1{font-size:$h3;font-weight:600;}
                i{display:inline-block;width:.12rem;line-height:.12rem;border-radius:99px;background:#d42a1c;color:#fff;text-align:center;font-weight:600;margin-right:.05rem;}
                a{position:absolute;right:.1rem;top:.05rem;line-height:.2rem;color:#fff;background:#d42a1c;padding:0 .05rem;border-radius:5px;}
                p{margin-top:.05rem;line-height:.18rem;}
            }
        }
        
    }
 </style>