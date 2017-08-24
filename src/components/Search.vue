<template>
    <div class="search">
        <el-row>
            <el-col :span="18" :offset="3" class="content">
                <el-row>
                    <el-col>
                        <img src="../assets/top_picture_3.jpg" class="image">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" :offset="2">
                        <div class="title"><span>{{ show }}</span></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22" :offset="1">
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column label="博客标题" min-width="220">
                                <template scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发布日期" min-width="200">
                                <template scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.publishTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="标签" min-width="400">
                                <template scope="scope">
                                    <el-tag :key="tag" v-for="tag in scope.row.tags" :close-transition="false" type="success">
                                        {{tag}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="90">
                                <template scope="scope">
                                    <el-button size="small" @click="readBlog(scope.$index, scope.row._id)">阅读
                                    </el-button>
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
    name: 'search',
    data() {
        return {
            tableData: [],
            show: ''
        }
    },
    created: function() {
        if (sessionStorage.getItem('token')) {
            this.changeLoginStatus();
        }
    },
    mounted() {
        this.fetchData()
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetchData'
    },
    methods: {
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
        fetchData() {
            let params = this.$route.params
            if (!params.searchInput) {
                this.$router.push('/');
            }
            this.$http.post('/api/search', params).then(res => {
                this.tableData = JSON.parse(res.body);
                if (this.$route.params.select == 2) {
                    this.show = '标签包含“' + this.$route.params.searchInput + '”的博客,共' + this.tableData.length + '篇'
                } else if (this.$route.params.select == 3) {
                    this.show = this.$route.params.searchInput + '写的博客,共' + this.tableData.length + '篇'
                } else {
                    this.show = '题目包含“' + this.$route.params.searchInput + '”的博客,共' + this.tableData.length + '篇'
                }
            }, res => {
                alert('err');
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
    },
}
</script>

<style scoped>
.search {
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
