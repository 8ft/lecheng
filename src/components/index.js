import { Toast, Indicator, MessageBox, Loadmore, InfiniteScroll, Popup, Lazyload, Navbar, TabItem, Radio, Switch, Picker, IndexList, IndexSection, DatetimePicker,Actionsheet } from 'mint-ui'

import AppLayout from './common/appLayout';
import Tabbar from './common/tabBar';
import CellSwipe from './common/cellSwipe';
import PageSwitch from './common/pageSwitch';
import Rate from './common/rate';

import MallSearch from './mall/search';
import StoreInfo from './mall/storeInfo';

import OrderLi from './orders/li';
import OrderActionBar from './orders/actionBar';

require('swiper/dist/css/swiper.css');
import { swiper, swiperSlide } from 'vue-awesome-swiper';


const install = function (Vue) {

  //mint-ui
  Vue.use(Lazyload);
  Vue.use(InfiniteScroll);
  Vue.component(Loadmore.name, Loadmore);
  Vue.component(Popup.name, Popup);
  Vue.component(Navbar.name, Navbar);
  Vue.component(TabItem.name, TabItem);
  Vue.component(Radio.name, Radio);
  Vue.component(Switch.name, Switch);
  Vue.component(Picker.name, Picker);
  Vue.component(IndexList.name, IndexList);
  Vue.component(IndexSection.name, IndexSection);
  Vue.component(DatetimePicker.name, DatetimePicker);
  Vue.component(Actionsheet.name, Actionsheet);
 
  //lecheng
  Vue.component(AppLayout.name, AppLayout);
  Vue.component(Tabbar.name, Tabbar);
  Vue.component(CellSwipe.name, CellSwipe);
  Vue.component(PageSwitch.name, PageSwitch);
  Vue.component(Rate.name, Rate);

  Vue.component(OrderLi.name, OrderLi);
  Vue.component(OrderActionBar.name, OrderActionBar);

  Vue.component(MallSearch.name, MallSearch);
  Vue.component(StoreInfo.name, StoreInfo);

  //other
  Vue.component(swiper.name, swiper);
  Vue.component(swiperSlide.name, swiperSlide);


  let a = Toast,
    b = Indicator,
    c = MessageBox;
  Vue.$toast = Vue.prototype.$toast = a;
  Vue.$indicator = Vue.prototype.$indicator = b;
  Vue.$messagebox = Vue.prototype.$messagebox = c;
};


module.exports = {
  install
};
