/* ==== 一级页面 ============================================================== */

const home = resolve => require(['../pages/home.vue'], resolve)
const fourS = resolve => require(['../pages/fourS.vue'], resolve)
const mall = resolve => require(['../pages/mall.vue'], resolve)
const me = resolve => require(['../pages/me.vue'], resolve)




/* ==== 模块 ============================================================== */

//4s店
const fourS_detail = resolve => require(['../pages/modules/fourS/detail.vue'], resolve)
const fourS_cargoods = resolve => require(['../pages/modules/fourS/cargoods.vue'], resolve)
const fourS_comments = resolve => require(['../pages/modules/fourS/comments.vue'], resolve)

//合作商家
const partners = resolve => require(['../pages/modules/partners/index.vue'], resolve)
const partner_detail = resolve => require(['../pages/modules/partners/detail.vue'], resolve)
const partner_goods = resolve => require(['../pages/modules/partners/goods.vue'], resolve)
const partner_comments = resolve => require(['../pages/modules/partners/comments.vue'], resolve)

//商城
const mall_cargoodsCategory = resolve => require(['../pages/modules/mall/cargoods/category.vue'], resolve)
const mall_cargoods= resolve => require(['../pages/modules/mall/cargoods/list.vue'], resolve)
const mall_cargoodsDetail = resolve => require(['../pages/modules/mall/cargoods/detail.vue'], resolve)

const mall_carCategory = resolve => require(['../pages/modules/mall/car/category.vue'], resolve)
const mall_car = resolve => require(['../pages/modules/mall/car/list.vue'], resolve)
const mall_carDetail = resolve => require(['../pages/modules/mall/car/detail.vue'], resolve)

const mall_cart = resolve => require(['../pages/modules/mall/cart.vue'], resolve)
const mall_order = resolve => require(['../pages/modules/mall/order.vue'], resolve)
const mall_orderCar = resolve => require(['../pages/modules/mall/orderCar.vue'], resolve)
const mall_buyList = resolve => require(['../pages/modules/mall/buyList.vue'], resolve)
const mall_collection = resolve => require(['../pages/modules/mall/collection.vue'], resolve)
const mall_ruleReturn = resolve => require(['../pages/modules/mall/ruleReturn.vue'], resolve)
const mall_ruleNewCar = resolve => require(['../pages/modules/mall/ruleNewCar.vue'], resolve)

//美容
const beauty = resolve => require(['../pages/modules/beauty/index.vue'], resolve)
const beauty_detail = resolve => require(['../pages/modules/beauty/detail.vue'], resolve)
const beauty_order = resolve => require(['../pages/modules/beauty/order.vue'], resolve)

//我的
const me_account = resolve => require(['../pages/modules/me/account.vue'], resolve)
const me_memberRights = resolve => require(['../pages/modules/me/memberRights.vue'], resolve)
const me_modifyNickname = resolve => require(['../pages/modules/me/modifyNickname.vue'], resolve)
const me_phoneOne = resolve => require(['../pages/modules/me/phoneOne.vue'], resolve)
const me_phoneTwo = resolve => require(['../pages/modules/me/phoneTwo.vue'], resolve)
const me_phoneThree = resolve => require(['../pages/modules/me/phoneThree.vue'], resolve)

const me_money = resolve => require(['../pages/modules/me/money.vue'], resolve)
const me_point = resolve => require(['../pages/modules/me/point.vue'], resolve)

//我的车库
const myCars = resolve => require(['../pages/modules/myCars/index.vue'], resolve)
const myCars_detail = resolve => require(['../pages/modules/myCars/detail.vue'], resolve)
const myCars_repair = resolve => require(['../pages/modules/myCars/repair.vue'], resolve)
const myCars_safe = resolve => require(['../pages/modules/myCars/safe.vue'], resolve)
const myCars_safeDetail = resolve => require(['../pages/modules/myCars/safeDetail.vue'], resolve)
const myCars_setMaintainRemind = resolve => require(['../pages/modules/myCars/setMaintainRemind.vue'], resolve)
const myCars_maintainRemind = resolve => require(['../pages/modules/myCars/maintainRemind.vue'], resolve)
const myCars_setSafeRemind = resolve => require(['../pages/modules/myCars/setSafeRemind.vue'], resolve)
const myCars_safeRemind = resolve => require(['../pages/modules/myCars/safeRemind.vue'], resolve) 
const myCars_setCheckRemind = resolve => require(['../pages/modules/myCars/setCheckRemind.vue'], resolve)
const myCars_checkRemind = resolve => require(['../pages/modules/myCars/checkRemind.vue'], resolve)

