<template>
  <app-layout id="mall_cart">
      <div v-if="list.length===0" class="lc-error">
          <img src="~assets/img/mall/icon_goods_empty.png">
          <p>暂无商品</p>
      </div>

      <div id="header" slot="header" :class="list.length>0?'':'hide'">
        共{{totleNum}}件商品
        <button @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</button>
      </div>

      <template v-if="list.length>0">

        <lc-cell-swipe v-for="item in list" :key="item.cart_id" :right="[{
                  content: '删除',
                  style: { background: 'red', color: '#fff','line-height':'1rem',padding:'0 .1rem' },
                  handler:()=>deleteItems([item.cart_id])
                }]">

          <div :class="{'item-radio':true,'on':selected.indexOf(item.cart_id)>=0,'dis':(!item.valid&&!isEdit)}" @click="select(item)"></div>

          <router-link class="item-info" :to="'/mall/cargoods/'+item.item_id">
            <div class="img">
              <img :src="item.img">
              <div v-if="item.valid&&item.store<item.quantity">库存不足</div>
            </div>
            
            <h1>{{item.title}}</h1>
            <p>{{item.spec_info||''}}</p>
            <span v-if="item.valid">￥{{parseFloat(item.price).toFixed(2)}}</span>
          </router-link>

          <div :class="{amount:true}" v-if="item.valid">
            <button @click.stop="minus(item)">-</button>
            <input class="dis" type="text" v-model="item.quantity">
            <button @click.stop="plus(item)">+</button>
          </div>

          <div v-if="!item.valid" class="amount">已失效</div>
        </lc-cell-swipe>

      </template>

      <div id="footer" slot="footer" :class="list.length>0?'':'hide'">
        <div :class="{'item-radio':true,'on':selectedAll}" @click="selectAll"></div>
        <template v-if="!isEdit">总计：<span>￥{{curent}}</span></template>
        <button :class="{next:true,dis:selected.length===0}" v-if="!isEdit" @click="next(selected)">去结算</button>
        <button class="del" v-if="isEdit" @click="deleteItems(selected)">删除</button>
      </div>

  </app-layout>
</template>

<script>
export default {
  name:'ex-cart',
  data() {
    return {
      all:[],
      available:[],
      totle:0,
      totleNum:0,

      list:[],
      selected:[],
      updated:[],
      curent:0,

      selectedAll:false,
      isEdit:false
    }
  },
  watch:{
    isEdit(val){
      this.selected=[];
      this.curent=0;
      this.selectedAll=false;
    }
  },
  mounted(){
    this.getList();
  },
  beforeRouteLeave(to,from,next){
    this.update(next);
  },
  methods:{
    select(item){
      let index=this.selected.indexOf(item.cart_id);
          
      if(index>=0){
        this.selected.splice(index,1);
        this.curent=this.$np.minus(this.curent,this.$np.times(item.quantity,item.price));
        this.selectedAll=false;
      }else{
        this.selected.push(item.cart_id);
        this.curent=this.$np.plus(this.curent,this.$np.times(item.quantity,item.price));

        let len=this.selected.length;
        if(len===this.all.length||len===this.available.length){
          this.selectedAll=true;
        }
      }
    },
    selectAll(){
      if(this.selectedAll){
        this.selected=[];
        this.curent=0;
        this.selectedAll=false;
      }else{
        if(this.isEdit){
          this.selected=[].concat(this.all);
        }else{
          this.selected=[].concat(this.available);
          this.curent=this.totle;
        }
        this.selectedAll=true;
      }
    },
    minus(item){
      let num=item.quantity;
      if(num>1){

        let diff=1,
          diffPrice=0;

        if(item.store<num){
          diff=Math.abs(item.store-num);
        }
        
        diffPrice=this.$np.times(item.price,diff);
        item.quantity-=diff;
        this.totle=this.$np.minus(this.totle,diffPrice);

        if(this.selected.indexOf(item.cart_id)>=0){
          this.curent=this.$np.minus(this.curent,diffPrice);
        }
        
        this.recordUpdate(item.cart_id);
      }
    },
    plus(item){
      item.quantity+=1;
      this.totle=this.$np.plus(this.totle,item.price);

      if(this.selected.indexOf(item.cart_id)>=0){
        this.curent=this.$np.plus(this.curent,item.price);
      }

      this.recordUpdate(item.cart_id);
    },
    async deleteItems(ids){
      if(ids.length===0){
        this.$toast('请选择要删除的商品');
      }else{
        let user=this.$cache.user,
          data={
            content:{
              cart_id:ids.join(','),
              mbeid:user.memberId,
              mobile:user.phone
            }
        };
        let res= await this.$post('/mall26/cart-remove.html', data);
        if (res.errcode === 0) {
          this.list=this.list.filter(item => ids.indexOf(item.cart_id)<0);
          this.calculate(this.list);
          this.$toast('删除成功');
        }
      }
    },
    recordUpdate(id){
      if(this.updated.indexOf(id)<0){
        this.updated.push(id);
      }
    },
    async update(next){
      let changed=this.updated,
          cLen=changed.length,
          newArr=[];

      if(cLen>0){
        newArr=this.list.filter(item => changed.indexOf(item.cart_id)>=0);
        newArr=newArr.map(function(item){
            return {cartid:item.cart_id,cart_num:item.quantity}
        });
      }

      let user=this.$cache.user,
          data={
            content:{
              mbeid:user.memberId,
              mobile:user.phone,
              cartlist:newArr
            }
        };
      let res= await this.$post('/mall26/cart-update.html', data);
      if (res.errcode === 0) {
        next();
      }
    },
    next(ids){
      if(ids.length===0){
        this.$toast('请选择要结算的商品');
      }else{
        let goods=[],
            originGoods;
        originGoods=this.list.filter(item => ids.indexOf(item.cart_id)>=0);
        goods=originGoods.map(function(item){
            return {cart_id:item.cart_id,cart_num:item.quantity}
        });

        let cart={
          goods:goods
        };
        
        this.$cache.cart=cart;
        this.$router.push('./order');
      }
    },
    async getList(){
     
        let user=this.$cache.user,
          data={
            content:{
              mbeid:user.memberId,
              mobile:user.phone
            }
        }
        let res= await this.$post('/mall26/cart-list.html', data);
        if (res.errcode === 0) {
          this.calculate(res.content.cartData.items);
        }
    },
    calculate(list){
      if(list){
          let totle=0,
              num=0,
              all=[],
              available=[],
              item;

          for(let i=0;i<list.length;i++){
            item=list[i];
            if(item.valid){
              totle=this.$np.plus(totle,this.$np.times(item.quantity,item.price));
              available.push(item.cart_id);
            }
            num+=item.quantity;
            all.push(item.cart_id);
          }

          this.list =list;
          this.totle=totle;
          this.totleNum=num;
          this.all=[].concat(all);
          this.available=[].concat(available);
      }
    }
  }

}

