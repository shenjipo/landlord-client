<template>
    <div class="box">
        <div class="box-head">
            <div class="hidden-card">
                <poker v-for="card, index in hiddenCard" :key="card.cardClass" :card="card" :style="{ left: card.left }"
                    :index="index">

                </poker>
            </div>
        </div>
        <div class="box-center">
            <div class="left">

                <poker v-for="card, index in leftCard" :key="card.cardClass" :card="card" :style="{ left: card.right }"
                    :index="index">

                </poker>
                <div style="position: absolute; right: 100px" class="block" v-if="turn === getServerPos('left')">{{
                    currTime }}</div>
            </div>
            <div class="right">
                <poker v-for="card, index in rightCard" :key="card.cardClass" :card="card" :style="{ left: card.left }"
                    :index="index">

                </poker>
                <div style="position: absolute; left: 100px" class="block" v-if="turn === getServerPos('right')">{{
                    currTime
                }}</div>
            </div>


        </div>
        <div class="box-bottom">
            <div class="bottom-action">
                <div class="block" v-if="turn === position || (turn === 'down' && position === 'up')">
                    {{ currTime }}{{ currPlayType }}
                </div>
                <button v-if="state === 'grabbingLandlords' && canShowlandlord" @click="handleGrab">抢地主</button>
                <button v-if="state === 'grabbingLandlords' && canShowlandlord" @click="giveUpGrab">不抢</button>
                <button :class="ableToSendCard ? '' : 'forbid'" v-if="state === 'grabbingLandlords' && canShowlandlord"
                    @click="giveUpGrab">出牌</button>
                <button v-if="state === 'grabbingLandlords' && canShowlandlord" @click="giveUpGrab">不出</button>
            </div>
            <div class="bottom-card">
                <poker v-for="card, index in ownCard" :key="card.cardClass" :index="index" :card="card"
                    :style="{ left: card.left }" @update-card-state="updateCardState">

                </poker>
            </div>


        </div>
    </div>
</template>
<script lang="ts" setup>
import { getWs } from '@/ws';
import { onMounted, ref, computed, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Card, CardClass } from '../constant'
import poker from '@/components/poker.vue';
import { Message } from '@arco-design/web-vue';
import { Utils } from '@/Utils'

const router = useRouter()
const route = useRoute()



let ws = getWs()

const roomId = ref('')
const position = ref('')
const ownCard = ref<Array<Card>>()
const leftCard = ref<Array<Card>>()
const rightCard = ref<Array<Card>>()
const hiddenCard = ref<Array<Card>>()
const currentCard = ref<Array<Card>>()
const progress = ref<Array<{
    pos: string,
    card: Array<Card>,
    cardType: string
}>>()
const state = ref('wait')
const turn = ref('')
// 获取绝对位置
const getServerPos = (val: string) => {
    // turn left
    if (position.value === 'left' && val === 'left') {
        return 'right'
    } else if (position.value === 'left' && val === 'right') {
        return 'down'
    } else if (position.value === 'right' && val === 'left') {
        return 'down'
    } else if (position.value === 'right' && val === 'right') {
        return 'left'
    } else if (position.value === 'up' && val === 'left') {
        return 'left'
    } else if (position.value === 'up' && val === 'right') {
        return 'right'
    }
}
// 是否可以展示 抢地主按钮
const canShowlandlord = computed(() => {
    return turn.value === position.value || (turn.value === 'down' && position.value === 'up')
})

