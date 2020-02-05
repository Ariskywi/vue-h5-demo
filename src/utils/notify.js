/*
 * 通知消息等
 * */

import { Dialog, Toast } from 'vant'

export const Alert = function({ msg, title, promot }) {
    Dialog.alert({
        title,
        message: msg
    }).then(promot)
}

export const Loading = function(title = '加载中...') {
    Toast.loading({
        duration: 0,
        message: title,
        forbidClick: true,
        loadingType: 'spinner'
    })
}
export const LoadingHide = function() {
    Toast.clear()
}

export const BaseToast = (message = '') => {
    Toast(message)
}
