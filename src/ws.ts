let ws: any = null

export const getWs = () => {
    if (ws) {
        return ws
    } else {
        ws = new WebSocket(process.env.VUE_APP_WS_BASE_URL)
        return ws
    }
}

export const clearWs = () => {
    ws = null
}
