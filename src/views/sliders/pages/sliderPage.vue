<template>
    <slider>
        <div class="content">
            <div class="back-btn btn" @click="goBack">&lt;返回</div>
            <p>Sub Page</p>
        </div>
    </slider>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.content {
    width: 100%;
    height: 100%;
    color: #ffffff;
    background: #82f8ff;
}
.back-btn {
    width: 150px;
}
</style>

<script>
import slider from '../slider'
export default {
    name: 'page2',
    props: ['swiper'],
    components: {
        slider
    },
    data() {
        return {}
    },
    methods: {
        goBack: function(e) {
            this.swiper.swipePrev()
        }
    },
    created() {},
    mounted() {
        this.$emit('addSlider', this.$el)
    }
}
</script>
