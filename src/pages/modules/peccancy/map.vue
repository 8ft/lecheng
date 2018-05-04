<template>
    <app-layout id="peccancyMap">
        
        <div slot="header" class="record">
            <div class="top clearfix">
                {{data.date}}
                <span>未处理</span>
            </div>
            <div class="center">
                <p>{{data.area}}</p>
                <p>{{data.act}}</p>
            </div>
            <div class="bottom">
                <div>扣分：<span>{{data.fen}}</span></div>
                <div>罚款: <span>{{data.money}}</span></div>
            </div>
        </div>
        
        <div v-if="error" class="lc-error">
            <img src="~assets/img/error-map.png">
            <p>无法加载违章地图</p>
        </div>   

        <div :class="error?'hide':''" id="pmap"></div>

    </app-layout>
</template>

<script>
    export default {
      name:'ex-peccancyMap',
      data() {
        return {
            data:{},
            error:false
        };
      },
      mounted(){
        let data=this.$cache.peccancy.record;
        this.data=data;
       
        if(!window.BMap){
            let vm=this;
            window.initMap=function () {vm.draw();}
            this.loadJScript();
        }else{
            this.draw();
        }  
      },
      methods: {
        draw(){

            let vm=this,
                map = new BMap.Map("pmap"),
                myGeo = new BMap.Geocoder();

            myGeo.getPoint(vm.data.area, function(point){
                if (point) {
                    map.centerAndZoom(point, 15);
                    map.addOverlay(new BMap.Marker(point));
                }else{
                    vm.error=true;
                }
            }, vm.data.city);

        },
        loadJScript () {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//api.map.baidu.com/api?v=2.0&ak=Znq1u2zyPT8ChoO1DWwP945g&callback=initMap";
            document.body.appendChild(script);
        }
      }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #peccancyMap{
        #allmap{ width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
        #allmap.hide{visibility: hidden;}
        .record{
            display:block;background:#fff;font-size:$h3;color:$gray;
            span{color:$mainColor;font-size:.14rem;}

            .top{border-bottom:$border;padding:.14rem .2rem .1rem;line-height:.16rem;
                span{float:right;}
            }

            .center{border-bottom:$border;padding:.14rem .2rem;line-height:.2rem;position:relative;
                  p{padding:0 .15rem;position: relative;}
                  p:nth-of-type(1)::before{content:'';display:block;position:absolute;left:0;top:.04rem; width:.09rem;height:.11rem;margin-right:.06rem;background:url('~assets/img/icon-addr.png') no-repeat center;background-size:100%;}
                  p:nth-of-type(2){padding-left: .15rem;}
            }
            .bottom{padding:.1rem .2rem .14rem;@include box;
                div:nth-of-type(1){@include flex(1);}
                div:nth-of-type(2){@include flex(2);}
            }
        }
    }
</style>