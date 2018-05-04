<template>
  <app-layout id="partners">

    <page-switch slot="header" :items="switchPages" :active="1"></page-switch>

    <ul slot="header" class="filter">
        <li :class="{on:showTypes}" @click="popup('type')">{{selectedType.name||'商家类别'}}<div></div></li>
        <li :class="{on:showAreas}" @click="popup('area')">{{selectedArea.name||'区域'}}<div></div></li>
        <li :class="{on:showSorts}" @click="popup('sort')">{{selectedSort.sortParamName||'排序'}}<div></div></li>
    </ul>

    <mt-popup v-model="showTypes" position="top" style="width:100%;">
        <ul class="page-content">
            <li :class="{on:selectedType.id===undefined}" @click="select('type',{})">全部类型</li>
            <li :class="{on:selectedType.id===item.id}"  @click="select('type',item)" v-for="item in types">
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
            <li :class="{on:selectedSort.id===undefined}" @click="select('sort',{})">默认排序</li>
            <li :class="{on:selectedSort.sortParam===item.sortParam}" @click="select('sort',item)" v-for="item in sorts">
                {{ item.sortParamName }}
            </li>
        </ul>
    </mt-popup>

    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">

        <router-link class="store" v-for="(store,index) in list" :to="'/partners/'+store.id">
            <img class="pic" v-lazy.appMain="store.img">
            <h1>{{store.name}}</h1>
            <lc-rate disabled v-model="store.star"></lc-rate>
            <div class="addr clearfix"><p>{{store.address}}</p><span>{{getDistance(store.longitude,store.dimension)}}</span></div>
            <div class="discount" v-if="store.rightIllustrate">{{store.rightIllustrate}}</div>
        </router-link>

    </div>

  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            switchPages:[
                {name:'4S店',path:'/stores'},
                {name:'合作商家',path:'/partners'}
            ],

            st:0,
            pageNo:1,
            pageSize:10,
            nomore:false,
            list:[],

            types:[],
            showTypes:false,
            selectedType:{},

            areas:[],
            showAreas:false,
            selectedArea:{},

            sorts:[],
            showSorts:false,
            selectedSort:{},

            myLocation:''
        };
      },
      mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
      },
      activated() {

        if(this.list.length===0){
            this.selectedSort={};
            this.selectedArea={};
            this.selectedType={};
            this.refresh();
        }

        if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
      },
      beforeRouteLeave(to, from, next) {
        this.st = this.$el.children.appMain.scrollTop;
        next();
     },
      methods:{
        select(type,item){
            switch (type) {
                case 'type':
                    this.showTypes=false;
                    this.selectedType=item;
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
        popup(target){
            
            switch (target) {
                case 'type':
                    this.showSorts=false;
                    this.showAreas=false;
                    this.showTypes=!this.showTypes;
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
                            vtypeIds: this.selectedType.id||'',
                            areaIds: this.selectedArea.id||'',
                            dimension:this.$cache.location.lat||'24.501821',
                            longitude:this.$cache.location.lng||'118.143012'
                        }
                    };

                let res=await this.$post('/CRM/appcoopbusi/querycoopbusilist.json',data);
                if(res.errcode==0){
                    if(this.types.length===0){this.types=res.content.busiList};
                    if(this.areas.length===0){this.areas=res.content.areaList};
                    if(this.sorts.length===0){this.sorts=res.content.sortParamList};

                    let list=res.content.coopBusiList;
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
  #partners{
      .store{display:block;position: relative;padding:.1rem .2rem .1rem 1.05rem;background: #fff;border-bottom:$border;min-height:.7rem;line-height:.15rem;
        .pic{position:absolute;left:.2rem;top:.1rem;width:.7rem;height:.7rem;}
        h1{color:$black;line-height: .2rem;}
        .addr{font-size:$h4;color:$gray;text-indent:.14rem;background: url('~assets/img/icon-addr.png') no-repeat left center;background-size:.09rem .11rem;
            p{width:70%;@include txtOverflow;float: left;}
            span{float:right;}
        }
        .discount{@include txtOverflow;color:$gray;font-size:$h4;margin-top:.03rem;
            &::before{content:'享';display: inline-block;background:$orange;color:#fff;padding:0 .02rem;margin-right:.05rem;font-size:$h4;border-radius:.02rem;line-height:.14rem;}
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
