<template>
  <app-layout>
        <div id="article" style="padding:.1rem .2rem;" v-html="pageData.articleContent||''"></div>
  </app-layout>
</template>

<script>
    export default {
      name:'ex-article',
      data() {
        return {
          pageData:{}
        };
      },
      mounted(){
        this.getData();
      },
      methods: {
        async getData() {
            let data={content: {
                id: this.$route.params.id
            }};

            let res=await this.$post('/CRM/apparticle/queryArticleDetail.json',data);
            if(res.errcode==0){
                let con=res.content;

                con.articleContent=con.articleContent.replace(/data-src/g,'src');
                this.pageData=res.content;
            }
        }
      }
    }
</script>

