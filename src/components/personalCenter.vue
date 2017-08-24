<template>
    <div class="personalCenter">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <el-row>
                    <el-col>
                        <img src="../assets/top_picture_7.jpg" class="image">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" :offset="3">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="个人信息" name="userInfo">
                                <el-form :model="userForm" ref="userForm" label-width="120px" class="form">
                                    <el-form-item label="用户名" prop="userName">
                                        <el-input placeholder="用户名" v-model="userForm.userName" :readonly="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="真实姓名" prop="realName">
                                        <el-input placeholder="真实姓名" v-model="userForm.realName" :readonly="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别" prop="sex">
                                        <el-radio-group v-model="userForm.sex" :disabled="true">
                                            <el-radio label="男"></el-radio>
                                            <el-radio label="女"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="出生日期" prop="dateOfBirth">
                                        <el-date-picker v-model="userForm.dateOfBirth" type="date" placeholder="选择日期时间" format="yyyy-MM-dd" :readonly="true">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="个人简介" prop="individualResume">
                                        <el-input type="textarea" v-model="userForm.individualResume" placeholder="个人简介" :rows="3" :readonly="true"></el-input>
                                    </el-form-item>
                                    <el-form-item class="last">
                                        <el-button type="primary" style='margin:auto;' @click="editUserInfo">编辑</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="修改密码" name="modifyPassword">
                                <el-form :model="modifyPasswordForm" :rules="modifyPasswordRules" ref="modifyPasswordForm" label-width="120px" class="form">
                                    <el-form-item label="原密码" prop="oldPassword">
                                        <el-input type="password" v-model="modifyPasswordForm.oldPassword" auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="pass">
                                        <el-input type="password" v-model="modifyPasswordForm.pass" auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="确认密码" prop="checkPass">
                                        <el-input type="password" v-model="modifyPasswordForm.checkPass" auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item class="last">
                                        <div>
                                            <el-button type="primary" style='margin:auto;' @click="submitForm('modifyPasswordForm')">提交</el-button>
                                            <el-button @click="resetForm('modifyPasswordForm')">重置</el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible">
            <el-form :model="editUserForm">
                <el-form-item label="真实姓名" prop="realName" :label-width="formLabelWidth">
                    <el-input placeholder="真实姓名" v-model="editUserForm.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
                    <el-radio-group v-model="editUserForm.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="dateOfBirth" :label-width="formLabelWidth">
                    <el-date-picker v-model="editUserForm.dateOfBirth" type="date" placeholder="选择日期时间" format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="个人简介" prop="individualResume" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="editUserForm.individualResume" placeholder="个人简介" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUserInfo">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'personalCenter',
    data() {
        var validateNewPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.modifyPasswordForm.checkPass !== '') {
                    this.$refs.modifyPasswordForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validateCheckNewPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.modifyPasswordForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            activeName: 'userInfo',
            userForm: {
                userName: '',
                realName: '',
                sex: '',
                dateOfBirth: '',
                individualResume: ''
            },
            dialogFormVisible: false,
            editUserForm: {
                userName: '',
                realName: '',
                sex: '',
                dateOfBirth: '',
                individualResume: ''
            },
            formLabelWidth: '80px',
            modifyPasswordForm: {
                oldPassword: '',
                pass: '',
                checkPass: '',
            },
            modifyPasswordRules: {
                oldPassword: [{
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur'
                }],
                pass: [{
                    validator: validateNewPassword,
                    trigger: 'blur'
                }],
                checkPass: [{
                    validator: validateCheckNewPassword,
                    trigger: 'blur'
                }]
            }
        }
    },
    created: function() {
        if (sessionStorage.getItem('token')) {
            this.changeLoginStatus();
        } else {
            this.router.push('login');
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
        fetchData() {
            let params = {
                userId: sessionStorage.getItem('userId')
            }
            this.$http.post('api/personalCenter', params, {
                headers: {
                    'x-access-token': sessionStorage.getItem('token')
                }
            }).then(
                function(res) {
                    if (res.body.message == 'token error') {
                        this.$alert('请登录', {
                            confirmButtonText: '确定',
                        });
                        this.$emit('change-loginStatusf');
                    } else {
                        this.userForm.userName = res.body.userName;
                        this.userForm.realName = res.body.realName;
                        this.userForm.sex = res.body.sex;
                        this.userForm.dateOfBirth = res.body.dateOfBirth;
                        this.userForm.individualResume = res.body.individualResume;
                    }
                },
                function() {
                    alert('error');
                })
        },
        editUserInfo() {
            this.editUserForm = this.userForm;
            this.dialogFormVisible = true;
        },
        submitUserInfo() {
            let params = {
                id: sessionStorage.getItem('userId'),
                realName: this.editUserForm.realName,
                sex: this.editUserForm.sex,
                dateOfBirth: this.editUserForm.dateOfBirth,
                individualResume: this.editUserForm.individualResume
            }
            this.$http.post('api/saveUserInfo', params, {
                headers: {
                    'x-access-token': sessionStorage.getItem('token')
                }
            }).then(
                res => {
                    if (res.body.message == 'token error') {
                        this.$alert('请登录', {
                            confirmButtonText: '确定',
                        });
                        this.$emit('change-loginStatusf');
                    } else {
                        this.$message(res.body.message);
                        this.dialogFormVisible = false;
                    }
                },
                res => {
                    alert(res);
                })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('此操作将修改您的密码, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            id: sessionStorage.getItem('userId'),
                            oldPassword: this.modifyPasswordForm.oldPassword,
                            newPassword: this.modifyPasswordForm.pass
                        };
                        this.$http.post('/api/modifyPassword', params, {
                            headers: {
                                'x-access-token': sessionStorage.getItem('token')
                            }
                        }).then(res => {
                            if (res.body.message == 'token error') {
                                this.$alert('请登录', {
                                    confirmButtonText: '确定',
                                });
                                this.$emit('change-loginStatusf');
                            } else {
                                this.$message(res.body.message);
                                this.resetForm('modifyPasswordForm');
                            }
                        }, res => {
                            this.$message('error' + res);
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.personalCenter {
    min-height: 90vh;

    background-color: #e5e9f2;
}
.image {
    width: 100%;
}
.el-col {
    background-color: #fff;
}
.form {
    padding-top: 20px;
    padding-right: 90px;
}
.last {
    padding-bottom: 40px;

    text-align: center;
}
.content {
    min-height: 90vh;
}

</style>
