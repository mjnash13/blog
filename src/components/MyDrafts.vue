<template>
    <div class="myDrafts">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <el-row>
                    <el-col>
                        <img src="../assets/top_picture_5.jpg" class="image">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" :offset="3">
                        <div class="title"><span>草稿箱(共 {{ getDraftCount }} 篇)</span></div>
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
                            <el-table-column label="保存日期" min-width="190">
                                <template scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.saveTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="标签" min-width="380">
                                <template scope="scope">
                                    <el-tag :key="tag" v-for="tag in scope.row.tags" :close-transition="false" type="success">
                                        {{tag}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="140">
                                <template scope="scope">
                                    <el-button size="small" @click="editDraft(scope.$index, scope.row._id)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="deleteDraft(scope.$index,scope.row._id)">删除</el-button>
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
    name: 'myDrafts',
    data() {
        return {
            tableData: []
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
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
        fetchData() {
            let params = {
                userId: sessionStorage.getItem('userId')
            }
            this.$http.post('api/myDrafts', params).then(
                function(res) {
                    this.tableData = JSON.parse(res.body);
                },
                function() {
                    alert('error');
                })
        },
        editDraft(index, draftId) {
            this.$router.push({
                name: 'draftContent',
                params: {
                    id: draftId
                }
            })
        },
        deleteDraft(index, draftId) {
            this.$confirm('此操作将永久删除该草稿, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    draftId: draftId,
                    index: index
                }
                this.$http.post('api/deleteDraft', params).then(function(res) {
                    this.tableData.splice(res.body.index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
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
        getDraftCount: function() {
            return this.tableData.length;
        }
    }
}
</script>


<style scoped>
.myDrafts {
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
