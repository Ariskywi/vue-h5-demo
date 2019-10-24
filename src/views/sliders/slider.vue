<template>
    <div class="swiper-slider" ref="slider">
        <slot />
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.swiper-slider {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: column nowrap;
    width: 100vw;
    height: 100vh;
}
</style>

<script>
export default {
    name: 'slider',
    data() {
        return {}
    }
}
</script>
