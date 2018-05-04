<template>     
    <app-layout id="serverDetail"  >
        <router-link tag="div" slot="aside" class="serverDetail-edit" to="/server/list?action=update">更换顾问</router-link>
        
        <div class="info-box">
            <div class="head-box">
                <div  class="phone"></div>
                <div :style="content.imgUrl ? {'background-image':'url('+content.imgUrl+')'}:{'background-image':'url('+default_server+')'}"   class="head"></div>
                <a :href="'tel:'+content.phone">
                    <img src="~assets/img/phone.png" alt="" class="phone">
                </a>
            </div>
            <div class="name-box">
                <span class="name">{{content.name}}</span>
                <span class="level" v-show="content.positionalTitle">{{content.positionalTitle}}</span>
                <span class="job">{{content.station}}</span>
            </div>
            <div class="star-box">
                <div class="star severStar">
                    <span :style="{'width':+severStar/5*content.compScore+'px'}">★★★★★</span>
                </div>
                <span class="level">{{content.compScore}}</span>
                <span class="num">{{content.orders}}单</span>
            </div>
            <div class="score-box">
                <span>服务质量{{content.qualScore}}</span>
                <span>服务效率{{content.effiScore}}</span>
                <span>服务态度{{content.attiScore}}</span>
            </div>
        </div>
        <div class="label-box" v-if="content.appraiseTagList&&content.appraiseTagList.length>0">
            <div class="title">评价标签</div>
            <ul class="label-ul" :class="{overflow:isHidden}">
                <li v-for="(item,index) in content.appraiseTagList">{{item.appraiseTag}}<span>{{item.appraiseNumber}}</span></li>
            </ul>
            <div class="arrow-box" @click="isHidden=!isHidden" v-show="content.appraiseTagList.length>6">
                <div class="arrow-bottom" v-if="isHidden" ></div>
                <div class="arrow-top" v-else ></div>
            </div>
        </div>
        <div class="comment-box">
            <div class="title">服务评价</div>
            <ul class="comment-ul" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
                <li v-for="(item,index) in commentList">
                    <div class="user-box">
                        <div class="head" :style="item.memberHeadPortrait ? {'background-image':'url('+item.memberHeadPortrait+')'}:{'background-image':'url('+default_server+')'}"></div>
  
                        <div class="name-star">
                            <div class="name">{{item.memberName}}</div>
                            <div class="star-box">
                                <div class="star userStar">
                                    <span :style="{'width':userStar/5*item.compScore+'px'}">★★★★★</span>
                                </div>
                                <span class="level">{{item.compScore}}</span>
                            </div>
                        </div>
                        <div class="time">{{item.appraiseTime}}</div>
                    </div>
                    <div class="comment">{{item.appraise}}</div>
                    <ul class="appraiseImg-ul" v-show="item.appraiseImg.length>0">
                        <li v-for="(val,inx) in item.appraiseImg" :style="{'background-image':'url('+val+')'}" @click="previewImg(val)"></li>
                    </ul>
                    <div class="answer" v-show="item.merchantReply!=''">{{item.merchantReply}}</div>
                </li>
                
            </ul>
        </div>
        
        <div slot="footer" class="nextOne"><router-link class="btn" to="/maintenance">找他预约</router-link></div>
    </app-layout>
    
