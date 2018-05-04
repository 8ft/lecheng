<template>
  <app-layout id="carExhibition_serverLogin">

    <div class="header">
      <img :src="data.img">
      <h1>{{data.autoShowName}}</h1>
      <h2>活动时间：{{data.startTime}} 至 {{data.endTime}}</h2>
    </div>

    <div class="input">
      <h1>销售顾问工号</h1>
      <input type="text" placeholder="请输入您的盈众公司工号  例：105121" v-model="wid">
    </div>

    <div slot="footer" class="nextOne"><button class="btn" v-on:click="next()">下一步</button></div>
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          data:{},
          wid:'',
          default_profile: require('assets/img/default_user.png'),
        }
      },
      mounted(){
        this.getData();
      },
      methods: {
        next(){
          let wid=this.wid;
          if(wid!==''){
            this.$router.push('/carExhibition/buildLink?aid='+this.$route.query.aid+'&wid='+wid);
          }else{
            this.$messagebox.alert('请输入您的工号');
          }
        },
        async getData() {
            let d={content: {
                id: this.$route.query.aid
                }};

            let res=await this.$post('/CRM/wechatautoshow/querySalesConsultantInfo.json',d);
            if(res.errcode==0){
                this.data=res.content;
            }
        }

      }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";

    #carExhibition_serverLogin{font-size:$h3;padding-bottom:.51rem;

        .header{
            text-align:center;
            img{width:100%;}
            h1{@include bold;}
            h2{color:$gray;}
        }

        .input{
          padding:.2rem;
          h1{@include bold;margin-bottom:.15rem;}
          input{background:#fff;box-sizing:border-box;width:100%;border-radius:3px;padding:.15rem;font-size:$h2;}
        }

    }
</style>