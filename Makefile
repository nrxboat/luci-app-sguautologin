# SPDX-License-Identifier: GPL-3.0-only
#
# Copyright (C) 2024
# Based on https://github.com/IDeLoveYou/SGU-Script

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI for SGU Campus Network Auto-Login
LUCI_DESCRIPTION:=韶关学院校园网锐捷认证自动登录工具
LUCI_DEPENDS:=+curl
LUCI_PKGARCH:=all

PKG_VERSION:=1.0.0
PKG_RELEASE:=1

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