// 订单
const orders = resolve => require(['../pages/modules/orders/index.vue'], resolve)
const orders_detail = resolve => require(['../pages/modules/orders/detail.vue'], resolve)
const orders_pay = resolve => require(['../pages/modules/orders/pay.vue'], resolve)
const orders_paid = resolve => require(['../pages/modules/orders/paid.vue'], resolve)
const orders_shipping = resolve => require(['../pages/modules/orders/shipping.vue'], resolve)
const orders_trail = resolve => require(['../pages/modules/orders/trail.vue'], resolve)
const orders_comment = resolve => require(['../pages/modules/orders/comment.vue'], resolve)

//天气
const weather = resolve => require(['../pages/modules/weather/index.vue'], resolve)
const weather_area = resolve => require(['../pages/modules/weather/area.vue'], resolve)

//套餐
const package_index = resolve => require(['../pages/modules/package/index.vue'], resolve)
const package_detail = resolve => require(['../pages/modules/package/detail.vue'], resolve)

// 服务顾问
const server_detail = resolve => require(['../pages/modules/servers/detail.vue'], resolve)
const server_list = resolve => require(['../pages/modules/servers/list.vue'], resolve)

// 销售顾问
const salesConsultant = resolve => require(['../pages/modules/salesConsultant/index.vue'], resolve)

//用户
const signUp = resolve => require(['../pages/modules/user/signUp.vue'], resolve)
const setPwd = resolve => require(['../pages/modules/user/setPwd.vue'], resolve)

//保养手册
const manual = resolve => require(['../pages/modules/manual/index.vue'], resolve)
const manual_chooseCars = resolve => require(['../pages/modules/manual/chooseCars.vue'], resolve)

//用车百科
const carWiki = resolve => require(['../pages/modules/carWiki/index.vue'], resolve)
const carWiki_detail = resolve => require(['../pages/modules/carWiki/detail.vue'], resolve)

//邀请有礼
const invite = resolve => require(['../pages/modules/invite/index.vue'], resolve)
const inviteRule = resolve => require(['../pages/modules/invite/rule.vue'], resolve)
const inviteRank = resolve => require(['../pages/modules/invite/rank.vue'], resolve)

//老荐新
const recommendBuyers = resolve => require(['../pages/modules/recommendBuyers/index.vue'], resolve)
const recommendBuyers_recommend = resolve => require(['../pages/modules/recommendBuyers/recommend.vue'], resolve)
const recommendBuyers_records = resolve => require(['../pages/modules/recommendBuyers/records.vue'], resolve)
const recommendBuyers_rewards = resolve => require(['../pages/modules/recommendBuyers/rewards.vue'], resolve)
const recommendBuyers_fourS = resolve => require(['../pages/modules/recommendBuyers/fourS.vue'], resolve)
const recommendBuyers_brands = resolve => require(['../pages/modules/recommendBuyers/brands.vue'], resolve)
const recommendBuyers_detail = resolve => require(['../pages/modules/recommendBuyers/record_detail.vue'], resolve)
const recommendBuyers_rule = resolve => require(['../pages/modules/recommendBuyers/rule.vue'], resolve)
const recommendBuyers_rank = resolve => require(['../pages/modules/recommendBuyers/rank.vue'], resolve)
const recommendBuyers_share = resolve => require(['../pages/modules/recommendBuyers/share.vue'], resolve)

