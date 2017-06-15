"use strict";
const models = require('./db');
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
const router = express.Router();

// 创建账号接口
router.post('/api/register', (req, res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    let newAccount = new models.Users({
        userName: req.body.userName,
        password: sha1(req.body.password)
    });

    models.Users.findOne({
        userName: newAccount.userName
    }, function(err, doc) {
        // doc 是单个文档
        if (doc) {
            return res.send({
                success: false,
                message: '用户名已被占用'
            })
        } else {
            // 保存数据newAccount数据进mongoDB
            newAccount.save((err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    data.password = undefined;
                    req.session.user = data;
                    var token = jwt.sign(req.session.user, 'app.get(superSecret)', {
                        expiresIn: 60 * 60 * 24 // 设置过期时间
                    });
                    //return res.send(token);
                    //res.redirect('/latestBlogs');
                    return res.send({
                        success: true,
                        message: '注册成功!',
                        userId: data._id,
                        userName: data.userName,
                        token: token
                    });
                }
            });
        }
    });
});

router.post('/api/login', (req, res) => {
    let userName = req.body.userName;
    let password = sha1(req.body.password);
    models.Users.findOne({
        userName: userName,
        password: password
    }, (err, data) => {
        if (data) {
            data.password = undefined;
            req.session.user = data;
            var token = jwt.sign(req.session.user, 'app.get(superSecret)', {
                expiresIn: 60 * 60 * 24 // 设置过期时间
            });
            return res.send({
                success: true,
                message: '登录成功!',
                userId: data._id,
                userName: data.userName,
                token: token
            });
        } else {
            res.send({
                success: false,
                message: '用户名或密码错误！'
            })
        }
    });
});

//保存草稿
router.post('/api/saveDraft', (req, res) => {
    let newDraft = new models.Draft({
        userId: req.body.userId,
        userName: req.body.userName,
        title: req.body.title,
        tags: req.body.tags,
        publicStatus: req.body.publicStatus,
        content: req.body.content,
        html: req.body.html,
        saveTime: req.body.saveTime
    });

    if (req.body.draftId != '未保存') {
        models.Draft.findByIdAndUpdate(req.body.draftId, {
            title: req.body.title,
            tags: req.body.tags,
            publicStatus: req.body.publicStatus,
            content: req.body.content,
            html: req.body.html,
            saveTime: req.body.saveTime
        }, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                return res.send({
                    success: true,
                    message: '保存草稿成功!',
                    draftId: data._id
                });
            }
        });
    } else {
        newDraft.save((err, data) => {
            if (err) {
                res.send(err);
            } else {
                return res.send({
                    success: true,
                    message: '保存草稿成功!',
                    draftId: data._id
                });
            }
        });
    }
});

//发布博客
router.post('/api/saveBlog', (req, res) => {
    let newBlog = new models.Blog({
        userId: req.body.userId,
        userName: req.body.userName,
        title: req.body.title,
        tags: req.body.tags,
        publicStatus: req.body.publicStatus,
        content: req.body.content,
        html: req.body.html,
        publishTime: req.body.publishTime,
        hitCount: 0
    });
    if (req.body.draftId != '未保存') {
        models.Draft.findByIdAndRemove(req.body.draftId, (err, data) => {
            if (err) {
                res.send(err);
            }
        });
    }
    newBlog.save((err, data) => {
        if (err) {
            res.send(err);
        } else {
            return res.send({
                success: true,
                message: '文章已发布!'
            });
        }
    });
});

//最新文章
router.post('/api/latestBlogs', (req, res) => {
    models.Blog.find({
        publicStatus: true
    }, {
        _id: 1,
        userId: 1,
        userName: 1,
        title: 1,
        publishTime: 1,
        tags: 1,
        hitCount: 1
    }).sort({
        'publishTime': -1
    }).limit(10).exec((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(JSON.stringify(data));
        }
    });
});

