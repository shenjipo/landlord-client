<template>
    <div class="box">
        <div class="box-room">

        </div>
        <div class="box-footer">
            <a-button type="primary">快速加入</a-button>
            <a-button>退出</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
let ws = new WebSocket('')

onMounted(() => {
    console.log(process.env.VUE_APP_WS_BASE_URL)
})

const initWS = () => {

}
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #555;

    .box-room {
        padding: 20px 20px 0 20px;
        height: calc(100% - 70px);

    }

    .box-footer {
        position: absolute;
        display: flex;
        justify-content: space-around;
        align-items: center;
        bottom: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        height: 50px;
    }
}
</style>
