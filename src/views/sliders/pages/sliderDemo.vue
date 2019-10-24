<template>
    <slider>
        <div class="content">
            <p>Main Page</p>
            <div class="next-btn btn" @click="nextPage">下一步</div>
        </div>
    </slider>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.content {
    width: 100%;
    height: 100%;
    color: #ffffff;
    background: #8cc0ff;
}
.next-btn {
    border: 1px solid #00ffff;
}
</style>

<script>
import slider from '../slider'
export default {
    name: 'page1',
    props: ['swiper'],
    components: {
        slider
    },
    data() {
        return {}
    },
    methods: {
        nextPage: function(e) {
            this.swiper.swipeNext()
        }
    },
    created() {},
    mounted() {
        this.$emit('addSlider', this.$el)
    }
}
</script>
