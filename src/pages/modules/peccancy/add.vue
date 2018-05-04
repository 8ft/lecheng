<template>
  <app-layout id="peccancyAdd">

      <ul class="card">
        <li :class="iCar?'dis':''">
          <label>车牌号码</label>
          <div v-on:click="areaVisible=true">
              <span>{{area}}</span>
          </div>
          <input class="item-val carId" type="text" placeholder="请输入车牌号码" maxlength="6" v-model="carNum">
        </li>
        <li v-if="needCode">
          <label v-on:click="showTip=!showTip">车架号码<span>?</span></label>
          <input class="item-val" type="text" :placeholder="'请输入'+(codeLen===0?'完整车架号':('车架号后'+codeLen+'位'))" :maxlength="(codeLen===0?'20':codeLen)" v-model="vcode">
        </li>
        <li v-if="needEngine">
          <label v-on:click="showTip=!showTip">发动机号<span>?</span></label>
          <input class="item-val" type="text" :placeholder="'请输入'+(engineLen===0?'完整发动机号':('发动机号后'+engineLen+'位'))" :maxlength="(engineLen===0?'20':engineLen)" v-model="ecode">
        </li>
        <li :class="iCar?'dis':'arrow'">
          <label>车型(选填)</label>
          <router-link to="/brands" class="item-val">{{brand}}</router-link>
        </li>
      </ul>

      <div class="radio"><div v-on:click="(radio?radio=false:radio=true)" :class="(radio?'on':'')"></div>我已阅读并同意<router-link to="./agreement">《授权协议》</router-link></div>
      <button class="sub" v-on:click="next">查询</button>

      <p class="tip">所填信息仅用于违章查询，我们将严格保密，请放心填写！</p>

      <mt-popup slot="aside" v-model="areaVisible" position="bottom" style="width:100%;">
        <table id="carArea" class="keyboard">
          <tr v-for="value in keyboardData">
              <td v-for="item in value" :class="area==item?'on':''" v-on:click="area=item;areaVisible=false;">{{item}}</td>
          </tr>
        </table>      
      </mt-popup>

      <mt-popup slot="aside" v-model="showTip" style="width:96%;">
        <img src="/CRM/WeChat/App/static/img/aboutCarInfo.png" style="display:block;width:100%;">
      </mt-popup>

  </app-layout>
</template>

