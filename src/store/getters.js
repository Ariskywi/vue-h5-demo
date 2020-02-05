const getters = {
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    status: state => state.user.status,
    roles: state => state.user.roles,
    dynamicRoutes: state => state.permission.dynamicRoutes,
    authData: state => state.permission.authData,
    errorLogs: state => state.errorLog.logs
}
export default getters
