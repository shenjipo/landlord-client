<template>
    <router-view />
</template>
<script lang="ts" setup>
import { Modal, Button } from '@arco-design/web-vue';
import { h } from 'vue';

const handleClick3 = () => {
    // @ts-ignore
    plus.screen.lockOrientation("landscape-primary")
}


const click2 = () => {
    // @ts-ignore
    plus.navigator.setFullscreen(true);
}
</script>
<style lang="scss"></style>
