<template>
    <div class="swiper">
        <div class="swiper-container" ref="swiperContainer"></div>
        <sliders
            @setSliders="setSliders"
            :swiper="swiperInst"
            :currentIndex="currentIndex"
            :reportDate="reportDate"
        />
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.swiper {
    width: 100%;
    height: 100%;
}
.swiper-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>

<script type="text/javascript">
import { mapMutations, mapActions } from 'vuex'
import { Swiper } from 'fex-swiper'
import sliders from '../sliders/index'
// sliders需要放在swiper-container外,以免影响样式

export default {
    name: 'home',
    props: ['reportDate'],
    components: {
        sliders
    },
    data() {
        return {
            swiperInst: null,
            currentIndex: 0
        }
    },
    methods: {
        ...mapActions(['getDateColumns', 'getReportPages']),
        ...mapMutations({ setReportDate: 'SET_REPORT_DATE' }),
        setSliders: function(sliders) {
            this.swiperInst && this.swiperInst.destroy()
            this.swiperInst = null
            this.currentIndex = 0
            this.initSwiper(sliders)
        },
        initSwiper: function(sliders) {
            const swiperInst = new Swiper({
                container: this.$refs.swiperContainer,
                data: sliders,
                // isVertical: false, // 是否垂直方向
                keepDefaultClasses: [
                    'btn',
                    'date-picker',
                    'van-picker__columns',
                    'van-picker-column__wrapper'
                ],
                transition: {
                    // name: 'rotate' // 动画效果
                    duration: 550 // 动画时间
                    // direction: 1 // 禁用方向
                }
            })

            swiperInst.on('swipeChanged', () => {
                this.currentIndex = swiperInst.getCurrentIndex()
            })
            this.swiperInst = swiperInst
        }
    },
    created() {
        this.getDateColumns()
        const reportDate = this.reportDate || '201910'
        this.setReportDate(reportDate)
        this.getReportPages(reportDate)
    },
    mounted() {}
}
</script>
