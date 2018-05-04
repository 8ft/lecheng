<template>

    <div class="order-store">
        
        <div class="base">
            <img class="photo" :src="data.photo">
            <h1>{{data.name}}</h1>
            <div class="brands">
                <img v-for="item in data.brandList" :src="item.icon">
            </div>

            <lc-rate disabled v-model="data.score"></lc-rate>
            <a :href="'tel:'+data.phone"></a>
        </div>

        <router-link class="addr clearfix" :to="'/map?lat='+data.lat+'&lng='+data.lng">
            <p>{{data.address}}</p>
            <span>{{getDistance(data.lng,data.lat)}}</span>
        </router-link>
    </div>

</template>

<script>
export default {
  name:'order-store',
  
  props:{
    data:{type:Object}
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
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-store{padding:.2rem .2rem 0;background:#fff;
        .base{padding-left:.75rem;position: relative;
            .photo{position:absolute;left:0;top:0;width:.6rem;height:.6rem;border-radius: .03rem;}

            h1{font-size:.15rem;color:$black}
            .brands{height: .2rem;
                img{width: .2rem;height:.2rem;margin-right:.1rem;}
            }

            a{position:absolute;top:0;right:0;display: block;width:.3rem;height: .3rem;background:url('~assets/img/phone.png') no-repeat center;background-size:100%;}
        }

        .addr{font-size: $h3;color:$gray;line-height:.44rem;display:block;
            p{width:65%;@include txtOverflow;float:left;text-indent:.14rem;background: url('~assets/img/icon-addr.png') no-repeat left center;background-size:.09rem .11rem;}
            span{float:right;padding-right:.3rem;background: url('~assets/img/indicator.png') no-repeat right center;background-size:.16rem .16rem;}
        }
    }
</style>
