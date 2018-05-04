<template>
  <app-layout id="carExhibition_signUp">
    
    <div v-if="data.vstatus=='3'" class="nodata">活动已结束</div>

    <ul v-if="data.vstatus=='1'">
      <li>
        <label>项目</label>
        <div class="item-val">{{data.name||''}}</div>
      </li>
      <li class="editable">
        <label>姓名</label>
        <input class="item-val" type="text" placeholder="请输入您的姓名" v-model="name">
      </li>
      <li class="editable">
        <label>手机</label>
        <input class="item-val" type="text" placeholder="请输入您的手机号码" v-model="phone">
      </li>
      <li class="selecter" v-if="data.joinBrandList&&data.joinBrandList.length>1">
          <label>品牌</label>
          <div>
              <span v-for="(brand,bi) in data.joinBrandList&&data.joinBrandList" :class="selectBrand===bi?'on':''" v-on:click="selectBrand=bi;">{{brand.brandName}}</span>
          </div>
      </li>
      <li class="selecter">
          <label>车系</label>
          <div>
              <span v-for="(car,ci) in data.joinBrandList&&data.joinBrandList[selectBrand].seriesList" :class="selectCar===ci?'on':''" v-on:click="selectCar=ci;carId=car.seriesId;">{{car.seriesName}}</span>
          </div>
      </li>
    </ul>

    <div slot="footer" class="nextOne"><button class="btn" v-on:click="next()">提交订单</button></div>
  </app-layout>

</template>

<script>
    export default {
        name:'ex-carExhibitionSignUp',
        data() {
          return {
            selectBrand:0,
            selectCar:0,
            carId:-1,
            data:{},
            uid:'',
            name:'',
            phone:''
          }
        },
        mounted() {
            let user=this.$cache.user;
            this.uid=user.memberId;
            this.name=user.name;
            this.phone=user.phone;
            this.getData();
        },
        watch:{
            selectBrand(val) {
                this.selectCar=0;
                this.carId=this.data.joinBrandList[val].seriesList[0].seriesId;
            }
        },
        methods: {
            async getData() {
              let d = {
                content: {
                  id: this.$route.query.aid
                }
              };

              let res=await this.$post('/CRM/wechatautoshow/orderPage.json', d);
              if (res.errcode == 0) {
                this.data = res.content;
                this.carId=this.data.joinBrandList[0].seriesList[0].seriesId;
              } 
            },
            hasNull() {
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
              
              return false;
            },
            async next() {
              if (!this.hasNull()) {

                let d = {
                  content: {
                    id:this.$route.query.aid,
                    memberId: this.uid,
                    signUpName: this.name,
                    signUpPhone: this.phone,
                    seriesId: this.carId,
                    consultantId: this.$route.query.sid||''
                  }
                };

                let res=await this.$post('/CRM/wechatautoshow/createOrder.json', d);
                if (res.errcode == 0) {
                  this.$messagebox.alert('报名成功！').then(action => {
                    this.$cache.history.pop();
                    this.$router.replace('/carExhibition/orderDetail?oid='+res.content.orderId);
                  });
                }
              }
            }
        }
      }
    
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #carExhibition_signUp{padding-bottom:.61rem;
      ul{background:#fff;margin-top:.1rem;}
      li{
        padding:0 .12rem 0 .6rem;border-bottom:$border;position:relative;height:.44rem;line-height:.44rem;
        label{position:absolute;left:.12rem;}
        .item-val{text-align:right;color:$black;@include txtOverflow;height:.44rem;width:100%;}
        input{height:100%;line-height:normal!important;}
      }

      li.editable{padding-right:.32rem;
        &::after{content:'';display:block;position:absolute;width:.15rem;height:.15rem;right:.12rem;top:.145rem;background:url('~assets/img/carExhibition/icon_-traffic_editor.png') no-repeat center;background-size:100%;}
      }

      li.selecter{
          height:auto;
          div{line-height:initial;padding-top: .1rem;}
          span{display:inline-block;font-size:$h3;line-height:.26rem;margin:0 .1rem .1rem 0;border:1px solid hsla(0,0%,93%,.6);padding:0 .08rem;border-radius:4px;}
          span.on{border-color:$mainColor;color:$mainColor;}
      }
}
</style>