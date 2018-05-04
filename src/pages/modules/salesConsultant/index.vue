<template>
    <app-layout id="salesConsultant">

        <ul class="list">
            <li class="clearfix" v-for="item in list" v-on:click="select(item)">
                <img :src="item.imgUrl?item.imgUrl:default_server">
                <h1>{{item.name}}</h1>
                
                <label>
                    <span v-if="item.positionalTitle">{{item.positionalTitle}}</span>
                    {{item.station}}
                </label>

                <p><lc-rate disabled v-model="item.star"></lc-rate></p>

                <div class="tick" :style="sid==item.id ? 'background:#a9ce52': ''" ></div>
            </li>
        </ul>
        
    </app-layout>
        
</template>

<script>
    export default {
      data() {
        return {
          default_server:require('assets/img/default_server.png'),
          sid:'',
          list: []
        };
      },
      activated(){
          this.sid=this.$cache.salesConsultant.id;
          if(!this.sid){
              this.getData();
          }
      },
      methods: {
            async getData() {
                let data={content:{
                    foursId:this.$cache.fourS.id
                }};

                let res=await this.$post('/CRM/appuser/salesConsultantList.json',data);
                if(res.errcode==0){
                    this.list=res.content.custList;
                }
            },
            async select(data){
                this.$cache.salesConsultant=data;
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #salesConsultant li{position:relative;font-size:$h3;color:$gray;padding:.1rem .2rem .1rem .9rem;

      img{width:.5rem;height:.5rem;border-radius: 50%;position:absolute;left:.2rem;top:.1rem;}

      h1{line-height:.2rem;font-size:$h2;color:$black;}

      label{display:block;height:.15rem;margin-bottom:.05rem;
          span{display:inline-block;background:$mainColor;color:#fff;}
          span:nth-of-type(1),p span:nth-of-type(1){background:$mainColor;padding:0 .05rem;color:#fff;border-radius:3px;margin-right:5px;}
      } 

      .served{margin-left:.1rem;}

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