//违章查询
const peccancy = resolve => require(['../pages/modules/peccancy/index.vue'], resolve)
const peccancy_add = resolve => require(['../pages/modules/peccancy/add.vue'], resolve)
const peccancy_map = resolve => require(['../pages/modules/peccancy/map.vue'], resolve)
const peccancy_result = resolve => require(['../pages/modules/peccancy/result.vue'], resolve)
const peccancy_agreement = resolve => require(['../pages/modules/peccancy/agreement.vue'], resolve)

//维保预约
const maintenance = resolve => require(['../pages/modules/maintenance/index.vue'], resolve)
const maintenance_date = resolve => require(['../pages/modules/maintenance/date.vue'], resolve)
const maintenance_guideDetail = resolve => require(['../pages/modules/maintenance/guideDetail.vue'], resolve)

//优惠券
const coupon = resolve => require(['../pages/modules/coupon/index.vue'], resolve)
const coupon_mine = resolve => require(['../pages/modules/coupon/mine.vue'], resolve)
const coupon_details = resolve => require(['../pages/modules/coupon/details.vue'], resolve)
const coupon_welfare = resolve => require(['../pages/modules/coupon/welfare.vue'], resolve)
const coupon_applystore = resolve => require(['../pages/modules/coupon/applystore.vue'], resolve)

//收货地址
const address = resolve => require(['../pages/modules/address/index.vue'], resolve)
const address_detail = resolve => require(['../pages/modules/address/detail.vue'], resolve)

//地图
const map = resolve => require(['../pages/modules/map.vue'], resolve)

//信用卡
const creditCard = resolve => require(['../pages/modules/creditCard/index.vue'], resolve)

//文章
const article = resolve => require(['../pages/modules/article.vue'], resolve)

//试驾
const testDrive = resolve => require(['../pages/modules/testDrive/index.vue'], resolve)
const testDrive_brands = resolve => require(['../pages/modules/testDrive/brands.vue'], resolve)


//内嵌容器
const frame = resolve => require(['../pages/modules/frame.vue'], resolve)

const bindCar = resolve => require(['../pages/modules/bindCar.vue'], resolve)
const brands = resolve => require(['../pages/modules/brands.vue'], resolve)
const model = resolve => require(['../pages/modules/model.vue'], resolve)



/* ==== 活动 ================================================================= */

//车展活动
const carExhibition = resolve => require(['../pages/activities/carExhibition/index.vue'], resolve)
const carExhibition_signUp = resolve => require(['../pages/activities/carExhibition/signUp.vue'], resolve)
const carExhibition_orders = resolve => require(['../pages/activities/carExhibition/orders.vue'], resolve)
const carExhibition_orderDetail = resolve => require(['../pages/activities/carExhibition/orderDetail.vue'], resolve)
const carExhibition_serverLogin = resolve => require(['../pages/activities/carExhibition/serverLogin.vue'], resolve)
const carExhibition_buildLink = resolve => require(['../pages/activities/carExhibition/buildLink.vue'], resolve)

//转盘抽奖
const lottery = resolve => require(['../pages/activities/lottery/index.vue'], resolve)
const lotteryRecords = resolve => require(['../pages/activities/lottery/records.vue'], resolve)
const lotteryAddInfo = resolve => require(['../pages/activities/lottery/addInfo.vue'], resolve)

//欢乐购
const happyGo = resolve => require(['../pages/activities/happyGo/index.vue'], resolve)
const happyGoRule = resolve => require(['../pages/activities/happyGo/rule.vue'], resolve)

//助力红包
const helpRed = resolve => require(['../pages/activities/helpRed/index.vue'], resolve)
const helpRedMyRed = resolve => require(['../pages/activities/helpRed/myRed.vue'], resolve)
const helpRedHelp = resolve => require(['../pages/activities/helpRed/help.vue'], resolve)
const helpRedRecord = resolve => require(['../pages/activities/helpRed/record.vue'], resolve)

//服务节
const serviceDay = resolve => require(['../pages/activities/serviceDay/index.vue'], resolve)

