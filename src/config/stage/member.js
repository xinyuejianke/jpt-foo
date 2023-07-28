const memberRouter = {
  route: null,
  name: null,
  title: '成员管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/member/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '成员列表',
      type: 'view',
      name: 'member-list',
      route: '/member/list',
      filePath: 'view/member/member-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default memberRouter
