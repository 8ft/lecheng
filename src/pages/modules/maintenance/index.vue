<template>
  <app-layout id="maintenance">

    <template v-if="pageShow">

      <ul class="card">
        <li class="arrow">
          <label>维保车辆</label>
          <router-link to="/myCars" class="item-val">{{pageData.carInfo!==undefined?pageData.carInfo.brandName:''}}{{pageData.carInfo!==undefined?pageData.carInfo.modelName:''}}</router-link>
        </li>
        <li class="arrow">
          <label>预约4S店</label>
          <router-link to="/fourS" class="item-val">{{pageData.carInfo!==undefined?pageData.carInfo['4sStoreName']:''}}</router-link>
        </li>
      </ul>

      <mt-radio v-if="radioValue!==''" style="width:100%;font-size:14px;" title="服务类型" align="right" v-model="radioValue" :options="options"></mt-radio>

      <ul class="card">
        <li class="arrow">
          <label>预约时间</label>
          <router-link :to="'./maintenance/date'+(radioValue===taocan?'?nodiscount':'')" class="item-val">{{date.id?(date.bespeakDate+' '+date.bespeakTime):'选择预约时间'}}</router-link>
        </li>
        <li class="arrow" v-if="date.id">
          <label>预约服务顾问</label>
          <router-link to="/server/list?action=maintenance" class="item-val">{{server.id?server.name:'选择服务顾问'}}</router-link>
        </li>
      </ul>

      <ul class="card">
        <li>
          <label>送修人(可改)</label>
          <input class="item-val" type="text" v-model="sender.name">
        </li>
        <li>
          <label>送修人电话(可改)</label>
          <input class="item-val" type="text" v-model="sender.phone">
        </li>
      </ul>

    </template>

    <div slot="footer" class="nextOne"><button class="btn" v-on:click="next">预 约</button></div>

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        pageShow: false,
        cars: null,
        taocan: '',
        userId: '',
        carId: '',
        storeId: '',
        radioValue: '',
        options: [],
        pageData: {},
        sender: {},
        date: {},
        server: {},
        serverCache:''
      };
    },
    watch: {
      carId(val) {
        this.refresh(val);
      },
      storeId(val) {
        this.refresh(val);
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm=>{
        if(!/(fourS|list|date|myCars)$/.test(to.path)){
            let s=vm.$cache.server;
            if(s.id){
              vm.serverCache=JSON.stringify(s);
            }
        }
      });
    },
    activated() {
      if (!this.$cache.car.carId&&this.cars === null) {
        this.getCars();
      } else {
        this.init();
      }
    },
    beforeRouteLeave(to, from, next) {
      if(!/(fourS|list|date|myCars)$/.test(to.path)){
        let s=this.serverCache;
        if(s){
          this.$cache.server=JSON.parse(s);
        }
        this.resetPage();
      }
      next();
    },
    methods: {
      refresh(val) {
        if (this.pageShow&&val != '' && val !== undefined) {
          this.server = {};
          this.date = {};

          this.$cache.server={};
          this.$cache.date={};
        }
      },
      async getCars() {
        let d = {
          content: {
            memberId:this.$cache.user.memberId
          }
        };

        let res=await this.$post('/CRM/appmembermgcust/queryCarList.json', d);
        if (res.errcode == 0) {
          let cars = res.content.carList;
          if (cars.length < 1) {
            this.pageShow = false;
            this.$cache.history.pop();
            this.$router.replace('/bindCar?maintenance');
          } else {
            this.cars = cars;
            this.init();
          }
        }
      },
      init() {
        let state = this.$cache,
          user = state.user,
          mid = user.memberId,
          cid = state.car.carId,
          sid = state.fourS.id;

        if (!this.sender.name) {
          this.sender['name'] = user.name;
          this.sender['phone'] = user.phone;
        }

        if (!cid) {
          let cars = this.cars,
            car;
          for (let i = 0; i < cars.length; i++) {
            car = cars[i];
            if (car.isDefaultCar) {
              cid = car.carId;
              if (!sid) {
                sid = parseInt(car['4sStoreId']);
                this.$cache.fourS={id: sid}
              }
            }
          }
        } else if (cid != this.carId) {
          sid = state.car['4sStoreId'];
          this.$cache.fourS={id: sid}
        }

        this.carId = cid;
        this.storeId = sid;
        this.userId = mid;

        this.getData(mid, cid, sid);
      },
      resetPage() {
        this.pageShow = false;
        this.taocan = '';
        this.radioValue = '';
        this.options = [];
        this.pageData = {};
        this.sender = {};
        this.date = {};
        this.server = {};
        this.serverCache='';
      },
      hasNull() {
        let data = document.getElementsByClassName('item-val'),
          vm = this,
          di,
          val;

        for (let i = 0; i < data.length; i++) {
          di = data[i];
          if (di.tagName != 'DIV') {
            di.tagName == 'INPUT' ? val = di.value : val = di.innerText;
            if (val === '' || val == '选择预约时间' || val == '选择服务顾问') {
              this.$toast(di.parentNode.children[0].innerText + '不能为空');
              return true;
            }
          } 
        }
        return false;
      },
      async checkServer(s) {
        let date = this.$cache.date,
          sd = date.bespeakDate,
          st = date.bespeakTime,
          server=s,
          sid=server.id;

        var d = {
          content: {
            "4sStoreId":this.$cache.fourS.id,
            serviceDate:sd||'',
            serviceTime:st||''
          }
        };

        let res=await this.$post('/CRM/appbespeak/queryservicecust.json', d);

        if (res.errcode == 0) {
          let list = res.content.custList,
            li;

          for (let i = 0; i < list.length; i++) {
            li = list[i];
            if (li.id == sid) {
              if (li.isFree != 1) {
                server = {};
              }
            }
          }
          
          this.server=server;
          this.$cache.server=server;
          this.date=this.$cache.date;
        }
        
        this.pageShow = true;
      },
      async getData(mid, cid, sid) {
        let d = {
          content: {
            memberId: mid,
            carId: cid||'' ,
            "4sStoreId": sid||''
          }
        };
        let res=await this.$post('/CRM/appbespeak/bespeakhomepage.json',d);
        let con =res.content;
        this.pageData = con;
  
        let options = [],
          s = con.serviceType,
          si;
        for (let i = 0; i < s.length; i++) {
          si = s[i];
          options.push({
            'label': si.stName,
            'value': si.stId.toString(),
            'disabled': this.setRadio(si.stName, si.stId, con.hasSetmeal, options)
          });
        }
        this.options = options;
  
        let server={},
            cur_server=this.server.id,
            default_server=con.carInfo.serviceCustId;

        server=this.$cache.server;
          
        if(default_server&&!cur_server&&!this.date.id){
            server={
              id:default_server,
              name:con.carInfo.serviceCustName
            };
        }
        
        if(this.date.id!=this.$cache.date.id){
          if(!server.id&&default_server){
            server={
              id:default_server,
              name:con.carInfo.serviceCustName
            };
          }
          this.checkServer(server);
        }else{
          this.server=server;
          this.$cache.server=server;
          this.pageShow = true;
        }
        
      },
      setRadio(name, id, hasSetmeal, options) {
        if (/套餐/.test(name)) {
          if (hasSetmeal) {
            this.radioValue = id.toString();
            this.taocan = id.toString();
            return false;
          } else {
            this.radioValue = options[0].value.toString();
            return true;
          }
        } else { 
          return false;
        }
      },
      async next() {
        if (!this.hasNull()) {
          let pageData = this.pageData,
            user = this.$cache.user;

          let data = this.$sign({
            content: {
              orderType:'WB',
              name: pageData.name,
              phone: pageData.phone,
              serviceTypeId: this.radioValue,
              registeredCarId: pageData.carInfo.carId,
              '4sStoreId': pageData.carInfo['4sStoreId'],
              bespeakSetId: this.date.id,
              consultantId: this.server.id,
              repairPersonName: this.sender.name,
              repairPersonPhone: this.sender.phone,
              remarks: '',
              orderResourse:1,
              setmealId: this.taocan != this.radioValue ? '' : pageData.setmealId
            }
          });

          let res=await this.$post('/CRM/api/commit.order.json', data);
          if (res.errcode == 0) {
            let vm=this;
            this.$messagebox.alert('预约成功！').then(action => {
              vm.resetPage();
              this.$cache.history.pop();
              this.$router.replace('/paid/'+res.content.no);
            });
          } 
        }
      }

    }
  }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #maintenance{
    .card {
      li{padding:0 .12rem;border-bottom:$border;@include box;height:.44rem;line-height:.44rem;}
      li.setDefault{height:44px;line-height:44px;}
      li.arrow{
        position:relative;padding-right:.2rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      label{@include flex;}
      
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;height:.44rem;}

      .sendCode{
        input{float:left;display:block;width:60%;}
        button{background:$mainColor;border-radius:3px;color:#fff;float: right;display: block;width: 40%;box-sizing: border-box;line-height: .3rem;margin-top:.07rem;white-space: initial;overflow:initial;text-overflow:initial;}
      }

      input{height:100%;line-height:normal!important;}
    }
    .sub{width:94%;margin: .2rem auto;}
  }
</style>
