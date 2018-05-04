<template>
  <app-layout id="carWiki">

    <mt-navbar slot="header" v-model="pageType">
      <mt-tab-item id="201">使用说明书</mt-tab-item>
      <mt-tab-item id="202">故障灯</mt-tab-item>
      <mt-tab-item id="203">应急指南</mt-tab-item>
    </mt-navbar>

      <!--使用说明书-->
      <div class="usage" v-if="listItems1.length>0&&pageType==='201'">

        <swiper :options="swiperOption" ref="carAreaSwiper">

          <swiper-slide id="outCar">
            <img src="~assets/img/carWiki/outCar.png">
            <button v-for="area in areaList.outCar" :class="selectArea===area.id?(area.position+' on'):area.position" v-on:click="selectArea===area.id?selectArea=-1:selectArea=area.id">{{area.name}}</button>
            <span>< 左滑进入车内</span>
          </swiper-slide>

          <swiper-slide id="inCar">
            <img src="~assets/img/carWiki/inCar.png">
            <button v-for="area in areaList.inCar" :class="selectArea===area.id?(area.position+' on'):area.position" v-on:click="selectArea===area.id?selectArea=-1:selectArea=area.id">{{area.name}}</button>
          </swiper-slide>

          <div class="swiper-pagination"  slot="pagination"></div>
          
        </swiper>

        <div class="part clearfix" v-for="area in listItems1" v-if="selectArea===area.areaId||selectArea===-1">
            <h1>{{area.itemName}}</h1>
            <router-link :to="'./carWiki/detail/'+item.pkId" v-for="item in area.areaList">
              <img v-lazy.appMain="item.icon">
              <h1>{{item.itemName}}</h1>
            </router-link>
        </div>

      </div>

      <!--使用说明书-->
      <div class="icons clearfix" v-if="listItems1.length>0&&pageType==='202'">
        <router-link :to="'./carWiki/detail/'+icon.pkId" v-for="icon in listItems2">
          <img :src="icon.icon">
          <h1>{{icon.itemName}}</h1>
        </router-link>
      </div>

      <!--应急指南-->
      <div class="icons guide clearfix" v-if="listItems1.length>0&&pageType==='203'">
        <router-link :to="'./carWiki/detail/'+guide.pkId" v-for="guide in listItems3">
          <img :src="guide.icon">
          <h1>{{guide.itemName}}</h1>
        </router-link>
      </div>
    


  </app-layout>
</template>

<script>

