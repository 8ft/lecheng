<template>
    <app-layout id="peccancyResult">
        
        <div slot="header" class="card overview">
            <div class="car-box">
                <div>
                <img :src="result.brandLogo?result.brandLogo:default_car">
                <h2>{{result.licenseplate}}</h2>
                <p class="location">查询地点：<span>{{result.cityName}}</span></p>
                </div>
                <button v-on:click="back"></button>
            </div>

            <div id="totle">
                <div>未处理<span>{{totle-handled}}</span></div>
                <div>扣分<span>{{point}}</span></div>
                <div>罚款<span>{{cost}}</span></div>
            </div>
        </div>

        <template v-if="!error">
            <div style="text-indent:.24rem;line-height:.3rem;">违章查询详细结果</div>

            <div class="record" v-for="(value,index) in result.lists" v-on:click="select(index)">
                <div class="top clearfix">
                    {{value.date}}
                    <span>未处理</span>
                </div>
                <div class="center">
                    <p>{{value.area}}</p>
                    <p>{{value.act}}</p>
                </div>
                <div class="bottom">
                    <div>扣分：<span>{{value.fen}}</span></div>
                    <div>罚款: <span>{{value.money}}</span></div>
                </div>
            </div>
        </template>

        <div v-if="error" class="lc-error">
            <img src="~assets/img/error-traffic.png">
            <p>没有违章或交管局未录入</p>
        </div>

    </app-layout>
</template>

<script>
    export default {
      name:'peccancyResult',
      data() {
        return {
            default_car:require('assets/img/default_car.png'),
            result:{},
            handled:0,
            totle:0,
            point:0,
            cost:0,
            error:false
        };
      },
      activated(){
          if(!this.result.licenseplate){
            this.getData();
          }
      },
      beforeRouteLeave(to, from, next){
        if(!/map/.test(to.path)){
            this.result={};
            this.handled=0;
            this.totle=0;
            this.point=0;
            this.cost=0;
            this.error=false;
        }
        next();
      }, 
      methods: {
          back(){
              this.$router.go(-1);
          },
          select(index){
              let record=this.result.lists[index];
              record['city']=this.result.cityName;
              this.$cache.peccancy['record']=record;

              this.$router.push('./map');
          },
          async getData(){
              let res=await this.$post('/CRM/appvehicleviolation/queryVVFromShowApi.json',{content:this.$cache.peccancy.content});
              if(res.errcode==0){

                  let con=res.content;
                  this.result=con;

                  let lists=con.lists,li;
                  this.totle=lists.length;
                  if(this.totle>0){
                    for(let i=0;i<lists.length;i++){
                      li=lists[i];
                      if(li.handled==1){this.handled+=1;}
                      this.point+=parseInt(li.fen);
                      this.cost+=parseInt(li.money);
                    }
                  }else{
                    this.error=true;
                  }
              }
          }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #peccancyResult{

        .overview{color:$gray;margin:0;border-bottom:$border;border-radius:0;
            .car-box{button{background:url('~assets/img/icon-edit.png') no-repeat center;background-size: .15rem .15rem;}}
            
            #totle{@include box;
                div{@include flex;text-align:center;border-top:$border;line-height:.4rem;
                    span{color:$mainColor;margin-left:.1rem;}
                    &:nth-of-type(2){border-left:$border;border-right:$border;}
                }
            }
        }

        .page-content{font-size:$h3;
         
          .record{
              display:block;background:#fff;font-size:$h3;color:$gray;margin-bottom:.1rem;
              span{color:$mainColor;font-size:.14rem;}

              .top{border-bottom:$border;padding:.14rem .2rem .1rem;line-height:.16rem;
                  span{float:right;}
              }

              .center{border-bottom:$border;padding:.14rem .2rem;line-height:.2rem;position:relative;

                  &::after{position:absolute;content:'';width:0;height:0;top:.34rem;right:21px;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                  &::before{position:absolute;content:'';width:0;height:0;top:.34rem;right:20px;border:.06rem solid transparent;border-right:0;border-left-color:#999;}

                  p{padding:0 .15rem;position: relative;}
                  p:nth-of-type(1)::before{content:'';display:block;position:absolute;left:0;top:.04rem; width:.09rem;height:.11rem;margin-right:.06rem;background:url('~assets/img/icon-addr.png') no-repeat center;background-size:100%;}
                  p:nth-of-type(2){padding-left: .15rem;}
              }
              .bottom{padding:.1rem .2rem .14rem;@include box;
                  div:nth-of-type(1){@include flex(1);}
                  div:nth-of-type(2){@include flex(2);}
              }
          }

      }
  }
</style>