<template>
  <app-layout id="stores">

    <page-switch v-show="path==='/stores'" slot="header" :items="switchPages" :active="0"></page-switch>

    <ul slot="header" class="filter">
        <li :class="{on:showBrands}" @click="popup('brand')">{{selectedBrand.name||'品牌'}}<div></div></li>
        <li :class="{on:showAreas}" @click="popup('area')">{{selectedArea.name||'区域'}}<div></div></li>
        <li :class="{on:showSorts}" @click="popup('sort')">{{selectedSort.sortParamName||'排序'}}<div></div></li>
    </ul>

    <mt-popup v-model="showBrands" position="top" style="width:100%;">
        <ul class="page-content">
            <li :class="{on:selectedBrand.id===undefined}" @click="select('brand',{})">不限品牌</li>
            <li :class="{on:selectedBrand.id===item.id}"  @click="select('brand',item)" v-for="item in brands">
                <img v-lazy.brands="item.icon">
                {{ item.name }}
            </li>
        </ul>
    </mt-popup>

    <mt-popup v-model="showAreas" position="top" style="width:100%;">
        <ul class="page-content">
            <li :class="{on:selectedArea.id===undefined}" @click="select('area',{})">所有区域</li>
            <li :class="{on:selectedArea.id===item.id}" @click="select('area',item)" v-for="item in areas">
                {{ item.name }}
            </li>
        </ul>
    </mt-popup>

    <mt-popup v-model="showSorts" position="top" style="width:100%;">
        <ul class="page-content">
            <li :class="{on:selectedSort.sortParam===item.sortParam}" @click="select('sort',item)" v-for="item in sorts">
                {{ item.sortParamName }}
            </li>
        </ul>
    </mt-popup>

    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">

        <div class="store" v-for="(store,index) in list" @click="next(index)">
            <img class="pic" :src="store.foursImg">
            <h1>{{store.name}}</h1>
            <div class="brands">
                <img v-for="item in store['4SBrandList']" :src="item.brandIcon">
            </div>

            <lc-rate disabled v-model="store.foursAppraise"></lc-rate>

            <div class="addr clearfix"><p>{{store.address}}</p><span>{{getDistance(store.longitude,store.dimension)}}</span></div>

            <store-discount v-if="$route.path==='/stores'" :discount="store.lowestDiscount"></store-discount>
            <div v-if="$route.path==='/fourS'" :class="{'select-icon':true,on:selectedStore.id==store.fourShipId}"></div>
        </div>

    </div>

  </app-layout>
</template>

