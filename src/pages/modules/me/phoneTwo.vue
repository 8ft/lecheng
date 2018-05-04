<template>
    <app-layout id="mePhoneTwo">
        <div class="title-box">
            <div class="item-box">选择验证方式</div>
            <div class="item-box select" style="text-indent: .1rem;">安全验证</div>
            <div class="item-box unselect" style="text-indent: .1rem;">换绑手机</div>
        </div>
        <div class="fill-box">
            <div class="input-box" style="margin-bottom:.05rem">
                <img src="~assets/img/me/icon_input_password@2x.png" alt="">
                <input type="text" placeholder="请输入手机号码" readonly :value="$cache.user.phone">
            </div>
            <div class="input-box">
                <img src="~assets/img/me/icon-_input_message@2x.png" alt="">
                <input type="text" placeholder="请输入验证码" v-model="code" @keyup="keyUpnum(code)">
                <div class="code" v-if="!clickCode" @click="sendCode">获取验证码</div>
                <div class="code unclick" v-else>{{codeTime}}s</div>
            </div>
        </div>
        <div class="binding unclick" v-if="code==''">验证后绑定新号码</div>
        <div class="binding"  v-else @click="verification">验证后绑定新号码</div>
        <div class="video-code" v-if="!clickVideo" @click="sendVideo">收不到短信？使用<span style="color:orangered">语音验证码</span></div>
        <div class="video-code" v-else>语音验证码已经发送，{{videoCode}}秒后重新发送</div>
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                code:'',
                codeTime:60,
                videoTime:60,
                clickCode:false,
                clickVideo:false
            }
        },
        methods:{
            keyUpnum(num){
                if(num){
                    this.code=num.replace(/\D/g,'')
                }
            },
            async sendCode(){ 
                let d={
                    content: {
                        mobilephone:this.$cache.user.phone,
                        status:2
                    }
                };
                let res = await this.$post('/CRM/appcustlogin/sendsms.json',d);
                if(res.errcode==0){
                    this.clickCode=true;
                    this.$toast('发送成功');
                    let clear=setInterval(()=>{
                        if(this.codeTime==0){
                            this.codeTime=60;
                            this.clickCode=false;
                            clearInterval(clear)
                        }
                        this.codeTime--;
                    },1000)
                } 
            },
            async sendVideo(){
                let d={
                    content: {
                        mobilephone:this.$cache.user.phone,
                        status:2
                    }
                };
                let res = await this.$post('/CRM/appcustlogin/sendVoiceVerify.json',d);
                if(res.errcode==0){

                    this.$toast('发送成功');
                    
                } 
            },
            async verification(){
                let d={
                    content: {
                        mobilephone:this.$cache.user.phone,
                        verifyCode:this.code

                    }
                };
                let res = await this.$post('/CRM/appcustlogin/VerifyCodeVerification.json',d);
                if(res.errcode==0){
                    this.$router.push({path:'/me/phoneThree'})
                } 
            }
        }
    }
</script>
<style lang="scss">
    #mePhoneTwo{
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
                &:first-child{
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
                        border-left: .1rem solid #f2f2f2;
                    }
                }
                &.unselect{
                    
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
        .fill-box{
            width: 90%;
            margin-left: 5%;
            
            .input-box{
                display: flex;
                align-items: center;
                height: .44rem;
                border-radius: 6px;
                background: #fff;
                padding-right: .1rem;
                box-sizing: border-box;
                img{
                    height: .15rem;
                    margin: 0 .14rem 0 .18rem;
                }
                input{
                    outline: none;
                    flex: 1
                }
                .code{
                    color: #fff;
                    height: .25rem;
                    line-height: .25rem;
                    border-radius: 4px;
                    width: .75rem;
                    text-align: center;
                    font-size: .13rem;
                    background: orangered;
                    &.unclick{
                        background: #c9c9c9;
                    }
                }
            }
        }
        .binding{
            width: 90%;
            margin:  auto;
            height: .4rem;
            border-radius: 6px;
            line-height: .4rem;
            color: #fff;
            font-size: .15rem;
            background: orangered;
            text-align: center;
            margin-top: .18rem;
            &.unclick{
                background: #c9c9c9;
                color: #fff;
            }
        }
        .video-code{
            float:right;
            color: #afafaf;
            margin-right: 5%;
            font-size: .1rem;
            margin-top: .1rem
        }
    }
</style>

