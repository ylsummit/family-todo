# 家庭待办 APP (Family Todo)

一个简洁友好的家庭多角色待办事项管理应用，支持任务提醒和家庭成员协作。

## 📱 功能特性

- ✅ **任务管理** - 创建、编辑、删除、完成任务
- ⏰ **定时提醒** - 设置任务提醒时间，准时推送通知
- 👨‍👩‍👧‍👦 **家庭多角色** - 支持多个家庭成员，可分配任务
- 📊 **数据统计** - 查看任务完成率和统计信息
- 🎨 **简洁界面** - 清爽友好的 UI 设计
- 📲 **安卓安装** - 可直接生成 APK 安装包

## 🛠️ 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - 快速开发和构建工具
- **AsyncStorage** - 本地数据存储
- **Expo Notifications** - 本地推送通知
- **React Navigation** - 页面导航

## 🚀 快速开始

### 1. 安装依赖

```bash
cd family-todo-app
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

然后扫码在 Expo Go 应用中预览，或按 `a` 键在安卓模拟器中运行。

### 3. 构建安卓 APK

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置 EAS
eas build:configure

# 构建 APK
eas build -p android --profile preview
```

构建完成后会提供下载链接，下载安装即可使用。

## 📁 项目结构

```
family-todo-app/
├── App.js                 # 应用入口
├── app.json              # Expo 配置
├── package.json          # 依赖配置
├── assets/               # 图片资源
└── src/
    ├── components/       # 可复用组件
    │   └── TaskItem.js   # 任务列表项
    ├── screens/          # 页面组件
    │   ├── HomeScreen.js      # 主页
    │   ├── TaskDetailScreen.js # 任务详情
    │   └── FamilyScreen.js     # 家庭成员
    └── utils/
        └── storage.js    # 数据存储和通知
```

## 🎯 使用说明

### 创建任务
1. 点击主页右下角 `+` 按钮
2. 输入任务标题和描述
3. 选择家庭成员
4. 设置提醒时间（可选）
5. 点击保存

### 切换用户
1. 导航到"家庭成员"页面
2. 点击要切换的成员卡片
3. 创建任务时会自动分配给当前用户

### 查看统计
- 主页顶部显示总任务数、已完成数、完成率

## 📝 后续优化建议

- [ ] 添加任务分类/标签
- [ ] 支持任务优先级
- [ ] 添加任务评论/讨论
- [ ] 云同步功能
- [ ] 深色模式
- [ ] 小组件支持

## 📄 许可证

MIT

---

**开发者**: 于小宝 📝  
**为用户**: 山哥
