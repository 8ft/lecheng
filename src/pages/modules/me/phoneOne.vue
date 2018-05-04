<template>
    <app-layout id="mePhoneOne">
        <div class="title-box">
            <div class="item-box select">选择验证方式</div>
            <div class="item-box unselect" style="text-indent: .1rem;">安全验证</div>
            <div class="item-box unselect" style="text-indent: .1rem;">换绑手机</div>
        </div>
        <div class="prompt">您正在修改乐橙账户绑定的手机号，请完成身份验证：</div>
        <router-link tag="div" class="list-item" to="/me/phoneTwo">
            <div class="title">通过短信验证码验证</div>
            <div class="right"><span class="arrow"></span></div>
        </router-link>
        <div class="prompt" style="margin-top:.1rem;">当前号码已不用或丢失，请点击<a href="tel:96358" style="color:orangered">我要申诉</a></div>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{

            }
        }
    }
</script>
<style lang="scss">
    #mePhoneOne{
        .title-box{
            height: .45rem;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: -.05rem;
            margin-bottom: .18rem;
            .item-box{
                background: #f2f2f2;
                font-size: .12rem;
                width: .9rem;
                position: relative;
                height: .25rem;
                line-height: .25rem;
                text-align: center;
                color: #88888d;
                margin: 0 .05rem;
                &.unselect{
                    &::before{
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        width:0;
                        height: 0;
                        line-height: 0;
                        border-top: .125rem solid transparent;
                        border-bottom: .125rem solid transparent;
                        border-left: .1rem solid #fff;
                    }
                    &::after{
                        content: '';
                        position: absolute;
                        right: -.1rem;
                        top: 0;
                        width:0;
                        height: 0;
                        line-height: 0;
                        border-top: .125rem solid transparent;
                        border-bottom: .125rem solid transparent;
                        border-left: .1rem solid #f2f2f2;
                    }
                }
                
                &.select{
                    background: orangered;
                    color: #fff;
                    &::after{
                        content: '';
                        position: absolute;
                        right: -.1rem;
                        top: 0;
                        width:0;
                        height: 0;
                        line-height: 0;
                        border-top: .125rem solid transparent;
                        border-bottom: .125rem solid transparent;
                        border-left: .1rem solid orangered
                    }
                }

            }
        }
        .prompt{
            font-size: .12rem;
            color: #88888d;
            padding: 0 5%;
            margin-bottom: .08rem;
        }
        .list-item{
            font-size: .15rem;
            color:#22222d;
            background: #fff;
            border-bottom: 1px solid #f2f2f2;
            height: .44rem;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding: 0 .2rem;
            justify-content: space-between;
            .right{
                flex: 1;
                text-align: right;
                color: #88888d;
                .arrow{
                    position:relative;
                    margin-right: .06rem;
                    margin-left: .1rem;
                    top: .01rem;
                    &::after{position:absolute;content:'';width:0;height:0;top: .02rem;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                    &::before{position:absolute;content:'';width:0;height:0;top: .02rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                }
                .avatar{
                    width: .6rem;
                    height: .6rem;
                    border-radius: 50%;
                    border:1px solid #d7d7d7;
                    background-size: 100% 100%;
                }

            }
        }
        
    }
</style>
