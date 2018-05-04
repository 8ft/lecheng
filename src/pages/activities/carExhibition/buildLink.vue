<template>
  <app-layout id="carExhibition_buildLink">

    <div class="serverInfo">
          <div class="profile"><img :src="data.headSculpture?data.headSculpture:default_profile"></div>
          <div class="info">
              <p><span>姓名：</span>{{data.name}}</p>
              <p><span>电话：</span>{{data.mobilePhone}}</p>
              <p><span>4S店：</span>{{data.belong4sName}}</p>
          </div>
    </div>
    
    <div class="tip">请核对销售顾问信息是否正确，如需修改请联系本店客服经理，在乐橙系统后台修改销售顾问信息。</div>

    <div slot="footer" class="nextOne"><router-link class="btn" :to="link">生成专属链接</router-link></div>

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        data: {},
        link: '',
        default_profile: require('assets/img/default_user.png')
      }
    },
    activated() {
      this.getData();
    },
    deactivated() {
      this.data = {};
      this.link = '';
    },
    methods: {
      async getData () {
        let d = {
          content: {
            id: this.$route.query.aid,
            workNumber: this.$route.query.wid
          }
        };

        let res = await this.$post('/CRM/wechatautoshow/querySalesConsultantInfo.json', d);
        if (res.errcode == 0) {
          this.data = res.content;
          this.link = '/carExhibition?aid=' + this.$route.query.aid + '&sid=' + this.data.consultantId;
        } else if (res.errcode == 9) {
          this.$messagebox.alert('您的员工账号尚未创建，请联系本店客服经理在乐橙系统中创建后再登录。').then(action => {
            this.$router.go(-1);
          });
        }
      }
    }
  }
</script>


<style lang="scss">
    @import "~assets/css/var.scss";

    #carExhibition_buildLink{font-size:$h3;padding-bottom:.51rem;

      .serverInfo{border-radius:4px;padding:.2rem;width:90%;margin:.2rem auto;padding-left:1.25rem;position:relative;background:#fff;box-sizing:border-box;
        .profile{position:absolute;width:.6rem;height:.6rem;left:.325rem;top:.3rem;border-radius:99px;overflow:hidden;
          img{width:100%;margin-top: -.05rem;}
        }
        .info{padding-left:.25rem;border-left:1px dotted hsla(0,0%,93%,.6);
          span{color:$gray;}
          p{margin-bottom:.1rem;@include bold;}
        }
        
      }

      .tip{color:#e73828;width:90%;margin:0 auto;line-height:.24rem;
          &:before{ vertical-align: middle;content:'';display:inline-block;width:.13rem;height:.13rem;background:url('~assets/img/carExhibition/icon_notice.png') no-repeat center;background-size:100%;margin-right:.05rem;}
      }

    }
</style>