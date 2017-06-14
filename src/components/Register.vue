<template>
    <div class="register">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <el-row>
                    <el-col :span="14" :offset="5">
                        <el-card :body-style="{ padding: '0px' }">
                            <h2 class="title">欢迎注册！</h2>
                            <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="100px">
                                <el-form-item label="用户名" prop="userName">
                                    <el-input placeholder="用户名" v-model="registerForm.userName"></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop="pass">
                                    <el-input placeholder="密码" type="password" v-model="registerForm.pass"></el-input>
                                </el-form-item>
                                <el-form-item label="重复密码" prop="checkPass">
                                    <el-input placeholder="重复密码" type="password" v-model="registerForm.checkPass"></el-input>
                                </el-form-item>
                                <el-form-item style="text-align:center;">
                                    <el-button type="primary" style='margin:auto;' @click="submitForm('registerForm')" id="registerBtn">注册</el-button>
                                </el-form-item>
                            </el-form>
                            <div style="text-align:center"><img src="../assets/register.jpg"></div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'register',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.registerForm.checkPass !== '') {
                    this.$refs.registerForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            registerForm: {
                userName: '',
                pass: '',
                checkPass: '',
                sex: '',
                individualResume: ''
            },
            registerRules: {
                userName: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 20,
                    message: '长度在 6 到 20 个字符',
                    trigger: 'blur'
                }],
                pass: [{
                    validator: validatePass,
                    trigger: 'blur'
                }],
                checkPass: [{
                    validator: validatePass2,
                    trigger: 'blur'
                }]
            }
        }
    },
    mounted() {

    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        userName: this.registerForm.userName,
                        password: this.registerForm.pass,
                    };
                    // 创建一个账号密码
                    this.$http.post('/api/register', params).then(
                        function(res) {
                            if (res.body.success) {
                                sessionStorage.setItem("token", res.body.token);
                                sessionStorage.setItem("userId", res.body.userId);
                                sessionStorage.setItem("userName", res.body.userName);
                                alert(res.body.message);
                                this.$router.push('latestBlogs');
                            } else {
                                //this.registerForm.userName='';
                                alert(res.body.message);
                            }
                        },
                        function() {
                            alert("error");
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped>
.register {
    background-color: #e5e9f2;
}
.title {
    margin-top: 5%;
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
</style>
