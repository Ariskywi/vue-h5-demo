import request from '@/utils/request'
import config from '@/utils/config'

const app = {
    state: {
        sidebar: {
            opened: sessionStorage.getItem('sidebarStatus')
                ? !!+sessionStorage.getItem('sidebarStatus')
                : true,
            withoutAnimation: false
        },
        reportDate: '201910',
        dateColumns: [],
        reportPages: []
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            state.sidebar.opened = !state.sidebar.opened
            state.sidebar.withoutAnimation = false
            if (state.sidebar.opened) {
                sessionStorage.setItem('sidebarStatus', 1)
            } else {
                sessionStorage.setItem('sidebarStatus', 0)
            }
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            sessionStorage.setItem('sidebarStatus', 0)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        SET_REPORT_DATE: (state, reportDate) => {
            state.reportDate = reportDate
        },
        SET_DATE_COLUMNS: (state, { dateColumns }) => {
            state.dateColumns = dateColumns
        },
        SET_REPORT_PAGES: (state, { reportPages }) => {
            state.reportPages = reportPages
        }
    },
    actions: {
        toggleSideBar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
        closeSideBar({ commit }, { withoutAnimation }) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        toggleDevice({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
        async getDateColumns({ commit }) {
            const res = await request({
                url: '/report/getReportDate',
                method: 'post',
                data: {}
            })
            if (res.success) {
                commit({
                    type: 'SET_DATE_COLUMNS',
                    dateColumns: res.data
                })
            }
        },
        async getReportPages({ commit }, reportDate) {
            const res = await request({
                url: '/report/getReport',
                method: 'post',
                data: {
                    reportDate
                }
            })
            if (res.success) {
                const reportPages = res.data.map(img => ({
                    url: `${config.staticUrl}/${img.url}`,
                    key: `${reportDate}-${img.partId}-${img.partIndex}`
                }))
                commit({
                    type: 'SET_REPORT_PAGES',
                    reportPages
                })
            }
        }
    }
}

export default app
