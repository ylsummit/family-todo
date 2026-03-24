# 家庭待办 APP - Android Studio 打包指南

## 📦 项目结构

```
family-todo-app/
├── android/              # 安卓原生项目
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/family/todo/
│   │   │   ├── res/
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
├── App.js                # React Native 入口
├── package.json
└── src/                  # 源代码
```

## 🚀 打包步骤

### 1. 打开 Android Studio

```
File → Open → 选择 family-todo-app/android 文件夹
```

### 2. 等待 Gradle 同步

第一次打开会下载依赖，可能需要 5-10 分钟。

### 3. 配置签名（可选，用于发布）

**调试版本不需要签名，直接打包即可。**

如果要生成正式签名版本：

1. 创建 keystore：
```bash
keytool -genkey -v -keystore family-todo.keystore -alias family-todo -keyalg RSA -keysize 2048 -validity 10000
```

2. 在 `android/gradle.properties` 添加：
```properties
FAMILY_TODO_UPLOAD_STORE_FILE=/path/to/family-todo.keystore
FAMILY_TODO_UPLOAD_STORE_PASSWORD=你的密码
FAMILY_TODO_UPLOAD_KEY_ALIAS=family-todo
FAMILY_TODO_UPLOAD_KEY_PASSWORD=你的密码
```

### 4. 构建 APK

**方法 A：使用 Android Studio**
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**方法 B：使用命令行**
```bash
cd android

# 调试版本
./gradlew assembleDebug

# 发布版本
./gradlew assembleRelease
```

### 5. 获取 APK

构建完成后，APK 位置：
```
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release.apk
```

## 📱 安装到手机

1. 把 APK 传到手机
2. 设置 → 安全 → 允许安装未知来源应用
3. 点击 APK 安装

## ⚙️ 环境要求

- **Android Studio**: Arctic Fox (2020.3.1) 或更高版本
- **JDK**: 17 或更高
- **Android SDK**: API 34
- **Node.js**: 18 或更高

## 🐛 常见问题

### 1. Gradle 同步失败
```bash
# 清理并重新同步
cd android
./gradlew clean
```

### 2. 找不到 SDK
在 Android Studio 中：
```
File → Project Structure → SDK Location
```
选择正确的 Android SDK 路径。

### 3. 构建内存不足
在 `android/gradle.properties` 增加：
```properties
org.gradle.jvmargs=-Xmx4096m
```

## 📞 技术支持

有问题随时问！

---

**开发者**: 于小宝 📝
**为用户**: 山哥
