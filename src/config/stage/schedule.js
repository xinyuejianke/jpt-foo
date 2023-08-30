const scheduleRouter = {
  route: null,
  name: null,
  title: '排班管理',
  type: 'folder', // 类型: folder, tab, view
  icon: '',
  filePath: 'view/schedule', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '排班列表',
      type: 'view',
      name: 'schedule-list',
      route: '/schedules/list',
      filePath: 'view/schedule/schedule-list.vue',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
    {
      title: '新增排班',
      type: 'view',
      name: 'schedule',
      route: '/schedules/add',
      filePath: 'view/schedule/schedule.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default scheduleRouter
