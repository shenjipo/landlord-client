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
    index: number
}
const props = defineProps<Props>()

const getClass = computed(() => {
    return props.card.cardState === 'selected' ? `${props.card.cardClass} top` : `${props.card.cardClass}`
})
const handleClick = () => {
    emit('updateCardState', props.index)
}
</script>
<style lang="scss" scoped>
.poker {
    width: 90px;
    height: 120px;
    background-repeat: no-repeat;
    background-size: contain;

}

.top {
    top: 10px;
}
</style>
