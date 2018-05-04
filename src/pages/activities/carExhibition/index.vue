<template>
  <app-layout id="carExhibition">

    <div class="header">
        <img :src="data.img">
        <h1>{{data.name}}</h1>
        <h2>活动时间：{{data.startTime}} 至 {{data.endTime}}</h2>
    </div>

    <div class="part">
        <div class="pd base">
            <div><span>￥<b>{{data.deposit}}</b></span>意向金</div>
            <div class="joinNum" v-if="data.showJoinNumber==='1'"><span>{{data.numberOfSignUp?data.numberOfSignUp:'0'}}</span>人报名</div>
            <div class="countDown">{{data.countdown}}</div>
        </div>
        <div class="pd promise clearfix">
            <div>
                <img src="~assets/img/carExhibition/icon_dj.png">
                <h1>低价保证</h1>
                <p>活动现场订车专享<br>低价购车服务保障</p>
            </div>
            <div>
                <img src="~assets/img/carExhibition/icon_tk.png">
                <h1>意向金政策</h1>
                <p>缴交意向金的用户<br>可享活动优惠</p>
            </div>
        </div>
    </div>

    <div class="server clearfix" v-if="server.name">
        <img class="profile_bg" src="~assets/img/carExhibition/icon_guwen.png">
        <div class="profile"><img :src="server.headSculpture?server.headSculpture:default_profile"></div>
        <a :href="'tel:'+server.mobilePhone"><img class="call" src="~assets/img/carExhibition/button_guwen_phone.png"></a>
        <h1>{{server.name}}</h1>
        <p>{{server.belong4sName}}</p>
    </div>

    <div class="part">
        <h1 class="pd title">活动详情</h1>
        <div class="pd article" v-html="data.detail&&data.detail.replace(/data-src/g,'src')"></div>
    </div>

    <div class="part" v-if="data.showFours==='1'">
        <h1 class="pd title">经销商信息</h1>
        <ul class="seller">
            <li class="pd" v-for="(item,index) in data.joinFoursList" v-if="index<3||showAllSeller">
                <h1>{{item.foursName}}({{item.brandName}})</h1>
                <p>{{item.address}}</p>
                <a :href="'http://api.map.baidu.com/marker?location='+item.latitude+','+item.longitude+'&title='+encodeURI(item.foursName)+'&content='+encodeURI(item.address)+'&output=html'"><img src="~assets/img/carExhibition/button_addressguide.png"></a>
                <a :href="'tel:'+item.phoneNumber"><img src="~assets/img/carExhibition/button_list_phone.png"></a>
            </li>
            <li class="showAllSeller" v-if="data.joinFoursList.length>3"  v-on:click="showAllSeller=showAllSeller?false:true">
                {{showAllSeller?'收起':'点击展开更多'}}
            </li>
        </ul>
    </div>

    <div class="part">
        <h1 class="pd title">参与活动流程</h1>
        <div class="pd steps">
            <img :src="data.processImg">
        </div>
    </div>

    <div slot="footer" class="nextTwo clearfix">
        <router-link to="/carExhibition/orders">查看我的报名</router-link>
        <router-link :to="$route.fullPath.replace('?','/signUp?')" :class="data.vstatus!==1?'dis':''">{{getBtnTxt(data.vstatus)}}</router-link>
    </div>

  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          data:{},
          server:{},
          default_profile: require('assets/img/default_user.png'),
          showAllSeller:false
        }
      },
      activated(){
        this.getData();
      },
      methods: {
        getBtnTxt(s){
            switch(s){
                case 0:
                    return '未开始';
                break;
                case 1:
                    return '立即报名';
                break;
                case 2:
                    return '已满额';
                break;
                case 3:
                    return '已结束';
                break;
            }
        },
        async getData(){
            let aid=this.$route.query.aid,
                sid=this.$route.query.sid||'',
                d={content: {
                    id: aid,
                    consultantId:sid
                }};

            let res=await this.$post('/CRM/wechatautoshow/autoShowDetail.json',d);
            if(res.errcode==0){
                let con=res.content;
                this.data=con;
                this.server=con.consultantInfo;

                //分享内容
                let shareData={
                    share_title:con.name,
                    share_desc:con.description,
                    share_img:con.shareImg,
                    share_url:location.origin+'/wxwap?#'+location.href.split('#')[1]
                }
                this.$utils.shareConfig(shareData);  
            }
        }
      }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";

    #carExhibition{font-size:$h3;padding-bottom:.51rem;

        .header{
            text-align:center;
            img{width:100%;}
            h1{@include bold;}
            h2{color:$gray;}
        }

        .part{
            background:#fff;margin:.1rem 0;
            .title{@include bold;border-bottom: 1px solid hsla(0,0%,93%,.6);}
            .title::before{content:'';display:inline-block;width:.12rem;height:.12rem;margin-right:.05rem;background:url('~assets/img/carExhibition/icon_headtitle.png') no-repeat center;background-size:100%;}
        }
        .pd{padding:.1rem .14rem;}

        .base{
            @include box;padding-bottom:.1rem;align-items:baseline;
            div{@include flex;text-align:right;}
            div:nth-of-type(1){text-align:left;}
            span{color:$mainColor;b{font-weight:500;font-size:.24rem;margin-right:.1rem;}}

            .joinNum::before{content:'';display:inline-block;width:.12rem;height:.12rem;margin: 0 .05rem;background:url('~assets/img/carExhibition/icon_people.png') no-repeat center;background-size:100%;}
            .countDown::before{content:'';display:inline-block;width:.12rem;height:.12rem;margin: 0 .05rem;background:url('~assets/img/carExhibition/icon_time.png') no-repeat center;background-size:100%;}
        }

        .promise{border-top: 1px solid hsla(0,0%,93%,.6);
            div{
                padding-left:.5rem;position:relative;float:left;max-width:50%;box-sizing:border-box;
                img{position:absolute;left:0;top:.1rem;width:.38rem;}
                h1{@include bold;line-height:.2rem;margin-bottom:.02rem;}
                p{color:#c9c9c9;line-height:.18rem;}
            }
            div:nth-of-type(1){width:50%;border-right: 1px dotted hsla(0,0%,93%,.6);}
            div:nth-of-type(2){float:right;}
        }

        .server{background:#fff;position:relative;
            .profile_bg{width:1.25rem;height:.55rem;margin-right:.15rem;float:left;display:block;}
            .profile{width:.4rem;height:.4rem;border-radius:99px;position:absolute;left:.76rem;top:.075rem;overflow:hidden;
                img{width:100%;}
            }
            h1{@include bold;line-height:.3rem;}
            .call{width:.35rem;margin-top:.1rem;margin-right:.2rem;float:right;}
        }

        .seller{
            li{
                border-bottom: 1px solid hsla(0,0%,93%,.6);position:relative;
                h1{line-height:.18rem;margin-bottom:.05rem;}
                p{color:#88888d;width: 80%;@include txtOverflow;}
                p::before{content:'';display:inline-block;width:.09rem;height:.11rem;margin-right:.05rem;background:url('~assets/img/carExhibition/icon_list_address.png') no-repeat center;background-size:100%;}
                a:nth-of-type(1){position:absolute;top:.1rem;left:50%;width:.75rem;margin-left:-.4rem;img{width:100%;}}
                a:nth-of-type(2){position:absolute;right:0;top:0;width:.65rem;height:100%;border-left:1px solid hsla(0,0%,93%,.6);
                    img{width:.21rem;margin:.22rem;}
                }
            }
            li.showAllSeller{text-align:center;color:#88888d;line-height:.45rem;}
        }

        .article{
            p{margin:.05rem 0;}
            img{width:100%;display:block;}
        }

        .steps img{width:100%;display:block;}
    }
</style>