 <template>
    <app-layout id="orderComment" v-if="orderType">
        
      <template v-for="mod in modules[orderType]">

          <div v-if="mod===1" class="target">
              <img :src="detail.targetInfo.img||default_server">
              <h1>{{detail.targetInfo.title}}</h1>
              <span class="lv" v-if="detail.targetInfo.positionalTitle">{{detail.targetInfo.positionalTitle}}</span>
              <span>{{detail.targetInfo.station}}</span>
          </div>

          <order-goods v-if="mod===2" class="dis" type="NC" :data="getTarget(detail.targetInfo)"></order-goods>

          <div v-if="mod===3" class="rate-box totle">
              <p v-if="!['NC','YY'].includes(orderType)">为本次服务进行打分</p>
              <label>总体评分</label>
              <lc-rate v-model="totle" :size=".25" :margin=".18"></lc-rate>
              <span>{{totle}}.0</span>
          </div>

          <div v-if="mod===4" class="rate-detail">
              <div class="rate-box qulity">
                <label>服务质量</label>
                <lc-rate v-model="qulity" icon="faces" :size=".25" :margin=".18"></lc-rate>
                <span>{{rateTxt[qulity]}}</span>
              </div>
              <div class="rate-box efficiency">
                <label>服务效率</label>
                <lc-rate v-model="efficiency" icon="faces" :size=".25" :margin=".18"></lc-rate>
                <span>{{rateTxt[efficiency]}}</span>
              </div>
              <div class="rate-box attitude">
                <label>服务态度</label>
                <lc-rate v-model="attitude" icon="faces" :size=".25" :margin=".18"></lc-rate>
                <span>{{rateTxt[attitude]}}</span>
              </div>
          </div>

          <div v-if="mod===5" class="tags">
              <p>评价标签</p>
              <div :class="{on:(tags.includes(item.id))}" v-for="item in getTags()" @click="tag(item.id)">{{item.tag}}</div>
          </div>

          <div v-if="mod===6" class="words">
            <textarea placeholder="填写高质量的评价就有机会获得乐橙积分~" rows="4" v-model="words"></textarea>
          </div>

          <template v-if="mod===7"></template>
          
          <!-- <img-loader v-if="mod===7" v-model="imgs"></img-loader> -->



          <template v-if="mod===8" v-for="(item,index) in detail.targetList">

            <order-goods class="dis" type="NC" :data="getTarget(item)"></order-goods>

            <div class="rate-box totle">
                <label>总体评分</label>
                <lc-rate v-model="cpComments[index].totle" :size=".25" :margin=".18"></lc-rate>
                <span>{{cpComments[index].totle}}.0</span>
            </div>

            <div class="words">
              <textarea placeholder="填写高质量的评价就有机会获得乐橙积分~" rows="4" v-model="cpComments[index].words"></textarea>
            </div>

            <!-- <img-loader v-model="cpComments[index].imgs"></img-loader> -->

          </template>


      </template>


      <div class="sub-bar" slot="footer">
        <div :class="{'item-radio':true,'on':anonymous}" @click="anonymous=!anonymous"></div>
        匿名评价
        <button @click="done(orderType)">提交</button>
      </div>

    </app-layout>
 </template>
 
 <script>
  import ImgLoader from 'components/common/imgLoader'
  import Goods from 'components/orders/goods'
  export default {
    name:'ex-comment',
    components:{
        'img-loader':ImgLoader,
        'order-goods':Goods
    },
    data() {
      return {
        default_server:require('assets/img/default_server.png'),
        orderType:'',
        detail:{},
        modules:{
            'CP':[8],
            'WB':[1,3,4,5,6,7],
            'SJ':[1,3,4,5,6,7],
            'NC':[2,3,6,7],
            'YY':[2,3,6,7],
            'MR':[2,3,4,6,7],
            'MG':[1,3,4,5,6,7]
        },

        totle:5,
        qulity:5,
        efficiency:5,
        attitude:5,
        rateTxt:['','很差','不够好','一般','很好','非常好'],

        tags:[],

        words:'',

        imgs:[],

        cpComments:[],

        anonymous:true
      };
    },
    mounted(){
      this.getData();
    },
    methods:{
      getTarget(obj){
        let data=obj;
        return {
          icon:data.img,
          name:data.title,
          subtitle:data.subtitle
        }
      },
      tag(id){
        let index=this.tags.indexOf(id);
        if(index>=0){
          this.tags.splice(index,1);
        }else{
          this.tags.push(id);
        }
      },
      getTags(){
        if(this.totle<=3){
          return this.detail.badTagList;
        }else{
          return this.detail.goodTagList;
        }
      },
      async getData(){
        let data=this.$sign({
              content:{
                no:this.$route.params.id
              }
            });

        let res= await this.$post('/CRM/api/forward.appraise.json', data);
        if (res.errcode === 0) {
          let con=res.content,
            orderType=con.statusInfo.orderType;

          if(orderType==='CP'){
            let goods=con.targetList,
              comments=[];
            for (let i = 0; i < goods.length; i++) {
              comments.push({
                id:goods[i].id,
                totle:5,
                words:'',
                imgs:[]
              })
            }
            this.cpComments=comments;
          }
          this.orderType=orderType;
          this.detail=res.content;
        }
      },

      async done(type){

        let uploadedImgs;

        if(type==='CP'){
          let comments=this.cpComments,
              comment;
          for (let i = 0; i < comments.length; i++) {
            comment=comments[i];
            uploadedImgs=await this.upload(comment.imgs);
            await this.sub({
              id:comment.id,
              words:comment.words,
              totle:comment.totle,
              imgs:uploadedImgs
            });
          }
        }else{
          uploadedImgs=await this.upload(this.imgs);
          let vm=this;
          await this.sub({
            id:vm.detail.targetInfo.id,
            words:vm.words,
            totle:vm.totle,
            imgs:uploadedImgs
          });
        }

        eventBus.$emit('updateOrder');
        this.$router.go(-1);

      },
      upload(imgs){
        return new Promise(async (resolve,reject)=>{

          if(imgs.length===0){
            resolve('');
          }else{
            let formData = new FormData();
            for(let i=0;i<imgs.length;i++){
                formData.append('files', imgs[i].blob);
            }

            let res= await this.$postForm('/CRM/appothers/uploadImg.json', formData);
            if (res.errcode === 0) {
              resolve(res.content.filesNames);
            }
          }

        });
      },
      sub(obj){
        return new Promise(async (resolve,reject)=>{

            let data=this.$sign({
                content:{
                  no:this.$route.params.id,
                  targetId:obj.id,
                  isAnno:this.anonymous?1:0,
                  appraise:obj.words,
                  qualityScore:this.qulity,
                  attitudeScore:this.attitude,
                  efficiencyScore:this.efficiency,
                  compScore:obj.totle,
                  appraiseTag:this.tags.join(','),
                  files:obj.imgs||'',
                }
              });

            let res= await this.$post('/CRM/api/commit.appraise.json', data);
            if (res.errcode === 0) {
                resolve();
            }

        });
      }
    }
       
}
</script>

 <style lang="scss">
   @import "~assets/css/var.scss";
   #orderComment{

      .target{position: relative;padding:.15rem .2rem .15rem .75rem;background:#fff;border-bottom:$border;
        img{width:.45rem;height:.45rem;border-radius:50%;position: absolute;left:.2rem;top:.15rem;}
        h1{margin-bottom:.07rem;}
        span{display:inline-block;border-radius: .05rem;color: #fff;padding:0 .05rem;font-size:$h3;background:$gray;
          &.lv{background:$mainColor;margin-right:.05rem;}
        }

      }
      .orders-goods .info div{display: none;}
       
      .rate-box{background: #fff;padding:.1rem .2rem;font-size:$h3;
        &.totle{padding-bottom:.15rem;}
          
        p{text-align: center;color:$gray;padding:.05rem 0 .15rem;}
        label{display:inline-block;line-height: .25rem;color:$gray;margin-right:.15rem;}
        span{float: right;line-height: .25rem;color:$mainColor;}
      }
      .rate-detail{padding:.05rem 0;background:#fff;border-top:$border;border-bottom:$border;}

      .tags{text-align:center;font-size: $h3;color:$gray;background:#fff;padding:.15rem .2rem;border-bottom:$border;
        p{margin-bottom:.03rem;}
        div{display:inline-block;line-height: .27rem;padding:0 .1rem;border-radius: .03rem;border:$border;margin-top:$h3;margin-right:$h3;}
        div.on{border-color:$mainColor;}
      }

      .words{padding:.15rem .2rem;background:#fff;border-bottom:$border;
        textarea{width:100%;box-sizing:border-box;border-radius:.03rem;padding: .15rem;background: #f2f2f2;font-size:$h3;}
      }


      .sub-bar{height:.5rem;line-height: .5rem;background:#fff;padding-left:.48rem;font-size:$h2;border-top:$border;
        .item-radio{display: block;position:absolute;width:.48rem;height:100%;top:0;left:0;background: url('~assets/img/icon_list_select.png') no-repeat center;background-size:.2rem .2rem;
          &.on{background-image:url('~assets/img/icon_list_select_pressed.png'); }
        }
        button{float:right;background:$mainColor;height: 100%;width:1.1rem;color:#fff;}
      }
      
   }
 </style>