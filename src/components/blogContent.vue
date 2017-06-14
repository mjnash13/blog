<template>
    <div class="blogContent">
        <el-row>
            <el-col :span="18" :offset="3" class="contentAll">
                <el-row>
                    <el-col>
                        <img src="../assets/top_picture_4.jpg" class="image">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14" :offset="2">
                        <h1 class="title1">{{blog.title}}</h1>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-breadcrumb separator="|">
                            <el-breadcrumb-item>{{blog.userName}}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{blog.publishTime}}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="4" :offset="10">
                        <div class="title2">阅读数：{{blog.hitCount}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="tags" :span="14" :offset="2">
                        <el-tag :key="tag" v-for="tag in blog.tags" :close-transition="false" type="success">
                            {{tag}}
                        </el-tag>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="content" :span="14" :offset="2">
                        <div v-html='blog.html'></div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'blogContent',
    data() {
        return {
            blog: ''
        }
    },
    created: function() {
        if (sessionStorage.getItem('userId')) {
            this.changeLoginStatus();
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
            let id = this.$route.params.id;
            this.$http.post('/api/blogContent/' + id).then(
                res => {
                    this.blog = JSON.parse(res.body)
                },
                res => console.log('错误' + res)
            )
        }
    },
}
</script>

<style scoped>
.blogContent {
    background-color: #e5e9f2;
}
.image {
    width: 100%;
}
.el-col {
    background-color: #fff;
}
.title1 {
    padding-top: 5%;

    color: #324057;
}
.title2 {
    font-size: 13px;

    color: #999;
}
.tags {
    padding-top: 20px;
}
.content {
    padding-top: 15px;
    padding-bottom: 80px;
}
.contentAll {
    min-height: 90vh;
}
</style>
