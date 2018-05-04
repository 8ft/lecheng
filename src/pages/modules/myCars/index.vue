<template>
    <app-layout id="myCars">
        <lc-cell-swipe class="car-box"  v-for="(value,index) in listItems" :key="value.id" :draggable="fromPath==='/maintenance'? false:true" :right="[{
                  content: '删除',
                  style: itemStyle,
                  handler:()=>delCar(index,value.carId)
                }]">
            <div v-on:click="select(index,value.carId)">
                <img class="defaultCar" v-if="value.isDefaultCar" src="~assets/img/defaultCar.png">
                <img :src="value.carImgUrl?value.carImgUrl:default_car">
                <h2>{{value.licenseplate}}</h2>
                <p>{{(value.brandName?value.brandName:'')+' '+(value.modelName?value.modelName:'')}}</p>
            </div>
        </lc-cell-swipe>
        
        <div slot="footer" class="nextOne"><div class="btn" @click="bindCar">添加爱车</div></div>
        
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            default_car:require('assets/img/default_car.png'),
            listItems:[],
            fromPath:'',
            itemStyle:{
                background: 'red',
                color: '#fff',
                padding:'0 .1rem',
                height:'100%',
                display: 'flex',
                'align-items': 'center'
            }
        };
      },
      beforeRouteEnter: (to, from, next) => {
       next(vm => {
            vm.fromPath=from.path;
            vm.getData();
        })
      },
      methods: {
        select(index,cid){
            if(this.fromPath==='/maintenance'){
                this.$cache.car=this.listItems[index];
                this.$router.go(-1);
            }else{
                this.$router.push('/myCars/detail/'+cid);
            }
        },
        async getData () {
            let d={content: {memberId:this.$cache.user.memberId}};

            let res = await this.$post('/CRM/appmembermgcust/queryCarList.json',d);
            if(res.errcode==0){
                this.listItems=res.content.carList;
            }
        },
        bindCar(){
            this.$cache.urlquery={status:'create'};
            this.$router.push({path:'/bindCar'});
        },
        delCar(index,id){
            let vm=this;
            vm.$messagebox.confirm('亲，确定要删除车辆吗?', '提示').then(async function(){
                let d={'content':{
                    'memberId':''+vm.$cache.user.memberId+'',
                    'registeredCars':[{
                        'status':'delete',
                        'carId':id,
                        'firstTimeAdded':'',
                        'czname':'',
                        '4sStoreId':'',
                        'brandId':'',
                        'seriesId':'',
                        'modelId':'',
                        'licensePlateNo':'',
                        'serviceCustId':'',
                        'setDefault':''
                    }]
                }};

                let res=await vm.$post('/CRM/appmembermgcust/updatecarinfo.json',d);
                if(res.errcode==0){
                    eventBus.$emit('userInfoUpdated');
                    vm.getData();
                }
            });
        }
        
      }
    }
</script>
<style lang="scss">
    #myCars{
        .lc-cell-wrapper{
            padding: 0
        }
        .lc-cell-right{
            padding: 0
        }
    }
    
</style>

