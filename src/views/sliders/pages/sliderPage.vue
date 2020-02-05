<template>
    <slider :noPrompt="noPrompt" :firstPage="firstPage">
        <div class="content">
            <img :src="realUrl" :data-src="imageUrl" />
            <van-button
                v-if="firstPage"
                round
                color="#243b5b"
                plain
                @click="onSelection"
                class="historyBtn btn"
            >
                历史查询
            </van-button>
            <van-popup
                class="date-picker"
                v-model="showPicker"
                position="bottom"
                @click="preventHandler"
                @touchmove.prevent
            >
                <van-picker
                    class="date-picker"
                    show-toolbar
                    :columns="dateColumns"
                    @confirm="onChange"
                    @cancel="onCancel"
                    @click="preventHandler"
                    :default-index="defaultIndex"
                />
            </van-popup>
        </div>
    </slider>
</template>

<style rel="stylesheet/less" lang="less">
.content {
    width: 100%;
    height: 100%;
    img {
        width: 100%;
        margin: -64px 0 0 0;
        object-fit: cover;
        object-position: center center;
    }
    .historyBtn {
        position: fixed;
        left: 50%;
        bottom: 15%;
        transform: translate(-50%, 0);
    }
    li.van-picker-column__item--selected {
        color: #3745a5;
    }
}
</style>

<script>
import slider from '../slider'
import { mapState } from 'vuex'
import { Button, Popup, Picker } from 'vant'
import { preventHandler } from '@/utils/index'

export default {
    name: 'sliderPage',
    props: ['swiper', 'noPrompt', 'imageUrl', 'pageIndex', 'getImages'],
    components: {
        slider,
        [Button.name]: Button,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    data() {
        return {
            realUrl: '',
            showPicker: false,
            firstPage: this.pageIndex === 0
        }
    },
    computed: {
        ...mapState({
            dateColumns: state => state.app.dateColumns,
            reportDate: state => state.app.reportDate,
            defaultIndex: state => state.app.dateColumns.indexOf(state.app.reportDate)
        })
    },
    watch: {
        // 解决Popup滑动透传问题
        showPicker(newVal) {
            if (newVal) {
                document
                    .querySelector('.firstPage')
                    .addEventListener('touchmove', preventHandler, { passive: false })
            } else {
                document
                    .querySelector('.firstPage')
                    .removeEventListener('touchmove', preventHandler, { passive: false })
            }
        }
    },
    methods: {
        loadImage: function() {
            const { imageUrl } = this
            this.realUrl = imageUrl
        },
        onSelection(e) {
            this.showPicker = !this.showPicker
        },
        onChange(value, index) {
            // 因微信js-sdk签名使用重定向方式
            document.location = `/index?t=${value}`
            // this.showPicker = !this.showPicker
            // const reportDate = value
            // this.$router.replace({
            //     path: '/index',
            //     query: { t: value }
            // })
            // const { getImages } = this
            // getImages(reportDate)
        },
        onCancel(e) {
            this.showPicker = false
        },
        preventHandler(e) {
            preventHandler(e)
        }
    },
    created() {},
    mounted() {
        this.$emit('addSlider', this.$el)
    }
}
</script>
