<template>
      <app-layout id="recommendBuyersBrands">

        <ul id="brandList" class="list">
            <li v-for="(item,index) in list" class="arrow" v-on:click="subId=brandId=item.cat_id;">
                <div>
                  <img :src="item.cat_logo">
                  {{ item.cat_name }}
                </div>
            </li>
        </ul>

        <div slot="aside" :class="'container subList'+(subId!=''?'':' moveout')">
          <ul slot="aside" class="page-content list" v-if="brandId==item.cat_id" v-for="item in list">
            <li :class="{on:sid==s.cat_id}" v-for="s in item.child" v-on:click="select(brandId,s.cat_id,item.cat_name,s.cat_name)">
              <div>{{s.cat_name}}</div>
            </li>
          </ul>
        </div>

        <div slot="aside" class="cover" v-if="brandId!=''" v-on:click="subId=''"></div>

      </app-layout>
</template>

<script>
    export default {
      data(){
          return{
              sid:'',
              list:[],
              brandId:'',
              subId:''
          }
      },
      mounted(){
        this.getData();
      },
      activated() {
          this.sid=this.$cache.brand.sid||'';
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
          let data = {content: {itemtype:'car'}};
          let res=await this.$post('/mall26/category-containsaleitem.html', data);
          if (res.errcode == 0) {
              this.list=res.content.brand;
          }
        },
        select(bid,sid,bname,sname){
            let brand=this.$cache.brand;
            brand.bid=bid;
            brand.sid=sid;
            brand.bname=bname;
            brand.sname=sname;

            if(this.$cache.history.includes('/testDrive')){
              this.$router.go(-1);
            }else{
              this.$router.replace('/testDrive');
            }
            
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
