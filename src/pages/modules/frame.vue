<template>
      <iframe id="ifrm" width="100%;" height="100%;" v-bind:src="actUrl" frameborder="0"></iframe>
</template>
<script>
import MD5 from 'js-md5'
export default {
  data() {
    return {
      actUrl: ''
    };
  },
  activated() {
    this.$indicator.open();

    let curPath = this.$route.path,
        origin=location.origin;

    if (/spMall/.test(curPath)) {

      let sourceUrl,
        to = curPath.split('spMall/')[1];

      switch (to) {
        case 'coupon':
          sourceUrl = "https://www.lechengclub.com/wap/shop-coupon.html?shop_id=2";
          break;
        case 'myCoupon':
          sourceUrl = "https://www.lechengclub.com/wap/member-couponList.html";
          break;
        case 'pMall':
          sourceUrl = "https://www.lechengclub.com/wap/jfshop.html?winzoom=1";
          break;
        case 'mall':
          sourceUrl = "https://www.lechengclub.com/wap/";
          break;
        case 'duiba':
          sourceUrl = "https://www.lechengclub.com/duiba/login.html";
          break;
        case 'somePage':
          sourceUrl = decodeURIComponent(this.$route.query.url);
          break;

      }
      
      let user = this.$cache.user,
        token = "START_UOKJsdfsw1354sDFSADF_END",
        before = "https://www.lechengclub.com/api-m/?method=user.login.duiba-m&format=json&sign_type=md5&v=v1",
        up = user.phone,
        mid = user.memberId,
        timestamp = (new Date()).valueOf().toString().substring(0, 10),
        sign = MD5("format=json&method=user.login.duiba-m&mid=" + mid + "&sign_type=md5&timestamp="+timestamp+ "&up=" + up +"&url=" + sourceUrl + "&v=v1&"+token ),

        next = before   
          + "&timestamp=" + timestamp
          + "&up=" + up
          + "&mid=" + mid
          + "&url=" + encodeURIComponent(sourceUrl)
          + "&sign=" + sign ;

      location.replace(next);
    } else {

      let indicator=this.$indicator,
          url=decodeURIComponent(this.$route.query.actUrl);

      if(/http/.test(url)){
        this.actUrl=url;
      }else{
        this.actUrl = origin+url;
      }
      
      let oFrm = document.getElementById('ifrm');
      
      oFrm.onload = oFrm.onreadystatechange = function () {
        if (this.readyState && this.readyState != 'complete') return;
        else {
          indicator.close();
        }
      }

    }
  },
  deactivated() {
    this.actUrl = '';
  }
}
</script>