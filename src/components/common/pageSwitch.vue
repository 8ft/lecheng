<template>
    <div class="page-switch">
        <div class="items">
            <div :class="{on:active===index}" @click="switchPage(item.path,index)" v-if="items.length>0" v-for="(item,index) in items">{{item.name}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'page-switch',
    props:{
        items:{type:Array,default:[]},
        active:{type:Number,default:0}
    },
    methods:{
        switchPage(path,index){
            if(this.active!==index){
                this.$router.replace(path);
            }
        }
    }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
.page-switch{background:#fff;padding:.1rem 0;border-bottom:$border;
    .items{@include box;width:2.1rem;line-height: .25rem;margin:0 auto;text-align: center;border-radius:99px;border:1px solid $mainColor;box-sizing:border-box;overflow: hidden;
        div{@include flex;color:$mainColor;
            &.on{background:$mainColor;color:#fff;}
        }
    }
}
</style>