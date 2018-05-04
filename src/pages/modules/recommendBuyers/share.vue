<template>
    <app-layout id="recommendBuyersShare">

        <template v-if="pageData.hasRecord==2">
            <div class="main">
                <div class="info">
                    <img class="profile" :src="pageData.memberInfo.memberHeadPortrait">
                    <h1>{{pageData.memberInfo.memberName}}</h1>
                    <h2>送给您一份购车大礼包</h2>
                    <div class="banner">
                        <img :src="pageData.image">
                    </div>
                    <p><label>1</label>盈众老友记推荐客户，尊享<span>VIP购车礼遇；</span></p>
                    <p><label>2</label>购车成功的<span>新车主，</span>赠送<span>1000元购车大礼包；</span></p>
                    <p><label>3</label>推荐成功的<span>老车主，</span>可享<span>500-2000元保养抵用券。</span></p>
                </div>

                <p class="tip">意向在盈众汽车旗下各品牌门店购车客户皆可参加。</p>
                <router-link tag="button" :to="'/recommendBuyers/recommend?id='+$route.params.id">立即报名</router-link>
            </div>

            <div class="aboutUs">
                <div class="con">
                    <p><span>盈众汽车</span>创立于2000，是一家以汽车销售服务业为主的综合性企业，下属<span>50余家品牌汽车4S店，</span>代理<span>十六大汽车品牌，</span>业务覆盖<span>福建全省。</span>公司连续16年保持厦门车市销量冠军。2009年，成为福建省率先突破万辆规模的汽车销售服务企业集团。2016年公司共销售乘用车近55000辆，营业额突破107亿元。</p>
                    <div>盈众汽车集团旗下代理品牌</div>
                    <img src="/CRM/WeChat/App/static/img/recommendBuyers/pic_logo.png">
                </div>
            </div>
        </template>

        <template v-if="pageData.hasRecord==1">
            <div class="aboutAct">
                <img class="banner" :src="pageData.image">
                <h1>您已报名参加盈众老友记活动</h1>
                <h2>请根据流程说明进店购车，享受优惠活动！</h2>
                <router-link :to="'/article/'+pageData.activityRuleId">查看规则详情 》</router-link>
            </div>
            
            <router-link tag="div" class="store" v-for="store in pageData.recommendList" :to="'/stores/'+store.foursId">
                <img class="pic" :src="store.foursImage">
                <h1>{{store.foursName}}</h1>
                <div class="brands">
                    <img v-for="item in store.brandImage.split(',')" :src="item">
                </div>
                <lc-rate disabled v-model="store.score"></lc-rate>
                <div class="addr clearfix"><p>{{store.address}}</p><span>{{getDistance(store.longitude,store.dimension)}}</span></div>
                <div class="arrow-link">查看门店</div>
            </router-link>

            <div slot="footer" class="nextOne"><router-link class="btn" :to="'/recommendBuyers/recommend?id='+$route.params.id">我还要报名</router-link></div>
            
        </template>
        
    </app-layout>
</template>

<script>
    export default {
        data(){
            return{
                myLocation:'',
                pageData:{}
            }
        },
        mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
      },
       activated(){
          this.getData();
      },
      methods: {
        async getData() {
            let data={
                content: {
                    memberId:this.$route.params.id,
                    openId:document.cookie.replace(/(?:(?:^|.*;\s*)openid\s*\=\s*([^;]*).*$)|^.*$/, "$1")
                }
            };

            let res=await this.$post('/CRM/wechatrecommendbuycar/invitationLetter.json',data);
            if(res.errcode==0){
                let con=res.content;
                this.pageData=con;
                if(con.hasRecord==1){eventBus.$emit('layout');}
            }
        },
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        }
      }
    }
    
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #recommendBuyersShare{
        .main{padding:1.1rem .2rem .15rem;
            background:url('/CRM/WeChat/App/static/img/recommendBuyers/bg_oldfriends.png') no-repeat 0 -.2rem,
                linear-gradient(to bottom,#ffa230 0%,#ff5130 100%);
            background-size:100% ;

            .info{color:$black;text-align:center;background:#fff;border-radius:10px;padding:.3rem .15rem .15rem;position: relative;line-height:.2rem;
                .profile{position: absolute;width:.46rem;height:.46rem;top:-.23rem;left:50%;margin-left:-.23rem;border-radius: 50%;}
                h2{color:$gray;margin-top:.05rem;}
                .banner{position: relative;height:1.4rem;margin:.3rem 0 .1rem;padding-bottom:.15rem;border-bottom:$border;
                    &:before{content:'';position:absolute;top:-.26rem;left:50%;margin-left:-.635rem;z-index:2;width:1.27rem;height:.565rem;background:url('/CRM/WeChat/App/static/img/recommendBuyers/icon_banner_gift.png') no-repeat center;background-size:100%;}
                    img{width:100%;height:100%;}
                }
                p{text-align: left;margin-top:.05rem;font-size:$h3;
                    label{background:#fb770a;border-radius:50%;color:#fff;font-size:$h4;padding:0 .03rem;margin-right:.05rem;}
                    span{color:#e83a18;font-weight: bold;}
                }
            }

            .tip{color:#fff;font-size:$h3;text-align: center;margin:.1rem auto;}

            button{color:#761e1d;line-height: .4rem;width:100%;border-radius:99px;@include transColor_t2b(#ffe668,#feb626);}
        }

        .aboutUs{background:#fff;padding:.4rem .2rem;
            .con{border:1px solid #761e1d;border-radius: 8px;padding:.3rem .1rem .1rem;position: relative;font-size:$h3;
                p{line-height:.2rem;text-indent:.24rem;span{color:#e83a18;}}
                &:before{content:'';position:absolute;top:-.2rem;left:50%;margin-left:-1.06rem;z-index:2;width:2.12rem;height:.325rem;background:url('/CRM/WeChat/App/static/img/recommendBuyers/icon_title_introduce.png') no-repeat center;background-size:100%;}
                div{width:1.82rem;line-height: .25rem;background:#e83a18;color:#fff;text-align: center;border-radius:99px;margin:.2rem auto;}
                img{width:100%;}
            } 
        }

        .aboutAct{margin-bottom:.05rem;background:#fff;text-align:center;font-size:$h3;padding-bottom:.1rem;
            img{margin-bottom:.2rem;}
            h1{color:$black;font-size:$h2;}
            h2{color:$gray;margin:.05rem 0;}
            a{color:$mainColor;text-decoration: $mainColor;}
        }

        .store{display:block;position: relative;padding:.1rem .2rem .1rem 1.05rem;background: #fff;border-bottom:$border;min-height:.7rem;
            .pic{position:absolute;left:.2rem;top:.1rem;width:.7rem;height:.7rem;}
            .brands{height: .2rem;
                img{width:.2rem;height:.2rem;margin-right:.05rem;}
            }

            .addr{font-size:$h4;color:$gray;
                p{width:70%;@include txtOverflow;float: left;}
                span{float:right;}
            }

            .arrow-link{font-size:$h3;color:$gray;position:absolute;right:0;top:.1rem;padding-right:.3rem;}
        }
    
    }
</style>

