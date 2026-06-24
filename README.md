# luci-app-sguautologin

基于 [SGU-Script](https://github.com/IDeLoveYou/SGU-Script) 的 OpenWrt / ImmortalWrt LuCI 应用，用于韶关学院校园网锐捷认证自动登录。

## 功能

- **自动登录** — 检测网络断线后自动执行锐捷网页认证
- **手动开关** — LuCI 界面一键启用/禁用
- **账号管理** — 在 LuCI 界面中安全设置用户名和密码
- **时段控制** — 可设置工作日网络供应时间段（开始/结束时间）
- **夜间不断网模式** — 24 小时全天候运行，网络断开时自动重连
- **运行日志** — 支持在 LuCI 界面中实时查看系统日志和应用日志
- **UA2F 保活** — 自动检测并重启失效的 UA2F 服务
- **自动时间同步** — 启动时自动同步 NTP 时间

## 文件结构

```
luci-app-sguautologin/
├── Makefile                                           # OpenWrt 包构建文件
├── htdocs/luci-static/resources/view/sguautologin/
│   ├── settings.js                                    # LuCI 设置页面 (JS)
│   └── log.js                                         # LuCI 日志页面 (JS)
└── root/
    ├── etc/
    │   ├── config/sguautologin                        # UCI 配置文件
    │   ├── init.d/sguautologin                        # procd 服务管理脚本
    │   └── uci-defaults/40_sguautologin               # 首次安装初始化
    └── usr/
        ├── sbin/sguautologin_script                   # 核心登录脚本
        └── share/
            ├── luci/menu.d/luci-app-sguautologin.json # 菜单注册
            └── rpcd/acl.d/luci-app-sguautologin.json  # ACL 权限控制
```

## 编译

```bash
# 将此项目放至 OpenWrt/ImmortalWrt 源码的 package/ 目录下
cd openwrt
./scripts/feeds update -a
./scripts/feeds install -a
make menuconfig  # 在 LuCI → Applications → luci-app-sguautologin 选中
make package/luci-app-sguautologin/compile V=s
```

或直接安装 ipk：

```bash
opkg install luci-app-sguautologin_*.ipk
```

## LuCI 界面路径

安装后进入 **网络 → 校园网自动登录**：

- **设置** — 启用/禁用、账号密码、时段控制、夜间模式
- **日志** — 实时查看系统日志和应用运行日志

## UCI 配置

配置文件路径：`/etc/config/sguautologin`

```bash
# 启用
uci set sguautologin.login.enabled='1'
uci set sguautologin.login.username='你的学号'
uci set sguautologin.login.password='你的密码'
uci commit sguautologin
/etc/init.d/sguautologin restart
```

## 命令行控制

```bash
/etc/init.d/sguautologin start     # 启动
/etc/init.d/sguautologin stop      # 停止
/etc/init.d/sguautologin restart   # 重启
/etc/init.d/sguautologin enable    # 开机自启
/etc/init.d/sguautologin disable   # 取消自启
```

## 日志查看

```bash
logread -e sguautologin            # 系统日志
cat /var/log/sguautologin.log      # 应用日志
```

## 依赖

- `curl` 或 `wget`
- `luci`（LuCI 界面）
- 可选：`ua2f`（UA2F 防共享检测服务）

## 许可证

MIT License

Copyright (c) 2024 nrxboat

Based on [SGU-Script](https://github.com/IDeLoveYou/SGU-Script) Copyright (c) 2022 IDeLoveYou
