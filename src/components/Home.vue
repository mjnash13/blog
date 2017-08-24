<template>
    <div class="home">
        <img class="background" src="../assets/home_background.jpg" />
        <el-row>
            <el-col :span="20" :offset="2">
                <el-carousel :interval="4000" type="card">
                    <el-carousel-item>
                        <h1>welcome</h1>
                        <h2>这是一个网络日记的平台</h2>
                        <h2>请尽情发挥</h2>
                        <!-- <h2>留下你的感悟</h2> -->
                    </el-carousel-item>
                    <el-carousel-item>
                        <div style="padding-top:30%">
                            <el-button :plain="true" type="success" @click="skip('latestBlogs')">最新文章</el-button>
                            <el-button :plain="true" type="success" @click="skip('hottestBlogs')">最热文章</el-button>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item>
                        <el-row>
                            <el-col :span="12" :offset="2">
                                <h2 style="margin-top:15%">加入我们，分享，学习</h2>
                            </el-col>
                            <el-col :span="8" v-if="btnShow">
                                <el-row>
                                    <el-col>
                                        <el-button class="loginBtn" :plain="true" type="info" @click="skip('login')">登录</el-button>
                                    </el-col>
                                    <el-col>
                                        <el-button :plain="true" type="info" @click="skip('register')">注册</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-carousel-item>
                    <el-carousel-item>
                        <el-row>
                            <el-col :span="12">
                                <img class="dogeImg" src="../assets/home_card_4.jpg">
                            </el-col>
                            <el-col :span="10" :offset="1">
                                <h2>作者简介</h2>
                                <h4>在读硕士研究生</h4>
                                <h4>立志成为高级前端工程师</h4>
                                <h3>联系我：</h3>
                                <a href="https://github.com/mjnash13" target="_blank"><img class="icon" src="../assets/icon_github.svg"></a>
                                <a href="mailto:qinzj13@gmail.com"><img class="icon" src="../assets/icon-email.svg"></a>
                            </el-col>
                        </el-row>
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="8" :offset="8">
                <div class="down">
                    <h3>人的天才只是火花,</h3>
                    <h3>要想使他成为熊熊火焰,</h3>
                    <h3>那就只有学习!学习!</h3>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
          btnShow: true
        }
    },
    created: function() {
        if (sessionStorage.getItem('token')) {
            this.btnShow = false;
            this.changeLoginStatus();
        }
    },
    methods: {
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
        skip: function(destination) {
            this.$router.push(destination)
        },
    }
}
</script>

<style scoped>
.home {
    width: 100%;
    min-height: 90vh;
}
.background {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    z-Index: -1;
}
.el-carousel {
    margin-top: 5%;
}
.el-carousel__item:nth-child(3) {
    text-align: center;

    color: #1f2d3d;
    background-image: url("../assets/home_card_1.jpg");
}
.el-carousel__item:nth-child(4) {
    text-align: center;

    color: #58b7ff;
    background-image: url("../assets/home_card_2.jpg");
}
.el-carousel__item:nth-child(5) {
    text-align: center;

    color: #324057;
    background-image: url("../assets/home_card_3.jpg");
}
.el-carousel__item:nth-child(6) {
    color: #1f2d3d;
    background-color: #99a9bf;
}
.loginBtn {
    margin-top: 20%;
    margin-bottom: 10%;
}
.dogeImg {
    margin-top: 20px;
    margin-left: 20px;
    width: 90%;
}
.icon {
    width: 15%;
    height: 15%;
}
.down {
    width: 100%;
    height: 50%;

    text-align: center;

    opacity: .5;
}
</style>
