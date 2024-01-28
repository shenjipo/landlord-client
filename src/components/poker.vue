<template>
    <div class="poker" @click="handleClick" :class="props.pokerClass">

    </div>
</template>
<script lang="ts" setup>

interface Props {
    pokerClass: string,
    pkoerState: string,
}
const props = defineProps<Props>()

const handleClick = () => {

}
</script>
<style lang="scss" scoped>
.poker {
    width: 90px;
    height: 120px;
    background-repeat: no-repeat;
    background-size: contain;

}
</style>
