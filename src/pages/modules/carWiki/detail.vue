<template>
    <app-layout id="carWikiDetail">
        <div class="header">
            <img :class="'banner'+data.subType" :src="data.detailIcon">
            <h1>{{data.detailTitle}}</h1>
        </div>

        <article v-html="data.detailContentHtml&&data.detailContentHtml.replace(/<br\/>/g,'</p><p>')"></article>
        
    </app-layout>
</template>

<script>
    export default {
      name:'ex-carWikiDetail',
      data() {
        return {
            type:'201',
            data:{}
        };
      },
      mounted(){
        this.getData(this.$route.path.split('detail/')[1]);
      },
      methods:{
          async getData(val){
            let data = {content: {pkId: val}};
            let res=await this.$post('/CRM/appcarencyclopedia/getItemDetailByPkId.json', data);
            if (res.errcode == 0) {
                let con=res.content;
                this.data=con;

                //分享内容
                let shareData={
                    share_title:con.shareTitle,
                    share_desc:con.shareContent,
                    share_img:con.detailIcon,
                    share_url: location.href.replace(location.search,'?')
                }
                this.$utils.shareConfig(shareData);  
            }
          }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #carWikiDetail{
    background:#fff;
    .header{
        img{display:block;max-width:100%;margin:0 auto .15rem;}
        .banner201{width:100%;height:1.675rem;}
        .banner202,.banner203{width: .8rem;height:.8rem;margin-top:.2rem;}
        h1{font-size:.22rem;color:#22222d;font-weight: bold;padding:0 .2rem .2rem;}
    }

    article{font-size:$h2!important;color:$black;padding:.2rem;
        p,p *{margin-bottom:.13rem!important;line-height:.26rem!important;letter-spacing:.01rem!important;text-indent: 0!important;}
        img{display:block;margin:0 auto .15rem!important;max-width:100%;}
    }
  }
</style>