// 获取当前选中的牌类型
const currPlayType = computed(() => {
    if (!ownCard.value) return 'others'

    let selectedCardList = ownCard.value.filter(item => {
        return item.cardState === 'selected'
    })
    selectedCardList = Utils.copy(selectedCardList)
    console.log(selectedCardList)
    selectedCardList = Utils.sortCard(selectedCardList, true)
    return Utils.judgeType(selectedCardList)
})
// 当前选中的牌型是否符合规则
const ableToSendCard = computed(() => {
    return Utils.isValidPlayType(currPlayType.value)
})
// 点击卡牌，改变卡牌状态
const updateCardState = (index: number) => {

    if (!ownCard.value?.length) return

    if (ownCard.value[index].cardState === 'selected') {
        ownCard.value[index].cardState = 'normal'
    } else if (ownCard.value[index].cardState === 'normal') {

        ownCard.value[index].cardState = 'selected'
    }


}
onMounted(() => {
    position.value = (route.params.roomId as string).split('-')[0]
    roomId.value = (route.params.roomId as string).split('-')[1]

    if (ws.readyState !== WebSocket.OPEN) {
        router.push({ name: 'Login' })
        return
    }
    ws.send(JSON.stringify({
        actionName: 'roomWaiting',
        data: {
            channelId: roomId.value,
            type: position.value
        }
    }))

    ws.onmessage = (event: { data: string }) => {

        let ev: { actionName: string, data: any } = JSON.parse(event.data)

        switch (ev.actionName) {
            case 'grabbingLandlords':
                grabbingLandlords(ev.data)
                break
            case 'updateLandlordTurn':
                updateTurn(ev.data)
                break
            case 'updateCardInfo':
                updateCardInfo(ev.data)
        }
    };
})
// 控制出牌按钮能否点击
const disabled = computed(() => {
    return 'disabled'
})
// 出牌
const sendUpCard = () => {
    if (disabled.value === 'disabled') return Message.warning('当前选中的牌不大于上家，无法出牌!')
    // 出牌
    sendMessage('playCard', {
        index: roomId.value,
        position: position.value,
        playCardList: Utils.copy(ownCard.value?.filter(item => item.cardState === 'selected')),
        playCardType: Utils.copy(currPlayType.value),
        ownCardList: Utils.copy(ownCard.value?.filter(item => item.cardState === 'noraml'))
    })

}
// 放弃出牌
const giveUpSendCard = () => {
    // 出牌
    sendMessage('notPlayCard', {
        index: roomId.value,
        position: position.value,
    })
}
// 更新抢地主机会
const updateTurn = (par: { turn: string }) => {
    currTime.value = initTime
    turn.value = par.turn
}
// 抢地主
const handleGrab = () => {
    clearTime()
    sendMessage('grabLandlord', {
        index: roomId.value,
        position: position.value,

    })
}
// 不抢地主
const giveUpGrab = () => {
    clearTime()
    sendMessage('giveUpLandlord', {
        index: roomId.value,
        position: position.value,
    })
}

const nextState = () => {
    switch (state.value) {
        // 抢地主时间到
        case 'grabbingLandlords':
            giveUpGrab()
            break
    }
}
const initTime = 300
const currTime = ref(initTime)
let timer: any
const clearTime = () => {
    timer && clearInterval(timer)
    currTime.value = initTime
}
const timerStart = () => {
    currTime.value = initTime
    timer && clearInterval(timer)
    timer = setInterval(() => {
        currTime.value--
        if (currTime.value > 0) {
            updateTime()
        } else {
            nextState()
            clearInterval(timer)
            timer = null
        }
    }, 1000)
}
const updateTime = () => {

    sendMessage('updateTime', {
        time: currTime.value,
        index: parseInt(roomId.value),
        position: position.value
    })
}
// 像服务端发送信息
const sendMessage = (actionName: string, data: any) => {

    ws.send(JSON.stringify({
        actionName,
        data,
    }))
}
let interval = 30
let hiddenInterval = 100

