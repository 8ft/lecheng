<template>
    <app-layout id="serviceDay">
        <div class="logo">
            <div>
                <img src="/CRM/WeChat/App/static/img/serviceDay/logo.png">
            </div>
            <img class="banner" src="/CRM/WeChat/App/static/img/serviceDay/banner.png">
        </div>

        <div class="bg1"><img src="/CRM/WeChat/App/static/img/serviceDay/t1.png"></div>
        <div class="step1">
            <h1>参加朋友圈分享活动即有机会<span>获得出行安全礼包</span></h1>

            <div class="part">
                <img class="profile" src="/CRM/WeChat/App/static/img/serviceDay/profile.png">
                <h2>乐小橙</h2>
                <p>#公司名称+进店有礼得安全礼包#我在XX4S店看XX车型，第二届盈众服务节特别优惠！你也来看看吧！详询XXX，求20赞。</p>
                <div class="imgs">
                    <img src="/CRM/WeChat/App/static/img/serviceDay/pic_photo.png">
                    <img src="/CRM/WeChat/App/static/img/serviceDay/pic_example.png">
                </div>
            </div>

            <div class="part">
                <h2>操作方法：</h2>
                <p>① 复制话题文字（修改为所在参与门店）</p>
                <p>② 与指定展厅车型（或试驾车型）合影并上传朋友圈</p>
                <p>③ 截图上传至活动页面</p>
            </div>

             <div class="part">
                <h2>参加进店有礼活动，有机会享安全出行礼包</h2>
                <div class="imgs">
                    <img src="/CRM/WeChat/App/static/img/serviceDay/pic_goods1.png">
                    <img src="/CRM/WeChat/App/static/img/serviceDay/pic_goods2.png">
                </div>
             </div>
            <a class="btn" href="http://cn.mikecrm.com/RBBJksA"><img src="/CRM/WeChat/App/static/img/serviceDay/b1-v2.png"></a>
        </div>

        <div class="bg2"><img src="/CRM/WeChat/App/static/img/serviceDay/t2.png"></div>
        <div class="step2">
            <h1>盈众服务节启动日活动</h1>
            <router-link class="banner" tag="img" src="/CRM/WeChat/App/static/img/serviceDay/s2-con-v2.png" to="/carExhibition?aid=26"></router-link>
        </div>

        <div class="bg1"><img src="/CRM/WeChat/App/static/img/serviceDay/t3.png"></div>
        <div class="step3">
            <h1>常规进站保养客户，有机会获得<span>最高666元免单券</span></h1>
            <img class="banner" src="/CRM/WeChat/App/static/img/serviceDay/s3-con.png">

            <a class="btn" href="https://a.app.qq.com/o/simple.jsp?pkgname=com.enjoyauto.lecheng"><img src="/CRM/WeChat/App/static/img/serviceDay/b2-v2.png"></a>
        </div>   

        <div class="bg2"><img src="/CRM/WeChat/App/static/img/serviceDay/t4.png"></div>
        <div class="step4">
            <h1>活动期间购买乐橙套餐<span>最高可享保养6.7折</span></h1>
            <p>参与活动品牌列表</p>
            <img class="banner" src="/CRM/WeChat/App/static/img/serviceDay/s4-con.png" >
            <div>
                <h2>最低单次保养233元</h2>
                <p>更多信息详询盈众旗下各品</p>
            </div>
            <router-link class="btn" to="/mall/cargoods/691"><img src="/CRM/WeChat/App/static/img/serviceDay/b3.png"></router-link>
        </div>

        <div class="bg1"><img src="/CRM/WeChat/App/static/img/serviceDay/t5.png"></div>
        <div class="step5">
            <div>
                <h2>交车送福</h2>
                <h3>3月10日– 4月10日</h3>
                <p>活动期间交车的客户可获交车福袋</p>
                <img src="/CRM/WeChat/App/static/img/serviceDay/fudai.png">
            </div>
            <div>
                <h2>欣悦服务</h2>
                <h3>3月10日– 4月10日</h3>
                <p>活动期间进站用户可免费清洁空调滤芯</p>
                <img src="/CRM/WeChat/App/static/img/serviceDay/lvxin.png">
            </div>       
        </div> 

        <div style="color:#fff;font-size:.1rem;text-align:center;margin-top:.12rem;">活动最终解释权归厦门盈众乐橙电子商务有限公司所有</div>
        
    </app-layout>
</template>

