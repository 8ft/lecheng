<template>
  <app-layout id="my_address">

      <template v-if="list.length>0">

        <lc-cell-swipe v-for="(item,index) in list" :key="item.id" :draggable="!isNotFromMe" :right="[{
                  content: '删除',
                  style: itemStyle,
                  handler:()=>deleteAddr(item.id,index)
                }]">

          <div v-if="isNotFromMe" :class="{'item-radio':true,'on':selected===index}" @click="select(index)"></div>

          <div class="info" :style="!isNotFromMe&&'padding-left:.2rem;width:3.15rem;'">
            <h1>{{item.consignee}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.mobilePhone}}</h1>
            <p><span v-if="item.isDefault">【默认】</span>{{item.proviceName+item.cityName+item.areaName+'   '+item.addressDetail}}</p>
          </div>

          <router-link class="edit" :to="'/address/detail/'+item.id"></router-link>
        </lc-cell-swipe>

      </template>

      <div v-if="list.length===0" class="lc-error">
          <img src="~assets/img/error-empty.png">
          <p>暂无收货地址</p>
      </div>

      <div slot="footer" class="nextOne"><router-link class="btn" to="/address/detail/new">添加新地址</router-link></div>

  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      isNotFromMe:false,
      list:[],
      selected:-1,
      itemStyle:{
        background: 'red',
        color: '#fff',
        padding:'0 .1rem',
        height:'100%',
        display: 'flex',
        'align-items': 'center'
      }
    }
  },
  activated(){
    if(this.$route.query.fromPath!=='me'){this.isNotFromMe=true;}
    this.getList();
  },
  methods:{
    select(index){
      this.selected=index;
      eventBus.$emit('selectAddr',this.list[index]);
      this.$router.go(-1);
    },
    async deleteAddr(id,index){
      let vm=this;
      vm.$messagebox.confirm('确定删除吗').then(async function(action){
          let d={
              content: {
                  mbeid: vm.$cache.user.memberId,
                  id:id,
                  type:"3",
                  mobile:vm.$cache.user.phone,
              }
          };

          let res = await vm.$post('/mall26/addresssave.html',d);
          if(res.content.errcode==0){
            vm.getList();
              // vm.list.splice(index,1);
              // vm.$toast('删除成功');                  
          }
      })
    },  
    async getList(){
     
        let user=this.$cache.user,
          data={
            content:{
              mbeid:user.memberId,
              mobile:user.phone
            }
        }
        let res= await this.$post('/mall26/addresslist.html', data);
        if (res.errcode === 0) {
          this.list=res.content.list;
        }
    }
  }

}

</script>


<style lang="scss">
@import "~assets/css/var.scss";
#my_address{
  .lc-cell{
    margin-bottom: .05rem;
  }
  .lc-cell-swipe-button{
    display: flex;
    align-items: center;
  }
  .lc-cell-wrapper{width:100%;height: .9rem;font-size:$h3;@include box;
    .info{width: 2.55rem;box-sizing:border-box;
      h1{color:$black;font-size:$h2;line-height: .26rem;margin-top:.1rem;margin-bottom: .05rem;}
      p{color:$gray;line-height:.2rem;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;span{color:$mainColor;}}
    }
    
    a{width:.6rem;height:100%;background:url('~assets/img/icon-edit.png') no-repeat center;background-size: .15rem .15rem;}
  }
  .item-radio{display: block;width:.6rem;height:100%;background: url('~assets/img/icon_list_select.png') no-repeat center;background-size:.2rem .2rem;
    &.on{background-image:url('~assets/img/icon_list_select_pressed.png'); }
  }

}
</style>
