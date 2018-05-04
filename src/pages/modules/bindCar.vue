<template>
  <app-layout id="bindCar">

      <div v-if="fromPath==='/maintenance'" class="nodata">您尚未绑定车辆，请先添加车辆，方可进行维保预约！</div>

      <ul class="card">

        <li>
          <label>车主姓名</label>
          <input class="item-val" type="text" placeholder="请输入车主姓名" v-model="owner">
        </li>

        <li class="arrow">
          <label>品牌车型</label>
          <router-link to="/brands" class="item-val">{{$cache.brand.brandName}} {{brand}}</router-link>
        </li>

        <li>
          <label>车牌号</label>
          <div class="area" v-on:click="areaVisible=true">
            <span>{{area}}</span>
          </div>
          <input class="item-val carId" type="text" placeholder="请输入车牌号码" maxlength="6" v-model="carNum">
        </li>

        <li class="arrow">
          <label>归属4S店</label>
          <router-link to="/fourS" class="item-val">{{fourS}}</router-link>
        </li>

        <li class="arrow" v-if="fourS!='选择归属4S店'">
          <label>专属服务顾问</label>
          <router-link to="/server/list" class="item-val">{{server}}</router-link>
        </li>

        <li class="setDefault" v-show="!isDefaultCar">
          <label>设为默认车</label>
          <div class="item-val">
            <mt-switch class="switch" v-model="radio"></mt-switch>
          </div>
        </li>

      </ul>

      <button class="sub" v-on:click="next">{{carId?'保存':'添加'}}</button>

      <mt-popup slot="aside" v-model="areaVisible" position="bottom" style="width:100%;">
        <table id="carArea" class="keyboard">
          <tr v-for="value in keyboardData">
            <td v-for="item in value" :class="area==item?'on':''" v-on:click="area=item;areaVisible=false;">{{item}}</td>
          </tr>
        </table>
      </mt-popup>

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        keyboardData: [
          ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀'],
          ['豫', '川', '渝', '辽', '吉', '黑', '皖', '鄂'],
          ['湘', '赣', '闽', '陕', '甘', '宁', '蒙', '津'],
          ['贵', '云', '桂', '琼', '青', '新', '藏', '台']
        ],
        carId:'',
        owner: '',
        area: '闽',
        carNum: '',
        fourS: '选择归属4S店',
        server: '选择专属服务顾问',
        brand: '选择车型',
        radio: false,
        areaVisible: false,
        fromPath: '',
        isDefaultCar:false
      };
    },
    watch: {
      fourS(val) {
        if (/fourS/.test(this.fromPath)&&val != '选择归属4S店') {
          this.server = '选择专属服务顾问';
          this.$cache.server={};
        }
      }
    },
    activated(){
        if(!this.carId){
          let car=this.$cache.car,
              carId=car.carId;
          if(carId){
            this.carId=carId;
            this.owner=car.czname;
            this.area=car.licenseplate.substr(0,1);
            this.carNum=car.licenseplate.substr(1);
            this.radio=car.isDefaultCar?true:false;
            this.isDefaultCar=car.isDefaultCar
          }
        }

        let fourS = this.$cache.fourS.name,
          server = this.$cache.server.name,
          brand = this.$cache.brand.name;

        if (fourS) {
          this.fourS = fourS;
        }
        if (server) {
          this.server = server;
        }
        if (brand) {
          this.brand = brand;
        }
    },
    beforeRouteEnter: (to, from, next) => {

      let fp=from.path;
      if(/detail/.test(fp)){
        to.meta.resetTitle='编辑爱车详情';
      }

      next(vm => {
          vm.fromPath=fp;
      })
    },
    beforeRouteLeave(to, from, next) {
      if (!/(brands|fourS|server)/.test(to.path)) {
        this.resetPage();
        this.$cache.car={};
        this.$cache.fourS={};
        this.$cache.brand={};
        this.$cache.server={};
      }
      next();
    },
    methods: {
      resetPage() {
        this.carId='';
        this.owner = '';
        this.area = '闽';
        this.carNum = '';
        this.fourS = '选择归属4S店';
        this.server = '选择专属服务顾问';
        this.brand = '选择车型';
        this.radio = false;
        this.areaVisible = false;
        this.firstCar = false;
        this.fromPath='';
      },
      hasNull() {

        let data = document.getElementsByClassName('item-val'),
          vm = this,
          di,
          val,
          len;

        for (let i = 0; i < data.length; i++) {
          di = data[i];
          if (di.tagName != 'DIV') {

            di.tagName == 'INPUT' ? val = di.value.replace(/(^\s+)|(\s+$)/g, '') : val = di.innerText;
            len = di.getAttribute('maxlength');

            if (val === '' || val == '选择车型' || val == '选择归属4S店') {
              this.$toast(di.parentNode.children[0].innerText + '不能为空');
              return true;
            } else if (len !== null && val.length < len) {
              this.$toast(di.parentNode.children[0].innerText + '应为' + len + '位非空字符，请检查');
              return true;
            }
          }
        }

        return false;
      },
      async next() {

        if (!this.hasNull()) {
          let s = this.$cache,
            brand = s.brand;

          let d = {
            'content': {
              'memberId': '' + s.user.memberId + '',
              'registeredCars': [{
                'status': this.carId?'update':'create',
                'carId': this.carId||null,
                'firstTimeAdded': '' + s.user.firstTimeAdded + '',
                'czname': this.owner,
                '4sStoreId': s.fourS.id.toString(),
                'brandId': brand.bid.toString(),
                'seriesId': brand.sid.toString(),
                'modelId': brand.mid.toString(),
                'licensePlateNo': '' + this.area + '' + this.carNum.toUpperCase() + '',
                'serviceCustId': (s.server.id === undefined || s.server.id === '') ? '' : s.server.id.toString(),
                'setDefault': this.radio
              }]
            }
          };

          let res=await this.$post('/CRM/appmembermgcust/updatecarinfo.json', d);
          if (res.errcode == 0) {
            eventBus.$emit('userInfoUpdated');
            if (/caidan/.test(location.search)) {
              this.$router.push('/myCars');
            } else if(this.fromPath==='/maintenance'){
              this.$cache.history.pop();
              this.$router.replace('/maintenance');
            }else{
              this.$router.go(-1);
            }
          } 
        }

      }

    }
  };

</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #bindCar{
    .page-content{padding:0 4%;}
    .card {
      li{padding:0 .12rem;border-bottom:$border;@include box;height:.44rem;line-height:.44rem;}
      li.setDefault{height:44px;line-height:44px;}
      li.arrow{
        position:relative;padding-right:.2rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      label{@include flex;}
      div.area{
        @include flex;text-align:center;
        span:nth-of-type(1){margin-right:.15rem;}
        span::after{content:"▼";margin-left:.02rem;}
      }
      
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;}
      .item-val.carId{@include flex(1);max-width:100px;}
      .item-val .switch{float:right;margin-top:6px;}

      input{height:100%;line-height:normal!important;}
    }

    .keyboard{
      border-spacing:.1rem;background: #eaebec;width:100%;
      td{line-height:.4rem;text-align:center;background:#fff;border-bottom: 1px solid #b8babb;border-radius:5px;width:12.5%;}
      td.on{background:$mainColor;color:#fff;}
    }
  }
  
</style>
