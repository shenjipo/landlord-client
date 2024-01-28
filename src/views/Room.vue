<template>
    <div class="box">
        <div class="box-head"></div>
        <div class="box-center"></div>
        <div class="box-bottom">
            <poker v-for="card in ownCard" :key="card.cardClass" :pkoer-state="card.cardState"
                :poker-class="card.cardClass">

            </poker>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { getWs } from '@/ws';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Card, CardClass } from '../constant'
import poker from '@/components/poker.vue';


const router = useRouter()
const route = useRoute()



let ws = getWs()

const roomId = ref('')
const postion = ref('')
const ownCard = ref<Array<Card>>()
const leftCard = ref<Array<Card>>()
const rightCard = ref<Array<Card>>()
const topCard = ref<Array<Card>>()

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

const grabbingLandlords = (data: { ownCard: Array<Card>, status: string, score?: Array<number> }) => {
    console.log(data)
    data.ownCard.forEach(card => {
        console.log(card)
        card.cardClass = CardClass[card.cardType][card.cardValue]
    })
    ownCard.value = data.ownCard
    console.log(data)
}
</script>
<style lang="scss" scoped>
.box {
    background: #297077;
    width: 100%;
    height: 100%;

    .box-head {
        display: flex;
        justify-content: center;
    }

    .box-center {
        display: flex;
        justify-content: space-around;
    }

    .box-bottom {
        display: flex;
        justify-content: center;
    }
}
</style>
