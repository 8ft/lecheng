<template>

    <router-link class="order-trail arrow-link" :to="'/orders/trail/'+no">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-'+icons[status]"></use>
        </svg>

        <h1>{{data.trackContent}}</h1>
        <p>{{data.trackTime}}</p>
    </router-link>

</template>

<script>
export default {
  name:'order-ship',
  props:{
    no:{type:String},
    status:{type:Number},
    data:{type:Object}
  },
  data() {
    return {
        icons:['','pay','ongoing','receive','comment','finish','failure','back']
    }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-trail{padding:.16rem .2rem .15rem .53rem;font-size:$h3;background:#fff;display:block;position: relative;
        .icon{position:absolute;font-size:.2rem;left:.21rem;top:.16rem;color:$gray;}
        h1{color:$black;margin-bottom:.09rem;}
        p{color:$gray;}
    }
</style>