</template>
<script>
    export default {
        name:'ex-servarDetail',
        data(){
            return{
                cid:'',
                sid:'',
                fid:'',
                default_server:require('assets/img/default_server.png'),
                isHidden:true,
                content:'',
                nomore: false,
                commentList: [],
                pageNo: 1,
                pageSize: 10,
                severStar:0,
                userStar:0
            }
        },
        mounted(){
            let cache=this.$cache;
            this.cid=cache.car.carId;
            this.sid=cache.server.id;
            this.fid=cache.fourS.id;

            this.getData();
            this.loadMore()
            this.severStar=document.querySelector('.severStar').offsetWidth-2;
        },
        methods:{
            async getData () {
                let d={
                    content: {
                        id:this.sid
                    }
                };
                let res = await this.$post('/CRM/appbespeak/queryServiceCustDetail.json',d);
                if(res.errcode==0){
                    this.content=res.content;
                }
            },
            async loadMore (){
                this.nomore = true;
                
                let d={
                    content: {
                        queryType:'20',
                        foursId:this.fid,
                        pageSize: this.pageSize,
                        pageNo:this.pageNo,
                        serviceCustId:this.sid,
                        pictureArr:[]
                    }
                };
                let res = await this.$post('/CRM/appbespeak/queryAppraiseInfoWithReply.json', d);

                if (res.errcode === 0) {
                    let list = res.content.appraiseList;
                    this.commentList = this.commentList.concat(list);
                    this.pictureArr=[];
                    for(let i=0;i<this.commentList.length;i++){
                        for(let j=0;j<this.commentList[i].appraiseImg.length;j++){
                            this.pictureArr.push(this.commentList[i].appraiseImg[j])
                        }
                    }
                    
                    this.$nextTick(()=>{
                        if(this.commentList.length>0){
                            this.userStar=document.querySelector('.userStar').offsetWidth;
                        }
                    })

                    if (res.content.totalPages > this.pageNo) {
                        this.pageNo += 1;
                        this.nomore = false;
                    }
                }  
            },
            previewImg(img){
                var that = this;
                wx.ready(function () {
                    wx.previewImage({
                        current: img, // 当前显示图片的http链接
                        urls: that.pictureArr // 需要预览的图片http链接列表
                    })
                })
                
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #serverDetail{
        .serverDetail-edit{
            color: #fff;
            font-size: .12rem;
            position: fixed;
            z-index: 204;
            right: 5%;
            top: 0;
            height: .4rem;
            line-height: .4rem;
        } 
        .info-box{
            padding-top: .25rem;
            padding-bottom: .1rem;
            background: #fff;
            margin-bottom: .05rem;
            .head-box{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: .15rem;
                .phone{
                    width: .3rem;
                    height: .3rem;
                    
                }
                .head{
                    height: .7rem;
                    width: .7rem;
                    border:1px solid #dfdfdf;
                    box-sizing: border-box;
                    border-radius: 50%;
                    margin: 0 .28rem;
                    background-size: cover;
                    background-position:center
                }
            }
            .name-box{
                display: flex;
                justify-content: center;
                align-items: center;
                .name{
                    font-size: .17rem;
                    color: #22222d;
                    margin: 0 .04rem;
                }
                .level{
                    background: #e94816;
                    color: #fff;
                    height: .17rem;
                    line-height: .17rem;
                    padding: 0 .05rem;
                    border-radius: 4px;
                    font-size: .12rem;
                    margin: 0 .04rem;
                }
                .job{
                    background: #88888d;
                    @extend .level;
                }
            }
            .star-box{
                display: flex;
                justify-content: center;
                align-items: center;
                margin: .08rem 0;
                .star{
                    display: block;
                    font-size: 15px;
                    letter-spacing: 3px;
                    position: relative;
                    &::before{
                        content: '\2605\2605\2605\2605\2605';
                        z-index: 1;
                        display: block;
                    }
                    span{
                        position: absolute;
                        z-index: 2;
                        top: 0;
                        left: 0;
                        display: block;
                        color: orangered;
                        overflow: hidden;
                        clear: both;
                    }
                }
                .level{
                    background: #e94816;
                    color: #fff;
                    height: .15rem;
                    line-height: .15rem;
                    padding: 0 .05rem;
                    border-radius: 4px;
                    font-size: .12rem;
                    margin: 0 .03rem;
                    margin-right: .1rem
                }
                .num{
                    color: #55555d;
                    font-size: .15rem;
                }
            }
            .score-box{
                display: flex;
                justify-content: center;
                align-items: center;
                color: #6e6e6e;
                font-size: .1rem;
                span{
                    margin: 0 .08rem;
                }
            }
            
        }
        .label-box{
            padding: .15rem .19rem 0;
            background: #fff;
            margin-bottom: .05rem;
            .title{
                font-size: .15rem;
                color: #22222d;
                margin-bottom: .15rem;
            }
            .overflow{
                overflow: hidden;
                max-height: .7rem;
            }
            .label-ul{
                font-size: 0;
                li{
                    display: inline-block;
                    border:1px solid #dfdfdf;
                    border-radius: 3px;
                    color: #88888d;
                    font-size: .12rem;
                    height: .26rem;
                    line-height: .26rem;
                    padding: 0 .06rem;
                    margin-right: .08rem;
                    margin-bottom: .08rem;
                    span{
                        margin-left: .08rem
                    }
                }
            }
            .arrow-box{
                position: relative;
                left: 0;
                bottom: 0;
                right: 0;
                top: 0;
                margin: auto;
                width: 8px;
                height: 5px;
                padding: .15rem 1rem;
                .arrow-bottom{
                    position: relative;
                    &::before{
                        content: '';
                        width: 7px;
                        height: 0;
                        border-top:1px solid #88888d;
                        position: absolute;
                        transform: rotate(45deg);
                        left: -2px;
                    };
                    &::after{
                        content: '';
                        width: 7px;
                        height: 0;
                        border-top:1px solid #88888d;
                        position: absolute;
                        transform: rotate(-45deg);
                        left: 2px;
                    }
                }
                .arrow-top{
                    position: relative;
                    &::before{
                        content: '';
                        width: 7px;
                        height: 0;
                        border-top:1px solid #88888d;
                        position: absolute;
                        transform: rotate(45deg);
                        left: 2px;
                    };
                    &::after{
                        content: '';
                        width: 7px;
                        height: 0;
                        border-top:1px solid #88888d;
                        position: absolute;
                        transform: rotate(-45deg);
                        left: -2px;
                    }
                }
            }
        }
        .comment-box{
            background: #fff;
            margin: 0;
            .title{
                font-size: .15rem;
                color: #22222d;
                padding:.15rem .19rem ;
            }
            .comment-ul{
                padding-bottom: .1rem;
                >li{
                    &:last-child{
                        border: 0
                    }
                    padding: .15rem .19rem;
                    border-bottom: 1px solid #f1f1f1;
                    .user-box{
                        display: flex;
                        justify-content: space-between;
                        .head{
                            width: .3rem;
                            height: .3rem;
                            border-radius: 50%;
                            border: 1px solid #f2f2f2;
                            box-sizing: border-box;
                            background-size: cover;
                            background-position: center;
                        }
                        .name-star{
                            flex: 1;
                            margin-left: .1rem;
                            .name{
                                font-size: .12rem;
                                color: #22222d;
                                margin-top: -.02rem;
                            }
                            .star-box{
                                display: flex;
                                align-items: center;
                                .star{
                                    display: block;
                                    font-size: 12px;
                                    letter-spacing: 2px;
                                    position: relative;
                                    &::before{
                                        content: '\2605\2605\2605\2605\2605';
                                        z-index: 1;
                                        display: block;
                                    }
                                    span{
                                        position: absolute;
                                        z-index: 2;
                                        top: 0;
                                        left: 0;
                                        display: block;
                                        color: orangered;
                                        overflow: hidden;
                                        clear: both;
                                    }
                                }
                                .level{
                                    background: #e94816;
                                    color: #fff;
                                    margin-top: 1px;
                                    height: .13rem;
                                    line-height: .13rem;
                                    padding: 0 .04rem;
                                    border-radius: 3px;
                                    font-size: .1rem;
                                    margin-left: .03rem;
           
                                }
                            }
                        }
                        .time{
                            color: #88888d;
                            font-size: .11rem;
                        }
                    }
                    .comment{
                        color: #88888d;
                        font-size: .12rem;
                        margin-left: .4rem;
                        margin-top: .05rem
                    }
                    .appraiseImg-ul{
                        margin-left: .4rem;
                        margin-top: .08rem;
                        display: flex;
                        li{
                            background-size: cover;
                            background-position: center;
                            height: .4rem;
                            width: .4rem;
                            margin-right: .04rem;
                        }
                    }
                    .answer{
                        background: #f2f2f2;
                        border: 1px solid #dfdfdf;
                        padding: .05rem .1rem;
                        border-radius: 4px;
                        margin-left: .4rem;
                        position: relative;
                        margin-top: .1rem;
                        &::before{
                            content: '';
                            width: 0;
                            height: 0;
                            line-height: 0;
                            border-left: .06rem solid transparent;
                            border-right: .06rem solid transparent;
                            border-bottom: .08rem solid #dfdfdf;
                            position: absolute;
                            top: -.08rem;
                            left: .12rem;
                        };
                        &::after{
                            content: '';
                            width: 0;
                            height: 0;
                            line-height: 0;
                            border-left: .06rem solid transparent;
                            border-right: .06rem solid transparent;
                            border-bottom: .08rem solid #f2f2f2;
                            position: absolute;
                            top: -.07rem;
                            left: .12rem;
                        }
                    }
                }
            }
        }
    }
    
</style>
