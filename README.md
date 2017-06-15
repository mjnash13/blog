# blog
使用vue和node开发的博客系统

一个简单的博客系统
前端使用vue.js框架，后台利用express搭建服务器，数据库使用了mongodb。
实现了登录、注册、文章填写、保存、提交、搜索、个人信息管理等功能。

 - vue2.0+vue-router+vue-resource
 - express+mongodb
 - element-ui组件库
 - markdown编辑器：vue-simplemde

home页面
![](https://github.com/mjnash13/blog/blob/master/previewImg/home.jpg)

登录页面
![](https://github.com/mjnash13/blog/blob/master/previewImg/login.jpg)

注册页面
![](https://github.com/mjnash13/blog/blob/master/previewImg/register.png)

写博客
![](https://github.com/mjnash13/blog/blob/master/previewImg/newblog.jpg)

浏览博客
![](https://github.com/mjnash13/blog/blob/master/previewImg/blogContent.jpg)

用户中心
![](https://github.com/mjnash13/blog/blob/master/previewImg/user.jpg)

### 本地查看方法

查看前端页面
``` bash
# git clone https://github.com/mjnash13/blog.git
# cd blog
# npm install
# npm run dev
# localhost:8080
```
启动服务器
``` bash
安装并运行 MongoDB 服务器
下载mongoose等依赖包
# cd server
# supervisor --harmony index
```
