<template>
    <div class="box">
        <a-input v-model="userName" class="a-input" placeholder="请输入用户名" allow-clear :max-length="10" show-word-limit />
        <div class="tool-tip">{{ toolTip }}</div>
        <a-button style="margin-top: 10px;" type="primary" @click="handleClick">确定</a-button>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
import { v4 as uuidv4 } from 'uuid'
import { clearWs } from '@/ws'

const router = useRouter()
const store = useStore()

const userName = ref('')
const toolTip = ref('')
onMounted(() => {
    clearWs()
})
const handleClick = () => {
    if (userName.value.length <= 0) {
        toolTip.value = '请输入用户名'
        return
    }
    if ('ontouchstart' in document.documentElement) {
        // @ts-ignore 设置横屏+全屏
        plus.navigator.setFullscreen(true);
        // @ts-ignore
        plus.screen.lockOrientation("landscape-primary")
    }
    store.setUser({
        name: userName.value,
        uuid: uuidv4(),
    })
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
