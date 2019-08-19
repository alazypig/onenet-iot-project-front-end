// 左边导航栏一级菜单打开项的配置文件
// 根据路由开启相应的一级菜单的下拉
let openConfig = {
  '/home/msg1': '1',
  '/home/msg2': '1',
  '/home/ctrl1': '2',
  '/home/ctrl2': '2',
  '/home/machineInfo': '3',
  '/home/tips': '4',
  '/home/personal': '',
  '/home/modifyInfo': '',
  '/home/changeInfo': '3'
}

function getOpenKeys(href) {
  return openConfig[href.split('#')[1]];
}
export default getOpenKeys