</script>



<style lang="scss">
@import "~assets/css/var.scss";
#mall_cart{
  .lc-cell-wrapper {width:100%;height: 1rem;padding:.1rem .2rem .1rem .48rem;box-sizing:border-box;display:block;position: relative;overflow: hidden;zoom:1;font-size:$h3;
    .item-info{display: block;width: 100%;height: 100%;}
    .img{height:.8rem;width:.8rem;float: left;margin-right:.1rem;position: relative;
      img{width:100%;height:100%;}
      div{position: absolute;bottom:0;left:0;right:0;font-size:$h3;line-height: .2rem;text-align: center;color:#fff;background: rgba(235,123,88,.9);}
    }
    
    h1{color:$black;max-height: .32rem;overflow: hidden;}
    p{color:$gray;margin-top:.05rem;}
    span{color:$mainColor;position:absolute;bottom:.1rem;left:1.35rem;}

    .amount{position: absolute;bottom:.1rem;right:.2rem;
      button{display: inline-block;width:.3rem;height:.25rem;border:$border;}
      input{display: inline-block;width:.3rem;height:.25rem;text-align: center;color:$black;border:$border;}
    }
  }

  .item-radio{display: block;position:absolute;width:.48rem;height:100%;top:0;left:0;background: url('~assets/img/icon_list_select.png') no-repeat center;background-size:.2rem .2rem;
    &.on{background-image:url('~assets/img/icon_list_select_pressed.png'); }
    &.dis{background: none;}
  }

  #header{height:.5rem;line-height: .5rem;background:#fff;font-size:$h2;border-bottom:$border;padding:0 .2rem;
    button{float:right;}
  }
  #appMain{padding:.1rem 0;}

  #footer{height:.5rem;line-height: .5rem;background:#fff;padding-left:.48rem;font-size:$h2;border-top:$border;
    span{color:$mainColor;}
    button{float:right;
      &.next{background:$mainColor;height: 100%;width:1.1rem;color:#fff;}
      &.del{color:$mainColor;border:1px solid $mainColor;border-radius: 3px;height:.3rem;margin-top:.1rem;margin-right:.2rem;padding:0 .2rem;line-height: .3rem;}
    }
  }

  .hide{visibility: hidden;}
}
</style>
