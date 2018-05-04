<template>
    <app-layout id="serverList">

        <ul class="list">
            <li v-for="value in listItems" v-on:click="select(value.id,value.name)" :class="'clearfix'+(action==='maintenance'?(value.isFree==1?'':' dis'):'')" >

                <img :src="value.imgUrl?value.imgUrl:default_server">
                <h1>{{value.name}}</h1>
                
                <label>
                    <span v-if="value.positionalTitle">{{value.positionalTitle}}</span>
                    {{value.station}}
                </label>

                <p><lc-rate disabled v-model="value.star"></lc-rate><span class="served">{{value.orders}}单</span></p>

                <div v-if="(action==='maintenance')&&value.isFree!=1" class="free">{{value.isFree==0?'休息':'预约已满'}}</div>
                <div v-else class="tick" :style="sid==value.id ? 'background:#a9ce52': ''" ></div>
            </li>
        </ul>
        
    </app-layout>
        
</template>

<script>
    export default {
      name:'ex-serverList',
      data() {
        return {
          default_server:require('assets/img/default_server.png'),
          action:'',
          sid:'',
          listItems: [],
        };
      },
      mounted() {
          this.action=this.$route.query.action;
          this.sid=this.$cache.server.id;

          this.getData();
      },
      methods: {
            async getData() {
                let date=this.$cache.date,
                    sd=date.bespeakDate,
                    st=date.bespeakTime;

                var d={content:{
                    "4sStoreId":this.$cache.fourS.id,
                    serviceDate: (sd?sd:''),
                    serviceTime: (st?st:'')
                }};

                let res=await this.$post('/CRM/appbespeak/queryservicecust.json',d);
                if(res.errcode==0){
                    this.listItems=res.content.custList;
                }
            },
            async select(id,name){
                if(this.action=='update'){
                    let d={
                        content: {
                            carId : this.$cache.car.carId,
                            serviceCustId:id
                        }
                    };
                    let res=await this.$post('/CRM/appmembermgcust/updatezsservice.json', d);
                    if (res.errcode == 0) {
                        eventBus.$emit('userInfoUpdated');
                        this.$cache.server={
                            id:id,
                            name:name
                        };
                        this.$router.go(-1);
                    }
                }else{
                    this.$cache.server={
                        id:id,
                        name:name
                    };
                    this.$router.go(-1);
                }
                
            }
        }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #serverList li{position:relative;font-size:$h3;color:$gray;padding:.1rem .2rem .1rem .9rem;

      img{width:.5rem;height:.5rem;border-radius: 50%;position:absolute;left:.2rem;top:.1rem;}

      h1{line-height:.2rem;font-size:$h2;color:$black;}

      label{display:block;height:.15rem;margin-bottom:.05rem;
          span{display:inline-block;background:$mainColor;color:#fff;}
          span:nth-of-type(1),p span:nth-of-type(1){background:$mainColor;padding:0 .05rem;color:#fff;border-radius:3px;margin-right:5px;}
      } 

      .served{margin-left:.1rem;}

      .free{color:$gray;position:absolute;right:.2rem;top:50%;line-height: .2rem;padding:0 .1rem;margin-top:-.05rem;}
      .tick{
            position: absolute;
            width: .2rem;
            height: .2rem;
            border-radius: 50%;
            background: #d7d7d7;
            right: .2rem;
            top: 50%;
            margin-top:-.1rem;
            &::after{position:absolute;content:'';width:.1rem;height:2px;top: .10rem;left:.065rem;transform: rotate(-50deg);background: #fff}
            &::before{position:absolute;content:'';width:.05rem;height:2px;top: .11rem;left:.04rem;transform: rotate(40deg);background: #fff}
        }
  }
</style>
