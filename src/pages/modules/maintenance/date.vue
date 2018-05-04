<template>
    <app-layout id="date">
           
        <table class="date_picker" v-for="(value,index) in months">
            <tr><th colspan="7">{{value.year}}年{{value.month}}月</th></tr>
            <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>
            <tr v-for="(row,rowIndex) in value.rows">
                <td v-for="day in value.days[rowIndex]" v-on:click="listVisible=true;showList=value.year+'-'+value.month+'-'+day;" :class="(day===''||listItems[value.year+'-'+value.month+'-'+day]===undefined?'dis':'')+(day!==''?' day':'')">{{day===''?'':parseInt(day)}}</td>
            </tr>
        </table>

        <mt-popup v-model="listVisible" position="bottom" style="width:100%;" :closeOnClickModal="false">
        <div id="pickerToolBar" class="clearfix"><button v-on:click="listVisible=false;">取消</button><button v-on:click="select()">确定</button></div>
        <mt-picker :slots="slots" @change="onValuesChange" ></mt-picker>
        </mt-popup>

    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            months:[],//可预约月份
            cur_date:0,
            listItems:{},
            listVisible:false,
            showList:'',
            selectIndex:-1,
            slotsData:{},
            slots: [{
                values:[],
                className: 'slot',
            }]
        };
      },
      watch: {
      listVisible(val) {
        if (val) {
          this.slots[0].values=this.slotsData[this.showList];
        }else{
          this.slots[0].values=[];
        }
      }
    },
      activated(){
          this.$indicator.open();

          let enable_mon=2,//可预约月份数
              months=[],
              date = new Date(),
              cur_year= date.getFullYear(),
              cur_month= date.getMonth() + 1,
              cur_date=date.getDate(),
              day0,
              rows,
              day_count,
              o,
              d;
        
          this.cur_date=cur_date<10?'0'+cur_date:cur_date;

          for(let i=0;i<enable_mon;i++){
                day0 = new Date('' + cur_year + '/' + cur_month + '/1').getDay();
                day_count = new Date(cur_year, cur_month, 0).getDate()+day0;
                rows=Math.ceil(day_count/7);

                months[i]={
                    'year':cur_year,
                    'month':cur_month<10?'0'+cur_month:cur_month,
                    'day_count':day_count,
                    'rows':rows,
                    'day0':day0,
                    'days':{}
                };

                for(let j=0;j<rows*7;j++){
                    o=Math.floor(j/7);

                    if(months[i].days[o]===undefined){
                        months[i].days[o]=[];
                    }

                    if(j<day0||j >= day_count){
                        months[i].days[o].push('');
                    }else{
                        d=j-day0+1;
                        months[i].days[o].push((d< 10 ? '0' + d: d));
                    }
                }

                cur_month++;
                if (cur_month > 12) {
                    cur_year++;
                    cur_month = 1;
                }
          }

          this.months=months;

          let start=months[0].year+'-'+months[0].month+'-'+cur_date,
              end=months[1].year+'-'+months[1].month+'-'+(months[1].day_count-months[1].day0);
          this.getData(start,end);
      },
      methods: {
        select(){
            let value=this.listItems[this.showList][this.selectIndex];
            if(value.remaining==0){
                alert('该时段已满,请选择其他时段');
            }else{
                this.$cache.date=value;
                this.listVisible=false;
                this.$router.go(-1);
            }
        },
        onValuesChange(picker, values) {
            this.selectIndex=this.slots[0].values.indexOf(values[0]);
        },
        async getData(start,end) {
            
            let d={content: {
                '4sStoreId':this.$cache.fourS.id,
                startDate:start,
                endDate:end,
                serviceCustId:""
            }};

            let res=await this.$post('/CRM/appbespeak/queryspeakset.json',d);
            if(res.errcode==0){
                let records=res.content.records,
                    discount=(this.$route.query.nodiscount===undefined),
                    newData={},
                    slotsData={};

                if(records!==null&&records.length>0){
                    let ri,
                        rname;
                    for(let i=0;i<records.length;i++){
                        ri=records[i];
                        rname=ri.bespeakDate;
                        if(newData[rname]===undefined){
                            newData[rname]=[];
                            slotsData[rname]=[];
                        }

                        newData[rname].push(ri);
                        slotsData[rname].push(ri.bespeakTime+' '+(ri.remaining==0?'已满':(ri.remaining<3?'繁忙':'空闲'))+(discount?' 保养工时费'+ri.discount+'折':''));
                    }
                }

                this.listItems=newData;    
                this.slotsData=slotsData;                
            }
        }
      }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #date{
        .date_picker{
            border:1px solid rgba(212, 204, 197, .7);margin:.2rem auto;background:#fff;border-spacing:0;border-collapse:collapse;text-align:center;
            td,th{height:.48rem;line-height:.48rem;width:.48rem;border:1px solid #e5e5e5;}
            th{border:none;}
            td.start{background:seagreen;color:#fff;border-color:seagreen;}
            td.end{background:darkred;color:#fff;border-color:darkred;}
            td.dis{pointer-events:none;}
            td.dis.day{background:#efefef;pointer-events:none;color:$gray;}
        }
        #pickerToolBar{
            background:lightgray;border-top:1px solid $gray;border-bottom:1px solid $gray;
            button{padding:.1rem .2rem;color:black;float:left;}
            button:last-child{color:blue;float:right;}
        }
        .slot{font-size:.18rem;width:100%;}
    }
</style>