//最火文章
router.post('/api/hottestBlogs', (req, res) => {
    models.Blog.find({
        publicStatus: true
    }, {
        _id: 1,
        userId: 1,
        userName: 1,
        title: 1,
        publishTime: 1,
        tags: 1,
        hitCount: 1
    }).sort({
        'hitCount': -1
    }).limit(10).exec((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(JSON.stringify(data));
        }
    });
});

// 查询文章详情路由
router.post('/api/blogContent/:id', function(req, res) {
    models.Blog.findByIdAndUpdate(req.params.id, {
        $inc: {
            hitCount: 1
        }
    }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(JSON.stringify(data));
        }
    });
});

//草稿箱
router.post('/api/myDrafts', (req, res) => {
    models.Draft.find({
        userId: req.body.userId
    }).sort({
        'saveTime': -1
    }).exec((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(JSON.stringify(data));
        }
    });
});

//编辑草稿
router.post('/api/draftContent/:id', (req, res) => {
    models.Draft.findById(req.params.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(JSON.stringify(data));
        }
    });
});

//删除草稿
router.post('/api/deleteDraft', (req, res) => {
    models.Draft.findByIdAndRemove(req.body.draftId, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send({
                index: req.body.index
            })
        }
    });
});

//我的博客
router.post('/api/myBlogs', (req, res) => {
    models.Blog.find({
        userId: req.body.userId
    }).sort({
        'publishTime': -1
    }).exec((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(JSON.stringify(data));
        }
    });
});

//删除博客
router.post('/api/deleteBlog', (req, res) => {
    models.Blog.findByIdAndRemove(req.body.blogId, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send({
                index: req.body.index
            })
        }
    });
});

//个人中心
router.post('/api/personalCenter', (req, res) => {
    models.Users.findById(req.body.userId, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            data.password = undefined;
            res.send(data);
        }
    });
});

//修改个人信息
router.post('/api/saveUserInfo', (req, res) => {
    models.Users.findByIdAndUpdate(req.body.id, {
        realName: req.body.realName,
        sex: req.body.sex,
        dateOfBirth: req.body.dateOfBirth,
        individualResume: req.body.individualResume
    }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send({
                success: true,
                message: '用户信息修改成功!'
            });
        }
    });
});

//修改密码
router.post('/api/modifyPassword', (req, res) => {
    models.Users.findById(req.body.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            if (sha1(req.body.oldPassword) == data.password) {
                models.Users.findByIdAndUpdate(req.body.id, {
                    password: sha1(req.body.newPassword)
                }, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            success: true,
                            message: '密码修改成功!'
                        });
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: '原密码不正确!'
                });
            }
        }
    });
});

//查询

router.post('/api/search', (req, res) => {
    if (req.body.select == 2) {
        models.Blog.find({
            publicStatus: true,
            tags: req.body.searchInput
        }, {
            _id: 1,
            userId: 1,
            userName: 1,
            title: 1,
            publishTime: 1,
            tags: 1,
            hitCount: 1
        }).sort({
            'publishTime': -1
        }).limit(100).exec(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(JSON.stringify(data));
            }
        });
    } else if (req.body.select == 3) {
        models.Blog.find({
            publicStatus: true,
            userName: req.body.searchInput
        }, {
            _id: 1,
            userId: 1,
            userName: 1,
            title: 1,
            publishTime: 1,
            tags: 1,
            hitCount: 1
        }).sort({
            'publishTime': -1
        }).limit(100).exec(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(JSON.stringify(data));
            }
        });
    } else {
        const reg = new RegExp(req.body.searchInput, 'i');
        models.Blog.find({
            publicStatus: true,
            title: {
                $regex: reg,
            }
        }, {
            _id: 1,
            userId: 1,
            userName: 1,
            title: 1,
            publishTime: 1,
            tags: 1,
            hitCount: 1
        }).sort({
            'publishTime': -1
        }).limit(100).exec(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(JSON.stringify(data));
            }
        });
    }
});

module.exports = router;
