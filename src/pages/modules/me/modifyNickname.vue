<template>
    <app-layout id="meModifyNickname">
        <div class="nickname-box">
            <input type="text" placeholder="修改昵称" v-model="nickname">
        </div>
        <div class="prompt">此昵称非真实姓名，仅用于发现评论等场景使用</div>
        <div class="save" @click="changeInfo">保存</div>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                nickname:this.$cache.user.nickname
            }
        },
        methods:{
            async changeInfo(){
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        name:this.$cache.user.name,
                        nickname:this.nickname,
                        sex:this.$cache.user.sex,
                        birthday:this.$cache.user.brithday
                    }
                };
                let res = await this.$post('/CRM/appmembermgcust/updatememberinfo.json',d);
                if(res.errcode==0){
                    this.$toast('修改成功')
                    this.$cache.user.nickname=this.nickname;
                    this.$router.go(-1)
                }
            },
        }
    }
</script>
<style lang="scss">
    #meModifyNickname{
        .nickname-box{
            background: #fff;
            height: .4rem;
            display: flex;
            align-items: center;
            input{
                height: .2rem;
                width: 95%;
                margin-left: 2.5%;
                &:focus{
                    border: 0;
                    outline: 0
                }
            }
        }
        .prompt{
            font-size: .11rem;
            color: #ccc;
            margin: .05rem 2.5%;
        }
        .save{
            width: 95%;
            margin:  auto;
            height: .4rem;
            border-radius: 6px;
            line-height: .4rem;
            color: #fff;
            font-size: .15rem;
            background: orangered;
            text-align: center
        }
    }
</style>
