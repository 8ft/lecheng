<template>
  <app-layout id="testDrive">

        <ul class="card">
            <li :class="$route.query.id?'dis':'arrow'">
              <label>试驾车型<span>*</span></label>
              <input class="item-val" readonly @click="$router.push('/testDrive/brands')"  placeholder="请选择试驾的车型" v-model="car">
            </li>
            <li class="arrow">
              <label>预约门店<span>*</span></label>
              <input class="item-val" readonly @click="$router.push('/fourS?ids='+ids)"  placeholder="请选择要试驾的4S店" v-model="fourS">
            </li>
        </ul>

        <ul class="card">
            <li>
              <label>姓名<span>*</span></label>
              <input class="item-val" type="text" placeholder="请填写试驾人姓名" v-model="name">
            </li>
            <li>
              <label>手机<span>*</span></label>
              <input class="item-val" type="text" placeholder="请填写试驾人手机" v-model="phone">
            </li>
            <li class="arrow" @click="listVisible=true">
              <label>预约时间<span>*</span></label>
              <input readonly class="item-val" type="text" placeholder="请选择试驾时间" v-model="date">
            </li>
        </ul>

        <ul class="card">
          <li class="txtArea">
                <label>留言</label>
                <textarea placeholder="可填写其他需求告诉我们哦~" v-model="remark"></textarea>
          </li>
        </ul>

        <div class="tip">特别提示：试驾时，请随身带好您的驾驶证及身份证。</div>

        <div class="nextOne" slot="footer">
            <button class="btn" v-on:click="sub">提交预约</button>
        </div>
        
        <img v-if="wxInvite" src="/CRM/WeChat/App/static/img/invite.png" class="invite-tip" v-on:click="wxInvite=false">


        <mt-popup v-model="listVisible" slot="aside" position="bottom" style="width:100%;" :closeOnClickModal="false">
            <div id="pickerToolBar" class="clearfix"><button v-on:click="listVisible=false;">取消</button><button v-on:click="select()">确定</button></div>
            <mt-picker :slots="slots" @change="onValuesChange" ></mt-picker>
        </mt-popup>

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        ids:'',
        nowDate:'',
        nowTime:0,
        selectedDate:'',

        name:'',
        phone:'',
        date:'',
        fourS:'',
        car:'',
        remark:'',
        areaVisible:false,

        wxInvite: false,

        listVisible:false,
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }, {
            flex: 1,
            values: ['9:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00','16:00-17:00'],
            className: 'slot3',
            textAlign: 'center'
          }
        ]
      };
    },
    mounted(){
      let user=this.$cache.user;
      this.name=user.name;
      this.phone=user.phone;
    },
    activated(){
      let s=this.$cache,
          fourS=s.fourS.name,
          brand=s.brand;

      if(fourS){this.fourS=fourS;}
      if(brand.bname){
        let car=brand.bname+' '+brand.sname;
        if(this.car!==car){
          this.car=car;
          this.fourS='';
          this.$cache.fourS = {};
        }
      }

      this.getData();
    },
    beforeRouteLeave (to,from,next){
      if(!/(brands|fourS)$/.test(to.path)){
        this.resetPage();
        this.$cache.fourS = {};
        this.$cache.brand = {};
      }
      next();
    },
    methods: {
      select(){
        this.date=this.selectedDate;
        this.listVisible=false;
      },
      onValuesChange(picker, values) {
         let date=values[0],
          time=values[1];

         if(time){
            let start=time.split(':')[0];
            if(date===this.nowDate&&this.nowTime>=start){
              let arr=picker.getSlotValues(1),
                  index=arr.indexOf(time);

              time=arr[index+1];
              picker.setSlotValue(1,time);
            }
            this.selectedDate=date+' '+time;
         }else if(date){
           let arr=picker.getSlotValues(1),
              index=arr.indexOf(time);
              picker.setSlotValue(1,arr[index+1]);
         }
      },
      resetPage(){
        this.fourS='';
        this.car='';
        this.date='';
        this.remark='';
        this.areaVisible=false;
      },
      hasNull(){

        if(this.car===''){
          this.$toast('请选择试驾的车型');
          return true;
        }

        if(this.fourS===''){
          this.$toast('请选择要试驾的4S店');
          return true;
        }

        if(this.name===''){
          this.$toast('请输入姓名');
          return true;
        }

        if(this.phone===''){
          this.$toast('请输入手机号码');
          return true;
        }else if(!/^1[345789]\d{9}$/.test(this.phone.replace(/\s/g,''))){
          this.$toast('手机号码格式有误，请检查');
          return true;
        }

        if(this.date===''){
          this.$toast('请选择预约时间');
          return true;
        }


        return false;
      },
      setDate(dateTime){
          this.nowDate=dateTime;

          let months=[],
          date=new Date(dateTime),

          cur_year= date.getFullYear(),
          cur_month= date.getMonth() + 1,
          cur_date= date.getDate(),
          cur_dayCount=new Date(cur_year, cur_month, 0).getDate(),

          next_year=cur_month>11?cur_year+1:cur_year,
          next_month=cur_month>11?1:cur_month,
          next_dayCount=new Date(next_year, next_month, 0).getDate(),
          next_date=next_dayCount>=cur_date?cur_date:next_dayCount,

          days=cur_dayCount-cur_date+next_date;

          if(this.nowTime<16){
            months.push(dateTime);
          }

          for (let i = 0; i < days; i++) {
            cur_date++;
            if(cur_date>cur_dayCount){
              cur_date=1;
              if(cur_month===12){
                cur_month=1;
                cur_year+=1;
              }else{
                cur_month+=1;
              }
            }
            months.push(cur_year+'-'+(cur_month<10?'0'+cur_month:cur_month)+'-'+(cur_date<10?'0'+cur_date:cur_date));
          }
          
          this.slots[0].values=months;
      },
      async getData() {
        let cache=this.$cache,
            data = {
              content: {
                crmid:cache.fourS.id||'',
                catid:cache.brand.sid||'',
                itemid:this.$route.query.id||''
              }
            };

        let res=await this.$post('/mall26/testdrivedata.html', data);
        if (res.errcode == 0) {
            let con=res.content,
              list=con.list;

            if(list.length>0){

              let storeInfo=list[0];
              this.car=storeInfo.pcat_name+' '+storeInfo.cat_name;
              
              let ids=[];
              for (let i = 0; i <list.length ; i++) {
                ids.push(list[i].ccrmid);   
              }

              this.ids=ids.join('_');
            }
            
            this.nowTime=new Date(con.now * 1000).getHours();
            this.setDate(con.date);
        }
      },
      async sub(){
        if(!this.hasNull()){

            let data=this.$sign({
              content:{
                orderType:'SJ',
                custName:this.name,
                mobilephone:this.phone,
                storeName:this.fourS,
                storeId:this.$cache.fourS.id,
                remark:this.remark,
                commodityName:this.car,
                subscribeTime:this.date
              }});

                
            let res=await this.$post('/CRM/api/commit.order.json',data);
            if(res.errcode==0){
              this.$cache.history.pop();
              this.$router.replace('/paid/'+res.content.no);
            }
          }
      }
    }
  }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #testDrive{
    .card {margin:.05rem auto;
      li{border-bottom:$border;}
      li:not(.txtArea){@include box;height:.44rem;line-height:.44rem;padding:0 .12rem;}
      li:not(.txtArea) label{@include flex;}
      li.arrow{
        position:relative;padding-right:.20rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      
      li.txtArea{
          padding:.12rem;
          label{display: block;}
          textarea{text-align: left;color:$black;width:100%;line-height:.20rem;min-height:.60rem;}
      }

      li label span{color:red;}
      
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;height:.44rem;}

      input{height:100%;line-height:normal!important;}
    }

    .tip{text-indent:.2rem;font-size:$h3;line-height:.2rem;color:$gray;}

    .btns{@include box;height:.5rem;
        button{display: block;line-height:.5rem;color:#fff;}
        .share{@include flex(1.5);background:#f29600;;}
        .submit{@include flex(2.5);background:$mainColor;}
    }
    
    #pickerToolBar{
        background:lightgray;border-top:1px solid $gray;border-bottom:1px solid $gray;
        button{padding:.1rem .2rem;color:black;float:left;}
        button:last-child{color:blue;float:right;}
    }
  }

</style>
