<template>
    <app-layout id="myCarsSetMaintainRemind">
    
        <div class="marquee-box">
            <img src="~assets/img/myCars/icon_mycar_tip_orange@2x.png"/>
            <div>
                <div class="scroll-enter" >请完善车辆"{{urlquery.licenseplate}}"以下信息，获取精确的保养提醒时间：</div>
            </div>
        </div>
        <div class="list-box">
            <div class="item"  @click="openPicker(1,firstPickerDate)">
                <div class="title">车辆注册时间</div>
                <div class="right">
                    <input type="text" :value="firstPickerValue"  placeholder="请设置车辆注册时间" readonly>
                    <span class="arrow"></span>
                </div>
            </div>
            <div class="item">
                <div class="title">是否有上次保养记录</div>
                <div class="right">
                    <mt-switch v-model="value"  style="float:right"></mt-switch>
                </div>
            </div>
        </div>
        <div class="list-box" v-if="value">
            <div class="item" @click="openPicker(2,lastPickerDate)">
                <div class="title">上次保养时间</div>
                <div class="right" >
                    <input type="text" :value="lastPickerValue"  placeholder="请设置上次保养时间" readonly>
                    <span class="arrow"></span>
                </div>
            </div>
            <div class="item">
                <div class="title">上次保养里程</div>
                <div class="right">
                    <input type="text" placeholder="请输入上次保养里程" v-model="maintainKm" @keyup="keyUpnum(maintainKm)" style="ime-mode: disabled"/>
                    <span>km</span>
                </div>
            </div>
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
                firstPickerDate:'',
                lastPickerDate:'',
                urlquery:'',
                maintainKm:'',
                PickerDate:'',
                pickerNum:1,
                carId:'',
                startDate:new Date(new Date().getFullYear() - 100, 0, 1),
                endDate:new Date(new Date().getFullYear() + 100, 0, 1),
            }
        },
        computed:{
            showBtn(){
                if(this.value){
                    if(this.firstPickerDate==''||this.lastPickerDate==''||this.maintainKm==''||this.maintainKm==null){
                        return false
                    }else{
                        return true
                    }
                }else{
                    if(this.firstPickerDate==''){
                        return false
                    }else{
                        return true
                    }
                }
            },
            firstPickerValue(){
                if(this.firstPickerDate==''||this.firstPickerDate==undefined) return
                let arr=this.firstPickerDate.split('-');
                let time=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
                return time
            },
            lastPickerValue(){
                if(this.lastPickerDate==''||this.lastPickerDate==undefined) return
                let arr=this.lastPickerDate.split('-');
                let time=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
                return time
            }
        },
        activated(){
            this.value=true
            this.carId=this.$route.params.carId;
            this.urlquery=this.$cache.urlquery;
            this.firstPickerDate=this.urlquery.firstCertifyLicense;
            this.lastPickerDate=this.urlquery.beforemaintaindate;
            this.maintainKm=this.urlquery.beforemaintainkm;
        },
        methods:{
            keyUpnum(num){
                if(num){
                    this.maintainKm=num.replace(/\D/g,'')
                }
                
            },
            openPicker(num,picker) {   
                if(picker==''||picker==undefined){
                    let date=new Date();
                    let month=(date.getMonth() + 1).toString().length<2 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1);
                    let day=date.getDate().toString().length<2 ? '0'+date.getDate():date.getDate();
                    let time=date.getFullYear() + '-' + month + '-' + day;
                    this.PickerDate=time;
                } else{
                    this.PickerDate=picker
                }
                this.pickerNum=num;
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
                if(this.pickerNum==1){
                    this.firstPickerDate=time;
                }else{
                    this.lastPickerDate=time;
                }
            },
            async saveSubmit(){
                if(!this.value){
                    this.lastPickerDate='';
                    this.maintainKm=''
                }
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        carId:this.carId,
                        regTime:this.firstPickerDate,
                        maintainTime:this.lastPickerDate,
                        maintainKm:this.maintainKm
                    }
                };
                let res = await this.$post('/CRM/appgarage/setMaintainInf.json',d);
                if(res.errcode==0){
                    this.urlquery.firstCertifyLicense=this.firstPickerDate;
                    this.urlquery.beforemaintaindate=this.lastPickerDate;
                    this.urlquery.beforemaintainkm=this.maintainKm
                    this.$toast('设置成功')
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
    #myCarsSetMaintainRemind{
        
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
            > div{
                @include flex;
                color: #fff;
                font-size: .12rem;
                overflow: hidden;
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
                        width:1.5rem
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