/* *
 * meta 说明
 *   1.title            页面标题（undifined->隐藏）
 *   2.resetTitle       是否重置标题（隐藏标题栏）
 *   3.hasTabBar        底部TabBar（undifined->隐藏）
 *   4.transition       页面过渡动画（默认：'fade',目前可选'slide'）
 *   5.requireAuth      是否需要登录(默认：true)
 *   6.share            1.true 定制的分享内容  2.false 不可分享  3.undefined 默认分享内容
 *   7.geolocation      是否需要地理定位
  */
export default [
  /* ==== 首页 ============================================================== */
  {
    path: '',
    redirect: '/home'
  }, {
    path: '/home',
    meta: {
      title:'盈众乐橙汇',
      hasTabBar: true,
      geolocation:true
    },
    component: home
  },



  /* ==== 商城 ================================================================ */
  {
    path: '/mall',
    meta: {
      resetTitle: '盈众乐橙商城',
      hasTabBar: true,
      requireAuth: false
    },
    component: mall
  },
  
  //新车
  {
    path: '/mall/carCategory/:type',
    meta: {
      resetTitle: '盈众乐橙商城',
      requireAuth: false
    },
    component: mall_carCategory
  },{
    path: '/mall/car',
    meta: {
      resetTitle: '新车列表',
      requireAuth: false
    },
    component: mall_car
  },{
    path: '/mall/car/:id',
    meta: {
      resetTitle: '新车详情',
      requireAuth: false,
      share:false
    },
    component: mall_carDetail
  },
  
  //车品
  {
    path: '/mall/cargoodsCategory/:type',
    meta: {
      resetTitle: '盈众乐橙商城',
      requireAuth: false
    },
    component: mall_cargoodsCategory
  },{
    path: '/mall/cargoods',
    meta: {
      resetTitle: '车品列表',
      requireAuth: false
    },
    component: mall_cargoods
  },{
    path: '/mall/cargoods/:id',
    meta: {
      resetTitle: '商品详情',
      requireAuth: false,
      share:false
    },
    component: mall_cargoodsDetail
  },
  
  {
    path: '/mall/cart',
    meta: {
      resetTitle: '我的购物车'
    },
    component: mall_cart
  },{
    path: '/mall/order',
    meta: {
      resetTitle: '确认订单',
      share:false
    },
    component: mall_order
  },{
    path: '/mall/orderCar',
    meta: {
      resetTitle: '确认订单',
      share:false
    },
    component: mall_orderCar
  },{
    path: '/mall/buyList',
    meta: {
      resetTitle: '商品清单'
    },
    component: mall_buyList
  },{
    path: '/mall/collection',
    meta: {
      resetTitle: '我的收藏'
    },
    component: mall_collection
  },{
    path: '/mall/ruleReturn',
    meta: {
      resetTitle: '退货说明',
      requireAuth: false,
      share: false
    },
    component: mall_ruleReturn
  },{
    path: '/mall/ruleNewCar',
    meta: {
      resetTitle: '乐橙新车条款',
      requireAuth: false,
      share: false
    },
    component: mall_ruleNewCar
  },

  //美容
  {
    path: '/beauty',
    meta: {
      resetTitle: '做美容',
      share:true
    },
    component:beauty
  },{
    path: '/beauty/detail/:id',
    meta: {
      resetTitle: '服务详情',
      share:false
    },
    component: beauty_detail
  },{
    path: '/beauty/order',
    meta: {
      resetTitle: '确认订单',
      share:false
    },
    component: beauty_order
  },



  /* ==== 我的 ================================================================= */
  {
    path: '/me',
    meta: {
      resetTitle: '个人中心',
      hasTabBar: true
    },
    component: me
  },{
    path: '/me/memberRights',
    meta: {
      resetTitle: '会员权益'
    },
    component: me_memberRights
  },{
    path: '/me/rightDetail',
    meta: {
      resetTitle: '权益详情',
    },
    component:frame
  },{
    path: '/me/account',
    meta: {
      resetTitle: '我的账号'
    },
    component: me_account
  },{
    path: '/me/modifyNickname',
    meta: {
      resetTitle: '修改昵称',
      transition: 'slide',
    },
    component: me_modifyNickname
  },{
    path: '/me/phoneOne',
    meta: {
      resetTitle: '选择验证方式',
      transition: 'slide',
    },
    component: me_phoneOne
  },{
    path: '/me/phoneTwo',
    meta: {
      resetTitle: '安全验证',
      transition: 'slide',
    },
    component: me_phoneTwo
  },{
    path: '/me/phoneThree',
    meta: {
      resetTitle: '换绑手机',
      transition: 'slide',
    },
    component: me_phoneThree
  },
  

  /* ==== 活动 ================================================================= */

  //车展活动
  {
    path: '/carExhibition',
    meta: {
      share: true,
      requireAuth: false
    },
    component: carExhibition
  }, {
    path: '/carExhibition/serverLogin',
    meta: {
      resetTitle: '销售顾问链接生成',
      share: false
    },
    component: carExhibition_serverLogin
  }, {
    path: '/carExhibition/buildLink',
    meta: {
      resetTitle: '销售顾问链接生成',
      share: false
    },
    component: carExhibition_buildLink
  }, {
    path: '/carExhibition/signUp',
    meta: {
      resetTitle: '立即报名',
      share: true
    },
    component: carExhibition_signUp
  }, {
    path: '/carExhibition/orders',
    meta: {
      resetTitle: '我的报名',
      share: false
    },
    component: carExhibition_orders
  }, {
    path: '/carExhibition/orderDetail',
    meta: {
      resetTitle: '订单详情',
      share: false
    },
    component: carExhibition_orderDetail
  },

  //转盘抽奖
   {
    path: '/lottery',
    meta: {
      share: true
    },
    component: lottery
  },{
    path: '/lottery/records',
    meta: {
      resetTitle: '我的中奖信息',
      share: false
    },
    component: lotteryRecords
  },{
    path: '/lottery/addInfo',
    meta: {
      resetTitle: '填写领奖信息',
      share: false
    },
    component: lotteryAddInfo
  },

  //欢乐购
   {
    path: '/happyGo',
    meta: {
      resetTitle: '盈众乐橙在线商城狂欢购',
      share: true,
      requireAuth:false
    },
    component: happyGo
  },{
    path: '/happyGo/rule',
    meta: {
      resetTitle: '活动规则',
      requireAuth: false
    },
    component: happyGoRule
  },
  
  //助力红包
  {
    path: '/helpRed/:aid',
    meta: {
      resetTitle: ' ',
      share:false
    },
    component: helpRed
  },
  {
    path: '/helpRed/help/:aid',
    meta: {
      resetTitle: ' ',
      share:false
    },
    component: helpRedHelp
  },
  {
    path: '/helpRed/myRed/:aid',
    meta: {
      resetTitle: '我的红包',
      share:false
    },
    component: helpRedMyRed
  },
  {
    path: '/helpRed/record/:aid',
    meta: {
      resetTitle: '历史红包记录',
      share:false
    },
    component: helpRedRecord
  },


  //服务节
  {
    path: '/serviceDay',
    meta: {
      resetTitle: '第二届盈众服务节千万红包大派送',
      requireAuth:false
    },
    component: serviceDay
  },


  
  /* ==== 模块 ============================================================== */

  //用户
  {
    path: '/signUp',
    meta: {
      resetTitle: '验证手机号',
      transition: 'slide',
      requireAuth: false,
      share: false
    },
    component: signUp
  }, {
    path: '/setPwd',
    meta: {
      resetTitle: '设置密码',
      transition: 'slide',
      requireAuth: false,
      share: false
    },
    component: setPwd
  },

  //天气
  {
    path: '/weather',
    meta: {
      resetTitle: '天气',
      transition: 'slide'
    },
    component: weather
  },{
    path: '/weather/area',
    meta: {
      resetTitle:'选择城市',
      transition: 'slide'
    },
    component: weather_area
  },
  

  //维保预约
  {
    path: '/maintenance',
    meta: {
      resetTitle: '维保预约'
    },
    component: maintenance
  }, {
    path: '/maintenance/date',
    meta: {
      resetTitle: '选择日期',
      requireAuth: false,
      transition: 'slide'
    },
    component: maintenance_date
  }, {
    path: '/maintenance/guide/:id',
    meta: {
      resetTitle: '内容详情',
      requireAuth: false,
      share: true
    },
    component: maintenance_guideDetail
  },


  //违章查询
  {
    path: '/peccancy',
    meta: {
      resetTitle: '选择要查询的车辆',
      share:false
    },
    component: peccancy
  }, {
    path: '/peccancy/agreement',
    meta: {
      resetTitle: '违章查询授权协议',
      requireAuth:false,
      share:false
    },
    component: peccancy_agreement
  }, {
    path: '/peccancy/add',
    meta: {
      resetTitle: '违章查询',
      transition: 'slide',
      requireAuth:false,
      share:false
    },
    component: peccancy_add
  }, {
    path: '/peccancy/result',
    meta: {
      resetTitle: '违章查询结果',
      requireAuth:false,
      share:false
    },
    component: peccancy_result
  }, {
    path: '/peccancy/map',
    meta: {
      resetTitle: '违章地图',
      requireAuth:false,
      share:false
    },
    component: peccancy_map
  },

  //邀请有礼
  {
    path: '/invite',
    meta: {
      resetTitle: '邀请有礼',
      share:true
    },
    component: invite
  }, {
    path: '/invite/rule',
    meta: {
      resetTitle: '活动规则',
      requireAuth: false
    },
    component: inviteRule
  }, {
    path: '/invite/rank',
    meta: {
      resetTitle: '排行榜'
    },
    component: inviteRank
  }, {
    path: '/invite/winner',
    meta: {
      resetTitle: '中奖名单',
      requireAuth: false
    },
    component: frame
  },

  //老荐新
  {
    path: '/recommendBuyers',
    meta: {
      resetTitle: '盈众老友记'
    },
    component: recommendBuyers
  }, {
    path: '/recommendBuyers/rewards',
    meta: {
      resetTitle: '我的奖励金',
      share: false
    },
    component: recommendBuyers_rewards
  }, {
    path: '/recommendBuyers/recommend',
    meta: {
      share:false,
      resetTitle: '信息填写'
    },
    component: recommendBuyers_recommend
  },{
    path: '/recommendBuyers/fourS',
    meta: {
      resetTitle: '4S店列表',
      geolocation:true,
      share: false
    },
    component: recommendBuyers_fourS
  }, {
    path: '/recommendBuyers/brands',
    meta: {
      resetTitle: '意向品牌车型',
      transition: 'slide',
      share: false
    },
    component: recommendBuyers_brands
  }, {
    path: '/recommendBuyers/records',
    meta: {
      resetTitle: '我的奖励金',
      share: false
    },
    component: recommendBuyers_records
  }, {
    path: '/recommendBuyers/records/:id',
    meta: {
      resetTitle: '推荐记录详情',
      share: false
    },
    component: recommendBuyers_detail
  }, {
    path: '/recommendBuyers/rule',
    meta: {
      resetTitle: '活动规则',
      share: false
    },
    component: recommendBuyers_rule
  },{
    path: '/recommendBuyers/rank',
    meta: {
      resetTitle: '盈众老友记排行榜',
      share: false
    },
    component: recommendBuyers_rank
  },{
    path: '/recommendBuyers/share/:id',
    meta: {
      resetTitle: '盈众老友记',
      geolocation:true
    },
    component: recommendBuyers_share
  },


  //用车百科
  {
    path: '/carWiki',
    meta: {
      resetTitle: '用车百科',
      requireAuth: false,
      share: true
    },
    component: carWiki
  }, {
    path: '/carWiki/detail/:id',
    meta: {
      resetTitle: '百科详情',
      requireAuth: false,
      share: true
    },
    component: carWiki_detail
  },

  //保养手册
  {
    path: '/manual',
    meta: {
      resetTitle: '保养手册',
      requireAuth: false,
    },
    component: manual
  },{
    path: '/manual/chooseCars/:carId',
    meta: {
      resetTitle: '选择车辆',
      requireAuth: false,
    },
    component: manual_chooseCars
  },{
    path: '/manual/manualDetail',
    meta: {
      resetTitle: '保养详情',
    },
    component:frame
  },
  
  //一键救援
  {
    path: '/sos',
    meta: {
      resetTitle: '一键救援',
      requireAuth: false
    },
    component: frame
  },

  //洗车
  {
    path: '/washCar',
    meta: {
      resetTitle: '洗车门店列表',
      requireAuth: false
    },
    component: frame
  },

  //我的车库
  {
    path: '/myCars',
    meta: {
      resetTitle: '我的车库'
    },
    component: myCars
  },{
    path: '/myCars/detail/:carId',
    meta: {
      resetTitle: '爱车详情'
    },
    component: myCars_detail
  },{
    path: '/myCars/repair/:carId',
    meta: {
      resetTitle: '维修履历'
    },
    component: myCars_repair
  },{
    path: '/myCars/safe/:carId',
    meta: {
      resetTitle: '保险记录'
    },
    component: myCars_safe
  },{
    path: '/myCars/safeDetail/:orderId',
    meta: {
      resetTitle: '保险单详情'
    },
    component: myCars_safeDetail
  },{
    path: '/myCars/setMaintainRemind/:carId',
    meta: {
      resetTitle: '设置保养提醒'
    },
    component: myCars_setMaintainRemind
  },{
    path: '/myCars/maintainRemind/:carId',
    meta: {
      resetTitle: '保养提醒'
    },
    component: myCars_maintainRemind
  },{
    path: '/myCars/setSafeRemind/:carId',
    meta: {
      resetTitle: '设置保险提醒'
    },
    component: myCars_setSafeRemind
  },{
    path: '/myCars/safeRemind/:carId',
    meta: {
      resetTitle: '保险提醒'
    },
    component: myCars_safeRemind
  },{
    path: '/myCars/setCheckRemind/:carId',
    meta: {
      resetTitle: '设置年检提醒'
    },
    component: myCars_setCheckRemind
  },{
    path: '/myCars/checkRemind/:carId',
    meta: {
      resetTitle: '年检提醒'
    },
    component: myCars_checkRemind
  },
  
  //套餐
  {
    path: '/package',
    meta: {
      resetTitle: '我的套餐'
    },
    component: package_index
  },{
    path: '/package/detail',
    meta: {
      resetTitle: '套餐详情'
    },
    component: package_detail
  },  

  // 服务顾问
  {
    path: '/server/detail',
    meta: {
      resetTitle: '您的专属顾问'
    },
    component: server_detail
  },{
    path: '/server/list',
    meta: {
      resetTitle: '服务顾问列表',
      transition: 'slide'
    },
    component: server_list
  },

  // 销售顾问
  {
    path: '/salesConsultant',
    meta: {
      resetTitle: '选择销售顾问',
      share: false
    },
    component: salesConsultant
  },

  // 订单
  {
    path: '/orders',
    meta: {
      share:false
    },
    component: orders
  },{
    path: '/orders/:id',
    meta: {
      share:false,
      geolocation:true
    },
    component: orders_detail
  },{
    path: '/pay/:id',
    meta: {
      resetTitle: '订单支付',
      share:false
    },
    component: orders_pay
  },{
    path: '/paid/:id',
    meta: {
      resetTitle: '订单状态',
      share:false
    },
    component: orders_paid
  },{
    path: '/shipping/:id',
    meta: {
      resetTitle: '物流信息',
      share:false
    },
    component: orders_shipping
  },{
    path: '/orders/trail/:id',
    meta: {
      resetTitle: '订单轨迹',
      share:false
    },
    component: orders_trail
  },{
    path: '/orders/comment/:id',
    meta: {
      resetTitle: '订单评价',
      share:false,
      requireAuth:false
    },
    component: orders_comment
  },


  //4s店
  {
    path: '/stores',
    meta: {
      resetTitle: '服务门店',
      geolocation:true,
      hasTabBar:true,
      requireAuth:false
    },
    component: fourS
  },{
    path: '/stores/:id',
    meta: {
      resetTitle: '4S店店面详情',
      geolocation:true,
      requireAuth:false
    },
    component: fourS_detail
  },{
    path: '/stores/:id/comments',
    meta: {
      resetTitle: '车主点评',
      requireAuth:false
    },
    component: fourS_comments
  },{
    path: '/stores/cargoods/:id',
    meta: {
      resetTitle: '精选车品',
      requireAuth:false
    },
    component: fourS_cargoods
  },{
    path: '/panorama',
    meta: {
      resetTitle: '全景展厅',
      requireAuth:false
    },
    component: frame
  },{
    path: '/fourS',
    meta: {
      resetTitle: '选择4S店',
      geolocation:true,
      requireAuth:false
    },
    component: fourS
  },

  //合作商家
  {
    path: '/partners',
    meta: {
      resetTitle: '服务门店',
      geolocation:true,
      hasTabBar:true,
      requireAuth:false
    },
    component: partners
  },{
    path: '/partners/:id',
    meta: {
      resetTitle: '合作商家详情',
      geolocation:true,
      requireAuth:false
    },
    component: partner_detail
  },{
    path: '/partners/:id/comments',
    meta: {
      resetTitle: '车主点评',
      requireAuth:false
    },
    component: partner_comments
  },{
    path: '/partners/goods/:id',
    meta: {
      resetTitle: '商家推荐',
      requireAuth:false
    },
    component: partner_goods
  },


  {
    path: '/bindCar',
    meta: {
      resetTitle: '绑定车辆'
    },
    component: bindCar
  }, {
    path: '/money',
    meta: {
      resetTitle: '我的余额'
    },
    component: me_money
  }, {
    path: '/point',
    meta: {
      resetTitle: '我的积分'
    },
    component: me_point
  }, {
    path: '/helpCenter',
    meta: {
      resetTitle: '客服中心',
      requireAuth: false
    },
    component: frame
  }, {
    path: '/onlineHelp',
    meta: {
      resetTitle: '在线客服',
      requireAuth: false
    },
    component: frame
  }, {
    path: '/brands',
    meta: {
      resetTitle: '品牌车系',
      transition: 'slide'
    },
    component: brands
  }, {
    path: '/brands/model',
    meta: {
      resetTitle: '车型',
      transition: 'slide'
    },
    component: model
  }, {
    path: '/spMall/:page',
    component: frame
  }, 
  
  //优惠券
  {
    path: '/coupon',
    meta: {
      resetTitle: '领券中心'
    },
    component: coupon
  }, {
    path: '/myCoupons/:type',
    meta: {
      resetTitle: '我的卡券'
    },
    component: coupon_mine
  },{
    path: '/myCoupons/detail/:id',
    meta: {
      resetTitle: '卡券详情'
    },
    component: coupon_details
  },{
    path: '/coupon/welfare/:id',
    meta: {
      requireAuth: false,
      resetTitle: '乐橙会员福利',
      share: false
    },
    component: coupon_welfare
  },{
    path: '/myCoupons/coupon_applystore/:id',
    meta: {
      resetTitle: '适用门店',
      share: false,
      geolocation:true
    },
    component: coupon_applystore
  },

  //收货地址
  {
    path: '/address',
    meta: {
      resetTitle: '收货地址'
    },
    component: address
  },{
    path: '/address/detail/:id',
    meta: {
      resetTitle: '收货地址详情'
    },
    component: address_detail
  },

  {
    path: '/map',
    meta: {
      resetTitle: '地图'
    },
    component: map
  },{
    path: '/link',
    meta: {
      requireAuth: false
    },
    component: frame
  },
  
  //信用卡
  {
    path: '/creditCard',
    meta: {
      resetTitle: '车主信用卡',
      requireAuth: false
    },
    component: creditCard
  },

  //文章
  {
    path: '/article/:id',
    meta: {
      resetTitle: '内容详情',
      requireAuth: false,
      share: false
    },
    component: article
  },

  //试驾
  {
    path: '/testDrive',
    meta: {
      resetTitle: '预约试驾信息填写',
      share:false
    },
    component: testDrive
  },{
    path: '/testDrive/brands',
    meta: {
      resetTitle: '选择试驾车型',
      share:false
    },
    component: testDrive_brands
  }


]