export default {
  data() {
    return {
      pageType: '201',
      selectArea: -1,
      listItems1: '',
      listItems2: '',
      listItems3: '',
      st: 0,
      swiperOption: {
        pagination: '.swiper-pagination'
      },
      areaList: {
        outCar: [
          { id: 3, position: 'li1', name: '车灯' },
          { id: 4, position: 'li2', name: '引擎盖' },
          { id: 2, position: 'li3', name: '前挡风玻璃' },
          { id: 5, position: 'li4', name: '后视镜' },
          { id: 1, position: 'li5', name: '车顶' },

          { id: 7, position: 'ri1', name: '轮胎' },
          { id: 9, position: 'ri2', name: '车门/车窗' },
          { id: 6, position: 'ri3', name: '油箱盖' },
          { id: 8, position: 'ri4', name: '后备箱' },

          { id: 10, position: 'key', name: '' }
        ],
        inCar: [
          { id: 12, position: 'li1', name: '仪表盘' },
          { id: 14, position: 'li2', name: '车灯调节' },
          { id: 11, position: 'li3', name: '方向盘' },
          { id: 13, position: 'li4', name: '座椅' },

          { id: 17, position: 'ri1', name: '多媒体' },
          { id: 16, position: 'ri2', name: '空调' },
          { id: 15, position: 'ri3', name: '档位/行车' }
        ]
      }
    };
  },
  watch: {
    pageType(val) {
      switch (val) {
        case '201':
          this.listItems1 === '' && this.getData(val);
          break;
        case '202':
          this.listItems2 === '' && this.getData(val);
          break;
        case '203':
          this.listItems3 === '' && this.getData(val);
          break;
      }

      this.st = 0;
      this.$el.children.appMain.scrollTop = 0;
    }
  },
  computed: {
      swiper() {
          return this.$refs.ranking.swiper;
      }
  },
  mounted() {
    this.getData(this.pageType);
  },
  activated() {
    //分享内容
    let shareData={
        share_title:'用车百科',
        share_desc:'你的汽车百科全书，为你提供汽车使用的入门知识、故障灯图解、应急处理等，让你秒变养车达人！',
        share_img:location.origin + '/CRM/WeChat/App/static/img/carWiki/share_logo.jpg',
        share_url: location.href.replace(location.search,'?')
    }
    this.$utils.shareConfig(shareData);  

    if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
  },
  beforeRouteLeave(to, from, next) {
    this.st = this.$el.children.appMain.scrollTop;
    next();
  },
  methods: {
    async getData(val) {
      let data = { content: { subType: val } };
      let res=await this.$post('/CRM/appcarencyclopedia/getItemListBySubtype.json', data);
      if (res.errcode == 0) {
        let list = res.content.itemList;
        switch (val) {
          case '201':
            this.listItems1 = list;
            break;
          case '202':
            this.listItems2 = list;
            break;
          case '203':
            this.listItems3 = list;
            break;
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #carWiki{
      .usage{
          .swiper-container{height:3.8rem;background:#212129;
            img{display:block;width:1.88rem;margin:.2rem auto 0;}
            button:not(.key){position:absolute;top:0;display:block;line-height:.28rem;width:.7rem;border:1px solid #fff;color:#fff;text-align:center;font-size:$h3;background:#212129;}
            button[class^="li"]{left:50%;margin-left:-1.64rem;}
            button[class^="ri"]{right:50%;margin-right:-1.64rem;}

            button:not(.key).on{border-color:#ea6000;background:#803016;}
          }

          #outCar{
              .li1{top:.3rem;}
              .li2{top:.68rem;}
              .li3{top:1.04rem;}
              .li4{top:1.64rem;}
              .li5{top:2.05rem;}
              
              .ri1{top:.96rem;}
              .ri2{top:1.58rem;}
              .ri3{top:2.45rem;}
              .ri4{top:3.1rem;}

              .key{position:absolute;top:.2rem;right:.45rem;width:.24rem;height:.515rem;background:url('~assets/img/carWiki/icon_key.png') no-repeat center;background-size:100%;}
              .key.on{background-image: url('~assets/img/carWiki/icon_key_pressed.png');}
              span{position:absolute;bottom:.2rem;left:.2rem;color:#fff;font-size:$h3;}
          }

          #inCar{
              .li1{top:.4rem;}
              .li2{top:.88rem;}
              .li3{top:1.36rem;}
              .li4{top:2.1rem;}
              
              .ri1{top:.86rem;}
              .ri2{top:1.4rem;}
              .ri3{top:1.9rem;}
          }

          .part{padding:.2rem;
              a{
                  float:left;display:block;width:1.6rem;padding:.04rem;background:#fff;box-sizing:border-box;margin-top:.1rem;border: 1px solid rgba(0,0,0,.1);
                  img{display:block;width:100%;height:.96rem;}
                  h1{text-align: center;padding: .06rem 0 .04rem;font-size: .12rem;@include txtOverflow;}
                  &:nth-of-type(even){float:right;}
              }
          }
      }

      .icons{text-align:center;background:#fff;
        a{display:block;float:left;width:25%;box-sizing:border-box;border:1px solid #fafafa;padding:.1rem 0;border-left:none;
            &:nth-of-type(4n){border-right:none;}
            img{width:.5rem;height:.5rem;margin-bottom:.1rem;border-radius:99px;}
            h1{font-size:$h3;@include txtOverflow;padding: 0 .1rem;line-height:.16rem;}
        }
      }
      
      .guide img{border-radius:0;}

  }
</style>