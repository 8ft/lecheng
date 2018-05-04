<template>
      <app-layout id="recommendBuyersBrands">

        <ul id="brandList" class="list">
            <li v-for="(value,index) in list" class="arrow" v-on:click="subId=brandId=value.brandId;">
                <div>
                  <img :src="value.brandIcon">
                  {{ value.brandName }}
                </div>
            </li>
        </ul>

        <div slot="aside" :class="'container subList'+(subId!=''?'':' moveout')">
          <ul slot="aside" class="page-content list" v-if="brandId==value.brandId" v-for="value in list">
            <li v-for="s in value.carSeriesList" v-on:click="select(brandId,s.carSeriesId,value.brandName,s.carSeriesName)">
              <div>{{s.carSeriesName}}</div>
            </li>
          </ul>
        </div>

        <div slot="aside" class="cover" v-if="brandId!=''" v-on:click="subId=''"></div>

      </app-layout>
</template>

<script>
    export default {
      name:'ex-recommendBuyersBrands',
      data(){
          return{
              list:[],
              brandId:'',
              subId:''
          }
      },
      mounted() {
        this.getData();
      },
      watch: {
        subId(val) {
          if (val==='') {
            setTimeout(() => {
              this.brandId = '';
            }, 300);
          }
        }
      },
      methods: {
        async getData() {
          let data = {content: {foursId: this.$cache.fourS.id}};
          let res=await this.$post('/CRM/appfourspoint/query4SCarInfo.json', data);
          if (res.errcode == 0) {
              this.list=res.content.carBrandList;
          }
        },
        select(bid,sid,bname,sname){
            let brand=this.$cache.brand;
            brand.bid=bid;
            brand.sid=sid;
            brand.bname=bname;
            brand.sname=sname;

            this.$router.go(-1);
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #recommendBuyersBrands{
    #brandList{
        .arrow div{line-height:.3rem;
          img{width:.3rem;height:.3rem;vertical-align:middle;margin-right:.1rem;}
          &::after{top:.09rem;}
          &::before{top:.09rem;}
        }
    }
  }
</style>
