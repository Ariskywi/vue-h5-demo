<template>
    <div class="swiper-container" ref="swiperContainer">
        <sliders @setSliders="setSliders" :swiper="swiperInst" />
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.swiper-container {
}
</style>

<script>
import { mapGetters } from 'vuex'
import { Swiper } from 'fex-swiper'
import sliders from '../sliders/index'

export default {
    name: 'home',
    components: {
        sliders
    },
    data() {
        return {
            swiperInst: null
        }
    },
    computed: {
        ...mapGetters(['data'])
    },
    methods: {
        setSliders: function(sliders) {
            this.initSwiper(sliders)
        },
        initSwiper: function(sliders) {
            this.swiperInst = new Swiper({
                container: this.$refs.swiperContainer,
                data: sliders,
                isVertical: false, // 是否垂直方向
                keepDefaultClasses: ['btn'],
                transition: {
                    name: 'slide', // 动画效果
                    duration: 300, // 动画时间
                    direction: 1 // 禁用方向
                }
            })
        }
    },
    mounted() {}
}
</script>
