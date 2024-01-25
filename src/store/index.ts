import { defineStore } from "pinia";
import { ref, computed } from "vue"


export const useStore = defineStore('store', () => {
    let user = ref<{ name: string, uuid: string }>({
        name: '',
        uuid: '',
    })

    const getUser = computed(() => {
        if (!user.value.uuid) {
            user.value = JSON.parse(sessionStorage.getItem('user') || '')
        }
        return user.value
    })

    const setUser = (par: { name: string, uuid: string }) => {
        sessionStorage.setItem('user', JSON.stringify(par))
        user.value = par
    }

    return {
        getUser,
        setUser
    }
})