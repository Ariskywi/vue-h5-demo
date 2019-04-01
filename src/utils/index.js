export function loadView (view) {
  return () => import(/* webpackChunkName: "[request]" */ `@/components/${view}.vue`)
}
