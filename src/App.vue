<template>
    <div id="app">
        <el-menu v-show="!loginStatus" theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="/" class="menuItem1"><a class="logo">enjoy it</a></el-menu-item>
            <el-submenu index="1">
                <template slot="title">文章阅读</template>
                <el-menu-item index="latestBlogs">最新文章</el-menu-item>
                <el-menu-item index="hottestBlogs">最热文章</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" class="menuItem2">
                <el-input placeholder="请输入内容" v-model="searchInput">
                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="题目" value="1"></el-option>
                        <el-option label="标签" value="2"></el-option>
                        <el-option label="作者" value="3"></el-option>
                    </el-select>
                    <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
            </el-menu-item>
            <el-menu-item class="appLogin" index="login">登录</el-menu-item>
            <el-menu-item index="register">注册</el-menu-item>
        </el-menu>
        <el-menu v-show="loginStatus" theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="/" class="menuItem1"><a class="logo">enjoy it</a></el-menu-item>
            <el-submenu index="1">
                <template slot="title">文章阅读</template>
                <el-menu-item index="latestBlogs">最新文章</el-menu-item>
                <el-menu-item index="hottestBlogs">最热文章</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" class="menuItem2">
                <el-input placeholder="请输入内容" v-model="searchInput">
                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="题目" value="1"></el-option>
                        <el-option label="标签" value="2"></el-option>
                        <el-option label="作者" value="3"></el-option>
                    </el-select>
                    <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
            </el-menu-item>
            <el-submenu index="3">
                <template slot="title">我的博客</template>
                <el-menu-item index="newBlog">写博客</el-menu-item>
                <el-menu-item index="myDrafts">草稿箱</el-menu-item>
                <el-menu-item index="myBlogs">已发布博客</el-menu-item>
            </el-submenu>
            <el-menu-item index="personalCenter">个人中心</el-menu-item>
            <el-menu-item index="logout" @click="logout"><i class="el-icon-close"></i>注销</el-menu-item>
        </el-menu>
        <el-row :gutter="0">
            <el-col :span="24">
                <!--  <div class="main"> -->
                <transition name="fade" mode="out-in">
                    <router-view @change-loginStatus='changeLoginStatus'></router-view>
                </transition>
                <!--  </div> -->
            </el-col>
        </el-row>
        <div class="footer">
            <el-row>
                <el-col :span="24">
                    <div class="footerContent"><a class="record" href="http://www.miitbeian.gov.cn" target="_blank">鄂ICP备17017287号</a>
                        Copyright © 2017 秦子健. All Rights Reserved.
                        <a href="https://github.com/mjnash13" target="_blank"><img class="footerIcon" src="./assets/icon_github.svg"></a>
                        <a href="mailto:qinzj13@gmail.com"><img class="footerIcon" src="./assets/icon-email.svg"></a>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    methods: {
        handleSelect(key, keyPath) {
            if (key == 'logout') {
                this.logout();
            } else if (key != '2') {
                this.$router.push(key);
            }
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        search() {
            this.searchInput = this.searchInput.replace(/(^\s*)|(\s*$)/g, '');
            let params = {
                select: this.select,
                searchInput: this.searchInput
            };
            if (this.searchInput == '') {
                this.$alert('请输入搜索内容', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: `输入搜索内容后再点击搜索`
                        });
                    }
                });
            } else {
                this.$router.push({
                    name: 'search',
                    params: params
                })
            }
        },
        logout() {
            this.loginStatus = false;
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            this.$router.push('latestBlogs');
        },
        changeLoginStatus() {
            this.loginStatus = true;
        }
    },
    data() {
        return {
            activeIndex: '1',
            loginStatus: false,
            visible: false,
            select: '',
            searchInput: '',
        }
    },
}
</script>

<style>
#app {
    position: relative;

    min-height: 100%;
}
.el-menu {
    min-width: 100%;
}
.logo {
    font: 50px ChantelliAntiquaRegular, Helvetica, sans-serif;

    color: #20a0ff;
}
.menuItem1 {
    width: 18%;
}
.el-select .el-input {
    width: 90px;
}
.menuItem2 {
    width: 45%;
}
.appLogin {
    margin-left: 5%;
}
.footer {
    position: absolute;
    bottom: 0;

    width: 100%;
}
.footerContent {
    padding-top: 1%;
    padding-bottom: 1%;
    height: 25px;

    text-align: center;

    color: #f9fafc;
    background-color: #1f2d3d;
}
.footerIcon {
    padding-left: 2%;
    height: 100%;
}
.record {
    text-decoration:none;
    color:white;
}
</style>
