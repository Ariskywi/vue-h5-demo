<template>
    <div id="app">
        <router-view />
        <div class="loading-wrapper" v-if="loading">
            <van-overlay :show="loading" />
            <van-loading class="loading" size="64px" type="spinner" color="#1989fa" vertical>
                加载中...
            </van-loading>
        </div>
    </div>
</template>

<style scoped lang="less">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    width: 100%;
}
.loading-wrapper {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}
</style>

<script type="text/javascript">
import { Loading, Overlay } from 'vant'
export default {
    name: 'App',
    components: {
        [Loading.name]: Loading,
        [Overlay.name]: Overlay
    },
    data() {
        return {
            loading: true
        }
    },
    created() {
        window.onload = () => {
            this.loading = false
        }
    },
    mounted() {
        setTimeout(() => {
            this.loading = false
        }, 1000)
    }
}
</script>
