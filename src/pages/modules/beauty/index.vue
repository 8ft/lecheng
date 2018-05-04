<template>
    <app-layout id="beauty">

        <div v-if="list.length===0" class="lc-error">
            <img src="~assets/img/mall/icon_goods_empty.png">
            <p>暂无商品</p>
        </div>
        
        <ul v-else class="goods-list col2">
            <router-link class="li" :to="'/beauty/detail/'+item.cat_id" v-for="item in list">
                <img :src="item.cat_logo">
                <div>
                    <h1 style="height:auto;">{{item.cat_name}}</h1>
                    <h3 style="height:.4rem;overflow:hidden;">{{item.cat_desc}}</h3>
                </div>
            </router-link>
        </ul>

    </app-layout>
</template>

<script>
export default {
    data() {
        return {
          cid:'',
          list:[]
        };
    },
    watch:{
        cid(val){
            if(val){
                this.list=[];
                this.getList();
            }
        }
    },
    mounted(){
        this.getList();
    },
    activated(){
        this.cid=this.$route.query.id;
    },
    methods:{
        async getList(){
            let data={
                    content:{
                        returntype:'allthirdcat',
                        itemtype:'meirong',
                        crmid:this.cid||''
                    }
                },
                res= await this.$post('/mall26/cargoods-category.html',data);

            if (res.errcode === 0) {
                let con=res.content,
                    share=con.share;
                
                let shareData={
                    share_title:share.title,
                    share_desc:share.desc,
                    share_img:share.img,
                    share_url:share.url||location.origin+'/wxwap?#/beauty'
                }
                this.$utils.shareConfig(shareData);

                this.list=con.list;

            }
        }
    }
}
</script>