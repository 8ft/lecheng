<template>
  <app-layout class="signUp">
  
      <img class="login-logo" src="/CRM/WeChat/App/static/img/login_logo.png">
  
      <input class="txt" type="tel" placeholder="请输入您的手机号码" v-model="phone">
      <div class="txt clearfix">
        <input type="tel" placeholder="请输入验证码" v-model="code">
        <div id="getCode" :class="coundDown!=='发送验证码'&&'dis'" v-on:click="sendCode">{{coundDown}}</div>
      </div>
  
      <button class="next" v-on:click="next">提 交</button>
  
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      code: '',
      coundDown: '发送验证码'
    };
  },
  watch: {
    coundDown(val) {
      if (this.coundDown > 0) {
        setTimeout(() => {
          this.coundDown -= 1;
        }, 1000);
      }else{
        this.coundDown='发送验证码';
      }
    },
  },
  methods: {
    hasNull(type) {
      if (this.phone === '') {
        this.$toast('请输入手机号码');
        return true;
      } else if (!/^1[345789]\d{9}$/.test(this.phone.replace(/\s/g,''))) {
        this.$toast('手机号码格式有误，请检查');
        return true;
      }

      if (type === 'next' && this.code === '') {
        this.$toast('请输入验证码');
        return true;
      }

      return false;
    },
    async sendCode() {
      if (!this.hasNull('sendCode')) {
        this.coundDown = 60;

        let data = this.$sign({
          appVersion:'2.6.0',
          content: this.$utils.encrypt(JSON.stringify({
            mobilephone:this.phone
          })),
          ts:new Date().getTime()
        },'sms');

        let res=await this.$post('/CRM/appcustlogin/sendsms.json', data);
        if (res.errcode != 0) {
          this.coundDown = '发送验证码';
        }
      }
    },
    async next() {
      if (!this.hasNull('next')) {
        let data = {
          content: {
            openid:this.$utils.getCookie('openid'),
            mobilephone:this.phone,
            code: this.code
          }
        };

        let res=await this.$post('/CRM/wechatcfg/regcust.json',data);
        if (res.errcode == 0) {
          if (res.content.isMbe) {
            let entry=this.$cache.entry;
            if(entry){
              this.$cache.history.pop();
              this.$router.replace(entry);
            }else{
              this.$router.go(-1);
            }
          } else {
            this.$cache.history.pop();
            this.$router.replace('/setPwd');
          }
        } 
      }
    }

  }
}
</script>