<script>
  export default {
    name:'peccancyAdd',
    data() {
      return {
        iCar:0,
        keyboardData:[
            ['京','沪','浙','苏','粤','鲁','晋','冀'],
            ['豫','川','渝','辽','吉','黑','皖','鄂'],
            ['湘','赣','闽','陕','甘','宁','蒙','津'],
            ['贵','云','桂','琼','青','新','藏','台']
        ],
        areaCode:{"皖A":{"vcode":-6},"皖P":{"vcode":-6},"皖C":{"vcode":-6},"皖D":{"vcode":-6},"皖E":{"vcode":-6},"皖F":{"vcode":-6},"皖G":{"vcode":-6},"皖H":{"vcode":-6},"皖J":{"vcode":-6},"皖M":{"vcode":-6},"皖K":{"vcode":-6},"皖L":{"vcode":-6},"皖Q":{"vcode":-6},"皖N":{"vcode":-6},"皖S":{"vcode":-6},"皖R":{"vcode":-6},"皖B":{"vcode":-6},"闽A":{"vcode":-6},"闽D":{"vcode":-6},"闽B":{"vcode":-6},"闽G":{"vcode":-6},"闽J":{"vcode":-6},"闽E":{"vcode":-6},"闽H":{"vcode":-6},"闽F":{"vcode":-6},"闽C":{"vcode":-6},"粤A":{"ecode":-6,"vcode":-6},"粤W":{"ecode":-6,"vcode":-6},"粤B":{"ecode":-6,"vcode":-6},"粤C":{"ecode":-6,"vcode":-6},"粤D":{"ecode":-6,"vcode":-6},"粤E":{"ecode":-6,"vcode":-6},"粤J":{"ecode":-6,"vcode":-6},"粤G":{"ecode":-6,"vcode":-6},"粤K":{"ecode":-6,"vcode":-6},"粤H":{"ecode":-6,"vcode":-6},"粤L":{"ecode":-6,"vcode":-6},"粤M":{"ecode":-6,"vcode":-6},"粤N":{"ecode":-6,"vcode":-6},"粤P":{"ecode":-6,"vcode":-6},"粤Q":{"ecode":-6,"vcode":-6},"粤R":{"ecode":-6,"vcode":-6},"粤S":{"ecode":-6,"vcode":-6},"粤T":{"ecode":-6,"vcode":-6},"粤U":{"ecode":-6,"vcode":-6},"粤V":{"ecode":-6,"vcode":-6},"粤F":{"ecode":-6,"vcode":-6},"冀E":{"vcode":-4},"冀D":{"vcode":-4},"冀C":{"vcode":-4},"冀B":{"vcode":-4},"冀A":{"vcode":-4},"冀F":{"vcode":-4},"冀R":{"vcode":-4},"冀J":{"vcode":-4},"冀H":{"vcode":-4},"冀G":{"vcode":-4},"冀T":{"vcode":-4},"鄂S":{"ecode":-6,"vcode":-6},"鄂Q":{"ecode":-6,"vcode":-6},"鄂M":{"ecode":-6,"vcode":-6},"鄂N":{"ecode":-6,"vcode":-6},"鄂R":{"ecode":-6,"vcode":-6},"鄂L":{"ecode":-6,"vcode":-6},"鄂J":{"ecode":-6,"vcode":-6},"鄂D":{"ecode":-6,"vcode":-6},"鄂K":{"ecode":-6,"vcode":-6},"鄂H":{"ecode":-6,"vcode":-6},"鄂G":{"ecode":-6,"vcode":-6},"鄂F":{"ecode":-6,"vcode":-6},"鄂E":{"ecode":-6,"vcode":-6},"鄂P":{"ecode":-6,"vcode":-6},"鄂B":{"ecode":-6,"vcode":-6},"鄂A":{"ecode":-6,"vcode":-6},"鄂C":{"ecode":-6,"vcode":-6},"吉A":{"vcode":-6},"吉B":{"vcode":-6},"吉C":{"vcode":-6},"吉D":{"vcode":-6},"吉H":{"vcode":-6},"吉F":{"vcode":-6},"吉J":{"vcode":-6},"吉G":{"vcode":-6},"吉E":{"vcode":-6},"苏A":{"ecode":-6},"苏B":{"ecode":-6},"苏C":{"ecode":-6},"苏D":{"ecode":-6},"苏E":{"ecode":-6},"苏F":{"ecode":-6},"苏N":{"ecode":-6},"苏H":{"ecode":-6},"苏J":{"ecode":-6},"苏K":{"ecode":-6},"苏L":{"ecode":-6},"苏M":{"ecode":-6},"苏G":{"ecode":-6},"辽K":{"vcode":-4},"辽F":{"vcode":-4},"蒙A":{"ecode":-6},"蒙B":{"ecode":-6},"蒙C":{"ecode":-6},"蒙D":{"ecode":-6},"蒙G":{"ecode":-6},"蒙K":{"ecode":-6},"蒙E":{"ecode":-6},"蒙L":{"ecode":-6,"vcode":-6},"蒙J":{"ecode":-6},"蒙F":{"ecode":-6},"蒙H":{"ecode":-6},"蒙M":{"ecode":-6},"鲁C":{"ecode":-6,"vcode":-6},"鲁M":{"ecode":-6,"vcode":-6},"鲁P":{"ecode":-6,"vcode":-6},"鲁N":{"ecode":-6,"vcode":-6},"鲁Q":{"ecode":-6,"vcode":-6},"鲁S":{"ecode":-6,"vcode":-6},"鲁L":{"ecode":-6,"vcode":-6},"鲁K":{"ecode":-6,"vcode":-6},"鲁J":{"ecode":-6,"vcode":-6},"鲁H":{"ecode":-6,"vcode":-6},"鲁G":{"ecode":-6,"vcode":-6},"鲁A":{"ecode":-6,"vcode":-6},"鲁B":{"ecode":-6,"vcode":-6},"鲁R":{"ecode":-6,"vcode":-6},"鲁D":{"ecode":-6,"vcode":-6},"鲁E":{"ecode":-6,"vcode":-6},"鲁F":{"ecode":-6,"vcode":-6},"陕J":{"ecode":-6},"陕H":{"ecode":-6},"陕G":{"ecode":-6},"陕K":{"ecode":-6},"陕F":{"ecode":-6},"陕A":{"ecode":-6},"陕E":{"ecode":-6},"陕D":{"ecode":-6},"陕C":{"ecode":-6},"陕B":{"ecode":-6},"川A":{"vcode":-6},"川W":{"vcode":-6},"川D":{"vcode":-6},"川E":{"vcode":-6},"川F":{"vcode":-6},"川B":{"vcode":-6},"川H":{"vcode":-6},"川J":{"vcode":-6},"川K":{"vcode":-6},"川L":{"vcode":-6},"川R":{"vcode":-6},"川Z":{"vcode":-6},"川Q":{"vcode":-6},"川X":{"vcode":-6},"川S":{"vcode":-6},"川T":{"vcode":-6},"川Y":{"vcode":-6},"川M":{"vcode":-6},"川U":{"vcode":-6},"川V":{"vcode":-6},"川C":{"vcode":-6},"津":{"ecode":-6,"vcode":-6},"藏D":{"ecode":-6,"vcode":-6},"藏E":{"ecode":-6,"vcode":-6},"藏F":{"ecode":-6,"vcode":-6},"藏C":{"ecode":-6,"vcode":-6},"藏A":{"ecode":-6,"vcode":-6},"藏B":{"ecode":-6,"vcode":-6},"藏G":{"ecode":-6,"vcode":-6},"新C":{"vcode":-6},"新R":{"vcode":-6},"新A":{"vcode":-6},"新B":{"vcode":-6},"新E":{"vcode":-6},"新G":{"vcode":-6},"新H":{"vcode":-6},"新J":{"vcode":-6},"新K":{"vcode":-6},"新L":{"vcode":-6},"新M":{"vcode":-6},"新N":{"vcode":-6},"新P":{"vcode":-6},"新Q":{"vcode":-6},"新D":{"vcode":-6},"云A":{"vcode":-6},"云K":{"vcode":-6},"云F":{"vcode":-6},"云M":{"vcode":-6},"云C":{"vcode":-6},"云P":{"vcode":-6},"云J":{"vcode":-6},"云S":{"vcode":-6},"云E":{"vcode":-6},"云G":{"vcode":-6},"云H":{"vcode":-6},"云L":{"vcode":-6},"云N":{"vcode":-6},"云Q":{"vcode":-6},"云R":{"vcode":-6},"云D":{"vcode":-6},"浙A":{"vcode":-6},"浙B":{"vcode":-6},"浙C":{"vcode":-6},"浙F":{"vcode":-6},"浙E":{"vcode":-6},"浙K":{"vcode":-6},"浙G":{"vcode":-6},"浙H":{"vcode":-6},"浙L":{"vcode":-6},"浙J":{"vcode":-6},"浙D":{"vcode":-6},"渝":{"vcode":-6}},
        area:'闽',
        pre:'闽',
        carNum:'',
        vcode:'',
        ecode:'',
        brand:'选择车型',
        radio:true,
        areaVisible:false,
        needCode:false,
        needEngine:false,
        codeLen:0,
        engineLen:0,
        showTip:false
      };
    },
    watch:{
      carNum(val) {
          this.pre=this.area+val.substr(0,1).toUpperCase();
      },
      area(val){
          this.pre=val+this.carNum.substr(0,1).toUpperCase();
      },
      pre(val){
          let cp=this.areaCode[val];
          if(cp){
            this.needCode = cp.vcode||cp.vcode===0 ? true : false;
            this.needEngine = cp.ecode||cp.ecode===0 ? true : false;
            this.codeLen = this.needCode&&Math.abs(cp.vcode);
            this.engineLen = this.needEngine&&Math.abs(cp.ecode);
          }else{
            this.needCode=false;
            this.needEngine=false;
          }
      }
    },
    activated(){
      let query=this.$route.query;
      if(query.carId&&!this.$cache.peccancy.content.licenseplate){
        this.$cache.user.memberId=query.memberId;
        this.getData(query.memberId,query.carId);
      }else{
        this.init();
      }
    },
    beforeRouteLeave (to,from,next){
      if(to.path==='/peccancy'){
        this.resetPage();
        this.$cache.brand = {};
      }
      next();
    },
    methods: {
      resetPage(){
        this.iCar=0;
        this.area='闽';
        this.pre='闽';
        this.carNum='';
        this.vcode='';
        this.ecode='';
        this.brand='选择车型';
        this.radio=true;
        this.areaVisible=false;
        this.needCode=false;
        this.needEngine=false;
        this.codeLen=0;
        this.engineLen=0;
      },
      init(){
        let content=this.$cache.peccancy.content,
            other=this.$cache.peccancy.other,
            brand=this.$cache.brand.name;
        this.iCar=other.iCar;

        let licenseplate=content.licenseplate;
        if(licenseplate){
          
          this.area=licenseplate.substring(0,1);
          this.carNum=licenseplate.substring(1,licenseplate.length);

          this.vcode=content.vcode;
          this.ecode=content.ecode;
        }

        if(brand){
          this.brand=brand;
        }else if(other.seriesName!==undefined&&other.seriesName!==null&&other.seriesName!=''){
          this.brand=other.seriesName+' '+other.modelName;
        }
      },
      async getData(mid,cid){
        let d={
              content: {
                  memberId: mid,
                  carId:cid
              }
          };

          let res = await this.$post('/CRM/appgarage/getGarageList.json',d);
          if(res.errcode==0){
              let content={},
                other={},
                data=res.content.violation.carInf;

              content.licenseplate=data.licenseplate;
              content.licenseplatePrefix=data.licenseplatePrefix;
              content.ecode=data.engineno||'';
              content.vcode=(/systemdefault/.test(data.carframeno)||!data.carframeno)?'':data.carframeno;
              
              content.city_name=data.cityName;
              content.province=data.provinceCode;

              content.brandId=data.brandId||'';
              content.seriesId=data.seriesId||'';
              content.modelId=data.modelId||'';

              other.iCar=data.iCar;
              other.img=data.carImgUrl||'';
              other.seriesName=data.seriesName||'';
              other.modelName=data.modelName||'';

              this.$cache.peccancy={content:content,other:other};

              this.init();
          }
      },
      hasNull(){
        let data=document.getElementsByClassName('item-val'),
          vm=this,
          di,
          val,
          len;

        for(let i=0;i<data.length;i++){
          di=data[i];
          
          di.tagName=='INPUT'?val=di.value.replace(/(^\s+)|(\s+$)/g,''):val=di.innerText;
          len=di.getAttribute('maxlength');

          if(val===''||val=='选择城市'){
              this.$toast(di.parentNode.children[0].innerText.replace('?','')+'不能为空');
              return true;
          }else if(len!==null&&len!=20&&val.length<len){
              this.$toast(di.parentNode.children[0].innerText.replace('?','')+'应为'+len+'位非空字符，请检查');
              return true;
          }  
        }

        if(!this.radio){
          this.$toast('请勾选阅读并同意《授权协议》');
          return true;
        }

        return false;
      },
      next(){
        
          if(!this.hasNull()){
            let content=this.$cache.peccancy.content,
                brand=this.$cache.brand;
            
            content.licenseplate=''+this.area+''+this.carNum.toUpperCase()+'';
            content.licenseplatePrefix=this.area+this.carNum.substr(0,1).toUpperCase();

            content.ecode=this.ecode.toUpperCase();
            content.vcode=this.vcode.toUpperCase();
          
            content.memberId=this.$cache.user.memberId;

            if(brand.name){
              content.brandId=brand.bid;
              content.seriesId=brand.sid;
              content.modelId=brand.mid;
            }else if(!content.brandId){
              content.brandId='';
              content.seriesId='';
              content.modelId='';
            }

            this.$router.push('./result');
          }
      }
    }
  };

