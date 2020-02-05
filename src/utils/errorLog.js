import Vue from 'vue'
import store from '../store'

if (process.env.NODE_ENV === 'production') {
    Vue.config.errorHandler = function(err, vm, info, a) {
        // Don't ask me why I use Vue.nextTick, it just a hack.
        Vue.nextTick(() => {
            store.dispatch('addErrorLog', {
                err,
                vm,
                info,
                url: window.location.href
            })
            console.error(err, info)
        })
    }
}
