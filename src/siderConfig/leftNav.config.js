// 在页面刷新的时候，获取地址栏中的地址
// 路由地址对应左侧导航栏的name，根据路由进行相应的高亮显示
let navConfig = {
  '/home/msg1': '1-1',
  '/home/msg2': '1-2',
  '/home/ctrl1': '2-1',
  '/home/ctrl2': '2-2',
  '/home/machineInfo': '3',
  '/home/tips': '4',
  '/home/personal': '',
  '/home/modifyInfo': '',
  '/home/changeInfo': '3'
};

function getActiveNav(href) {
  return navConfig[href.split('#')[1]];
}

export default getActiveNav;