<template>
    <app-layout id="weatherArea">

        <ul class="list">
            <li>当前城市</li>
            <li @click="changeCity"><img src="~assets/img/icon-addr.png">{{city}}</li>
        </ul>

        <ul class="list">
            <li>全部城市</li>
            <li class="arrow-link" v-for="item in cityArr" @click="changeCity(item)">{{item}}</li>
        </ul>

    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                city:'',
                cityArr:['福州市','厦门市','泉州市','漳州市','三明市','龙岩市','南平市','莆田市','宁德市']
            }
        },
        activated(){
            this.city=this.$cache.city;
        },
        methods:{
            changeCity(city){
                if(city&&city!==this.city){
                    eventBus.$emit('cityChanged', city);
                }
                this.$router.go(-1);
            }
        }

    }
</script>
<style lang="scss">
  #weatherArea{
      .list{margin-bottom:.1rem;
          img{width:.1rem;vertical-align: middle;margin-right:.05rem;}
          li:nth-of-type(1){padding: .07rem .14rem;background: #fafafa;}
      }
  }
</style>
