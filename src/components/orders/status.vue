<template>
    <div class="order-status">
        订单{{statusTxt[data.status]}}
        <div :class="'status'+data.status"></div>
    </div>

</template>

<script>
export default {
  name:'order-status',
  props:{
    data:{type:Object}
  },
  data() {
    return {
        statusTxt:['','待付款','进行中','待收货','待评价','已完成','已取消','取消中']
    }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-status{padding:0 .4rem;color:#fff;line-height:.75rem;display:block;background: url('~assets/img/orders/order_status_bg.png') no-repeat center;background-size:cover;position: relative;
        div{width:.5rem;height:.4rem;position:absolute;top:.18rem;right:.46rem;background:url('~assets/img/orders/status/1.png') no-repeat center;background-size:cover;
            &.status1{background-image: url('~assets/img/orders/status/1.png');}
            &.status2{background-image: url('~assets/img/orders/status/2.png');}
            &.status3{background-image: url('~assets/img/orders/status/3.png');}
            &.status4{background-image: url('~assets/img/orders/status/4.png');}
            &.status5{background-image: url('~assets/img/orders/status/5.png');}
            &.status6{background-image: url('~assets/img/orders/status/7.png');}
            &.status7{background-image: url('~assets/img/orders/status/6.png');}
        }
    }
</style>
