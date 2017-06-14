// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');

// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));
/************** 定义模式loginSchema **************/
const usersSchema = mongoose.Schema({
    userName: String,
    password: String,
    realName: String,
    sex: String,
    dateOfBirth:String,
    individualResume: String
});

const draftSchema = mongoose.Schema({
    userId: String,
    userName: String,
    title: String,
    tags: Array,
    publicStatus: String,
    content: String,
    html: String,
    saveTime: String
});

const blogSchema = mongoose.Schema({
    userId: String,
    userName: String,
    title: String,
    tags: Array,
    publicStatus: String,
    content: String,
    html: String,
    publishTime: String,
    hitCount: Number
})

/************** 定义模型Model **************/
const Models = {
    Users: mongoose.model('Users', usersSchema),
    Draft: mongoose.model('Draft', draftSchema),
    Blog: mongoose.model('Blog', blogSchema)
}

module.exports = Models;
