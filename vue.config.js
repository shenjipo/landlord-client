module.exports = {
    lintOnSave: false,
    publicPath: '/landlord/',
    chainWebpack: (config) => {
        config.plugin('define').tap((definitions) => {
            Object.assign(definitions[0], {
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
            })
            return definitions
        })
    }
}