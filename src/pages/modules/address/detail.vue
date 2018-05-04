<template>
    <app-layout id="meAddDelivery" >
        <div class="list-box">
            <div class="item">
                <div class="title">收货人</div>
                <div class="right">
                    <input type="text" placeholder="请输入收货人姓名" v-model="consignee"/>
                </div>
            </div>
            <div class="item">
                <div class="title">手机号码</div>
                <div class="right">
                    <input type="text" placeholder="请输入收货人手机号码" v-model="mobilePhone"/>
                </div>
            </div>
            <div class="item" @click="popupVisible=true">
                <div class="title">地区</div>
                <div class="right">
                    <input class="dis" type="text" placeholder="省市-城市-地区" :value="areaArr.length==0 ? '' : areaArr[0]+' '+areaArr[1]+' '+areaArr[2]"/>
                </div>
            </div>
            <div class="item">
                <div class="title">详细地址</div>
                <div class="right">
                    <input type="text" placeholder="请填写到街道门牌号" v-model="addressDetail"/>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="item">
                <div class="title">设为默认收货地址</div>
                <div class="right">
                    <mt-switch v-model="value"  style="float:right"></mt-switch>
                </div>
            </div>
        </div>
        <div class="next-btn" @click="saveAddress">保存</div>
        <mt-popup position="bottom" v-model="popupVisible">
            <div class="toolbar">
                <div @click="popupVisible=false">取消</div>
                <div @click="trueArea">确定</div>
            </div>
            <mt-picker :slots="slots" :visible-item-count="5" @change="onAddressChange" ></mt-picker>
        </mt-popup>
    </app-layout>
</template>

