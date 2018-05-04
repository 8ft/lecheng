<template>
      <app-layout id="creditCard">
          <img class="banner" src="/CRM/WeChat/App/static/img/creditCard/header.jpg">
          
          <a href="https://bank-static.pingan.com.cn/ca/pc/index.html#/First?channel=WX&onlineSQFlag=N&sign=ecdf3400-d7e7-4e18-bd15-f87eed7e52c465b7d1d6bccec14f0b7960c0894cb211&ccp=3a&cardCatenaNo=06a01a02a03a04a05&versionNo=R10310&scc=233610194&isDisplayRecommend=N&isDisplaySales=Y&bt9=ZY&mt=23SC36100001">
              <img src="/CRM/WeChat/App/static/img/creditCard/pic_card_pingan.png">
              <h1>平安银行 车主卡</h1>
              <p>享加油88折，110万全车人员意外险，全国免费道路救援。</p>
              <button>立即申请</button>
          </a>

          <a href="http://creditcard.ecitic.com/h5/shenqing/chezhu/index.html?sid=SJO734341">
              <img src="/CRM/WeChat/App/static/img/creditCard/pic_card_zhongxin.png">
              <h1>中信银行 车主卡</h1>
              <p>享15%加油金返还，0元洗车，1元机场停车，1000元航班延误险，1500万航空意外伤害险。</p>
              <button>立即申请</button>
          </a>

          <a href="https://creditcard.cmbc.com.cn/wsv2/?enstr=eFI5%2fCxjZMD1oMlD7sxIWlx%2frnd%2bKy%2bBQ9HXafpAtEIrNY81Ds92yNdbNJe5p0wwBfJN%2fpbuQcQwqqq8IXcMv9L9OHlaAM3DUNBJkAxcVTeXXaT4McBZ7dwEQmjGKxhGCsWrEmDNIHdgv5gfsftbkvvf2NGusllapgaNTzjClKErA1X86D523cAMGWhxg%2f%2bv9ReRpXxdVfGvidpkd9soKWz07hH2hjKZL1g9MGY%2b5fY7TkLcOK96QXetyaWQEpjgO%2fgVQFY30B0gJxMsxTE93mPpJLfr8nDTyXA3Km11hhF8KXuY7pLOUiJMra8ITSxmnM1hKgPTL28ZwvJzF6PPig%3d%3d">
              <img src="/CRM/WeChat/App/static/img/creditCard/pic_card_minsheng.jpg">
              <h1>民生银行 车主卡</h1>
              <p>加油享福利：每月最高返500元，全年最高返6000元；停车享优惠：1元机场停车。</p>
              <button>立即申请</button>
          </a>

          <!-- <a href="https://ecentre.spdbccc.com.cn/creditcard/indexActivity.htm?data=P2120316">
              <img src="/CRM/WeChat/App/static/img/creditCard/pic_card_pufabaijin.png">
              <h1>浦发银行 简约白金卡</h1>
              <p>免年费，人气美食享5折，五星级酒店自助餐买一赠一，五星级酒店“住3付2”。</p>
              <button>立即申请</button>
          </a> -->

      </app-layout>
</template>

<style lang="scss">
  @import "~assets/css/var.scss";
  #creditCard{

      a{padding:.2rem .2rem .2rem 1.35rem;position: relative;min-height:.63rem;background:#fff;border-bottom:$border;display:block;
          img{position: absolute;left:.2rem;top:.2rem;width:1rem;}
          h1{color:$black;margin-bottom:.1rem;}
          p{color:$gray;font-size:$h3;}
          button{position:absolute;font-size:$h3;right:.2rem;top:.2rem;border:1px solid #43aae4;color:#43aae4;border-radius:99px;padding:0 .1rem;line-height: .18rem;}
      }
    
  }
</style>
