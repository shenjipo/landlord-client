declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VUE_APP_BASE_API: string;
            NODE_ENV: 'development' | 'production';
            VUE_APP_WS_BASE_URL: string;
        }
    }
}
export { }