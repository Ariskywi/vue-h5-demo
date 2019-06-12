<template>
    <div class="navbar flex-row">
        <div class="logo"></div>
        <div class="menu">
            <el-menu
                :default-active="activeIndex"
                class="nav-menu"
                mode="horizontal"
                :router="true"
                @select="handleSelect"
                background-color="#304156"
                text-color="#fff"
                active-text-color="#1AB7EA"
            >
                <el-menu-item v-if="authCode.includes('C20003')" index="/home/index"
                    >首页</el-menu-item
                >
                <el-submenu
                    v-if="authCode.includes('C20004')"
                    index="/operation"
                >
                    <template slot="title">
                        操作中心
                    </template>
                    <el-menu-item
                        v-if="authCode.includes('C20006')"
                        index="/operation/dashboard"
                    >
                        仪表盘
                    </el-menu-item>
                    <el-menu-item
                        v-if="authCode.includes('C20018')"
                        index="/operation/personal"
                    >
                        个人信息
                    </el-menu-item>
                    <el-submenu
                        v-if="authCode.includes('C20020')"
                        index="/operation/enterprise"
                    >
                        <template slot="title">
                            企业信息
                        </template>
                        <el-menu-item
                            v-if="authCode.includes('C20012')"
                            index="/operation/enterprise/item1"
                        >
                            选项1
                        </el-menu-item>
                        <el-menu-item
                            v-if="authCode.includes('C20021')"
                            index="/operation/enterprise/item2"
                        >
                            选项2
                        </el-menu-item>
                        <el-menu-item
                            v-if="authCode.includes('C20002')"
                            index="/operation/enterprise/item3"
                        >
                            选项3
                        </el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item
                    v-if="authCode.includes('C20008')"
                    index="/message/index"
                    >消息中心</el-menu-item
                >
                <el-submenu v-if="authCode.includes('C25000')" index="/account">
                    <template slot="title">
                        账户管理
                    </template>
                    <el-menu-item
                        v-if="authCode.includes('C25001')"
                        index="/account/manage"
                    >
                        账户信息
                    </el-menu-item>
                    <el-menu-item
                        v-if="authCode.includes('C25001')"
                        index="/account/materials"
                    >
                        资料管理
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </div>

        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <search class="right-menu-item" />

                <error-log
                    class="errLog-container right-menu-item hover-effect"
                />
            </template>

            <el-dropdown
                class="avatar-container right-menu-item hover-effect"
                trigger="click"
            >
                <div class="avatar-wrapper">
                    <svg class="icon user-avatar" aria-hidden="true">
                        <use xlink:href="#icon-avatar"></use>
                    </svg>
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/">
                        <el-dropdown-item>
                            {{ navbar.dashboard }}
                        </el-dropdown-item>
                    </router-link>
                    <a
                        target="_blank"
                        href="https://github.com/PanJiaChen/vue-element-admin/"
                    >
                        <el-dropdown-item>
                            {{ navbar.github }}
                        </el-dropdown-item>
                    </a>
                    <el-dropdown-item divided>
                        <span style="display:block;" @click="logout">{{
                            navbar.logOut
                        }}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ErrorLog from '@/components/ErrorLog'
import Search from '@/components/HeaderSearch'

import { globalStyles } from '@/utils/config'

export default {
    data() {
        return {
            navbar: {
                logOut: '退出登录',
                dashboard: '首页',
                github: '项目地址',
                theme: '换肤',
                size: '布局大小'
            },
            activeIndex: this.$route.path,
            theme: {
                themeColor: globalStyles.themeColor,
                textColor: globalStyles.textColor
            },
            authCode: this.$store.getters.authData.codes
        }
    },
    components: {
        ErrorLog,
        Search
    },
    computed: {
        ...mapGetters(['sidebar', 'name', 'avatar', 'device'])
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key)
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload() // In order to re-instantiate the vue-router object to avoid bugs
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.navbar {
    height: 10%;
    overflow: hidden;
    background-color: $themeColor;

    .logo {
        width: 80px;
        height: 100%;
    }

    .menu {
        flex: 1 0 auto;
        .nav-menu {
            border-bottom: none;
        }
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    font-size: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