<script>
    import Discount from 'components/stores/discount' 
    export default {
        components:{
            'store-discount':Discount
        },
       
      data() {
        return {
            switchPages:[
                {name:'4S店',path:'/stores'},
                {name:'合作商家',path:'/partners'}
            ],

            ids:'',
            path:'/stores',
            selectedStore:{},

            st:0,
            pageNo:1,
            pageSize:10,
            nomore:false,
            list:[],

            brands:[],
            showBrands:false,
            selectedBrand:{},

            areas:[],
            showAreas:false,
            selectedArea:{},

            sorts:[],
            showSorts:false,
            selectedSort:{},

            myLocation:''
        };
      },
      watch:{
          path(val){
              eventBus.$emit('layout');
          }
      },
      mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
      },
      activated() {
        let ids=this.$route.query.ids,
        path=this.$route.path;

        if(this.list.length===0||this.ids!=ids||this.path!=path){
            this.ids=ids;
            this.path=path;

            this.selectedSort={};
            this.selectedArea={};
            this.selectedBrand={};
            this.refresh();
        }

        this.selectedStore=this.$cache.fourS;
        if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
      },
      beforeRouteLeave(to, from, next) {
        this.st = this.$el.children.appMain.scrollTop;
        next();
     },
      methods:{
        select(type,item){
            switch (type) {
                case 'brand':
                    this.showBrands=false;
                    this.selectedBrand=item;
                    break;
                case 'area':
                    this.showAreas=false;
                    this.selectedArea=item;
                    break;
                case 'sort':
                    this.showSorts=false;
                    this.selectedSort=item;
                    break;
            }
            this.refresh();
        },
        next(i){
            let store=this.list[i];
            switch(this.$route.path){
                case '/stores':
                    this.$router.push('/stores/'+store.fourShipId)
                break;
                case '/fourS':
                    let fourS=this.$cache.fourS;
                    fourS.id=store.fourShipId;
                    fourS.name=store.name;
                    this.$router.go('-1');
                break;
            }
        },
        popup(target){
            
            switch (target) {
                case 'brand':
                    this.showSorts=false;
                    this.showAreas=false;
                    this.showBrands=!this.showBrands;
                    break;
                case 'area':
                    this.showSorts=false;
                    this.showBrands=false;
                    this.showAreas=!this.showAreas;
                    break;
                case 'sort':
                    this.showBrands=false;
                    this.showAreas=false;
                    this.showSorts=!this.showSorts;
                    break;
                
            }
        },
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        },
        refresh(){
            this.list=[];
            this.pageNo=1;
            this.nomore=false;
            this.loadMore();
        },
        async loadMore() {
            
            if(!this.nomore){
                this.nomore=true;

                let data={
                        content:{
                            pageSize:this.pageSize,
                            pageNo:this.pageNo,
                            sort:this.selectedSort.sortParam||'',
                            brandId: this.selectedBrand.id||'',
                            areaId: this.selectedArea.id||'',
                            foursId: this.ids?this.ids.replace(/_/g,','):'',
                            dimension:this.$cache.location.lat,
                            longitude:this.$cache.location.lng
                        }
                    };

                let res=await this.$post('/CRM/appfourspoint/query4SInfoV2.json',data);
                if(res.errcode==0){
                    if(this.brands.length===0){this.brands=res.content.brandList};
                    if(this.areas.length===0){this.areas=res.content.areaList};
                    if(this.sorts.length===0){this.sorts=res.content.sortParamList};

                    let list=res.content.fsList;
                    this.list=this.list.concat(list?list:[]);
                    if(res.content.totalPages>this.pageNo){
                        this.pageNo+=1;
                        this.nomore=false;
                    }
                }
            }
        }
          
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #stores{
      .store{display:block;position: relative;padding:.1rem .2rem .1rem 1.05rem;background: #fff;border-bottom:$border;min-height:.7rem;line-height:.15rem;
        .pic{position:absolute;left:.2rem;top:.1rem;width:.7rem;height:.7rem;}
        h1{color:$black;line-height:.2rem;}
        .brands{height: .2rem;
            img{width:.2rem;height:.2rem;margin-right:.05rem;}
        }

        .addr{font-size:$h4;color:$gray;
            p{width:70%;@include txtOverflow;float: left;}
            span{float:right;}
        }

        .select-icon{position:absolute;width:.2rem;height:.2rem;right:.2rem;top:50%;margin-top:-.2rem;background: url('~assets/img/icon_list_select.png') no-repeat center;background-size:100%;
            &.on{background-image:url('~assets/img/icon_list_select_pressed.png');}
        }
    }

    .filter{@include box;background:#fff;border-bottom:$border;
        li{@include flex;text-align: center;height:.4rem;line-height:.4rem;

            div{position:relative;display:inline-block;margin-left:.05rem;height:100%;vertical-align: middle;
                &::after{position:absolute;content:'';width:0;height:0;left:0;bottom:50%;margin-bottom:-.0125rem;border:.05rem solid transparent;border-bottom:0;border-top-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;left:0;bottom:50%;margin-bottom:-.0225rem;border:.05rem solid transparent;border-bottom:0;border-top-color:$black;}
            }

            &.on div{color:$mainColor;
                &::after{position:absolute;content:'';width:0;height:0;left:0;top:50%;margin-top:-.0225rem;border:.05rem solid transparent;border-top:0;border-bottom-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;left:0;top:50%;margin-top:-.0325rem;border:.05rem solid transparent;border-top:0;border-bottom-color:$mainColor;}
             }
           
        }
    }

    .mint-popup,.v-modal{position:absolute!important;}
    .mint-popup{z-index: $middleFloor!important;padding-top:.85rem;}
    .v-modal{z-index: $bottomFloor!important;}

    .mint-popup .page-content{
        max-height: 4rem;
    }
    .mint-popup li{line-height:.3rem;padding:.1rem .2rem;border-bottom:$border;
        img{display:inline-block;width:.3rem;height:.3rem;vertical-align:middle;margin-right:.1rem;}
    }

  }
</style>
