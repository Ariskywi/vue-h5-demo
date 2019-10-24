<template>
    <div class="login-container flex-column">
        <div class="title-container">
            <h3 class="title">
                {{ login.title }}
            </h3>
        </div>
        <div class="flex-row mb10 w300">
            <span class="svg-container">
                <div class="user iconfont icon-user-fill" />
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-user-fill"></use>
                </svg>
            </span>
            <van-field
                class="form-field"
                label="用户名"
                required
                clearable
                v-model="loginForm.userName"
                placeholder="请输入用户名"
            />
        </div>

        <div class="flex-row mb10 w300">
            <span class="svg-container">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                </svg>
            </span>
            <van-field
                class="form-field"
                label="密码"
                required
                clearable
                :value="loginForm.password"
                placeholder="请输入密码"
            />
            <span class="show-pwd" @click="showPwd">
                <svg v-if="passwordType === 'password'" class="icon" aria-hidden="true">
                    <use xlink:href="#icon-eye-close"></use>
                </svg>
                <svg v-else class="icon" aria-hidden="true">
                    <use xlink:href="#icon-eye-open"></use>
                </svg>
            </span>
        </div>

        <van-button type="primary" class="login-btn mb10" @click.native.prevent="handleLogin">
            {{ login.logIn }}
        </van-button>
    </div>
</template>

<script>
import { Field, Button } from 'vant'

export default {
    name: 'Login',
    data() {
        return {
            login: {
                title: '请登录',
                logIn: '登录',
                username: '账号',
                password: '密码'
            },
            loginForm: {
                userName: 'admin',
                password: '1111111'
            },
            passwordType: 'password',
            loading: false,
            showDialog: false
        }
    },
    components: {
        vanField: Field,
        vanButton: Button
    },
    created() {},
    destroyed() {},
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
        },
        validate() {},
        handleLogin() {
            this.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store
                        .dispatch('LoginByUsername', this.loginForm)
                        .then(() => {
                            this.loading = false
                            this.$router.push({ path: this.redirect || '/' })
                        })
                        .catch(() => {
                            this.loading = false
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: @bg;
    padding: 100px 0 0 0;
    overflow: hidden;
    .svg-container {
        color: @dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
    .title-container {
        position: relative;
        .title {
            font-size: 26px;
            color: @light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
    .mb10 {
        margin: 0 0 10px 0;
    }
    .w300 {
        width: 300px;
    }
    .icon {
        font-size: 26px;
    }
    .form-field {
        height: 40px;
    }
    .login-btn {
        width: 80%;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: @dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
