<template>
   <div class="login" style="background-color: #e5e9f2;">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <el-row>
                    <el-col :span="14" :offset="5">
                        <el-card :body-style="{ padding: '0px' }">
                            <h1 class="title">Welcome!</h1>
                            <el-form :label-position="labelPosition" :model="loginForm" :rules="loginRules" ref="loginForm" label-width="100px" style="text-align:center">
                                <el-form-item label="用户名" prop="userName">
                                    <el-input placeholder="用户名" v-model="loginForm.userName"></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop="password">
                                    <el-input placeholder="密码" v-model="loginForm.password" type="password">></el-input>
                                </el-form-item>
                                <el-form-item style="width:80%">
                                    <el-button type="primary" @click="login('loginForm')" class="loginBtn">登录</el-button>还没账号？前去<a href="#/register">注册</a>
                                </el-form-item>
                            </el-form>
                            <div style="text-align:center"><img src="../assets/login.jpg"></div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            loginForm: {
                userName: '',
                password: ''
            },
            loginRules: {
                userName: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            },
            labelPosition: 'right'
        }
    },
    mounted() {

    },
    methods: {
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        userName: this.loginForm.userName,
                        password: this.loginForm.password
                    };
                    this.$http.post('/api/login/', params).then(function(res) {
                        if (res.body.success) {
                            sessionStorage.setItem("token", res.body.token);
                            sessionStorage.setItem("userId", res.body.userId);
                            sessionStorage.setItem("userName", res.body.userName);
                            this.changeLoginStatus();
                            this.$router.push('latestBlogs');
                        } else {
                            this.loginForm.userName = '';
                            this.loginForm.password = '';
                            this.$alert(res.body.message);
                        }
                    }, function() {

                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        }
    }
}
</script>

<style scoped>
.login {
    background-color: #e5e9f2;
}
.title {
    margin-top: 10%;
    margin-bottom: 5%;

    text-align: center;

    color: #20a0ff;
}
.el-col {
    background-color: #fff;
}
.content {
    min-height: 90vh;
}
.el-card {
    margin-top: 5%;
    margin-bottom: 5%;
}
.el-form-item {
    width: 85%;
}
.loginBtn {
    margin-right: 10%;
}
</style>
