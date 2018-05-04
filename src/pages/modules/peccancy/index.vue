<template>
    <app-layout id="peccancy">
       
        <h1 v-if="myCars.length>0">我的爱车</h1>
        <div v-for="(value,index) in myCars" class="car-box">
            <div v-on:click="next(myCars[index])">
                <img :src="value.carImgUrl?value.carImgUrl:default_car">
                <h2>{{value.licenseplate}}</h2>
                <p>{{(value.seriesName?value.seriesName:'')+' '+(value.modelName?value.modelName:'')}}</p>
            </div>
        </div>
        
        <h1 v-if="otherCars.length>0">其他车辆</h1>
        <div v-for="(value,index) in otherCars" class="car-box hasBtn">
            <div v-on:click="next(otherCars[index])">
                <img :src="value.carImgUrl?value.carImgUrl:default_car">
                <h2>{{value.licenseplate}}</h2>
                <p>{{(value.seriesName?value.seriesName:'')+' '+(value.modelName?value.modelName:'')}}</p>
            </div>
            <button v-on:click="delCar(index,value.id)"></button>
        </div>

        <div slot="footer" class="nextOne"><router-link class="btn" to="./peccancy/add">添加查询车辆</router-link></div>
    </app-layout>
</template>

<style lang="scss">
  #peccancy{
    //   #add{font-size:.24rem;display:block;position:fixed;right:0;top:0;width:40px;line-height:40px;z-index:204;color:#fff;text-align:center;}
      .page-content h1{margin:.14rem 0;text-indent:.14rem;font-weight:500;}
  }
</style>

<script>
    export default {
      name:'peccancy',
      data() {
        return {
            default_car:require('assets/img/default_car.png'),
            myCars:[],
            otherCars:[]
        };
      },
      activated(){
          this.getData();
          this.$cache.peccancy = {content:{},other:{}};
      },
      methods: {
        delCar(index,id){
            let vm=this;
            vm.$messagebox.confirm('亲，确定要删除车辆吗？', '提示').then(async function(){

                let res=await vm.$post('/CRM/appvehicleviolation/deletevvlog.json',{content:{id:id}});
                if(res.errcode==0){
                    vm.otherCars.splice(index,1);
                }
            });
        },
        async getData() {
            let res=await this.$post('/CRM/appvehicleviolation/queryvvlog.json',{content: {memberId:this.$cache.user.memberId}});
            if(res.errcode==0){
                let con=res.content,
                    myCars=[],
                    otherCars=[],
                    ci;

                for (let i = 0; i < con.length; i++) {
                    ci= con[i];
                    if(ci.iCar=='1'){
                        myCars.push(ci);
                    }else{
                        otherCars.push(ci);
                    }
                }

                this.myCars=myCars;
                this.otherCars=otherCars;
            }
        },
        next(car){
            let content={},
                other={},
                data=car;
            
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
                this.$router.push('./peccancy/add');
        }
      }
    }
</script>
