<template>
    <app-layout id="chooseCars">
        <div v-for="(value,index) in listItems" :class="'car-box '+(fromMaintenance?'':'hasBtn')" @click="goDetail(value.carId,index)">
            <div>
                <img class="defaultCar" v-if="value.isDefaultCar" src="~assets/img/defaultCar.png">
                <img :src="value.carImgUrl?value.carImgUrl:default_car">
                <h2>{{value.licenseplate}}</h2>
                <p>{{(value.brandName?value.brandName:'')+' '+(value.modelName?value.modelName:'')}}</p>
            
            </div>
            <div class="tick" :style="chooseId==value.carId ? 'background:#a9ce52': ''" ></div>
        </div>
        
        <div slot="footer" class="nextOne"><div class="btn" @click="bindCar">添加车辆</div></div>
        
    </app-layout>
</template>

<script>
    export default {
        data() {
            return {
                default_car:require('assets/img/default_car.png'),
                fromMaintenance:false,
                listItems:[],
                chooseId:0
            };
        },
        activated(){
            this.fromMaintenance=/maintenance/.test(location.search);
            this.getData();
            this.chooseId=this.$route.params.carId;

        },
        methods: {
            goDetail(carId,index){
                this.$cache.urlquery={};
                this.$cache.urlquery.carId=carId
                this.$cache.car=this.listItems[index];
                this.$cache.car.carId=''
                this.$router.go(-1);
            },
            select(index){
                if(this.fromMaintenance){
                    this.$cache.car=this.listItems[index];
                    this.$router.go(-1);
                }
            },
            async getData () {
                let d={content: {memberId: this.$cache.user.memberId}};

                let res = await this.$post('/CRM/appmembermgcust/queryCarList.json',d);
                if(res.errcode==0){
                    this.listItems=res.content.carList;
                    // for(let i=0;i<this.listItems.length;i++){
                    //     if(this.$route.params.carId==this.listItems[i].carId){
                    //         this.chooseId
                    //     }
                    // }
                    
                }
            },
            bindCar(){
                
                this.$cache.urlquery.status='create';
                this.$router.push({path:'/bindCar'})
            },
            
            
        }
    }
</script>
<style lang="scss">
    #chooseCars{
        .tick{
            position: absolute;
            width: .2rem;
            height: .2rem;
            border-radius: 50%;
            background: #d7d7d7;
            right: .15rem;
            padding: 0;
            top: .3rem;
            &::after{position:absolute;content:'';width:.1rem;height:2px;top: .10rem;left:.065rem;transform: rotate(-50deg);background: #fff}
            &::before{position:absolute;content:'';width:.05rem;height:2px;top: .11rem;left:.04rem;transform: rotate(40deg);background: #fff}
        }
    }
</style>
