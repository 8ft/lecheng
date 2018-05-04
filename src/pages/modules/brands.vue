<template>
      <app-layout id="brands">

          <mt-index-list>
            <mt-index-section index="#">
              <p v-if="sBrands.length>0" class="mint-indexsection-index self">盈众集团自营品牌</p>
              <div class="sth-link n5 clearfix area">
                <a class="sth" v-for="item in sBrands" :key="item.id" v-on:click="selectBrand(item.id)"><img :src="item.brandImgUrl"><h1>{{item.name}}</h1></a>
              </div>
            </mt-index-section>

            <mt-index-section v-for="(list, key) in brands" :index="key">
              <ul class="list brandList">
                <li v-for="item in list" :key="item.id" v-on:click="selectBrand(item.id)">
                    <div>
                      <img v-lazy.brands="item.brandImgUrl">
                      {{ item.name }}
                      <span v-if="item.selfSupport==='1'">盈众自营</span>
                    </div>
                </li>
              </ul>
            </mt-index-section>

          </mt-index-list>

          <div slot="aside" id="series" :class="'container subList'+(subId!=''?'':' moveout')">
            <ul class="page-content list">
              <li><div>{{series.brandName}}</div></li>
              <li class="arrow" v-for="item in series.carSeriesList" v-on:click="select(item.id)">
                <div>{{item.name}}</div>
              </li>
            </ul>
          </div> 

          <div slot="aside" id="brands_cover" class="cover" v-if="brandId!=''" v-on:click="subId=''"></div> 

      </app-layout>
</template>

<script>
    export default {
      name: 'brands',
      data(){
          return{
              sBrands:[],
              brands:[],
              series:{},
              subId:'',
              brandId:''
          }
      },
      mounted() {
        this.getBrands();
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
        async selectBrand(id){
          this.brandId=this.subId=id;
          if(this.series.brandId!=id){
            this.series={};

            let res=await this.$post('/CRM/appcartype/querySeries.json',{content:{brandId: id}});
            if (res.errcode == 0) {
                this.series=res.content;
                this.$cache.brand.brandName=res.content.brandName
            }
          }
        },
        async getBrands() {
          let res=await this.$post('/CRM/appcartype/queryBrand.json');
          if (res.errcode == 0) {

              let con=res.content,
                  brands=con.brandsList,
                  bi,
                  newList={};

              for(let i=0;i<brands.length;i++){
                  bi=brands[i];
                  if(!newList[bi.namePrefix]){
                    newList[bi.namePrefix]=[];
                  }
                  newList[bi.namePrefix].push(bi);
              }

              this.brands=newList;
              this.sBrands=con.selfSupportBrandsList;
          }
        },
        select(sid){
          this.$router.push('./brands/model?sid='+sid+'');
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #brands{
    .mint-indexlist-content{margin-right:0!important;}
    .mint-indexsection:nth-of-type(1) .mint-indexsection-index:not(.self){display: none;}
    .mint-indexlist-nav{border-left:none!important;background: transparent;}

    .brandList{
        div{line-height:.3rem;
          img{width:.3rem;height:.3rem;vertical-align:middle;margin-right:.1rem;}
          span{color:red;border:1px solid red;border-radius: 3px;margin-left:.1rem;font-size:$h3;padding: 0 .06rem;}
        }
    }       
    #series li:nth-of-type(1){padding: .07rem .14rem;background: #fafafa;} 
  }
</style>
