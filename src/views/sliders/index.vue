<template>
    <div>
        <component
            v-for="page in pages"
            :is="page.exp"
            :key="page.key"
            @addSlider="addSlider"
            :swiper="swiper"
        />
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped></style>

<script>
export default {
    name: 'sliders',
    props: ['swiper'],
    data() {
        return {
            index: 0,
            pages: [],
            sliders: [],
            currentSlider: ''
        }
    },
    methods: {
        addSlider: function(slider) {
            this.sliders.push({ content: slider })
            this.index += 1
            if (this.sliders.length === this.pages.length) {
                this.setSliders()
            }
        },
        setSliders: function() {
            this.$emit('setSliders', this.sliders)
        }
    },
    created() {
        const requireComponent = require.context(
            // 其组件目录的相对路径
            './pages',
            // 是否查询其子目录
            false,
            // 匹配基础组件文件名的正则表达式
            /[a-z]\w+\.(vue|js)$/
        )

        requireComponent.keys().forEach(fileName => {
            // 获取和目录深度无关的文件名
            const componentName = fileName
                .split('/')
                .pop()
                .replace(/\.\w+$/, '')
            // 自动添加page
            this.pages.push({
                exp: require(`./pages/${componentName}.vue`).default,
                key: componentName
            })
        })
    },
    mounted() {}
}
</script>
