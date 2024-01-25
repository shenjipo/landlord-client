<template>
    <div>
        棋牌室
        {{ roomId }}
        {{ postion }}
    </div>
</template>
<script lang="ts" setup>
import {getWs} from '@/ws';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
let ws = getWs()

const roomId = ref('')
const postion = ref('')
onMounted(() => {
    postion.value = (route.params.roomId as string).split('-')[0]
    roomId.value = (route.params.roomId as string).split('-')[1]
  
    if (ws.readyState !== WebSocket.OPEN) {
        router.push({ name: 'Login' })
        return
    }
    ws.send(JSON.stringify({
        actionName: 'roomWaiting',
        data: {
            channelId: roomId.value,
            type: postion.value
        }
    }))

    ws.onmessage = (event: { data: string }) => {
 
        let ev: { actionName: string, data: any } = JSON.parse(event.data)

        switch (ev.actionName) {
            case 'grabbingLandlords':
                grabbingLandlords(ev.data)
                break
        }
    };
})

const grabbingLandlords = (data: any) => {
   
}
</script>
<style lang="scss" scoped></style>
