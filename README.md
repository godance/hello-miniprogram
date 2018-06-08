# hello-miniprogram
小程序从入门到放弃


## App
小程序实例，包含3个文件（app.js, app.json, app.wxss）       
1. app.js       
```JavaScript
必须在app.js中使用App()函数注册小程序，还可注册各种全局响应事件
App({
  onLaunch: function(options) {
    //小程序启动时触发
  },
  globalData: 'I am global data'//全局data
  //。。。及其他响应事件
})

全局都能通过 getApp()获取此实例
```

2. app.json
```json
小程序全局配置文件，必须配置pages属性，如：
{
 "pages": [
    "pages/login/login",
    "pages/menu/menu"
  ]
}
数组需包含小程序全部页面，数组第一项默认为初始页面；
文件名不需加后续，会自动将四个文件组合（.json,.js,.wxml,.wxss）
```
3. app.wxss
```
全局样式配置
```

## Page
每个页面由同文件名的四个文件组成（json,js,wxml,wxss）
1. json
```
配置文件，可缺省，配置项app.json的子集，若配置则在该页面覆盖app.json的全局配置
```
2. js
```javascript
使用Page()函数来注册页面

Page({
  data: {
    text: "This is page data.",
    arr:["one", "two", "three"]
  },
  onLoad: function(options) {
    this.setData({text:"this is changed data"});
  },
  myfunction: function(e){
      //自己定义的方法，通过对页面组建绑定事件调用
  }
  //....
})
关于data：
其中data是页面的动态数据，data必须为object
一般建议使用 setData()改变data的数据，它会同步改变data，并异步重新渲染页面

```

3. wxml
```html
页面布局文件，主要使用 Mustache 语法和组件构建页面

1数据绑定
如:{{text}}，使用双大括号获取page.data里的属性
另外括号内能进行简单的数术运算、条件判断等操作

2列表渲染
组件 + wx:for可以实现列表渲染
如：
<view wx:for="{{arr}}" wx:key="*this">{{index}}-{{item}}</view>
效果：
<view>0-one</view>
<view>1-two</view>
<view>2-three</view>
其中数组下标默认用index，数组元素默认用item

可以用wx：key指定数组的唯一键，提高渲染效率(还能记录某些表单组件状态)
1数组元素都是数字或字符串，且都唯一，可以直接用 *this 将数组元素设为key;
2数组元素是对象，且有唯一属性，如id，则wx:key="{{item.id}}"

3条件渲染
组件 + wx:if | wx:elif | wx:else 实现条件渲染
<view wx:if="{{false}}"> 1 </view>
<view wx:elif="{{true}}"> 2 </view>
<view wx:else> 3 </view>
显示：
<view> 2 </view>
可使用<block> + wx:if 控制块区域的条件渲染

4事件
事件分冒泡事件和非冒泡事件(具体查文档)
以下以tap事件（点击事件）为例：
组件可使用bind 或 catch 绑定事件,如：
1 bind:tap(bind不会阻止事件继续冒泡，中间:可省略)
2 catch:tap(catch阻止事件向上冒泡，中间:可省略)

<view data-id="1" data-val="one" bindtap="myfunction">touch me</view>
以上组件绑定了tap事件，并在点击后触发page的myfunction函数
数据通过"data-"传递到事件的dataset
myfunction可以通过入参的事件对象e获取,如e.target.dataset //{id:1, val:"one"}

5其他
另外还有模板，wxs页面脚本等这里不做详述

```

4. wxss
```css
页面样式表，基本与css一致，多了两个特性
1 尺寸单位 rpx ,可根据屏幕尺寸自适应
2 样式导入， 能使用 @import 导入外联样式
```


## 最后
基本看完上面就能进行简单开发了，更深入的自行查文档把。预祝：早日弃了吧！