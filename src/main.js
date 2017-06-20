// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import VueSimplemde from 'vue-simplemde'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import Home from './components/home.vue'
import Login from './components/login.vue'
import Register from './components/register.vue'
import LatestBlogs from './components/latestBlogs.vue'
import HottestBlogs from './components/hottestBlogs.vue'
import BlogContent from './components/blogContent.vue'
import NewBlog from './components/newBlog.vue'
import MyDrafts from './components/myDrafts.vue'
import MyBlogs from './components/myBlogs.vue'
import DraftContent from './components/draftContent.vue'
import PersonalCenter from './components/personalCenter.vue'
import Search from './components/search.vue'

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(VueSimplemde);

/* eslint-disable no-new */
const router = new VueRouter({
    /*mode: 'history',*/
    routes: [{
        path: '/',
        component: Home
    }, {
        path: '/login',
        component: Login
    }, {
        path: '/register',
        component: Register
    }, {
        path: '/latestBlogs',
        component: LatestBlogs
    }, {
        path: '/hottestBlogs',
        component: HottestBlogs
    }, {
        path: '/blogContent:id',
        name: 'blogContent',
        component: BlogContent
    }, {
        path: '/newBlog',
        meta: {
            // 进入这个路由是需要登录的
            requireAuth: true,
        },
        component: NewBlog
    }, {
        path: '/myDrafts',
        meta: {
            // 进入这个路由是需要登录的
            requireAuth: true,
        },
        component: MyDrafts
    }, {
        path: '/draftContent:id',
        name: 'draftContent',
        meta: {
            // 进入这个路由是需要登录的
            requireAuth: true,
        },
        component: DraftContent
    }, {
        path: '/myBlogs',
        meta: {
            // 进入这个路由是需要登录的
            requireAuth: true,
        },
        component: MyBlogs
    }, {
        path: '/personalCenter',
        meta: {
            // 进入这个路由是需要登录的
            requireAuth: true,
        },
        component: PersonalCenter
    }, {
        path: '/search:searchInput',
        name: 'search',
        component: Search
    }]
});

router.beforeEach((to, from, next) => {
    // 判断该路由是否需要登录权限
    if (to.meta.requireAuth) {
        if (sessionStorage.getItem('token')) {
            next();
        } else {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    } else {
        next();
    }
});

new Vue({
    el: '#app',
    router: router,
    /* created() {
         this.checkLogin();
     },*/
    methods: {
        /*checkLogin() {
            //检查是否存在session
            if (!sessionStorage.getItem('token')) {
                //如果没有登录状态则跳转到登录页
                this.$router.push('/login');
            } else {
                //否则跳转到登录后的页面
                this.$router.push('/latestBlogs');
            }
        }*/
    },
    render: h => h(App)
});
