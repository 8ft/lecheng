<template>
    <app-layout id="guideDetail">
        <div class="header">
            <!-- <img class="'banner201" :src="data.imgUrl"> -->
            <h1>{{data.title}}</h1>
        </div>
        <article v-html="data.articleContent&&data.articleContent.replace(/<br\/>/g,'</p><p>').replace(/data-src/g,'src')"></article>
    </app-layout>
</template>

<script>
    export default {
      name:'ex-guideDetail',
      data() {
        return {
            data:{}
        };
      },
      mounted(){
        this.getData(this.$route.params.id);
      },
      methods:{
          async getData(val){
            let data = {content: {id: val}};
            let res=await this.$post('/CRM/appmaintenance/queryMaintenanceDetail.json', data);
            if (res.errcode == 0) {
                let con=res.content
                this.data=con;
                
                //分享内容
                let shareData={
                    share_title:con.shareTitle,
                    share_desc:con.shareContent,
                    share_img:con.shareImgUrl,
                    share_url: location.href.split('?')[0]
                }
                this.$utils.shareConfig(shareData);                       
            }
          }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #guideDetail{
      background:#fff;
      .header{
          img{display:block;width:100%;margin:0 auto .15rem;}
          h1{font-size:.22rem;color:#22222d;font-weight: bold;padding:0 .2rem .2rem;}
      }

      article{font-size:$h2!important;color:$black;padding:.2rem;
          p,p *{margin-bottom:.13rem!important;line-height:.26rem!important;letter-spacing:.01rem!important;text-indent: 0!important;}
          img{display:block;margin:0 auto .15rem!important;max-width:100%;}
      }
  }
</style>
