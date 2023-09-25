# cesium_custom_popup

## 一.关于项目

### 1.背景

cesium.js 是一款优秀三维地理可视化框架，由于 cesium.js 框架自身没有内置弹窗组件，但在业务开发中，经常遇到各种定制化开发的弹窗提示组件的需求。在此背景下，cesium_custom_popup 库封装开发了一个可实例化的自定义弹窗类。只需一两行代码，就可以 DIY 得到你想要的弹窗。

### 2.版本

```
1.0.0
```

### 3.作者

```
康伟涛
```

## 二.功能特性

- 特性 1：减少开发量，只需实例化弹窗类就可以得到一个自定义弹窗。
- 特性 2：自由定制化，通过 html 字符串即可构建常用弹窗组件，视频弹窗组件。
- 特性 3：样式可编辑，可以通过 option 配置项，来 DIY 你想要的弹窗的样式。
- 特性 4：实时性更新，可以通过实例方法 updateOption(),updateHtml()来实时更新弹窗位置和内容。

## 三.快速开始

### 1.安装

```shell
npm install cesium_custom_popup
```

### 2.引入

```js
import CustomPopup from "cesium_custom_popup";
```

### 3.使用

```js
const popup = new CustomPopup(position, html, type, [option]);
```

## 四.参数

- position

> 作用：弹窗显示位置
>
> 类型：数组
>
> 必需参数：是
>
> ```js
> const position = [lng, lat, elevation];
> ```

- html

  > 作用：弹窗嵌入的内容
  >
  > 类型：字符串
  >
  > 必需参数：是
  >
  > ```js
  > const html = `
  >         <ul style="width: 100%; height: 100%;font-size:22px; color:white;padding top:60px;padding-left:80px">
  >         <li>测试文字111</li>
  >         <li>测试文字222</li>
  >         <li>测试文字333</li>
  >         </ul>`;
  > ```

- type

  > 作用：弹窗类型，’common‘为通用弹窗，’video‘为视频弹窗
  >
  > 类型：字符串
  >
  > 必需参数：是
  >
  > 可选值：'common' 或 'video'
  >
  > ```js
  > const type = `common`;
  > const type = `video`;
  > ```

- option

  > 作用：弹窗类型，’common‘为通用弹窗，’video‘为视频弹窗
  >
  > 类型：对象
  >
  > 必需参数：否
  >
  > ```js
  > const option = {
  >   title, // 弹窗标题，字符串，非必须参数
  >   showTitle, // 是否显示标题，布尔值，非必须参数
  >   showClose, // 是否显示关闭按钮，布尔值，非必须参数
  >   lineHeight, // 连接线高度，整数，非必须参数
  >   lineWidth, // 连接线宽度，整数，非必须参数
  >   lineColor, // 连接线颜色，十六进制颜色值，非必须参数
  >   popupAt, // 弹窗弹出位置，字符串，非必须参数，('left' 或 'center' 或 'right')
  >   borderColor, // 弹窗边框颜色，十六进制颜色值，非必须参数
  >   backgroundColor, // 弹窗背景颜色，十六进制颜色值，非必须参数
  >   scale, // 弹窗缩放比例，整数或浮点数，非必须参数
  > };
  > ```

## 五.方法

- addTo()

  > 作用：添加弹窗
  >
  > 参数：viewer
  >
  > ```js
  > popup.addTo(viewer);
  > ```

- removeFrom()

  > 作用：移除弹窗
  >
  > 参数：viewer
  >
  > ```js
  > popup.removeFrom(viewer);
  > ```

- onClosePopup()

  > 作用：点击弹窗关闭按钮时触发的事件
  >
  > 参数：callback
  >
  > ```js
  > popup.onClosePopup(callback);
  > ```

- updatePosition()

  > 作用：更新弹窗位置
  >
  > 参数：position
  >
  > ```js
  > popup.updatePosition(position);
  > ```

- updateHtml()

  > 作用：更新弹窗内容
  >
  > 参数：html
  >
  > ```js
  > popup.updateHtml(html);
  > ```

## 六.示例

![](C:\Users\kangw\Desktop\cesium学习\cesium弹窗\cesium_custom_popup\image\Snipaste_2023-09-24_19-04-19.png)
