<template>
  <div id="cityList" class="page">
    <ul class="page-content list">
      <li v-for="(value,index) in cityList" :class="(value.subcities.length>1?'arrow':'province')+(province===value.province_name?' on':'')" v-on:click="select(index)">
        <div>{{ value.province_name }}</div>
      </li>
    </ul>
    <div v-for="(value,index) in cityList" :class="'page subList '+(subId===index?'':'moveout')">
      <ul class="page-content list">
        <li v-for="(c,cIndex) in value.subcities" :class="city===c.city_name?' on':''" v-on:click="select(index,cIndex)">
          <div>{{c.city_name}}</div>
        </li>
      </ul>
    </div>
    <div id="city_cover" class="cover" v-if="subId!==''" v-on:click="subId=''"></div>
  </div>
</template>

<script>
export default {
  name: 'city',
  data() {
    return {
      province: '',
      city: '',
      subId: '',
      cityList: []
    }
  },
  mounted() {
    this.getCityList();
  },
  activated() {
    let city = this.$cache.city;
    this.province = city.province;
    this.city = city.name;
  },
  methods: {
    async getCityList() {
      let res=await this.$post('/CRM/appvehicleviolation/getCitylistFromShowapi.json', {content: { updateTime: "" } });
      if (res.errcode == 0) {
        // this.cityList =res.content.city_list;

        let con=res.content.city_list,
            c,
            p,
            arr={};

        for(let i=0;i<con.length;i++){

          c=con[i].subcities;

          for(let j=0;j<c.length;j++){

              p=c[j].params;

              if(!arr[p.licenseplatePrefix]){
                  if(p.ecode||p.vcode){
                    let o={};
                    if(p.ecode){o.ecode=p.ecode;}
                    if(p.vcode){o.vcode=p.vcode;}
                    arr[p.licenseplatePrefix]=o;
                  }
              }
          }

        }

      } 
    },
    select(pIndex, cIndex) {
      let city = this.$cache.city,
        list = this.cityList,
        p = list[pIndex],
        c=p.subcities;

      if (cIndex === undefined && c.length > 1) {
        this.subId = pIndex;
      } else {
        let ci = c[cIndex||0],
          cp = ci.params;

        city.licenseplatePrefix=cp.licenseplatePrefix;
        city.province = p.province_name;
        city.name = ci.city_name;
        city.needCode = cp.vcode||cp.vcode===0 ? true : false;
        city.needEngine = cp.ecode||cp.ecode===0 ? true : false;
        city.codeLen = Math.abs(cp.vcode);
        city.engineLen = Math.abs(cp.ecode);

        this.$router.go(-1);
      }
    }
  }
}
</script>
