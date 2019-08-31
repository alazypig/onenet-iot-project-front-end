<template>
  <div class="wrapper">
    <Menu
      ref="leftMenu"
      :active-name="activeNav"
      :open-names="openKeys"
      class="inner"
      @on-select="handleRouter"
      :theme="theme1"
    >
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-stats" />设备数据
        </template>
        <MenuItem name="1-1">
          <Icon type="ios-clock" />实时数据
        </MenuItem>
        <MenuItem name="1-2">
          <Icon type="ios-calendar" />历史数据
        </MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-construct" />设备控制
        </template>
        <MenuItem name="2-1">
          <Icon type="ios-flash" />电机
        </MenuItem>
        <MenuItem name="2-2">
          <Icon type="ios-cube" />其他
        </MenuItem>
      </Submenu>
      <MenuItem name="3">
        <Icon type="ios-folder-open" />设备信息
      </MenuItem>
      <MenuItem name="4">
        <Icon type="md-chatbubbles" />系统中心
      </MenuItem>
    </Menu>
  </div>
</template>
<script>
// 实现页面刷新时，侧边栏仍然停留在之前高亮显示的页面
import getActiveNav from "../siderConfig/leftNav.config.js";
import getOpenKeys from "../siderConfig/openKeys.config.js";

export default {
  data() {
    return {
      theme1: "dark",
      activeNav: "",
      openKeys: [""]
    };
  },
  beforeMount() {
    this.openKeys = getOpenKeys(window.location.href).toString().split("");
    this.activeNav = getActiveNav(window.location.href);
  },
  methods: {
    handleRouter(name) {
      // 设备信息展示页面路由跳转
      if (name === "1-1") this.$router.push("/home/msg1");
      if (name === "1-2") this.$router.push("/home/msg2");

      // 设备控制页面路由跳转
      if (name === "2-1") this.$router.push("/home/ctrl1");
      if (name === "2-2") this.$router.push("/home/ctrl2");

      // 设备信息页面跳转
      if (name === "3") this.$router.push("/home/machineInfo");
      
      // 系统提示页面路由跳转
      if (name === "4") this.$router.push("/home/tips");
    }
  }
};
</script>
<style scoped>
/* 让侧边栏占满 */
.wrapper {
  width: 200px;
  display: block;
  position: absolute;
  left: 0;
  top: 0px;
  bottom: 0;
}
.inner {
  width: 200px;
}

/* 设置左边导航栏的宽及文字居中*/
ul {
  width: 200px !important;
  text-align: center;
}
/* 让导航栏右边的线消失 */
.ivu-menu-vertical.ivu-menu-light:after {
  width: 0px;
  height: 0px;
}
.ivu-menu,
.ivu-menu-item {
  font-size: 18px;
}
i.ivu-icon.ivu-icon-md-chatboxes::before {
  font-size: 18px;
}
/* 覆盖二级菜单默认背景 */
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item:hover {
  background: #515a6e !important;
}
/* 覆盖一级菜单被选中时的默认背景 */
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):hover {
  background: #515a6e !important;
}
/* 二级菜单被选中时的字体颜色 */
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
  color: #2d8cf0;
}
</style>

