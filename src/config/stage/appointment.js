const appointmentRouter = {
  route: null,
  name: null,
  title: '预约管理',
  type: 'folder', // 类型: folder, tab, view
  icon: '',
  filePath: 'view/appointment', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '预约列表',
      type: 'view',
      name: 'appointment-list',
      route: '/appointments/list',
      filePath: 'view/appointment/appointment-list.vue',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
  ],
}

export default appointmentRouter
