<template>
    <div class="draftContent">
        <el-row>
            <el-col :span="18" :offset="3">
                <div class="draftTitle">
                    <el-row>
                        <el-col :span="10" :offset="6">
                            <el-input size="large" placeholder="请输入博客标题" v-model="title"></el-input>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-radio class="radio" v-model="publicStatus" label=true>公开</el-radio>
                            <el-radio class="radio" v-model="publicStatus" label=false>不公开</el-radio>
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
    name: 'draftContent',
    data() {
        return {
            draft: '',
            title: '',
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            publicStatus: true,
            content: ''
        }
    },
    created: function() {
        if (sessionStorage.getItem('userId')) {
            this.changeLoginStatus();
        } else {
            this.router.push('login');
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            let id = this.$route.params.id;
            sessionStorage.setItem('draftId', id);
            this.$http.post('/api/draftContent/' + id).
            then(
                res => {
                    let draft = JSON.parse(res.body);
                    this.title = draft.title;
                    this.dynamicTags = draft.tags;
                    this.publicStatus = draft.publicStatus;
                    this.content = draft.content;
                },
                res => console.log('错误' + res)
            )
        },
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
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
                this.$http.post('/api/saveDraft', params).then(function(res) {
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
                this.$http.post('api/saveBlog', params).then(
                    function(res) {
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
.draftContent {
    background-color: #e5e9f2;
}
.el-col {
    background-color: #fff;
}
.el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
.radio {
    padding-top: 10px;
}
.draftTitle {
    padding-top: 20px;
    padding-bottom: 10px;
}
.buttomBtn {
    padding-bottom: 70px;
}
</style>
