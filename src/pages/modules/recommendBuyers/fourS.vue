<template>
      <app-layout id="recommendBuyersFourS">

        <ul id="brandList" class="list">
            <li v-for="(item,index) in brands" class="arrow" v-on:click="subId=selectedBrand=item.id">
                <div>
                  <img :src="item.icon">
                  {{ item.name }}
                </div>
            </li>
        </ul>

        <div slot="aside" :class="'container subList'+(subId!=''?'':' moveout')">
          <div class="page-content">

            <div class="store" v-for="(store,index) in list[selectedBrand]" @click="next(list[selectedBrand][index])">
                <img class="pic" :src="store.foursImg">
                <h1>{{store.name}}</h1>
                <div class="addr clearfix"><p>{{store.address}}</p><span>{{getDistance(store.longitude,store.dimension)}}</span></div>
                <div class="reward" v-if="store.reward">奖励{{store.reward}}元</div>
            </div>

          </div>
        </div>

        <div slot="aside" class="cover" v-if="selectedBrand!=''" v-on:click="subId=''"></div>

      </app-layout>
</template>

<script>
    export default {
      data(){
          return{
              list:{},
              brands:[],
              selectedBrand:'',
              subId:'',
              myLocation:''
          }
      },
      mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
        this.getData();
      },
      watch: {
        subId(val) {
          if (val==='') {
            setTimeout(() => {
              this.selectedBrand = '';
            }, 300);
          }
        }
      },
      methods: {
        async getData() {

            let data={
                content:{
                    pageSize:100,
                    pageNo:1,
                    brandId: '',
                    dimension:this.$cache.location.lat,
                    longitude:this.$cache.location.lng,
                    needRewardInfo:1
                }
            };

            let res=await this.$post('/CRM/appfourspoint/query4SInfoV2.json',data);
            if(res.errcode==0){
                let list={},
                    fs=res.content.fsList,
                    brand=res.content.brandList;

                if(this.brands.length===0){this.brands=brand};

                for (let i = 0; i < brand.length; i++) { 
                    let bid=brand[i].id;
                    if(!list[bid]){
                        list[bid]=fs.filter( (item)=> {
                            for(let j=0;j<item.brandId.split(',').length;j++){
                                if(item.brandId.split(',')[j] == bid ){
                                    return true
                                }
                            } 
                        });
                    }
                }
                this.list=list;
            }
        },
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        },
        next(item){
            let store=item,
                fourS=this.$cache.fourS;

            fourS.id=store.fourShipId;
            fourS.name=store.name;
            this.$router.go('-1');
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #recommendBuyersFourS{
    
    #brandList{
        .arrow div{line-height:.3rem;
          img{width:.3rem;height:.3rem;vertical-align:middle;margin-right:.1rem;}
          &::after{top:.09rem;}
          &::before{top:.09rem;}
        }
    }

    .subList{background:#fff;width:70%;}

    .store{display:block;position: relative;padding:.1rem .1rem .1rem .65rem;background: #fff;border-bottom:$border;min-height:.45rem;line-height: .2rem;
        .pic{position:absolute;left:.1rem;top:.1rem;width:.45rem;height:.45rem;border-radius:3px;}

        .addr{font-size:$h4;color:$gray;margin-top:.05rem;
            p{width:70%;@include txtOverflow;float: left;text-indent:.14rem;background: url('~assets/img/icon-addr.png') no-repeat left center;background-size:.09rem .11rem;}
            span{float:right;}
        }

        .reward{position:absolute;right:.1rem;top:.1rem;font-size: $h4;color:$mainColor;text-indent:.17rem;background: url('~assets/img/recommendBuyers/icon_4s_prize.png') no-repeat left center;background-size:.12rem .12rem;}
    }
  }
</style>
