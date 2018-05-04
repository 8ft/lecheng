 <template>
 <app-layout id="lotteryAddConsignee">

    <ul class="card">
        <li>
            <label>姓名</label>
            <input class="item-val" type="text" placeholder="请填写真实姓名" v-model="name">
        </li>
        <li>
            <label>联系电话</label>
            <input class="item-val" type="text" placeholder="请输填写手机号码" v-model="phone">
        </li>

        <li class="arrow" v-if="'38'.match(type)">
            <label>所在省市</label>
            <router-link to="/city" class="item-val">{{city}}</router-link>
        </li>
        <li class="arrow" v-if="'38'.match(type)">
            <label>意向4S店</label>
            <router-link to="/fourS" class="item-val">{{fourS}}</router-link>
        </li>

        <li class="txtArea" v-if="type==='1'">
            <label>详细地址</label>
            <textarea placeholder="请填写真实详细地址~" v-model="addr"></textarea>
        </li>

        <li style="height:auto;"><button class="sub" v-on:click="sub">提 交</button></li>
    </ul>

 </app-layout>
 </template>
 
 <script>
  export default {
    data() {
      return {
        aid:'',
        pid:'',
        type:'',
        name:'',
        phone:'',
        fourS:'请选择意向4S店',
        city:'请选择所在省市',
        addr:'',
        area:'',
        fourS:'',
        brand:''
      };
    },
    activated() {
        this.aid=this.$route.query.aid;
        this.pid=this.$route.query.pid;
        this.type=this.$route.query.type;
    },
    methods:{
        checkNull(){
            if(!this.name){this.$toast('请填写姓名');return false;}
            if(!this.phone){this.$toast('请填写手机号码');return false;}else if(!/^1[345789]\d{9}$/.test(this.phone)){this.$toast('手机号格式有误，请检查');return false;}
            if(this.type==='1'&&!this.addr){this.$toast('请填写详细地址');return false;}

            return true;
        },
        async sub(){
            if(this.checkNull()){
                this.$indicator.open();
                let data = {
                        content: {
                            memberId: this.mid,
                            activityId: this.aid,
                            id:this.pid,
                            receiverName: this.name,
                            receiverNumber: this.phone,
                            receiverAddress: this.addr,
                            receiverArea:this.area,
                            receiverFours:this.fourS,
                            receiverBrand:this.brand
                        }
                    };
                    
                let res=await this.$post('/CRM/wechatluckydraw/fillReceiveInfo.json',data);
                if (res.errcode === 0) {
                    this.$messagebox.alert('提交成功！').then(action => {
                        this.$router.go(-1);
                    });
                }
            }
        }
    }
       
}
</script>

 <style lang="scss">
   @import "~assets/css/var.scss";
   #lotteryAddConsignee{
       background:url('/CRM/WeChat/App/static/img/lottery/addInfoBg.jpg') no-repeat top center;background-size:100%;
       .card {width: 94%;margin: 1.2rem auto 0;
            li{border-bottom:$border;}
            li:not(.txtArea){@include box;height:.44rem;line-height:.44rem;padding:0 .12rem;}
            li:not(.txtArea) label{@include flex;}
            li.arrow{
                position:relative;padding-right:.20rem;
                &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
            }
            
            li.txtArea{
                padding: 0 .12rem .12rem;
                label{display: block;line-height: .44rem;}
                textarea{text-align: left;color:$black;width:100%;line-height:.20rem;min-height:.60rem;}
            }

            li label span{color:red;}
            
            .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;height:.44rem;}

            input{height:100%;line-height:normal!important;}

            .sub{margin: .20rem auto;}
        }
        
   }
 </style>