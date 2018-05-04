<template>
    <app-layout id="coupon_details" >
        <li>
            <div :class="{top:true,yellow:item.status=='nouse',dis:item.status=='overdue'||item.status=='hasuse'}">
                <div class="title">{{item.coupon_name}}</div>
                <div class="money">
                    <div><span>¥</span>{{item.deduct_money}}</div>
                    <span v-if="item.thresholdType==2">满任意金额可用</span>
                    <span v-else>满{{item.limit_money}}元可用</span>
                </div>
            </div>
            <div class="bottom" :style="item.apply_stores==''?'padding-bottom:.2rem':''">
                <div class="code-box">
                    <span style="margin-right:.1rem">券码</span>
                    <span style="font-size:.2rem" v-if="item.verification_code">
                        <template v-for="(val,inx) in Math.ceil(item.verification_code.length/4)"> {{item.verification_code.substr(inx*4,4)}}</template>
                    </span>
                </div>
                <img :src="'http://qr.liantu.com/api.php?w=115&m=0&text='+item.verification_code+'&fg=000000'" style="margin:0 auto;display:block"/>
                <div class="con-box">
                    <div class="title">使用有效期</div>
                    <div class="con">{{$format(item.canuse_start_time)}}至{{$format(item.canuse_end_time)}}</div>
                </div>
                <!-- <div class="con-box" v-if="item.apply_stores&&item.apply_stores!=''">
                    <div class="title">适用门店</div>
                    <div class="con">{{item.apply_stores}}</div>
                </div> -->
                <div class="con-box" v-if="item.coupon_desc">
                    <div class="title">使用须知</div>
                    <div class="con">{{item.coupon_desc}}</div>
                </div>

                <div class="stores-btn" @click="seeStore" v-if="item.apply_stores&&item.apply_stores!=''">查看适用门店<span class="arrow"></span></div>
            </div>
        </li>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                item:{},
            }
        },
        activated(){
            this.item=this.$cache.urlquery
        },
        methods:{
            
            seeStore(){
                this.$router.push({path: '/myCoupons/coupon_applystore/'+this.item.coupon_id,params:{id:this.item.coupon_id}})
            }
        }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #coupon_details{
        
        li{color:#fff;width:3.4rem;margin:.15rem auto 0;background:#fff;border-radius:8px;box-shadow: 1px 1px 6px -3px #8c8c8e;display: block;
            .top{height: .65rem;position: relative;display:flex;
                &.blue{background: url('~assets/img/mall/background_card_top.png') no-repeat top center;background-size: 100%;}
                &.yellow{background: url('~assets/img/mall/background_card_top_yellow.png') no-repeat top center;background-size: 100%;}
                &.dis{background: url('~assets/img/mall/background_card_top_over.png') no-repeat top center;background-size: 100%;}
                .title{line-height: .65rem;text-indent: .15rem;font-size:.15rem;width: 70%;@include txtOverflow;}
                .money{font-size: .3rem;line-height:.3rem;font-weight:500;flex:1;text-align: center;display:flex;flex-direction: column;justify-content: center;margin-right:.15rem;text-align:right;
                    div{font-size: .27rem;font-weight:600;position: relative;top:.06rem;
                        span{font-size: .17rem}
                    }
                    span{font-size: .12rem;position: relative;top: -.02rem;    white-space: nowrap;}
                }

            }
            .bottom{
                border:$border;
                border-top:none;
                border-radius:0 8px 8px 8px;
                padding:.2rem  0rem 0;
                position: relative;
                box-sizing:border-box;
                .code-box{
                    line-height: .25rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 2.5rem;
                    margin: .1rem auto;
                    text-align: center;
                    span{
                        color:#22222c;
                        font-size: .13rem
                    }
                }
                .code-img{
                    width:1.15rem;
                    height: 1.15rem;
                    border: 1px solid #000;
                    margin: 0 auto;
                }
                .con-box{
                    padding: 0 .15rem;
                    line-height: .2rem;
                    color: #88878c;
                    margin-top: .18rem;
                    font-size: .12rem;
                    .title{
                        color:#e84615;
                    }
                    .con{
                        white-space: pre-wrap;
                    }
                }
                .stores-btn{
                    margin-top: .18rem;
                    padding: 0 .15rem;
                    height: .44rem;
                    border-top: 1px solid #f2f2f2;
                    line-height: .44rem;
                    color: #23212c;
                    font-size: .15rem;
                    .arrow{
                        position: relative;
                        margin-right: .06rem;
                        float: right;
                        margin-left: .1rem;
                        top: .15rem;
                        &::after{position: absolute;content: '';width: 0;height: 0;top: .02rem;right: -.05rem;border: .06rem solid transparent;border-right: 0;border-left-color: #fff;}
                        &::before{position: absolute;content: '';width: 0;height: 0;top: .02rem;border: .06rem solid transparent;border-right: 0;border-left-color: #999;}
                    }
                }
                
            }
            
        }
    }
</style>