</script>



<style lang="scss">
  @import "~assets/css/var.scss";

  #peccancyAdd{
    .page-content{padding:0 4%;}
    .card {
      li{padding:0 .12rem;border-bottom:$border;@include box;height:.44rem;line-height:.44rem;}
      li.dis .item-val{color:$gray;}
      li.arrow{
        position:relative;padding-right:.2rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      label{
        @include flex;
        span{display:inline-block;width:.15rem;line-height:.15rem;background:$mainColor;border-radius:99px;color:#fff;text-align:center;margin-left:3px;}
      }
      div{
        @include flex;text-align:center;
        span:nth-of-type(1){margin-right:.15rem;}
        span::after{content:"▼";margin-left:.02rem;}
      }
      
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;max-width: 60%;}
      .item-val.carId{@include flex(1);max-width:100px;}

      input{height:100%;line-height:normal!important;}
    }
    .radio{
      height:.2rem;padding:1px 0 1px .18rem;position:relative;margin-bottom:.14rem;font-size:.13rem;color:$lightBlack;
      div{position:absolute;width:.11rem;height:.11rem;top:.03rem;left:0;border-radius:99px;border:1px solid $mainColor;}
      div.on{background:$mainColor;color:#fff;}
      div.on:before{content:'√';}
      a{color:$mainColor;}
    }
    .tip{font-size:.11rem;text-align:center;margin-top:.12rem;color:$gray;}

     .keyboard{
        border-spacing:.1rem;background: #eaebec;width:100%;
        td{line-height:.4rem;text-align:center;background:#fff;border-bottom: 1px solid #b8babb;border-radius:5px;width:12.5%;}
        td.on{background:$mainColor;color:#fff;}
      }
  }

 

</style>
