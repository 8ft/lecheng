<template>
  <app-layout class="signUp">
  
      <img class="login-logo" src="/CRM/WeChat/App/static/img/login_logo.png">
  
      <input class="txt" id="pwd" type="text" placeholder="请设置您的密码(6-20位数字或字母)" v-model="pwd">
  
      <button class="next" v-on:click="next">完 成</button>
  
  </app-layout>
</template>

<script>
import MD5 from 'js-md5'
export default {
  data() {
    return {
      pwd: ''
    };
  },
  methods: {
    hasNull(type) {
      let pwd = this.pwd;

      if (pwd === '') {
        this.$toast('请输入密码');
        return true;
      } else if (!/^[A-Za-z0-9]{6,20}$/.test(pwd)) {
        this.$toast('密码应为6-20位数字或字母')
        return true;
      }

      return false;
    },
    async next() {
      if (!this.hasNull('next')) {

        let data = {
          content: {
            openid:this.$utils.getCookie('openid'),
            password:MD5(this.pwd).toLowerCase(),
          }
        };

        let res=await this.$post('/CRM/wechatcfg/commitpwd.json', data);
        if (res.errcode == 0) {
          let entry=this.$cache.entry;
          if(entry){
              this.$cache.history.pop();
              this.$router.replace(entry);
            }else{
              this.$router.go(-1);
            }
        } 
      }
    }

  }
}
</script>
