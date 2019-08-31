<template>
  <div class="wrapper">
    <Row class-name="head">
      <Col span="3">
        <router-link to="/home/msg1" tag="span">
          <!-- link to home -->
          <div class="logo">
            <img src="../assets/logo.png" alt />
          </div>
        </router-link>
      </Col>
      <Col span="16">
        <div class="name">数据边缘网关</div>
      </Col>
      <Col span="2">
        <span class="app" @click="download">
          <Icon type="ios-navigate" class="photo" />下载App
        </span>
      </Col>
      <Col span="3">
        <div class="user">
          <Dropdown @on-click="handleClick">
            <div>
              <Avatar style="background-color: #363e4f" icon="ios-home" />
              <span>{{ adminName }}</span>
              <Icon type="ios-arrow-down" style="color: #fff;"></Icon>
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="personal">个人信息</DropdownItem>
              <DropdownItem name="loginOut" @click="confirm">退出登录</DropdownItem>
              <DropdownItem name="empty" @click="confirm">注销账号</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adminName: ""
    };
  },
  beforeMount() {
    this.getUserName();
  },
  methods: {
    handleClick(name) {
      if (name === "loginOut") {
        // 询问是否退出
        this.$Modal.confirm({
          title: "确定退出该系统？",
          onOk: () => {
            this.$router.push("/login");
          },
          onCancel: () => {
            this.$Message.info("欢迎回来！");
          }
        });
      } else if (name === "personal") {
        this.$router.push("/home/personal");
      } else if (name === "empty") {
        // 先提示用户是否注销账号，用户确定后再执行注销账号操作
        this.$Modal.confirm({
          title: "确定注销账号？",
          content: "<p>执行该操作后，您将不能通过此账号登录本系统，相关数据将被清空！！！</p>",
          onOk: () => {
            this.$axios
              .delete("/api/admin", {
                headers: { token: localStorage.getItem("token") }
              })
              .then(res => {});
            alert("账号注销成功！");
            this.$router.push("/login");
          },
          onCancel: () => {
            this.$Message.info("欢迎回来！");
          }
        });
      }
    },
    getUserName() {
      this.$axios
        .get("/api/admin", {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          this.adminName = res.data.data.name;
        });
    },
    download() { // redirect
      window.location.href = "http://47.111.134.50:8200/api/download/gateway";
    }
  }
};
</script>

<style scoped>
/* 头部样式 */
.head {
  height: 64px;
  line-height: 64px;
}
/* logo样式 */
.logo {
  height: 64px;
  text-align: center;
  cursor: pointer;
}
/* 系统名称样式 */
.name {
  height: 64px;
  font-size: 50px;
  margin-left: 415px;
  color: #fff;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-style: italic;
  cursor: pointer;
}
.user {
  text-align: center;
  height: 64px;
}
.app {
  color: #fff;
  display: inline-block;
  cursor: pointer;
}
.ivu-col-span-2 {
  text-align: center;
}
span {
  font-size: 18px;
  color: #fff;
}
.ivu-dropdown,
.ivu-dropdown-rel {
  height: 64px !important;
}
.photo {
  font-size: 20px;
}
.ivu-dropdown-item {
  font-size: 14px !important;
}
</style>
