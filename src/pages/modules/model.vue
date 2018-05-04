<template>
    <app-layout id="model">

        <ul class="list">
            <li v-for="(value,key) in listItems" class="arrow" v-on:click="brandId=subId=key;">
                <div>
                {{key}}
                </div>
            </li>
        </ul>

        <div slot="aside" v-for="(value,key) in listItems" :class="'container subList '+(subId==key?'':'moveout')">
            <ul class="page-content list">
                <li v-for="item in value" v-on:click="select(sid,item.id,item.realName)">
                <div>{{item.name}}</div>
                </li>
            </ul>
        </div>

        <div slot="aside" id="brands_cover" class="cover" v-if="brandId!=''" v-on:click="subId=''"></div>

    </app-layout>
</template>

<script>
    export default {
      name:'ex-model',
      data(){
          return{
              listItems:{},
              bid:'',
              sid:'',
              subId:'',
              brandId:''
          }
      },
      mounted() {
        this.sid=this.$route.query.sid;
        this.getModels();
      },
      watch: {
        subId(val) {
          if (val==='') {
            setTimeout(() => {
              this.brandId = '';
            }, 300);
          }
        }
      },
      methods: {
        async getModels(){
            let res=await this.$post('/CRM/appcartype/queryTypes.json',{content:{carSeriesId: this.sid}});
            if (res.errcode == 0) {
                let con=res.content,
                    data=res.content.carTypeList,
                    newData={},
                    name='',
                    di;

                for(let i=0;i<data.length;i++){
                    di=data[i];
                    name=di.name.substring(0,5);

                    if(newData[name]){
                        newData[name].push({id:di.id,name:di.name.substr(6),realName:di.name});                  
                    }else{
                        newData[name]=[{id:di.id,name:di.name.substr(6),realName:di.name}];
                    }
                }

                this.listItems=newData;
                this.bid=con.brandId;
            }
        },
        select(sid,mid,name){
            let brand=this.$cache.brand;
            brand.bid=this.bid;
            brand.sid=sid;
            brand.mid=mid;
            brand.name=name;
            this.$router.go(-2);
        }

      }
    }


</script>
