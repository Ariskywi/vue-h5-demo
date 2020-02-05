<template>
    <div class="bh_prompt" :class="animateClass">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-slide-up"></use>
        </svg>
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.bh_prompt {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    width: 1em;
    height: 1em;
    padding: 5px;
    animation-duration: 1.5s;
    animation-delay: 0.5s;
}
</style>

<script>
// import { animateCSS } from '@/utils'
export default {
    name: 'BhPrompt',
    props: ['infinity', 'animateType'],
    data() {
        const { infinity = 'infinite', animateType = '', width, height } = this
        return {
            animateClass: {
                animated: animateType,
                infinite: infinity,
                [animateType]: animateType
            },
            content: '',
            styleObj: {
                width,
                height
            }
        }
    },
    computed: {},
    components: {},
    created() {},
    destroyed() {
        // const { animateType } = this
        // animateCSS('', animateType)
    },
    methods: {}
}
</script>
