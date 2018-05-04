<template>
    <app-layout id="mallBuyList">

        <div class="totle clearfix">
            <span>共{{num}}件商品</span>
            <span>￥{{totle}}</span>
        </div>

        <div class="goods-list col1">
            <div class="li" v-for="item in list">
                <img :src="item.img">
                <div>
                    <h1>{{item.title}}</h1>
                    <p>{{item.spec_info}}</p>
                    <h2>￥{{item.price}}</h2>
                    <span>x{{item.quantity}}</span>
                </div>
            </div>
        </div>

    </app-layout>
</template>

<script>
export default {
    data() {
        return {
            totle:0,
            num:0,
            list: []
        };
    },
    activated() {
        let cart=this.$cache.cart;
        this.totle=cart.totle;
        this.num=cart.num;
        this.list = [].concat(cart.origin);
    }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
    #mallBuyList{
        .totle{line-height: .5rem;border-bottom:$border;background:#fff;margin-top:.1rem;padding:0 .2rem;
            span{float:left;}
            span:last-of-type{float:right;color:$mainColor;}
        }
        .li div{position: relative;
            span{position:absolute;right:0;bottom:0;}
        }
    }
</style>