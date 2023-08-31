import Utils from '@/lin/util/util'
import adminConfig from './admin'
import memberRouter from './member'
import scheduleRouter from './schedule'
import appointmentRouter from './appointment'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'view/log/log.vue',
    inNav: true,
    permission: ['查询所有日志'],
    icon: 'iconfont icon-iconset0103',
    order: 1,
  },
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'view/center/center.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  adminConfig,
  memberRouter,
  scheduleRouter,
  appointmentRouter
]

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)
deepReduceName(homeRouter)

export default homeRouter


/**
 * 使用 Symbol 处理 name 字段, 保证唯一性
 */
function deepReduceName(target) {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      target.name = target.name || Utils.getRandomStr()
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}
