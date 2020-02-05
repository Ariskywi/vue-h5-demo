<template>
    <div class="swiper-slider" :class="{ firstPage: firstPage }" ref="slider">
        <slot />
        <div class="prompt" v-if="!noPrompt">
            <bh-prompt animateType="fadeOutUp" infinity="true" />
        </div>
    </div>
</template>

<style rel="stylesheet/less" lang="less" scoped>
.swiper-slider {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
}
.prompt {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, 0);
}
</style>

<script>
import BhPrompt from '../../components/prompt'
export default {
    name: 'slider',
    props: ['noPrompt', 'firstPage'],
    components: {
        BhPrompt
    },
    data() {
        return {}
    }
}
</script>
