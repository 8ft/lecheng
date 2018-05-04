<template>
    <app-layout id="map">
        
        <div v-if="error" class="lc-error">
            <img src="~assets/img/error-map.png">
            <p>无法加载地图</p>
        </div>   

        <div :class="error?'hide':''" id="map"></div>

    </app-layout>
</template>

<script>
    export default {
      name:'ex-map',
      data() {
        return {
            error:false
        };
      },
      mounted(){
        this.draw();
      },
      methods: {
        draw(){
            let map = new BMap.Map("map"),
                point=new BMap.Point(this.$route.query.lng,this.$route.query.lat);
            
            map.centerAndZoom(point, 15);
            map.addOverlay(new BMap.Marker(point));
        }
      }
    }
</script>

<style lang="scss">
    #map{
        #allmap{ width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
        #allmap.hide{visibility: hidden;}
    }
</style>