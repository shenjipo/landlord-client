<template>
    <div class="box">
        <div class="box-room">
            <div class="room-item" v-for="item in channelStatus" :key="item.id">
                <div class="soft up" @click="handleSitting(item, 'up')">{{ item.children['up'].name }}</div>
                <div class="soft left" @click="handleSitting(item, 'left')">{{ item.children['left'].name }}</div>
                <div class="soft right" @click="handleSitting(item, 'right')">{{ item.children['right'].name }}</div>
                <div class="center"></div>
            </div>
        </div>
        <div class="box-footer">
            <a-button type="primary">快速加入</a-button>
            <a-button @click="handleExit">退出</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useStore } from '@/store';
import { getWs } from '../ws'

const store = useStore()
const router = useRouter()
let postion = ''
let ws: any

interface child {
    name: string,
    uuid: string
}
const channelStatus = ref<Array<{
    id: number,
    name: string,
    children: {
        up: child,
        left: child,
        right: child,
    }
}>>([])
onMounted(() => {

    initWS()
})

const initWS = () => {
    ws = getWs()

    ws.onopen = () => {
        console.log('onopen')
    }
    ws.onmessage = (event: { data: string }) => {
      
        let ev: { actionName: string, data: any } = JSON.parse(event.data)
        switch (ev.actionName) {
            case 'updataWaitingInfo':
                updataWaitingInfo(ev.data)
                break
            case 'goRoom':
                goRoom(ev.data)
                break

        }
    };
    ws.onclose = (ev: any) => {
        console.log('onclose', ev)
    };
}
const updataWaitingInfo = (data: any) => {
    channelStatus.value = data
}
const goRoom = (par: { roomId: number }) => {
    router.push({
        name: 'Room',
        params: {
            roomId: `${postion}-${par.roomId}`
        }
    })
}
const handleSitting = (item: {
    id: number, name: string, children: {
        up: child,
        left: child,
        right: child,
    }
}, type: string) => {
    postion = type
    ws.send(JSON.stringify({
        actionName: 'sitting',
        data: {
            type: type,
            index: item.id,
            name: store.getUser.name,
            uuid: store.getUser.uuid
        }
    }))
}
const handleExit = () => {
    if ('ontouchstart' in document.documentElement) {
        // @ts-ignore 设置横屏+全屏
        plus.navigator.setFullscreen(false);
        // @ts-ignore
        plus.screen.lockOrientation("portrait-primary")
    }

    router.push({
        name: 'Login'
    })
}
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #555;

    .box-room {
        padding: 20px 20px 0 40px;
        height: calc(100% - 70px);
        display: flex;
        row-gap: 30px;
        column-gap: 30px;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        overflow-y: auto;
        .room-item {
            width: 120px;
            position: relative;
            height: 140px;

            .soft {
                height: 30px;
                width: 30px;
                border: solid 1px #7b7b7b;
                cursor: pointer;
                position: absolute;
                text-align: center;
                color: #94BFFF;
            }

            .center {
                position: absolute;
                width: 60px;
                height: 60px;
                background-image: url(../assets/desk.png);
                left: calc(50% - 30px);
                top: calc(50% - 30px);
                background-size: 60px;
            }

            .up {
                left: calc(50% - 15px);
                top: 0;
            }

            .left {
                bottom: 0;
                left: 0;
            }

            .right {
                bottom: 0;
                right: 0;
            }
        }
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
