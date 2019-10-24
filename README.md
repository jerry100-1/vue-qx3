# testhome-h5

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 项目配置说明

- 授权/落地/分享/支付域名及授权appid通过后端接口获取：Fortune/Index/getConfig
- “我的”页面中“联系客服”、“关注测测运势公众号图片”以及“优惠券[支付]有效时间”通过后台数据字典配置，数据字典key：productConfig
- 用户投诉后的跳转地址通过数据字典配置，数据字典key：complaintJumpUrl
- 首页顶部banner及banner下方橱窗位通过后台配置：甲子占卜后台管理系统-产品端管理-通用配置-首页广告图配置
- 首页测算产品图通过后台配置：甲子占卜后台管理系统-产品端管理-商品管理-商品列表
- 分享内容配置：甲子占卜后台管理系统-产品端管理-通用配置-分享内容配置
- 分享参数获取：Fortune/Index/getWxConfig，需要后端确保appid与落地域名对应，并且落地域名/分享域名都要配置到微信管理后台的js安全域名中

## 运行说明

- 命令行npm run dev运行后在微信开发者工具中输入url：http://落地域名/main，如：http://test.gzhh5.tatoutiao.com/main （需要先配置nginx/apache以及host才能用域名访问本机项目，见第三步）
- 微擎测算产品页面在calculateGather-server项目中，需要本地搭建php环境，浏览器中访问项目地址以执行安装
    - ai面相页面：code/lh/addons/hc_face/template/mobile
    - 塔罗牌页面：code/lh/addons/zunyue_taluopai/template/mobile
    - 运势运程测算页面：code/lh/addons/zunyue_ysyccs/template/mobile
    - 由于微擎那边没统一分辨率和单位，修改样式时请分别按以下设置：
        - ai面相：将设计稿宽度设为375px，以vw为单位，值为设计稿上标的值/3.75
        - 塔罗牌：将设计稿宽度设为640px，以rem为单位，值为设计稿上标的值/50
        - 运势运程：将设计稿宽度设为750px，以rem为单位，值为设计稿上标的值/100
- apache配置：

  ```
  <VirtualHost *:80>
    ServerName test.gzhh5.tatoutiao.com
    ProxyPassMatch ^/main/(.*)$ http://test.gzhh5.tatoutiao.com:8080/main/$1
    ProxyPass /main http://test.gzhh5.tatoutiao.com:8080/main/
    ProxyPassReverse /main http://test.gzhh5.tatoutiao.com:8080/main/
  </VirtualHost>
  ```

  host配置（仅供参考，域名可能已换）：
  
  ```
  127.0.0.1 test.gzhh5.tatoutiao.com
  127.0.0.1 pay.gzhh5.tatoutiao.com
  127.0.0.1 testshare.tatoutiao.com

  10.7.30.64 recapi.meite.com
  10.7.30.64 adminrec.meite.com testrecreg.meite.com testrec.meite.com
  ```

## 打包说明

- npm run build打包后应将dist目录下的文件复制到：calculateGather-server项目根目录/code/lh/main/
