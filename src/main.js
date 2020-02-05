import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'animate.css'
import 'normalize.css'
import '@/assets/css/main.scss'
import '@/assets/iconfont/iconfont.js'

// import '@/router/permission'
import '@/utils/errorLog'

// import * as filters from './utils/filters'
// register global utility filters.
// Object.keys(filters).forEach(key => {
//     Vue.filter(key, filters[key])
// })

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

// 清除控制台
if (module.hot) {
    // already had this init code
    module.hot.accept()
    module.hot.addStatusHandler(status => {
        if (status === 'prepare') console.clear()
    })
}
