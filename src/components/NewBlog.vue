<template>
    <div class="newBlog">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <div class="blogTitle">
                    <el-row>
                        <el-col :span="10" :offset="6">
                            <el-input size="large" placeholder="请输入博客标题" v-model="title" class="blogTitle"></el-input>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-switch v-model="publicStatus" on-color="#13ce66" off-color="#ff4949" on-text="公开" off-text="不公开">
                            </el-switch>
                        </el-col>
                    </el-row>
                </div>
                <el-row>
                    <el-col :span="14" :offset="1">
                        <el-tag :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)" type="primary">
                            {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="middlel" @click="showInput">+ 添加标签</el-button>
                    </el-col>
                    <el-col :span="3" :offset="2">
                        <el-button type="primary" style='margin:auto;' @click='saveDraft'>保存草稿</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" style='margin:auto;' @click='publishBlog'>发布博客</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col :span="22" :offset="1">
                        <markdown-editor v-model="content" ref="markdownEditor"></markdown-editor>
                    </el-col>
                </el-row>
                <el-row class="buttomBtn">
                    <el-col :span="3" :offset="9">
                        <el-button type="primary" style='margin:auto;' @click='saveDraft'>保存草稿</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" style='margin:auto;' @click='publishBlog'>发布博客</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
    getNowFormatDate
} from '../javascript/getNowFormatDate.js'
export default {
    name: 'newBlog',
    data() {
        return {
            title: '',
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            publicStatus: true,
            content: ''
        }
    },
    created: function() {
        if (sessionStorage.getItem('token')) {
            this.changeLoginStatus();
            sessionStorage.setItem('draftId', '未保存');
        } else {
            this.router.push('login');
        }
    },
    methods: {
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
        saveDraft() {
            if (this.title != '') {
                let saveTime = getNowFormatDate();
                let params = {
                    userId: sessionStorage.getItem('userId'),
                    userName: sessionStorage.getItem('userName'),
                    title: this.title,
                    tags: this.dynamicTags,
                    publicStatus: this.publicStatus,
                    content: this.content,
                    html: this.simplemde.markdown(this.content),
                    saveTime: saveTime,
                    draftId: sessionStorage.getItem('draftId')
                }
                this.$http.post('/api/saveDraft', params, {
                    headers: {
                        'x-access-token': sessionStorage.getItem('token')
                    }
                }).then(function(res) {
                        if (res.body.message == 'token error') {
                            this.$alert('请登录', {
                                confirmButtonText: '确定',
                            });
                            this.$emit('change-loginStatusf');
                        } else {
                            sessionStorage.setItem('draftId', res.body.draftId)
                            this.$alert(res.body.message, {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$message({
                                        type: 'info',
                                        message: res.body.message
                                    });
                                }
                            });
                        }
                    },
                    function() {
                        alert("error");
                    });
            } else {
                this.$alert('请填写博客标题', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: '填写博客标题后再保存'
                        });
                    }
                });
            }
        },
        publishBlog() {
            if (this.title == '') {
                this.$alert('请填写博客标题', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: '填写博客标题后再提交'
                        });
                    }
                });
            } else if (this.content == '') {
                this.$alert('请填写博客内容', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: '填写博客内容后再提交'
                        });
                    }
                });
            } else {
                let publishTime = getNowFormatDate();
                let params = {
                    userId: sessionStorage.getItem('userId'),
                    userName: sessionStorage.getItem('userName'),
                    title: this.title,
                    tags: this.dynamicTags,
                    publicStatus: this.publicStatus,
                    content: this.content,
                    html: this.simplemde.markdown(this.content),
                    publishTime: publishTime,
                    draftId: sessionStorage.getItem('draftId')
                }
                this.$http.post('api/saveBlog', params, {
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
                            this.$alert(res.body.message, {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$message({
                                        type: 'info',
                                        message: res.body.message
                                    });
                                }

                            });
                            this.$router.push('latestBlogs');
                        }
                    },
                    function() {
                        alert('error');
                    })
            }
        }
    },
    computed: {
        simplemde() {
            return this.$refs.markdownEditor.simplemde
        }
    },
}
</script>

<style scoped>
.newBlog {
    background-color: #e5e9f2;
}
.el-row {
    &:last-child {
      margin-bottom: 0;
    }
}
.el-col {
    background-color: #fff;
}
.el-switch {
    width: 70px;
}
.content {
    min-height: 90vh;
}
.blogTitle {
    padding-top: 5%;
    padding-bottom: 2%;
}
.el-tag {
    margin-left: 5px;
}
.el-switch {
    margin-top: 25px;
}
.buttomBtn {
    padding-bottom: 70px;
}
</style>
