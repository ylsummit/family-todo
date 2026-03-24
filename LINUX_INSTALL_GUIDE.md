# Linux 安装 Android Studio 指南

## ⚠️ 重要提示

**Android Studio 需要图形界面（桌面环境）**

如果你的 Linux 虚拟机**没有图形界面**（纯命令行），有两种方案：

### 方案 A：使用 Windows/Mac 电脑（推荐）
- 在电脑上下载安装 Android Studio
- 把项目代码拷贝过去
- 打包 APK

### 方案 B：命令行打包（无需图形界面）
- 只安装 Android SDK 命令行工具
- 用 Gradle 命令打包
- 需要配置环境变量

---

## 🖥️ 方案一：有图形界面的 Linux

### 1. 下载 Android Studio

**官网下载：**
```bash
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.26/android-studio-2023.1.1.26-linux.tar.gz -O /tmp/android-studio.tar.gz
```

**或者国内镜像：**
```bash
wget https://mirrors.cloud.tencent.com/android-studio/ide-zips/2023.1.1.26/android-studio-2023.1.1.26-linux.tar.gz -O /tmp/android-studio.tar.gz
```

### 2. 解压安装

```bash
# 解压到 /opt 目录
sudo tar -xzf /tmp/android-studio.tar.gz -C /opt/

# 进入安装目录
cd /opt/android-studio/bin/

# 运行 Android Studio
./studio.sh
```

### 3. 创建桌面快捷方式（可选）

```bash
sudo /opt/android-studio/bin/studio.sh
```

首次运行会提示创建桌面快捷方式。

### 4. 配置 SDK

第一次启动后：
1. 选择 "Standard" 安装类型
2. 等待 SDK 下载（约 2-3 GB）
3. 完成后点 "Finish"

### 5. 打开项目

```
File → Open → 选择 /home/admin/.openclaw/workspace/family-todo-app/android
```

### 6. 打包 APK

```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

---

## 📟 方案二：纯命令行（无图形界面）

### 1. 安装 Java（如果还没装）

```bash
# CentOS/RHEL/Alibaba Cloud Linux
sudo yum install -y java-17-openjdk

# Ubuntu/Debian
sudo apt-get install -y openjdk-17-jdk
```

验证：
```bash
java -version
```

### 2. 下载 Android 命令行工具

```bash
# 创建目录
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk/cmdline-tools

# 下载命令行工具
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip

# 解压
unzip cmdline-tools.zip
mv cmdline-tools latest
```

### 3. 配置环境变量

编辑 `~/.bashrc` 或 `~/.bash_profile`：

```bash
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
```

生效：
```bash
source ~/.bashrc
```

### 4. 安装 SDK 组件

```bash
# 接受许可证
yes | sdkmanager --licenses

# 安装必要组件
sdkmanager "platform-tools"
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
```

### 5. 配置项目

在项目目录创建 `android/local.properties`：

```bash
echo "sdk.dir=$HOME/android-sdk" > /home/admin/.openclaw/workspace/family-todo-app/android/local.properties
```

### 6. 打包 APK

```bash
cd /home/admin/.openclaw/workspace/family-todo-app/android

# 调试版本
./gradlew assembleDebug

# 发布版本
./gradlew assembleRelease
```

### 7. 获取 APK

```bash
# 调试版
ls -la app/build/outputs/apk/debug/app-debug.apk

# 发布版
ls -la app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 推荐方案

**如果你有 Windows/Mac 电脑：**

1. 在电脑上下载 Android Studio：https://developer.android.com/studio
2. 用 scp 把项目拷到电脑：
   ```bash
   scp -r admin@服务器 IP:/home/admin/.openclaw/workspace/family-todo-app/android ~/Downloads/
   ```
3. 电脑上打开打包

**如果你只有 Linux 虚拟机且无图形界面：**

用方案二的命令行方式，或者明天找台有图形界面的电脑。

---

## 📞 有问题随时问！

---

**开发者**: 于小宝 📝
**为用户**: 山哥
