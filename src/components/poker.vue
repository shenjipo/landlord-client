<template>
    <div class="poker" @click="handleClick" :class="getClass">

    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { Card } from '@/constant';
const emit = defineEmits(['updateCardState']);
interface Props {
    card: Card,
    index: number,
    pos: string
}
const props = defineProps<Props>()

const getClass = computed(() => {
    if (props.pos !== 'own') {
        return 'hidden'
    }
    return props.card.cardState === 'selected' ? `${props.card.cardClass} top` : `${props.card.cardClass}`
})
const handleClick = () => {
    emit('updateCardState', props.index)
}
</script>
<style lang="scss" scoped>
.poker {
    width: calc((100vw - 200px) / 8);
    height: 85%;
    background-repeat: no-repeat;
    background-size: contain;

}

.top {
    top: -10px;
}
</style>
