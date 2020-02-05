<template>
    <div>
        <slider-page
            v-for="(page, index) in reportPages"
            :key="page.key"
            :imageUrl="page.url"
            :pageIndex="index"
            :ref="page.key"
            :currentIndex="currentIndex"
            :getImages="getImages"
            @addSlider="addSlider"
            :swiper="swiper"
            :noPrompt="index === sliders.length - 1"
        />
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped></style>

<script>
import { mapState } from 'vuex'
import sliderPage from './pages/sliderPage'

const LOADNUM = 3

export default {
    name: 'sliders',
    props: ['swiper', 'currentIndex', 'reportDate'],
    components: {
        sliderPage
    },
    data() {
        return {
            index: 0,
            sliders: [],
            currentSlider: ''
        }
    },
    computed: {
        ...mapState({
            reportPages: state => state.app.reportPages
        })
    },
    methods: {
        addSlider: function(slider) {
            this.sliders.push({ content: slider })
            this.index += 1
            if (this.sliders.length === this.reportPages.length) {
                this.setSliders()
            }
        },
        setSliders: function() {
            this.$emit('setSliders', this.sliders)
        },
        loadImage: function() {
            this.reportPages.forEach((page, index) => {
                const { key } = page
                const { currentIndex } = this
                if (index >= currentIndex && index - currentIndex < LOADNUM) {
                    if (this.$refs[key] && this.$refs[key].length) {
                        this.$refs[key][0].loadImage()
                    }
                }
            })
        }
    },
    created() {},
    mounted() {
        this.loadImage()
    },
    beforeUpdate() {
        this.loadImage()
    }
}
</script>
