const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.token,
  refreshToken: state => state.refreshToken,
  expiresInToken: state => state.expiresInToken,
  // avatar: state => state.user.avatar,
  firstName: state => state.user.attributes.first_name,
  lastName: state => state.user.attributes.last_name,
  email: state => state.user.attributes.email,
  roles: state => state.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
