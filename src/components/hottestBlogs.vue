<template>
    <div class="hottestBlogs">
        <el-row>
            <el-col :span="20" :offset="2">
                <div class="pageTitle">最热博客(前10篇)</div>
            </el-col>
            <el-col :span="9" v-for="blog in blogs" :key="blog" :offset="2">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="../assets/top_picture_2.jpg" class="image">
                    <h3 class="title">{{blog.title}}</h3>
                    <div class="author">作者：{{blog.userName}}</div>
                    <div style="padding: 14px;">
                        <el-tag :key="tag" v-for="tag in blog.tags" :close-transition="false" type="success">
                            {{tag}}
                        </el-tag>
                        <div class="bottom clearfix">
                            <time class="time">{{blog.publishTime}}</time>
                            <el-button type="text" class="button" @click='readBlog(blog._id)'>阅读文章</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div style="padding-bottom:80px"></div>
    </div>
</template>

<script>
export default {
    name: 'hottestBlogs',
    data() {
        return {
            blogs: "",
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
    methods: {
        changeLoginStatus() {
            this.$emit('change-loginStatus')
        },
        fetchData() {
            this.$http.post('/api/hottestBlogs/').then(function(res) {
                this.blogs = JSON.parse(res.body);
            }, function() {
                alert('error')
            })
        },
        readBlog(id) {
            this.$router.push({
                name: 'blogContent',
                params: {
                    id: id
                }
            })
        }
    }
}
</script>

<style scoped>
.pageTitle {
    color: #20a0ff;
}
.el-col {
    margin-top: 20px;
}
.time {
    font-size: 13px;

    color: #999;
}
.bottom {
    margin-top: 13px;

    line-height: 12px;
}
.button {
    float: right;

    padding: 0;
}
.image {
    display: block;

    width: 100%;
}
.clearfix:before,
.clearfix:after {
    display: table;

    content: "";
}
.clearfix:after {
    clear: both;
}
.title {
    text-align: center;

    color: #1f2d3d;
}
.author {
    text-align: center;

    color: #1f2d3d;
}
.el-tag {
    margin-left: 5px;
}

</style>
