<template>     
    <app-layout id="myCarsMaintainRemind">
        <router-link slot="aside" :to="'/myCars/setMaintainRemind/'+carId">
            <div class="maintainRemind-edit" >编辑</div>
        </router-link>
        <div class="card">
            <div class="head">下次保养到期时间为：{{nextMaintainDate}}，还有：</div>
            <div class="content">
                <div class="time"><span>{{content.maintainDayNum}}</span> 天</div>
                <div class="explain">请在{{nextMaintainDate}}，或车辆公里数为{{content.maintainKilometer}}KM时，其中一项先到为准，到4S店进行保养！</div>
            </div>
        </div>
        <div class="recommend"><div>推荐保养项目</div></div>
        <ul class="list-box" >
            <li class="title" style="color:#e84816">必须保养的项目（{{mustBeItemList.length}}项）</li>
            <li v-for="(item,index) in mustBeItemList" @click="goDetails(item.url)">
                <img :src="item.itemIcon"/>
                <span>{{item.itemName}}</span>
                <div class="right">
                    <span>查看详情</span>
                    <span class="arrow"></span>
                </div>       
            </li>
        </ul>
        
        <ul class="list-box">
            <li class="title">可做的养护项目（{{feasibiityItemList.length}}项）</li>
            <li v-for="(item,index) in feasibiityItemList" @click="goDetails(item.url)">
                <img :src="item.itemIcon"/>
                <span>{{item.itemName}}</span>
                <div class="right">
                    <span>查看详情</span>
                    <span class="arrow"></span>
                </div>
            </li>
        </ul>
        <ul class="list-box">
            <li class="title">需要进行检查的项目（{{needCheckItemList.length}}项）</li>
            <li v-for="(item,index) in needCheckItemList" @click="goDetails(item.url)">
                <img :src="item.itemIcon"/>
                <span>{{item.itemName}}</span>
                <div class="right">
                    <span>查看详情</span>
                    <span class="arrow"></span>
                </div>
            </li>
        </ul>
        
        <div slot="footer" class="nextOne"><div class="btn" >立即预约享优惠</div></div>
    
    </app-layout>
    
</template>
<script>
    export default {
        data() {
            return{
                carId:'',
                content:'',
                nextMaintainDate:'',
                mustBeItemList:[],
                feasibiityItemList:[],
                needCheckItemList:[]
            }
        },
        activated(){
          this.carId=this.$route.params.carId,
          this.getData();
        },
        methods:{
            async getData () {
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        carId:this.carId
                    }
                };

                let res = await this.$post('/CRM/appgarage/getMaintainDetail.json',d);
                if(res.errcode==0){
                    this.content=res.content;
                    this.mustBeItemList=res.content.mustBeItemList;
                    this.feasibiityItemList=res.content.feasibiityItemList;
                    this.needCheckItemList=res.content.needCheckItemList;
                    let arr=this.content.nextMaintainDate.split('-');
                    this.nextMaintainDate=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
                }
            },
            goDetails(url){
                location.href=url
            }
            
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    .maintainRemind-edit{
        color: #fff;
        font-size: .15rem;
        position: fixed;
        z-index: 204;
        right: 5%;
        top: 0;
        height: .4rem;
        line-height: .4rem;
    }
    #myCarsMaintainRemind{
        .card{
            width: 90%;
            margin: .18rem 5% 0;
            .head{
                height: .4rem;
                background: orangered;
                color: #fff;
                line-height: .4rem;
                text-align: center;
                font-size: .12rem;
                border-radius: 6px 6px 0 0;
            }
            .content{
                border-radius: 0 0 6px 6px;
                .time{
                    text-align: center;
                    color: #88888d;
                    font-size: .12;
                    padding:.05rem 0;
                    border-bottom: 1px dashed #d2d2d2;
                    span{
                        color: #c9c9c9;
                        font-size: .6rem;
                    }
                }
                .explain{
                    color: #88888d;
                    font-size: .12rem;
                    padding:.1rem .19rem;
                    line-height: .18rem
                }
            }
        }
        .recommend{
            height: .52rem;
            color: #88888d;
            font-size: .12rem;
            text-align: center;
            div{
                position: relative;
                display: inline-block;
                margin:.1rem .1rem;
                height: .32rem;
                line-height: .32rem;
                &::before{
                    content: '';
                    position: absolute;
                    width: .49rem;
                    height: 1px;
                    background: #88888d;
                    left: -.59rem;
                    top: .15rem;
                }
                &::after{
                    content: '';
                    position: absolute;
                    width: .49rem;
                    height: 1px;
                    background: #88888d;
                    right: -.59rem;
                    top: .15rem;
                }
            }
            
        }
        .list-box{
            margin-bottom:.05rem;
            li{
                background: #fff;
                height: .45rem;
                border-bottom: 1px solid #f2f2f2;
                line-height: .45rem;
                padding: 0 5%;
                font-size: .12rem;
                @include box;
                align-items: center;
                
                .right{
                    flex: 1;
                    text-align: right;
                    color: #88888d;
                    font-size: .12rem;
                    .arrow{
                        position:relative;
                        margin-right: .06rem;
                        margin-left: .1rem;
                        top: .01rem;
                        &::after{position:absolute;content:'';width:0;height:0;top: 0;right:-5px;border:6px solid transparent;border-right:0;border-left-color:#fff;}
                        &::before{position:absolute;content:'';width:0;height:0;top: 0;border:6px solid transparent;border-right:0;border-left-color:#999;}
                    }
                    > span{
                        color: #c9c9c9
                    }
                }
                > img{
                    height: .25rem;
                    width: .25rem;
                    margin-right: .15rem;
                }
                > span{
                    color: #888d8d
                }
            }
            li.title{
                font-size: .15rem;
                color: #22222e
            }
        }
    }
</style>
