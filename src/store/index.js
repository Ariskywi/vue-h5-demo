import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import errorLog from './errorLog'
import permission from './permission'
import user from './user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        errorLog,
        permission,
        user
    },
    getters
})
