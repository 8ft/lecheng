<template>
  <app-layout id="recommendBuyersRecommend">

        <ul class="card">
          <li>
            <label>{{txts.name||''}}<span>*</span></label>
            <input class="item-val" type="text" :placeholder="txts.nameTip||''" v-model="name">
          </li>
          <li>
            <label>{{txts.phone||''}}<span>*</span></label>
            <input class="item-val" type="text" :placeholder="txts.phoneTip||''" v-model="phone">
          </li>
        </ul>

        <ul class="card">
            <li class="arrow">
              <label>{{txts.fourS||''}}<span>*</span></label>
              <router-link to="/recommendBuyers/fourS" class="item-val">{{fourS}}</router-link>
            </li>
            <li v-if="fourS!='请选择'" class="arrow">
              <label>销售顾问</label>
              <router-link to="/salesConsultant" class="item-val">{{salesConsultant}}</router-link>
            </li>
            <li v-if="fourS!='请选择'" class="arrow">
              <label>意向车系</label>
              <router-link to="/recommendBuyers/brands" class="item-val">{{car}}</router-link>
            </li>
        </ul>

        <ul class="card">
          <li class="txtArea">
                <label>备注</label>
                <textarea placeholder="有其他购车意向可以填写在这里哦~" v-model="remark"></textarea>
          </li>
        </ul>

        <div class="btns" slot="footer">
            <button class="share" v-on:click="share" v-if="!$route.query.id">转发朋友代填</button>
            <button class="submit" v-on:click="sub">立即提交</button>
        </div>
        
        <img v-if="wxInvite" src="/CRM/WeChat/App/static/img/invite.png" class="invite-tip" v-on:click="wxInvite=false">

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        txts:{},
        defaultTxts:{
          name:'客户姓名',
          nameTip:'您要推荐的客户姓名',
          phone:'客户电话',
          phoneTip:'您要推荐的客户手机号码',
          fourS:'推荐4S店'
        },
        shareTxts:{
          name:'姓名',
          nameTip:'请输入您的姓名',
          phone:'电话',
          phoneTip:'请输入您的手机号码',
          fourS:'选择4S店'
        },

        name:'',
        phone:'',
        fourS:'请选择',
        car:'请选择(选填)',
        salesConsultant:'请选择(选填)',
        remark:'',
        areaVisible:false,

        wxInvite: false,
      };
      
    },
    watch: {
      fourS(val) {
        if (val!=='请选择要推荐的4S店') {
          this.car='请选择意向车型';
          this.salesConsultant='请选择(选填)';
          
          this.$cache.brand = {};
          this.$cache.salesConsultant={};
        }
      }
    },
    activated(){
      this.txts=this.$route.query.id?this.shareTxts:this.defaultTxts;

      let s=this.$cache,
          fourS=s.fourS.name,
          brand=s.brand,
          salesConsultant=s.salesConsultant.name;

      if(fourS){this.fourS=fourS;}
      if(salesConsultant){this.salesConsultant=salesConsultant;}
      if(brand.bname){this.car=(brand.bname+' '+brand.sname);}
    },
    beforeRouteLeave (to,from,next){
      if(to.path=='/recommendBuyers'){
        this.resetPage();
        this.$cache.fourS = {};
        this.$cache.brand = {};
      }
      next();
    },
    methods: {
      resetPage(){
        this.name='';
        this.phone='';
        this.fourS='请选择';
        this.car='请选择(选填)';
        this.salesConsultant='请选择(选填)';
        this.remark='';
        this.areaVisible=false;
      },
      hasNull(){
       if(this.name===''){
         this.$toast('请输入姓名');
         return true;
       }

       if(this.phone===''){
         this.$toast('请输入手机号码');
         return true;
       }else if(!/^1[345789]\d{9}$/.test(this.phone.replace(/\s/g,''))){
         this.$toast('手机号码格式有误，请检查');
         return true;
       }

       if(this.fourS==='请选择要推荐的4S店'){
         this.$toast('请选择要推荐的4S店');
         return true;
       }

        return false;
      },
      share(){
        let shareData=this.$cache.recommendBuyersShareData;
            shareData.share_title='您有一份购车大礼包待领';
            shareData.share_desc='欢迎您参加盈众老友记活动，车主介绍亲友购车，新老客户双享诚意大礼！';
            shareData.share_url=location.origin+'/wxwap?#/recommendBuyers/share/'+this.$cache.user.memberId;

        this.$utils.shareConfig(shareData,'call');
        if (!isLecheng) {
          this.wxInvite = true;
        } 
      },
      async sub(){
        if(!this.hasNull()){
            let s=this.$cache,
                fourS=s.fourS.id,
                brand=s.brand;
                
            let data={
              content:{
                memberId:this.$route.query.id||s.user.memberId,
                customerName:this.name,
                customerPhone:this.phone,
                recommendFours:fourS,
                intentionCarBrand:brand.bid||'',
                intentionCarSeries:brand.sid||'',
                consultant:this.salesConsultant,
                remark:this.remark,
                openId:this.$route.query.id?document.cookie.replace(/(?:(?:^|.*;\s*)openid\s*\=\s*([^;]*).*$)|^.*$/, "$1"):''
              }};
                
            let res=await this.$post('/CRM/wechatrecommendbuycar/commitCustomerInfo.json',data);
            if(res.errcode==0){
              this.$messagebox.alert('推荐成功').then(action => {
                  this.$router.go(-1);
              });
            }
          }
      }
    }
  }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #recommendBuyersRecommend{
    .card {
      li{border-bottom:$border;}
      li:not(.txtArea){@include box;height:.44rem;line-height:.44rem;padding:0 .12rem;}
      li:not(.txtArea) label{@include flex;}
      li.arrow{
        position:relative;padding-right:.20rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      
      li.txtArea{
          padding:.12rem;
          label{display: block;}
          textarea{text-align: left;color:$black;width:100%;line-height:.20rem;min-height:.60rem;}
      }

      li label span{color:red;}
      
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;height:.44rem;}

      input{height:100%;line-height:normal!important;}
    }

    .btns{@include box;height:.5rem;
        button{display: block;line-height:.5rem;color:#fff;}
        .share{@include flex(1.5);background:#f29600;;}
        .submit{@include flex(2.5);background:$mainColor;}
    }
    
  }

</style>
