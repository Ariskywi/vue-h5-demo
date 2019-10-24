<template>
    <div class="navbar flex-row">
        <div class="logo"></div>
        <div class="menu">
            <van-tabs v-model="active">
                <van-tab title="标签 1">内容 1</van-tab>
                <van-tab title="标签 2">内容 2</van-tab>
                <van-tab title="标签 3">内容 3</van-tab>
                <van-tab title="标签 4">内容 4</van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
// import ErrorLog from '@/components/ErrorLog'
// import Search from '@/components/HeaderSearch'
import { Tab, Tabs } from 'vant'

import { globalStyles } from '@/utils/config'

export default {
    data() {
        return {
            active: 2,
            device: 'mobile',
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
        // ErrorLog,
        // Search,
        vanTab: Tab,
        vanTabs: Tabs
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
