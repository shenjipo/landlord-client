<template>
    <div class="box">
        <a-input v-model="userName" class="a-input" placeholder="请输入用户名" allow-clear :max-length="10" show-word-limit />
        <div class="tool-tip">{{ toolTip }}</div>
        <a-button style="margin-top: 10px;" type="primary" @click="handleClick">确定</a-button>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()


const userName = ref('')
const toolTip = ref('')
const handleClick = () => {
    if (userName.value.length <= 0) {
        toolTip.value = '请输入用户名'
        return
    }
    // @ts-ignore 设置横屏+全屏
    plus.navigator.setFullscreen(true);
    // @ts-ignore
    plus.screen.lockOrientation("landscape-primary")
    router.push({
        name: 'WaitingHall'
    })
}
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .tool-tip {
        color: red;
        margin-top: 5px;
        ;
    }

    .a-input {
        width: 50%;
    }
}
</style>
