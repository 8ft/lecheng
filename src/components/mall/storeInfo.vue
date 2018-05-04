<template>

    <div :class="{'store-info':true,on:selected}">
              
        <div @click="select" class="info">
            <div class="name">
                <h2>{{data.name}}</h2>
                <div v-if="data.brandList">
                    <img v-for="item in data.brandList" :src="item.brandIcon||item.icon">
                </div>
            </div>
            <div class="address">
                <p>{{data.address}}</p>
                <span>{{getDistance(data.lng,data.lat)}}</span>
            </div>
        </div>

        <div class="contact">
            <router-link :to="'/map?lat='+data.lat+'&lng='+data.lng">地图</router-link>
            <a :href="'tel:'+data.phone">电话</a>
        </div>
        
    </div>

</template>

<script>
export default {
  name:'store-info',
  
  props:{
    readOnly:{type:Boolean,default:false},
    selected:{type:Boolean,default:false},
    data:{type:Object,default:{name:'',address:'',lat:'',lng:'',phone:'',brandList:[]}}
  },
  data() {
    return {
        myLocation:''
    }
  },
  mounted(){
    let point=this.$cache.location;
    this.myLocation=new BMap.Point(point.lng,point.lat);
  },

  methods:{
    getDistance(lng,lat){
        let point=new BMap.Point(lng,lat);
        let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));
        return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
    },
    select(){
        if(!this.readOnly){
            this.$emit('select');
        }
      }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .store-info{padding:0 .2rem;border-bottom:$border;background:#fff;margin-bottom:.05rem;
        &.on{color:inherit;
            .name{background: url('~assets/img/mall/icon_list_detail_select.png') no-repeat right center;background-size:17px 12px;}
        }
        .info{padding: .12rem 0;
            .name{display: flex;
                h2{font-size:.15rem;color:$black}
                
                &:last-of-type{margin-bottom:0;}
                div{height: .2rem;margin-left:.2rem;
                    img{width: .2rem;height:.2rem}
                }
                
            }
            .address{color: $gray;display: flex;justify-content:space-between;margin-top:.07rem;line-height:.16rem;font-size:$h3;
                p{width: 80%;@include txtOverflow}
            }
        }
        .contact{@include box;padding:.1rem 0;border-top:$border;color: $black;font-size: .14rem;}
            a{@include flex;text-align: center;
            &:before{content:'';display: inline-block;width:.14rem;height:.14rem;margin-right:.06rem;vertical-align: middle;background: url('~assets/img/mall/icon_popup_list_phone.png') no-repeat center;background-size:.14rem .14rem;}
            &:first-of-type:before{background-image: url('~assets/img/mall/icon_popup_list_address.png');margin-top: -.02rem;}
            &:first-of-type{border-right:$border;}
        }
    }
</style>