<script>
    import Areajs from '../../../assets/js/area.js'
    export default {
        name:'ex-addDelivery',
        data(){
            return{
                initCon:'',
                proviceIndex:0,
                cityIndex:0,
                areaIndex:0,
                value:false,
                popupVisible:false,
                codeArr:[],
                selarea:[],
                areaArr:[],
                consignee:'',
                mobilePhone:'',
                addressDetail:'',
                slots: [
                    {
                        flex: 1,
                        values: [],
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: [],
                        className: 'slot3',
                        textAlign: 'center',

                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values: [],
                        className: 'slot5',
                        textAlign: 'center',
                    }
                ],
            }
        },

        mounted(){
            this.getData(this.$route.params.id) 
        },

        methods:{
            getArea(){
                for(let i=0;i<Areajs.provinceList.length;i++){
                    this.slots[0].values.push(Areajs.provinceList[i]['provinceName']);
                    if(Areajs.provinceList[i]['provinceName']==this.areaArr[0]&&this.areaArr.length>0){
                        this.slots[0].defaultIndex=i;
                        this.proviceIndex=i
                    }        
                }
                for(let i=0;i<Areajs.provinceList[this.proviceIndex].cityList.length;i++){
                    this.slots[2].values.push(Areajs.provinceList[this.proviceIndex].cityList[i]['cityName'])
                    if(Areajs.provinceList[this.proviceIndex].cityList[i]['cityName']==this.areaArr[1]&&this.areaArr.length>0){
                        this.slots[2].defaultIndex=i;
                        this.cityIndex=i
                    }
                }
                for(let i=0;i<Areajs.provinceList[this.proviceIndex].cityList[this.cityIndex].areaList.length;i++){ 
                    this.slots[4].values.push(Areajs.provinceList[this.proviceIndex].cityList[this.areaIndex].areaList[i]['areaName'])
                    if(Areajs.provinceList[this.proviceIndex].cityList[this.cityIndex].areaList[i]['areaName']==this.areaArr[2]&&this.areaArr.length>0){
                        this.slots[4].defaultIndex=i;
                    }
                }
            },
            async getData (id) {
                if(id=='new'){
                    this.getArea()
                }else{
                    let d={
                        content: {
                            mbeid: this.$cache.user.memberId,
                            mobile:this.$cache.user.phone,
                            addr_id:id
                        }
                    };
                    let res = await this.$post('/mall26/addressdetail.html',d);
                    if(res.errcode==0){
                        this.consignee=res.content.consignee;
                        this.mobilePhone=res.content.mobilePhone;
                        this.addressDetail=res.content.addressDetail;
                        if(res.content.isDefault==1){
                            this.value=true;
                        }else{
                            this.value=false;
                        }
                        this.areaArr=[res.content.proviceName,res.content.cityName,res.content.areaName];
                        this.codeArr=[res.content.proviceCode,res.content.cityCode,res.content.areaCode];
                        this.getArea()
                    }
                }
                
            },
            trueArea(){
                this.codeArr=[];
                this.areaArr=this.selarea;
                this.popupVisible=false;
                for(let i=0;i<Areajs.provinceList.length;i++){
                    if(Areajs.provinceList[i]['provinceName']==this.areaArr[0]){
                        this.codeArr.push(Areajs.provinceList[i]['provinceCode']);

                        for(let j=0;j<Areajs.provinceList[i].cityList.length;j++){
                            if(Areajs.provinceList[i].cityList[j]['cityName']==this.areaArr[1]){
                                this.codeArr.push(Areajs.provinceList[i].cityList[j]['cityCode']);

                                for(let k=0;k<Areajs.provinceList[i].cityList[j].areaList.length;k++){
                                    if(Areajs.provinceList[i].cityList[j].areaList[k]['areaName']==this.areaArr[2]){
                                        this.codeArr.push(Areajs.provinceList[i].cityList[j].areaList[k]['areaCode']);
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            },
            onAddressChange(picker, values) {
                var that=this;
                let cityArr=[];
                let streetArr=[];

                if(values[0]==undefined||values[1]==undefined||values[2]==undefined){  
                    return        
                }
                for(let i=0;i<Areajs.provinceList.length;i++){
                    if(Areajs.provinceList[i]['provinceName']==values[0]){
                        for(let j=0;j<Areajs.provinceList[i].cityList.length;j++){
                            cityArr.push(Areajs.provinceList[i].cityList[j]['cityName'])
                        }
                        picker.setSlotValues(1, cityArr)
                        break;
                    }
                }
                
                for(let i=0;i<Areajs.provinceList.length;i++){
                    for(let j=0;j<Areajs.provinceList[i].cityList.length;j++){
                        if(Areajs.provinceList[i].cityList[j]['cityName']==values[1]){
                            for(let k=0;k<Areajs.provinceList[i].cityList[j].areaList.length;k++){
                                streetArr.push(Areajs.provinceList[i].cityList[j].areaList[k]['areaName'])
                            }
                            picker.setSlotValues(2, streetArr)
                            break;
                        }
                        
                    }  
                }

                this.selarea=[values[0],values[1],values[2]];
            },
            async saveAddress(){
                if(this.consignee==''){
                    this.$toast('输入收货人名称')
                    return
                }else if(this.mobilePhone==''){
                    this.$toast('输入收货人手机号码')
                    return
                }else if(!(/^1[345789]\d{9}$/.test(this.mobilePhone))){
                    this.$toast('手机号码有误')
                    return
                }else if(!(/^1[345789]\d{9}$/.test(this.mobilePhone))){
                    this.$toast('手机号码有误')
                    return
                }else if(this.areaArr.length==0){
                    this.$toast('选择地区')
                    return
                }else if(this.addressDetail==''){
                    this.$toast('输入详细地址')
                    return
                }
                let d={
                    content: {
                        mbeid: this.$cache.user.memberId,
                        id:this.$route.params.id=='new' ? '':this.$route.params.id,
                        type:this.$route.params.id=='new' ? '1':'2',
                        mobile:this.$cache.user.phone,
                        name:this.consignee,
                        mobilePhone:this.mobilePhone,
                        proviceCode:this.codeArr[0],
                        cityCode:this.codeArr[1],
                        areaCode:this.codeArr[2],
                        proviceName:this.areaArr[0],
                        cityName:this.areaArr[1],
                        areaName:this.areaArr[2],
                        addressDetail:this.addressDetail,
                        isDefault:this.value ? 1:2,
                        zipCode:''
                    }
                };

                let res = await this.$post('/mall26/addresssave.html',d);
                if(res.errcode==0){
                    this.$toast('保存成功')
                    this.$router.go(-1)
                }
            }
        }
        
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #meAddDelivery{
        .mint-popup{
            width: 100%;
            
            .toolbar{
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #eaeaea;
                display: flex;
                color: orangered;
                font-size: 16px;
                text-align: center;
                div{
                    flex:1
                }
            }
            .picker-item{
                font-size: 15px;
            }
        }
        .list-box{
            margin-top:.1rem;
            .item{
                font-size: .15rem;
                background: #fff;
                border-bottom:1px solid #f2f2f2;
                height: .5rem;
                 @include box;
                 align-items: center;
                 padding: 0 .2rem;
                .right{
                    flex: 1;
                    text-align: right;
                    color: #88888d;
                    .arrow{
                        position:relative;
                        margin-right: .06rem;
                        margin-left: .1rem;
                        top: .01rem;
                        &::after{position:absolute;content:'';width:0;height:0;top: .02rem;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                        &::before{position:absolute;content:'';width:0;height:0;top: .02rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                    }
                    input{
                        height: .3rem;
                        line-height: .3rem;
                        text-align: right;
                        width:2rem
                    }
                }
            }
            
        }
        .next-btn{
            width: 90%;
            margin: .28rem auto;
            height: .4rem;
            border-radius: 6px;
            line-height: .4rem;
            color: #fff;
            font-size: .15rem;
            background: orangered;
            text-align: center
        }
    }
</style>
