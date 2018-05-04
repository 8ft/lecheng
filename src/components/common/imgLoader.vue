<template>  
  <div class="img-loader">  
    <div class="img-box" v-for="(img,index) in imgs" :style="'background:url('+img.base64+') no-repeat center;background-size:cover;'"><button @click="imgs.splice(index, 1)">X</button></div>
    <div class="loader">  
        <input v-if="multiple" type="file" multiple accept="image/*" @change="load">  
        <input v-else type="file" accept="image/*" @change="load">
    </div>  
  </div>  
</template>  
  
<script>  
import Exif from 'exif-js'  
  
export default {
  name:'img-loader',  
  props:{
    value:{type:Array},
    multiple:{type:Boolean,default:true}
  },
  data () {  
    return {  
      imgs:this.value||[]
    }  
  },  
  watch:{
    imgs(val){
      this.$emit('input',val);
    }
  },
  methods: {
    async load (e) {  
      let files = e.target.files || e.dataTransfer.files;  

      let len=files.length;
      if (!len) return; 

      if(len>4||this.imgs.length>=4){
        this.$toast('最多只能上传4张');
        return;
      }

      for (let i = 0; i < len; i++) {
          const response = await this.imgPreview(files[i],i);
          this.imgs.push(await response); 
      }
    },  
    imgPreview (file,index) {  
          if (!file || !window.FileReader) return;  
      
          if (/^image/.test(file.type)) {  
            return new Promise((resolve,reject)=>{
                let vm = this,
                  reader = new FileReader();  

                reader.readAsDataURL(file);
                reader.onloadend = function () { 
                  let img = new Image();  
                  img.src = this.result;  
                  img.onload =function () { 
                    let Orientation;
                    //去获取拍照时的信息，解决拍出来的照片旋转问题  
                    Exif.getData(file,async function(){  
                        Orientation = parseInt(Exif.getTag(this, 'Orientation')||0);  
                        let res=await vm.compress(img,Orientation);
                        resolve(res);
                    });  
                  }  
                }  
                  
            })
          }
      },  
      rotateImg (img,direction,canvas) {  
        //最小与最大旋转方向，图片旋转4次后回到原方向      
        const min_step = 0;      
        const max_step = 3;        
        if (img == null)return;      
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错      
        let height = img.height;      
        let width = img.width;        
        let step = 2;      
        if (step == null) {      
            step = min_step;      
        }      
        if (direction == 'right') {      
            step++;      
            //旋转到原位置，即超过最大值      
            step > max_step && (step = min_step);      
        } else {      
            step--;      
            step < min_step && (step = max_step);      
        }       
        //旋转角度以弧度值为参数      
        let degree = step * 90 * Math.PI / 180;      
        let ctx = canvas.getContext('2d');      
        switch (step) {      
          case 0:      
              canvas.width = width;      
              canvas.height = height;      
              ctx.drawImage(img, 0, 0);      
              break;      
          case 1:      
              canvas.width = height;      
              canvas.height = width;      
              ctx.rotate(degree);      
              ctx.drawImage(img, 0, -height);      
              break;      
          case 2:      
              canvas.width = width;      
              canvas.height = height;      
              ctx.rotate(degree);      
              ctx.drawImage(img, -width, -height);      
              break;      
          case 3:      
              canvas.width = height;      
              canvas.height = width;      
              ctx.rotate(degree);      
              ctx.drawImage(img, -width, 0);      
              break;  
        }      
    },  
    compress(img,Orientation) {  
      let canvas = document.createElement("canvas");  
      let ctx = canvas.getContext('2d');  
        //瓦片canvas  
      let tCanvas = document.createElement("canvas");  
      let tctx = tCanvas.getContext("2d");  
      let initSize = img.src.length;  
      let width = img.width;  
      let height = img.height;  
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下  
      let ratio;  
      if ((ratio = width * height / 4000000) > 1) {  
        ratio = Math.sqrt(ratio);  
        width /= ratio;  
        height /= ratio;  
      } else {  
        ratio = 1;  
      }  
      canvas.width = width;  
      canvas.height = height;  
      //铺底色  
      ctx.fillStyle = "#fff";  
      ctx.fillRect(0, 0, canvas.width, canvas.height);  
      //如果图片像素大于100万则使用瓦片绘制  
      let count;  
      if ((count = width * height / 1000000) > 1) {  
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片  
        //计算每块瓦片的宽和高  
        let nw = ~~(width / count);  
        let nh = ~~(height / count);  
        tCanvas.width = nw;  
        tCanvas.height = nh;  
        for (let i = 0; i < count; i++) {  
          for (let j = 0; j < count; j++) {  
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);  
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);  
          }  
        }  
      } else {  
        ctx.drawImage(img, 0, 0, width, height);  
      }  

      //修复ios上传图片的时候 被旋转的问题  
      switch(Orientation){  
        case 6://需要顺时针（向左）90度旋转  
            this.rotateImg(img,'left',canvas);  
            break;  
        case 8://需要逆时针（向右）90度旋转  
            this.rotateImg(img,'right',canvas);  
            break;  
        case 3://需要180度旋转  
            this.rotateImg(img,'right',canvas);//转两次  
            this.rotateImg(img,'right',canvas);  
            break;  
      } 

      return new Promise((resolve,reject)=>{
        canvas.toBlob(function(b){
          let obj={};
          obj.base64=canvas.toDataURL('image/jpeg', 0.4); 
          obj.blob=b;

          tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0; 
          resolve(obj);
        },'image/jpeg', 0.4)

      });

    },  
  }  
}  
</script>  
  
<style lang="scss">  
  @import "~assets/css/var.scss";
  .img-loader{@include box;background:#fff;padding:.2rem;
    .img-box,.loader{width:.6rem;height:.6rem;box-sizing: border-box;position: relative;border:$border;}
    .img-box{margin-right:.0875rem;
      button{display: block;width:.2rem;height:.2rem;background: rgba(0,0,0,.6);color:#fff;position:absolute;top:-.08rem;right:-.05rem;border-radius: 50%;font-size: $h3;}
    }
    .loader{
      input{display:block;position:absolute;top:0;left:0;width:100%;height:100%;opacity: 0;}
    }
  }
</style>  