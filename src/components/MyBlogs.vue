<template>
     <div class="myBlogs">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <el-row>
                    <el-col>
                        <img src="../assets/top_picture_6.jpg" class="image">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" :offset="3">
                        <div class="title"><span>我的博客(共 {{ getBlogCount }} 篇)</span></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22" :offset="1">
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column label="博客标题" min-width="200">
                                <template scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发布日期" min-width="190">
                                <template scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.publishTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="标签" min-width="380">
                                <template scope="scope">
                                    <el-tag :key="tag" v-for="tag in scope.row.tags" :close-transition="false" type="success" hit=true>
                                        {{tag}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="140">
                                <template scope="scope">
                                    <el-button size="small" @click="readBlog(scope.$index, scope.row._id)">查看</el-button>
                                    <el-button size="small" type="danger" @click="deleteBlog(scope.$index,scope.row._id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'myBlogs',
    data() {
        return {
            getDraftCount: 10,
            tableData: []
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
            this.$http.post('api/myBlogs', params, {
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
                        this.tableData = JSON.parse(res.body);
                    }
                },
                function() {
                    alert('error');
                })
        },
        readBlog(index, blogId) {
            this.$router.push({
                name: 'blogContent',
                params: {
                    id: blogId
                }
            })
        },
        deleteBlog(index, blogId) {
            this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    blogId: blogId,
                    index: index
                }
                this.$http.post('api/deleteBlog', params, {
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
                        this.tableData.splice(res.body.index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    computed: {
        getBlogCount: function() {
            return this.tableData.length;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myBlogs {
    background-color: #e5e9f2;
}
.image {
    width: 100%;
}
.title {
    padding-top: 25px;

    font-size: 20px；;

    color: #20a0ff;
}
.el-table {
    margin-top: 25px;
    margin-bottom: 80px;
}
.el-col {
    background-color: #fff;
}
.content {
    min-height: 90vh;
}
</style>
