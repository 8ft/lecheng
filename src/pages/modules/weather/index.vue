<template>
    <app-layout id="weather" v-if="content!=''">
        <div class="weather-top">
            <div class="city">{{content.city}}市</div>
            <div class="weather-box">
                <div class="left">
                    <img :src="content['arr'][weekdayInx].dayWeatherPic" alt="">
                    <div>{{content['arr'][weekdayInx].dayWeather}}</div>
                </div>
                <div class="right">
                    <p>{{content['arr'][weekdayInx].nightTemp}}/{{content['arr'][weekdayInx].dayTemp}}°C</p>
                    <div>{{content['arr'][weekdayInx].washCarTitle}}洗车</div>
                </div>
            </div>
            <ul class="bottom">
                <li>
                    <p>湿度</p>
                    <div>({{content['arr'][weekdayInx].humidity||'暂无'}})</div>
                </li>
                <li>
                    <p>风向</p>
                    <div>({{content['arr'][weekdayInx].windDirection||'暂无'}})</div>
                </li>
                <li>
                    <p>日出/日落</p>
                    <div>({{content['arr'][weekdayInx].sunBeginEnd||'暂无'}})</div>
                </li>
                <li>
                    <p>风力</p>
                    <div>({{content['arr'][weekdayInx].windPower||'暂无'}})</div>
                </li>
            </ul>
        </div>
        <ul class="date-box">
            <li v-for="(item,index) in content['arr']" :class="weekdayInx==index ? 'chooseli' :''" @click="weekdayInx=index">
                <p v-if="index==0">今天</p>
                <p v-else-if="index==1">明天</p>
                <p v-else-if="index==2">后天</p>
                <p v-else>{{item.weekday}}</p>
                <div class="time">{{item.day.substr(5)}}</div>
                <div class="spot" :class="weekdayInx==index ? 'choosespot' :''"></div>
            </li>      
        </ul>
        <div class="index-title">天气指数</div>

        <table class="index-box">

            <tr>
                <td>
                    <div class="tip">
                        <div class="left">
                            <img src="~assets/img/weather/icon_weather_dress@2x.png" alt="">
                            <p>穿衣</p>
                        </div>
                        <div class="right">
                            <p>{{content['arr'][weekdayInx].clothesTitle}}</p>
                            <div>{{content['arr'][weekdayInx].clothesDesc}}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="tip">

                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_washcar@2x.png" alt="">
                        <p>洗车</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].washCarTitle}}</p>
                        <div>{{content['arr'][weekdayInx].washCarDesc}}</div>
                    </div>
                    </div>
                    
                </td>
            </tr>

            <tr>
                <td>
                    <div class="tip">
                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_sport@2x.png" alt="">
                        <p>运动</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].sportsTitle}}</p>
                        <div>{{content['arr'][weekdayInx].sportsDesc}}</div>
                    </div>
                    </div>
                </td>
                <td>
                    <div class="tip">
                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_sick@2x.png" alt="">
                        <p>感冒</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].coldTitle}}</p>
                        <div>{{content['arr'][weekdayInx].coldDesc}}</div>
                    </div>
                    </div>
                </td>
            </tr>

            <tr>
                <td>
                    <div class="tip">
                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_uv@2x.png" alt="">
                        <p>紫外线</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].uvTitle}}</p>
                        <div>{{content['arr'][weekdayInx].uvDesc}}</div>
                    </div>
                    </div>
                </td>
                <td>
                    <div class="tip">
                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_air@2x.png" alt="">
                        <p>空气质量</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].aqiTitle}}</p>
                        <div>{{content['arr'][weekdayInx].aqiDesc}}</div>
                    </div>
                    </div>
                </td>
            </tr>

            <tr>
                <td>
                    <div class="tip">
                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_skin@2x.png" alt="">
                        <p>护肤</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].beautyTitle}}</p>
                        <div>{{content['arr'][weekdayInx].beautyDesc}}</div>
                    </div>
                    </div>
                </td>
                <td>
                    <div class="tip">
                    <div class="left">
                        <img src="~assets/img/weather/icon_weather_travel@2x.png" alt="">
                        <p>旅游</p>
                    </div>
                    <div class="right">
                        <p>{{content['arr'][weekdayInx].travelTitle}}</p>
                        <div>{{content['arr'][weekdayInx].travelDesc}}</div>
                    </div>
                    </div>
                </td>
            </tr>

        </table>
        
    </app-layout>
</template>
<script>
export default {
  data() {
    return {
      weekdayInx: 0,
      content: ""
    };
  },
  activated() {
    this.content = this.$cache.weather;
  }
};
</script>
<style lang="scss">
@import "~assets/css/var.scss";
#weather {
  .weather-top {
    width: 100%;
    height: 2.05rem;
    color: #fff;
    background: linear-gradient(#577dd0, #6864c3);
    position: relative;
    .city {
      text-align: center;
      font-size: 0.18rem;
      height: 0.4rem;
      line-height: 0.4rem;
    }
    .weather-box {
      display: flex;
      text-align: center;
      justify-content: center;
      .left {
        margin-right: 0.7rem;
        img {
          width: 0.7rem;
        }
      }
      .right {
        align-self: flex-end;
        p {
          font-size: 0.28rem;
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      height: 0.5rem;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      bottom: 0;
      left: 0;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        font-size: $h4;
        width: 25%;
        height: 0.27rem;
        border-right: 1px solid #fff;
        box-sizing: border-box;
        &:last-child {
          border: 0;
        }
        p {
          margin-bottom: 0.03rem;
        }
      }
    }
  }
  .date-box {
    display: flex;
    height: 0.6rem;
    background: #fff;
    color: $gray;
    align-items: center;
    text-align: center;
    font-size: $h3;
    li {
      flex: 1;
      .spot {
        width: 0.05rem;
        height: 0.05rem;
        border-radius: 50%;
        background: #fff;
        margin: auto;
      }
      .choosespot {
        background: #6569c6;
      }
      .time {
        margin: 0.04rem 0 0.02rem;
      }
      &.chooseli {
        color: #6569c6;
      }
    }
  }
  .index-title {
    height: 0.3rem;
    font-size: $h3;
    background: #f2f2f2;
    line-height: 0.3rem;
    padding-left: 0.2rem;
  }
  table {
    background: #fff;
    color: $gray;
    font-size: $h3;
    border-collapse: collapse;
    td {
      border: $border;
      width: 50%;
      .tip{ @include box;}
      .left {
        width: 35%;
        text-align: center;
        align-self: center;
        img {
          width: 0.25rem;
        }
      }
      .right {
        width: 65%;
        box-sizing: border-box;
        padding:.1rem .1rem .1rem 0;
        p {
          color: $black;
          margin: .05rem 0;
        }
        div {
          font-size: $h4;
        }
      }
    }
  }
}
</style>
