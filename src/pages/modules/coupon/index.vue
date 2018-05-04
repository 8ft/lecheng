<template>
    <app-layout id="coupon">
        <mt-navbar slot="header" v-model="selected">
          <mt-tab-item v-for="(item,index) in titleArr" :id="'status'+index" >{{item}}</mt-tab-item>
        </mt-navbar>
        <ul class="coupon-ul" v-show="listItems.length>0" v-infinite-scroll="loadMore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false" infinite-scroll-disabled="loading">
            
            <li v-for="(item,index) in listItems" :key="item.coupon_id" v-if="item.cansend_end_time>nowtime&&item.cansend_start_time<=parseInt(nowtime)+86400">
                <div class="left">
                    <img src="~assets/img/coupon/icon_coupon_pic_general.png" alt="">
                    <div class="coupon-box">
                        <p>{{item.coupon_name}}</p>
                        <div><span :class="{blue:selected=='status0',yellow:selected=='status1'}" style="font-size:.13rem;margin:0">¥</span><span :class="{blue:selected=='status0',yellow:selected=='status1'}">{{item.deduct_money}}</span><em>{{item.condition}}</em></div>
                    </div>
                </div>
                <div  :class="{right:true,blue:selected=='status0',yellow:selected=='status1'}">

                    <div class="time" v-if="item.cansend_start_time>nowtime">
                        <p>距离开抢还剩</p>
                        <div class="surplus-box" :class="{blue:selected=='status0',yellow:selected=='status1'}">
                            <div class="surplus">{{$countDown((item.cansend_start_time-nowtime)*1000)[0]}}</div>
                            <span class="point">:</span>
                            <div class="surplus">{{$countDown((item.cansend_start_time-nowtime)*1000)[1]}}</div>
                            <span class="point">:</span>
                            <div class="surplus">{{$countDown((item.cansend_start_time-nowtime)*1000)[2]}}</div>
                        </div>
                        
                    </div>

                    <img src="~assets/img/coupon/icon_coupon_get.png" alt="" v-else-if="item.userlimit_quantity<=item.hasgetnum||(item.hasgetnum>0&&item.send_couponcode_quantity>=item.max_gen_quantity&&item.userlimit_quantity>item.hasgetnum)">

                    <img src="~assets/img/coupon/icon_coupon_empty.png" alt="" v-else-if="item.send_couponcode_quantity>=item.max_gen_quantity">

                    <div class="time"  v-show="item.userlimit_quantity>item.hasgetnum&&item.send_couponcode_quantity<item.max_gen_quantity&&item.cansend_start_time<=nowtime">
                        <!-- <p>剩余{{parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)}}%</p>
                        <div class="progress">
                            <div :style="{'width':(item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100+'%'}"></div>
                        </div> -->
                        <div class="canvas-box" >
                            <canvas  class="canvas" :width="canvasWid" :height="canvasWid" :num="parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)==0?Math.ceil((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100):parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)"></canvas>
                            <div class="canvas-circle" :class="{blue:selected=='status0',yellow:selected=='status1'}">
                                <div class="text-box">
                                    <div>剩余</div>
                                    <div>{{parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)}}%</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div class="btn" v-if="(item.hasgetnum==0&&item.send_couponcode_quantity>=item.max_gen_quantity)||item.cansend_start_time>nowtime" v-show="selected=='status0'" @click="use(item.type,item.coupon_id)">去逛一逛</div>
                    <div class="btn" v-else-if="item.userlimit_quantity<=item.hasgetnum||(item.hasgetnum>0&&item.send_couponcode_quantity>=item.max_gen_quantity&&item.userlimit_quantity>item.hasgetnum)" v-show="selected=='status0'" @click="use(item.type,item.coupon_id)">立即使用</div>
                    <div class="btn" v-else @click="receive(index,item.coupon_id,item.hasgetnum,item.send_couponcode_quantity)">立即领取</div>
                    
                </div>
            </li>
            
        </ul>
        <div  class="lc-error" v-show="listItems.length==0">
            <img src="~assets/img/error-empty.png">
            <p>抱歉，暂无优惠券</p>
        </div>
        <!-- <div class="mint-indicator-mask" v-show="isclick"></div> -->
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                titleArr:['优惠券','乐橙券'],
                selected:'status0',
                selNum:0,
                // pageNo:1,
                pageSize:10,
                loading1:false,
                listItems1:[],//优惠券
                loading2:false,
                pageNo1:1,
                listItems2:[],//乐橙券
                pageNo2:1,
                nowtime:null,
                cleartime:'',
                canvasHtml:'',
                canvasWid:parseInt(document.documentElement.clientWidth/375*48),
                // isclick:false
            }
        },

        activated(){ 
            this.resetPage()
            this.loadMore()
            clearInterval(this.cleartime)
            this.cleartime=setInterval(()=>{  
                // let now=new Date().getTime().toString()
                // this.nowtime=now.substr(0,10)
                this.nowtime=this.nowtime+1
            },1000)
               
        },

        deactivated(){
            clearInterval(this.cleartime)
        },
        computed:{
            listItems(){
                if(this.selected=='status0'){
                    return this.listItems1
                }else{
                    return this.listItems2
                }
            },
            pageNo(){
                if(this.selected=='status0'){
                    return this.pageNo1
                }else{
                    return this.pageNo2
                }
            },
            loading(){
                if(this.selected=='status0'){
                    return this.loading1
                }else{
                    return this.loading2
                }
            },
        },
        watch: {
            selected(val) {
                if((this.listItems1.length==0&&this.pageNo1==1)||(this.listItems2.length==0&&this.pageNo2==1)){
                    this.loadMore();
                }else{
                    
                    this.$nextTick(()=>{
                        this.loadCanvas()
                    })
                   
                }
                
            }
        },
        methods:{
            // selTab(index){
            //     if(index!=(this.selNum%2)){
            //         this.resetPage();
            //         this.loadMore();
            //         this.selNum++
            //     }
            // },
            use(type,id){
                switch(type){
                    case 'meirong':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cosmetology');
                        }else{
                            this.$router.push('/beauty');
                        }
                    break;
                    
                    case 'cargoods':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cargoods_with_coupon',id);
                        }else{
                            this.$router.push('/mall/cargoods?cpid='+id);
                        }
                    break; 

                    case 'yiye':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cargoods_with_coupon',id);
                        }else{
                            this.$router.push('/partners');
                        }
                    break;

                    case 'salecar':
                    case 'xiche':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cargoods_with_coupon',id)
                        }else{
                            this.$utils.downLoad(this.$messagebox,'请下载APP', '微信版暂无此功能');
                        }
                    break;
                    
                }
            },
            loadCanvas(){
                CanvasRenderingContext2D.prototype.sector = function(x, y, radius, sDeg, eDeg) {
                    this.save()
                    this.beginPath();
                    this.moveTo(x, y);
                    this.arc(x, y, radius, sDeg, eDeg, false);
                    this.closePath();
                    this.restore();
                    return this;
                }

                var canvasArr = document.querySelectorAll('.canvas');
                for(let i=0;i<canvasArr.length;i++){
                    var num=canvasArr[i].getAttribute('num')/100
                    var ctx = canvasArr[i].getContext('2d');
                    ctx.clearRect(0, 0, this.canvasWid, this.canvasWid);
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.sector(this.canvasWid/2, this.canvasWid/2, this.canvasWid/2, 0, Math.PI / 180 * 84 * 3.6).fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.sector(this.canvasWid/2, this.canvasWid/2, this.canvasWid/2, 0, Math.PI / 180 * 84* num * 3.6).fill();
                }
            },
            resetPage(){
                this.pageNo1=1;
                this.loading1=false;
                this.listItems1=[];

                this.pageNo2=1;
                this.loading2=false;
                this.listItems2=[];
            },
            async loadMore () {
                // if(!this.loading){
                    if(this.selected=='status0'){
                        this.loading1=true; 
                    }else{
                        this.loading2=true; 

                    }
                    
                    let res;
                    let d={
                        content: {
                            memberId: this.$cache.user.memberId,
                            mobile:this.$cache.user.phone,
                            pageSize:this.pageSize,
                            pageNo:this.pageNo
                        }
                    };
                    if(this.selected=='status0'){
                        
                        res = await this.$post('/couponSys/appcoupon/centerOnlinelist.json',d);
                    }else if(this.selected=='status1'){
                        
                        res = await this.$post('/couponSys/appcoupon/centerlist.json',d);
    
                    }
                    if(res.errcode==0){
                        // if(this.pageNo==1){    
                        //      this.listItems=[];  
                        // }
                        this.nowtime=Number(res.content.time)-1;
                        let list=res.content.list;
                        if(this.selected=='status0'){
                            this.listItems1=this.listItems1.concat(list?list:[]);
                        }else{
                            this.listItems2=this.listItems2.concat(list?list:[]);
                        }
                        
                        setTimeout(()=>{
                            this.$nextTick(()=>{
                                this.loadCanvas()
                            })
                        },10)
                        
                        if(res.content.totalPages>this.pageNo){
                            if(this.selected=='status0'){
                                this.pageNo1 += 1;
                                this.loading1 = false;
                            }else{
                                this.pageNo2 += 1;
                                this.loading2 = false;
                            }
                            
                            
                        }else{
                            if(this.selected=='status0'){
                                this.pageNo1 += 1;
                                this.loading1 = true;
                            }else{
                                this.pageNo2 += 1;
                                this.loading2 = true;
                            }
                        }
                        
                    }
                    
                // }
                
            }, 
            async receive(index,id,hasgetnum,couponcode){
                
                let res;
                if(this.selected=='status0'){
                    let d={
                        content: {
                            memberId: this.$cache.user.memberId,
                            id:id,
                            receiveType:1
                        }
                    };
                    res = await this.$post('/couponSys/appcoupon/receiveOnCoupon.json',d);
                }else if(this.selected=='status1'){
                    let d={
                        content: {
                            memberId: this.$cache.user.memberId,
                            id:id
                        }
                    };
                    res = await this.$post('/couponSys/appcoupon/receive.json',d);
                }
                
                if(res.errcode==0){
                    if(this.selected=='status0'){
                        this.listItems1[index].hasgetnum=++hasgetnum;
                        this.listItems1[index].send_couponcode_quantity=++couponcode;
                    }else{
                        this.listItems2[index].hasgetnum=++hasgetnum;
                        this.listItems2[index].send_couponcode_quantity=++couponcode;
                    }
                    
                    
                    setTimeout(()=>{
                        this.$nextTick(()=>{
                            this.loadCanvas()
                        })
                    },10)
                    this.$toast('领取成功')
                }else{
                    this.resetPage();
                    this.loadMore();
                    this.$toast(res.msg)
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #coupon{
        .canvas-box{
            width: .48rem;
            height: .48rem;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
            .canvas{
                z-index: 2;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: .48rem;
                height: .48rem;
                margin: auto;
                transform: rotate(120deg);
            }
            .canvas-circle{
                font-size: .12rem;
                text-align: center;
                color: #fff;
                z-index: 3;
                width:.42rem;
                height: .42rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                border-radius: 50%;
                .text-box{
                    margin-top: .05rem
                }
                &.blue{
                    background: #44aae5;
                }
                &.yellow{
                    background: #f29600
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
        font-size: .12rem;
        color: #88888d;
        .coupon-ul{
            width: 90%;
            margin-left: 5%;
            padding-bottom: .2rem;
            li{
                width: 100%;
                height: .97rem;
                background: #fff;
                margin-top: .18rem;
                border-radius: 4px;
                display: flex;
                .left{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    img{
                        width: .65rem;
                        height: .65rem;
                        margin:0 .1rem;
                    }
                    .coupon-box{
                        height: .65rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        flex: 1;
                        margin-right: .08rem;
                        p{
                            font-size: .13rem;
                            word-break: break-all;
                            color: #22222d;
                        }
                        div{
                            span{
                                font-size: .24rem;
                                margin-right: .03rem;
                                font-weight: 600;
                                &.blue{
                                    color: #44aae5;
                                }
                                &.yellow{
                                    color: #e94816
                                }
                            }
                            em{
                                    font-style: normal;
                            }
                        }
                    }
                }
                .right{
                    text-align: center;
                    width: .9rem;
                    height: 100%;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    &.blue{
                        background: url('~assets/img/coupon/background_coupon_shopping_right.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.yellow{
                        background: url('~assets/img/coupon/background_coupon_shopping_right_yellow.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    .time{
                        position: relative;
                        color: #fff;
                        text-align: center;
                        .surplus-box{
                            display: flex;
                            justify-content: center;
                            &.blue{
                                    color: #44aae5;
                            }
                            &.yellow{
                                color: #e94816;
                            }
                            .surplus{
                                width: .16rem;
                                height: .16rem;
                                background: #fff;
                                line-height: .16rem;
                                text-align: center;
                                font-weight: 600;
                            }
                            .point{
                                margin: 0 .05rem;
                                color: #fff;
                            }
                        }
                        p{
                            font-size: .13rem;
                            margin-bottom: .08rem;
                        }
                        .progress{
                            width: .65rem;
                            height: .05rem;
                            background: rgba(0,0,0,.15);
                            border-radius: .05rem;
                            margin-top: .08rem;
                            position: relative;
                            div{
                                position: absolute;
                                left: 0;
                                top: 0;
                                border-radius: .05rem;
                                width: 80%;
                                height: 100%;
                                background: #fff;
                            }
                        }
                    }
                    img{
                        width: .48rem;
                        height: .48rem;
                        text-align: center;
                        // margin-top: .1rem;
                    }
                    .btn{
                        
                        height: .2rem;
                        line-height: .2rem;
                        padding: 0 .08rem;
                        display: inline-block;
                        border:1px solid #fff;
                        border-radius: .2rem;
                        text-align: center;
                        color: #fff;
                        margin-top: .08rem;
                    }
                }
            }
        }
    }
</style>