<script>
export default {
  data() {
    return {
        st:0
    };
  },
  activated(){
    if(this.st != 0) { 
      this.$el.children.appMain.scrollTop = this.st;
    }

    let shareData={
        share_title:'第二届盈众服务节千万红包大派送',
        share_desc:'进店礼多多，进站享免单',
        share_img:location.origin+'/CRM/WeChat/App/static/img/serviceDay/share.jpg',
        share_url:location.origin+'/wxwap?#/serviceDay'
    }
    this.$utils.shareConfig(shareData);
  },
  beforeRouteLeave(to, from, next) {
      this.st = this.$el.children.appMain.scrollTop;
      next();
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #serviceDay{background: #80b6e1;
        #appMain{padding-bottom:1.16rem;}

        $blue:#20629F;
        $red:#E24816;
        @mixin font1{font-size:.14rem;font-weight: 600;line-height: .14rem;}
        @mixin font2{font-size:.12rem;line-height: .12rem;color:#55555D;}

        .logo{position: relative;padding-top:.85rem;
            div{position: absolute;top:0;left:0;width:100%;height: 1.41rem;background:url('/CRM/WeChat/App/static/img/serviceDay/cloud.png') no-repeat center 100%;background-size:cover;text-align:center;z-index: 2;
                img{width:1.38rem;margin-top:.09rem;}
            }
        }
        
        .bg1{background:url('/CRM/WeChat/App/static/img/serviceDay/bg1.png') no-repeat center 100%;background-size:cover;padding:1.02rem 0 .09rem;text-align:center;
            img{width:2.23rem;}
        }
        .bg2{background:url('/CRM/WeChat/App/static/img/serviceDay/bg2.png') no-repeat center 100%;background-size:cover;padding:1.48rem 0 .09rem;text-align:center;
            img{width:2.23rem;}
        }

        div[class^="step"]{padding:0 .3rem;
            h1{@include font1;color:$blue;text-align:center;line-height:.57rem;span{color:$red;}}
            .btn{display:block;text-align:center;margin-top:.1rem;img{width:2.94rem;}}
        }

        .step1{background:url('/CRM/WeChat/App/static/img/serviceDay/s1.png') no-repeat center 100%;background-size:cover;height: 5.83rem;
            .part{
                h2{@include font1;color:$blue;}
                p{@include font2;}
                .imgs{@include box;align-items: baseline;}
                &:nth-of-type(1){padding-left:.5rem;padding-bottom:.15rem;position: relative;
                    h2{margin-bottom:.07rem;}
                    p{line-height: .16rem;user-select:text;}
                    .profile{width:.4rem;position: absolute;left:0;top:0;}
                    .imgs{margin-top:.08rem;
                        img:nth-of-type(1){width:1.34rem;margin-right:.22rem;}
                        img:nth-of-type(2){width:.59rem;}
                    }
                }
                &:nth-of-type(2){padding:.16rem 0 .15rem;background:url('/CRM/WeChat/App/static/img/serviceDay/line.png') no-repeat top left 100%;
                    h2{margin-bottom:.11rem;}
                    p{line-height: .2rem;}
                }
                &:nth-of-type(3){padding-top:.15rem;background:url('/CRM/WeChat/App/static/img/serviceDay/line.png') no-repeat top left 100%;
                    h2{color:$red;text-align: center;}
                    .imgs{margin-top:.09rem;justify-content:center;
                        img:nth-of-type(1){width:1.66rem;margin-right:.13rem;}
                        img:nth-of-type(2){width:.74rem;}
                    }
                }
            }
        }

        .step2{background:url('/CRM/WeChat/App/static/img/serviceDay/s2.png') no-repeat center 100%;background-size:cover;height: 1.7rem;text-align:center;}
        .step3{background:url('/CRM/WeChat/App/static/img/serviceDay/s3.png') no-repeat center 100%;background-size:cover;height: 2.52rem;text-align:center;}
        .step4{background:url('/CRM/WeChat/App/static/img/serviceDay/s4.png') no-repeat center 100%;background-size:cover;height:2.72rem;text-align:center;
            p{@include font2;text-align: left;margin-bottom:.1rem;}

            div{background:url('/CRM/WeChat/App/static/img/serviceDay/line.png') no-repeat top left 100%;text-align:center;margin-top:.15rem;padding-top:.15rem;
                h2{@include font1;color:$red;margin-bottom:.08rem;}
                p{@include font2;text-align:center;margin-bottom:.08rem;}
            }
        }

        .step5{background:url('/CRM/WeChat/App/static/img/serviceDay/s5.png') no-repeat center 100%;background-size:cover;height: 2.02rem;
            div{padding:.25rem 0 .15rem;position: relative;
                h2{@include font1;color:$blue;margin-bottom:.11rem;}
                h3{@include font1;color:$red;margin-bottom:.12rem;}
                p{@include font2;}
                img{position:absolute;right:0;bottom:.11rem;width:1.1rem;}
            }
            div:nth-of-type(2){padding-top:.14rem;background:url('/CRM/WeChat/App/static/img/serviceDay/line.png') no-repeat top left 100%;}
        }


    }
</style>
