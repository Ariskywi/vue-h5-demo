<template>
    <slider :noPrompt="noPrompt">
        <div class="content"></div>
    </slider>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.content {
    width: 100%;
    height: 100%;
    color: #ffffff;
    background: #8cc0ff url('../../../assets/images/201909/00/00-1.png') no-repeat center;
    background-size: cover;
}
.next-btn {
    border: 1px solid #00ffff;
}
</style>

<script>
import slider from '../slider'
export default {
    name: 'page1',
    props: ['swiper', 'noPrompt'],
    components: {
        slider
    },
    data() {
        return {}
    },
    methods: {},
    created() {},
    mounted() {
        this.$emit('addSlider', this.$el)
    }
}
</script>