// 更新卡牌信息
const updateCardInfo = (data: {
    downCard: Array<Card>, status: string, turn: string,
    leftCard: Array<Card>, rightCard: Array<Card>, state: string,
    progress: any, currentCard: Nullable<Array<Card>>
}) => {
    if (position.value === 'left') {
        ownCard.value = data.leftCard
        leftCard.value = data.rightCard
        rightCard.value = data.downCard
    } else if (position.value === 'right') {
        ownCard.value = data.rightCard
        leftCard.value = data.downCard
        rightCard.value = data.leftCard
    } else {
        ownCard.value = data.downCard
        leftCard.value = data.leftCard
        rightCard.value = data.rightCard
    }


    ownCard.value = Utils.sortCard(ownCard.value)
    leftCard.value = Utils.sortCard(leftCard.value)
    rightCard.value = Utils.sortCard(rightCard.value)


    ownCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${interval * index}px`
    })
    
    leftCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.right = `${interval * index}px`
    })
    rightCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${interval * index}px`
    })

    progress.value = data.progress
    if (Array.isArray(currentCard)) {
        currentCard.value = data.currentCard
    }

    if (data.turn === position.value || (data.turn === 'down' && position.value === 'up')) {
        state.value = 'play'
    } else {
        state.value = 'waitPlay'
    }
    turn.value = data.turn
    timerStart()
}
// 抢地主
const grabbingLandlords = (data: {
    downCard: Array<Card>, status: string, turn: string,
    leftCard: Array<Card>, rightCard: Array<Card>, hiddenCard: Array<Card>
}) => {


    if (position.value === 'left') {
        ownCard.value = data.leftCard
        leftCard.value = data.rightCard
        rightCard.value = data.downCard
    } else if (position.value === 'right') {
        ownCard.value = data.rightCard
        leftCard.value = data.downCard
        rightCard.value = data.leftCard
    } else {
        ownCard.value = data.downCard
        leftCard.value = data.leftCard
        rightCard.value = data.rightCard
    }
    hiddenCard.value = data.hiddenCard

    ownCard.value = Utils.sortCard(ownCard.value)
    leftCard.value = Utils.sortCard(leftCard.value)
    rightCard.value = Utils.sortCard(rightCard.value)
    hiddenCard.value = Utils.sortCard(hiddenCard.value)

    ownCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${interval * index}px`
    })
    leftCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.right = `${interval * index}px`
    })
    rightCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${interval * index}px`
    })
    hiddenCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${hiddenInterval * index}px`
    })
    if (data.turn === position.value || (data.turn === 'down' && position.value === 'up')) {
        state.value = 'grabbingLandlords'
    } else {
        state.value = 'grabbingLandlords'
    }

    turn.value = data.turn
    timerStart()

}

</script>
<style lang="scss" scoped>
.box {
    background: #297077;
    width: 100%;
    height: 100%;

    // 
    .poker-top {
        top: -10px;
    }

    .forbid {
        background-color: #86909c !important;
        cursor: not-allowed !important;
    }

    .block {
        background: url('/imgs/others/clock.png') no-repeat;
        background-size: contain;
        width: 58px;
        height: 60px;
        display: inline-block;
        margin-top: -1px;
        text-align: center;
        color: #81681c;
        line-height: 60px;
        background-position: center;
        font-weight: bold;
    }

    .box-head {

        height: 30%;

        .hidden-card {
            position: relative;
            height: 100%;
            left: 50%;
            transform: translate(-50%, 0);
            width: 290px;
        }
    }

    .box-center {
        display: flex;
        justify-content: space-between;
        height: 30%;

        .left {
            display: flex;
            align-items: center;
            position: relative;
            width: 40%;
            left: 10%;
            height: 100%;
        }

        .right {
            display: flex;
            align-items: center;
            position: relative;
            width: 50%;
            height: fit-content;
            height: 100%;
        }
    }

    .box-bottom {

        position: relative;
        width: 100%;
        height: 30%;

        .bottom-card {
            display: flex;
            align-items: center;
            width: 50%;
            position: relative;
            height: 100%;
            left: 33%;
        }

        .bottom-action {

            display: flex;
            align-items: center;
            justify-content: center;



            button {
                cursor: pointer;
                background: #00BCD4;
                outline: none;
                border: none;
                color: #fff;
                padding: 5px 10px;
                font-size: 16px;
                border-radius: 5px;
                margin-left: 10px;
            }
        }
    }

    .poker {
        position: absolute;
    }
}
</style>
