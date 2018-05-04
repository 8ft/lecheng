<template>
    <app-layout id="orderTrail">
        <div class="trail-icons">
            <h1>订单编号：{{no}}</h1>
            <ul>
                <li :class="{'last-icon':i===pageData.iconList.length-1,on:item.bright?true:false}" v-for="(item,i) in pageData.iconList"><div></div><p><img :src="item.icon">{{item.text}}</p></li>
            </ul>
        </div>

        <ul class="trail-nodes" v-if="pageData.nodeList">
            <li class="node" v-for="item in pageData.nodeList">
                <div>
                    <h1>{{item.nodeContent}}</h1>
                    <span>{{item.nodeTime}}</span>
                </div>
            </li>
        </ul>
        
    </app-layout>
</template>

<script>
    export default {
      name:'ex-orderTrail',
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
        async getData() {
            let data=this.$sign({
                    content:{
                        no:this.no
                    }
                });

            let res=await this.$post('/CRM/api/query.track.json',data);
            if(res.errcode==0){
                this.pageData=res.content;
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #orderTrail{font-size:$h3;line-height:.2rem;

    .trail-icons{padding:.1rem .2rem;background: #fff;border-bottom:$border;
        ul{@include box;padding:.35rem 0 0;
            li{@include flex;text-align:center;color:$gray;position:relative;
                div{display:block;height:1px;width:100%;background:$lightGray;position: absolute;top: 0;left:0;}
                p{position:relative;display:inline-block;padding-top:.18rem;
                    img{width:.25rem;position:absolute;top:-.125rem;left:50%;margin-left:-.165rem;border-left:.04rem solid #fff;border-right:.04rem solid #fff;}
                }

                &:first-of-type{div{width:50%;left:auto;right:0;}}
                &.last-icon{div{width:50%;}}

                &.on{color:$mainColor;
                    div{background-color:$mainColor;}
                }
            }
        }
    }

    .trail-nodes{background: #fff;padding:.2rem;
        li{
            div{border-left:1px solid #f1f1f1;padding-left:14px;position:relative;
                &::before{content:'';display:block;width:10px;height:10px;background: lightgray;border-radius:99px;position:absolute;left:-5px;top:0;}
            }
            h1{margin-bottom:.05rem;}
            span{display:block;color:lightgray;font-size:$h4;padding-bottom:.24rem;}
        }

        li:first-of-type{
            div::before{background: $mainColor;}
        }

        li:last-of-type{
            div{border-left:none;}
        }
    }
  }
</style>
