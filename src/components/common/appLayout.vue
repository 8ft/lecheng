<template>
    <div class="container" :style="'padding-top:'+top+'px;'+'padding-bottom:'+bottom+'px;'">
        <header id="appHeader">
            <div class="app-title" v-if="title">{{title}}</div>
            <slot name="header"></slot>
        </header>

        <main id="appMain" :class="{'page-content':true,'dis':subPage}">
            <slot></slot>
        </main>

        <div id="appSubPage" v-if="subPage" :style="'top:'+top+'px;'+'bottom:'+bottom+'px;'">
            <slot name="subPage"></slot>
        </div>

        <slot name="aside"></slot>
            
        <footer id="appFooter">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'app-layout',
    props:{
        subPage:{type:Boolean,default:false}
    },
    data() {
        return {
            top:0,
            bottom:0,
            title:''
        };
    },
    mounted(){
        eventBus.$on('layout',()=> {
            this.setPageSize();
        });

        this.setPageSize();
    },
    activated(){
        this.title=this.$cache.page.title;
        this.setPageSize();
    },
    methods:{
        setPageSize(){
            this.$nextTick(function () {
                let header=this.$el.children.appHeader,
                    footer=this.$el.children.appFooter;

                this.top=header?header.clientHeight:0;
                this.bottom=footer?footer.clientHeight:0;
            })
        }
    }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
.container{
  header{position:absolute;top:0;left:0;right:0;z-index: $topFloor;
      .app-title{font-size:.16rem;font-weight:600;color:#fff;text-align:center;background:$mainColor;height:.4rem;line-height:.4rem;}
  }
  #appSubPage{position: absolute;left:0;right:0;z-index: $topFloor;}
  footer{position:absolute;bottom:0;left:0;right:0;z-index: $topFloor;}
}
</style>