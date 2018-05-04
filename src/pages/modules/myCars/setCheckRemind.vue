<template>
    <app-layout id="myCarsSetCheckRemind">
        <div class="marquee-box">
            <img src="~assets/img/myCars/icon_mycar_tip_orange@2x.png"/>
            <div>
                <div class="scroll-enter">请完善车辆"{{urlquery.licenseplate}}"以下信息，获取精确的年检时间：</div>
            </div>
        </div>
        <div class="list-box">
            <div class="item"  @click="openPicker(regDate)">
                <div class="title">行驶证注册日期</div>
                <div class="right">
                    <input type="text" :value="regValue"  placeholder="必填(车辆注册时间)" readonly style="width:1.4rem">
                    <span class="arrow"></span>
                </div>
            </div>
            <div class="item">
                <div class="title">五座及五座以下且未造成人伤事故</div>
                <div class="right">
                    <mt-switch v-model="value"  style="float:right"></mt-switch>
                </div>
            </div>
        </div>
        <div class="remind">
            <div>1.开启年检提醒，不再为年检过期而烦恼；</div>
            <Div>2.盈众乐橙将提前告知您本次年检的类型，及时做好准备！</Div>
        </div>
        <div class="next-btn" v-if="showBtn" @click="saveSubmit">下一步</div>
        <div class="next-btn" style="background:#c9c9c9" v-else>下一步</div>
        
        <mt-datetime-picker 
            ref="picker"
            type="date"
            v-model="PickerDate"
            @confirm="handleConfirm"
            :startDate="startDate"
            :endDate="endDate">
        </mt-datetime-picker>

    </app-layout>
</template>
<script>
    export default {
        data() {
            return{
                value:true,
                PickerDate:'',
                regDate:'',
                urlquery:'',
                startDate:new Date(new Date().getFullYear() - 100, 0, 1),
                endDate:new Date(new Date().getFullYear() + 100, 0, 1),
            }
        },
        activated(){
            this.carId=this.$route.params.carId;
            this.urlquery=this.$cache.urlquery;
            this.regDate=this.urlquery.firstCertifyLicense;
            if(this.$cache.urlquery.isNewCarAnnual==1){
                this.value=true
            }else{
                this.value=false
            }
        },
        computed:{
            showBtn(){
                if(this.regDate==''){
                    return false
                }else{
                    return true
                }
            },
            pickerValue(){
                let arr=this.PickerDate.split('-');
                let time=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
                return time
            },
            regValue(){
                if(this.regDate==''||this.regDate==undefined) return
                let arr=this.regDate.split('-');
                let time=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
                return time
            }
        },
        methods:{
            openPicker(picker) {
                
                if(picker==''||picker==undefined){
                    let date=new Date();
                    let month=(date.getMonth() + 1).toString().length<2 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1);
                    let day=date.getDate().toString().length<2 ? '0'+date.getDate():date.getDate();
                    let time=date.getFullYear() + '-' + month + '-' + day;
                    this.PickerDate=time;
                } else{
                    this.PickerDate=picker
                }
                this.$refs.picker.open();
            },
            handleConfirm(e){
                let date=new Date(e)
                if(date.getTime() > new Date().getTime()){
                    this.$toast('所选时间必须小于当前时间')
                    this.$refs.picker.open();  
                    return 
                }
                let month=(date.getMonth() + 1).toString().length<2 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1);
                let day=date.getDate().toString().length<2 ? '0'+date.getDate():date.getDate();
                let time=date.getFullYear() + '-' + month + '-' + day;
                this.regDate=time;
            },
            async saveSubmit(){
                let accidentState=1;
                if(this.value){
                    accidentState=0
                }
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        carId:this.carId,
                        regDate:this.regDate,
                        accidentState:accidentState
                    }
                };
                let res = await this.$post('/CRM/appgarage/setAnnualInf.json',d);
                if(res.errcode==0){
                    this.urlquery.firstCertifyLicense=this.regDate;
                    if(accidentState==0){
                        this.$cache.urlquery.isNewCarAnnual=1
                    }else{
                        this.$cache.urlquery.isNewCarAnnual=0
                    }
                    
                    this.$toast('设置成功');
                    this.$router.go(-1)
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    .mint-toast {
        z-index: 2009 !important;
    }
    #myCarsSetCheckRemind{
        .scroll-enter {
            position: relative;
            left: 100%;
            animation: scroll-in 6s infinite linear;
        }
        @keyframes scroll-in {
            0% {
                left:100%;
            }
            50% {
                left:0%;
            }
            100% {
                left:-100%;
            }
        }
        .mint-datetime-action{
            color: orangered
        }
        .marquee-box{
            height: .35rem;
            background: #303030;
            @include box;
            align-items: center;
            img{
                height: .12rem;
                width: .12rem;
                padding-left: .2rem;
                padding-right: .05rem;
            }
            >div{
                @include flex;
                color: #fff;
                font-size: .12rem;
                overflow: hidden
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
                        text-align: right;
                        width:1.2rem
                    }
                }
            }
        }
        .remind{
            margin-top: .2rem;
            padding:0 5%;
            div{
                color: #88888d;
                font-size: .12rem;
                line-height: .2rem;
                
            }
        }
        .next-btn{
            width: 90%;
            margin: .15rem auto;
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
