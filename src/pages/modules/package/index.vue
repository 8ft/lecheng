<template>
    <app-layout id="package">
        <ul class="package-ul" v-if="listItems&&listItems.length>0">
            <li v-for="(value,index) in listItems" :style="value.frequency==0 ? {'background':'#fafafa'} : ''">
                <div class="top" :style="value.frequency==0 ? {'background':'#c9c9c9'} : ''">
                    <div class="progress">
                        <div class="full" :style="{'width':value.frequency/value.totalnumber*100+'%'}"></div>
                    </div>
                    <div class="num">剩余<span>{{value.frequency}}</span>次</div>
                    <div class="round" :style="value.frequency==0 ? {'background':'#c9c9c9'} : ''"></div>
                </div>
                <div class="content-box">
                    <div class="title">{{value.setmealName}}</div>
                    <div class="content">
                        
                        <div class="left"> 
                            <div class="door"><img src="~assets/img/package/icon_vip_detail_notice@2x.png" alt="">适用门店：{{value['4sStoreName']}}</div>
                            <div class="time"><img src="~assets/img/package/icon_vip_detail_time@2x.png" alt="">有效期至{{value.dateTime}}</div>
                        </div>
                        <div class="btn" @click="showDetail(value)" :style="value.frequency==0 ? {'color':'#c9c9c9','border-color':'#c9c9c9'} : ''">查看详情</div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="lc-error" style="background:#f2f2f2" v-else>
            <img src="~assets/img/error-empty.png">
            <p>抱歉，暂无套餐</p>
        </div>
        
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            listItems:[]
        };
      },
      activated(){
          this.getData();
      },
      deactivated(){
        this.$indicator.close();
      },
      methods: {
        showDetail(value){
            this.$cache.urlquery=JSON.parse(JSON.stringify(value));
            this.$router.push({path:'/package/detail'});
            
        },
        async getData() {
            let d={content: {memberId: this.$cache.user.memberId}};
            let res=await this.$post('/CRM/appmembermgcust/querySetmeal.json',d);
            if(res.errcode==0){
                this.listItems=res.content;
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #package{
      .page-content{
          background: #fff;
      }
      .package-ul{
          padding:0 5% .17rem;
          box-sizing: border-box;
          >li{
              border-radius: 4px;
              box-shadow: 2px 2px 8px 0px #c9c9c9;
              width: 100%;
              background: #fff5e6;
              margin-top: .17rem;
              .top{
                  position: relative;
                  border-radius: 4px 4px 0 0;
                  background:#ff9600;
                  width: 90%;
                  height: .38rem;
                  padding:0 5%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  color: #fff;
                  font-size: .12rem;
                  .round{
                      position: absolute;
                      width: .35rem;
                      height: .25rem;
                      border-radius: 50%;
                      right: 0.26rem;
                        bottom: -.09rem;
                        z-index: 1;
                        background: #ff9600;
                  }
                  .progress{
                      width: 2.08rem;
                      height: .1rem;
                      border-radius: .1rem;
                      background: #fff;
                      position: relative;
                      .full{
                          position: absolute;
                          background: #ffca7f;
                          height: .1rem;
                          border-radius: .1rem;
                          width: 50%;
                      }
                  }
                  .num{
                      position: relative;
                      z-index: 2;
                      span{
                        transform: scale(2.2);
                        display: inline-block;
                        padding: 0 .12rem;
                    }
                  }
              }
              .content-box{
                .title{
                    width: 90%;
                    margin-left: 5%;
                    font-size: .15rem;
                    margin-top: .11rem;
                }
                .content{
                    padding-bottom: .13rem;
                    width: 90%;
                    margin-left: 5%;
                    display: flex;
                    justify-content: space-between;
                    color: #22222d;
                    .left{
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        flex:1;
                        font-size: .12rem;
                        
                        .door{
                            margin-top: .11rem;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            
                        }
                        .time{
                            margin-top: .12rem;
                        }
                        img{
                            height: .12rem;
                            width: .12rem;
                            vertical-align: text-top;
                            margin-right: .05rem;
                        }
                    }
                    .btn{
                        height: .21rem;
                        width: .65rem;
                        border:1px solid #ff9600;
                        color: #ff9600;
                        font-size: .12rem;
                        line-height: .21rem;
                        text-align: center;
                        border-radius: .21rem;
                        align-self: flex-end;
                        margin-bottom: 0;
                    }
                }
              }
          }
      }
  }
</style>
