<template>
  <div>
    <Layout>
      <Header>
        <HeadBar></HeadBar>
      </Header>
      <Layout>
        <Sider class="sider">
          <Affix :offset-top="64">
            <SideBar></SideBar>
          </Affix>
        </Sider>
        <Layout>
          <Content :style="{'minHeight': autoHeight}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import HeadBar from "../components/Header.vue";
import SideBar from "../components/Sider";

export default {
  name: "home",
  components: {
    HeadBar,
    SideBar
  },
  data() {
    return {
      autoHeight: ""
    };
  },
  beforeMount() {
    this.autoHeight = window.innerHeight - 64 + "px";
  }
};
</script>

<style scoped>
.ivu-layout-header {
  height: 64px;
  line-height: 64px;
  padding: 0;
}
.ivu-layout-sider {
  position: relative;
}
.ivu-layout-sider-children {
  padding-top: 0 !important;
  margin-top: 0 !important;
}
.sider {
  display: block;
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
}
.ivu-layout-content {
  /* padding: 20px; */
  width: 100%;
}
.ivu-divider,
.ivu-divider-vertical {
  margin: 0;
}
</style>