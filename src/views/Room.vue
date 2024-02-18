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
            <div class="left" :style="centerLeft">

                <poker v-for="card, index in leftCard" :key="card.cardClass" :card="card" :style="{ right: card.right }"
                    :index="index" :pos="'left'">

                </poker>
                <div style="position: absolute; right: 100px" class="block" v-if="turn === getServerPos('left')">{{
                    currTime }}</div>
            </div>
            <div class="center" :style="center">
                <poker v-for="card, index in currentCard" :key="card.cardClass" :card="card" :index="index" :pos="'own'"
                    :style="{ left: card.left }">

                </poker>
            </div>
            <div class="right" :style="centerRight">
                <poker v-for="card, index in rightCard" :key="card.cardClass" :card="card" :style="{ left: card.left }"
                    :index="index" :pos="'right'">

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
                <button :class="disabled === 'able' ? '' : 'forbid'" v-if="state === 'play'" @click="sendUpCard">出牌</button>
                <button v-if="canShowGiveUpSendCard" @click="giveUpSendCard">不出</button>
            </div>
            <div class="bottom-card" :style="bottomLeft">
                <poker v-for="card, index in ownCard" :key="card.cardClass" :index="index" :card="card"
                    :style="{ left: card.left }" @update-card-state="updateCardState" :pos="'own'">

                </poker>
            </div>


        </div>

        <a-modal v-model:visible="visible" @ok="goWaitingHall">
            <template #title>
                游戏结束
            </template>
            <div>xxx获胜，返回游戏大厅</div>
        </a-modal>
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
const visible = ref(false)
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
let interval = 30
let hiddenInterval = 100
let centerInterval = 10
// 计算样式
const bottomLeft = computed(() => {
    if (!Array.isArray(ownCard.value)) return {}
    let len = ownCard.value.length

    return {
        left: `calc((100vw - ${(len - 1) * interval}px - ((100vw - 200px) / 8)) / 2)`
    }
})
const centerLeft = computed(() => {
    return {
        right: `calc(50vw + 15%)`
    }
})
const centerRight = computed(() => {
    return {
        left: `calc(50vw + 15%)`
    }
})
const center = computed(() => {
    if (!Array.isArray(currentCard.value)) return {}
    let len = currentCard.value.length

    return {
        left: `calc((100vw - ${(len - 1) * interval}px - ((100vw - 200px) / 8)) / 2)`
    }
})
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

const canShowGiveUpSendCard = computed(() => {

    if (state.value !== 'play') {
        return false
    } else if (state.value === 'play') {
        if (Array.isArray(progress.value) && progress.value.length === 0) {
            return false
        } else if (Array.isArray(progress.value) && progress.value.length > 2) {
            const len = progress.value.length
            console.log('canShowGiveUpSendCard', progress.value)
            // null false null false false
            // null false a  true   true
            // a    null true
            // a    a    true
            return progress.value[len - 1].cardType !== null || progress.value[len - 2].cardType !== null
        }
    }
    return true
})
// 获取当前选中的牌类型
const currPlayType = computed(() => {
    if (!ownCard.value) return 'others'

    let selectedCardList = ownCard.value.filter(item => {
        return item.cardState === 'selected'
    })
    selectedCardList = Utils.copy(selectedCardList)
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
                break
            case 'updateRoomTime':
                updateRoomTime(ev.data)
                break
            case 'endPlay':
                endPlay()
                break
        }
    };
})
// 游戏结束
const endPlay = () => {
    clearTime()
    visible.value = true
}
const goWaitingHall = () => {
    router.push({
        name: 'WaitingHall'
    })
}
// 控制出牌按钮能否点击
const disabled = computed(() => {
    // 自己第一次出牌 符合条件就能出
    // 接在别人后面出牌 需要比大小
    if (!Array.isArray(progress.value)) return 'disabled'
    const len = progress.value.length
    let selectedCardList = (ownCard.value as Array<Card>).filter(item => {
        return item.cardState === 'selected'
    })
    selectedCardList = Utils.copy(selectedCardList)
    selectedCardList = Utils.sortCard(selectedCardList, true)
    if (len === 0) {

        return 'able'
    } else if (len > 2 && progress.value[len - 2].cardType === null
        && progress.value[len - 1].cardType === null) {
        return 'able'
    } else if (len > 0 && ableToSendCard.value && Utils.judgeIsBigger(progress.value[len - 1].card, selectedCardList) === true) {
        return 'able'
    }
    return 'disabled'
})
// 出牌
const sendUpCard = () => {
    if (disabled.value === 'disabled') return Message.warning('当前选中的牌不大于上家，无法出牌!')
    clearTime()

    // 出牌
    sendMessage('playCard', {
        index: Utils.copy(roomId.value),
        position: Utils.copy(position.value),
        playCardList: Utils.SpcialSort(Utils.copy(ownCard.value?.filter(item => item.cardState === 'selected'))),
        playCardType: Utils.copy(currPlayType.value),
        ownCardList: Utils.copy(ownCard.value?.filter(item => item.cardState === 'normal'))
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

// 更新时间信息
const updateRoomTime = (data: { time: number }) => {
    currTime.value = data.time
}
// 更新卡牌信息
const updateCardInfo = (data: {
    downCard: Array<Card>, status: string, turn: string,
    leftCard: Array<Card>, rightCard: Array<Card>, state: string,
    progress: any, currentCard: Nullable<Array<Card>>
}) => {
    console.log(data, 'updateCardInfo')
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
        card.right = `${centerInterval * index}px`
    })
    rightCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${centerInterval * index}px`
    })

    progress.value = data.progress

    if (Array.isArray(data.currentCard)) {
        currentCard.value = data.currentCard
        currentCard.value.forEach((card, index) => {
            card.cardClass = CardClass[card.cardType][card.cardValue]
            card.left = `${interval * index}px`
        })
    }

    if (data.turn === position.value || (data.turn === 'down' && position.value === 'up')) {
        state.value = 'play'
        timerStart()
    } else {
        state.value = 'waitPlay'
    }
    turn.value = data.turn

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
        card.right = `${centerInterval * index}px`
    })
    rightCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${centerInterval * index}px`
    })
    hiddenCard.value.forEach((card, index) => {
        card.cardClass = CardClass[card.cardType][card.cardValue]
        card.left = `${hiddenInterval * index}px`
    })
    if (data.turn === position.value || (data.turn === 'down' && position.value === 'up')) {
        state.value = 'grabbingLandlords'
        timerStart()
    } else {
        state.value = 'waitGrabbingLandlords'
    }

    turn.value = data.turn


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
        position: relative;
        height: 30%;

        .left {
            display: flex;
            align-items: center;
            position: absolute;
            width: 40%;

            height: 100%;
        }

        .right {
            display: flex;
            align-items: center;
            position: absolute;
            width: 50%;
            height: fit-content;
            height: 100%;
        }

        .center {
            position: absolute;
            height: 100%;
        }
    }

    .box-bottom {

        position: relative;
        width: 100%;
        height: 40%;

        .bottom-card {
            display: flex;
            align-items: center;
            width: 50%;
            position: relative;
            height: calc(100% - 60px);

        }

        .bottom-action {

            display: flex;
            align-items: center;
            justify-content: center;

            height: 60px;

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
