<template>
    <app-layout id="orderShipping">
        <div class="base">
            <div class="img">
                <img :src="pageData.picPath">
                <div>{{pageData.count}}件商品</div>
            </div>
            
            <p><span>物流公司：</span>{{pageData.logisticsCompany}}</p>
            <p><span>运单编号：</span>{{pageData.invoiceNo}}</p>
        </div>

        <div class="status">
            <div class="step" v-for="item in pageData.nodeList">
                <div>
                    <h1 v-html="initCon(item.nodeContent)"></h1>
                    <span>{{item.nodeTime}}</span>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    export default {
      name:'ex-orderShipping',
      data() {
        return {
            no:'',
            pageData:{}
        };
      },
      mounted(){
          this.no=this.$route.params.id;
          this.getData();
      },
      methods: {
        initCon(con){
            return con.replace(/0\d{2,3}-\d{7,8}/g,'<a href="tel:$&">$&</a>').replace(/1[345789]\d{9}/g,'<a href="tel:$&">$&</a>');
        },
        async getData() {
            let data=this.$sign({
                    content:{
                        no:this.no
                    }
                });

            let res=await this.$post('/CRM/api/query.logistics.json',data);
            if(res.errcode==0){
                this.pageData=res.content;
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #orderShipping{font-size:$h3;line-height:.2rem;
    .base{margin-top:.1rem;height:.6rem;padding:.15rem .2rem .15rem 1rem;background:#fff;position: relative;border-bottom:$border;
        .img{height:.6rem;width:.6rem;position:absolute;left:.2rem;top:.2rem;
            img{width:100%;height:100%;}
            div{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.8);text-align: center;color:#fff;}
        }
        p{margin-bottom:.05rem;
            span{color:$gray;margin-right:.2rem;}
        }
    }

    .status{background: #fff;padding:.2rem;
        .step{
            div{border-left:1px solid #f1f1f1;padding-left:14px;position:relative;
                &::before{content:'';display:block;width:10px;height:10px;background: lightgray;border-radius:99px;position:absolute;left:-5px;top:0;}
            }
            h1{margin-bottom:.05rem;
                a{color:$mainColor;}
            }
            span{display:block;color:lightgray;font-size:$h4;padding-bottom:.24rem;}
        }

        .step:first-of-type{
            div::before{background: $mainColor;}
        }

        .step:last-of-type{
            div{border-left:none;}
        }
    }
  }
</style>
