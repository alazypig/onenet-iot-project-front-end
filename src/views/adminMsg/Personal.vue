<template>
  <div class="wrapper" :style="{minHeight: autoHeight}">
    <Card class="inner move">
      <p slot="title" class="title">
        <Icon type="ios-card" />&nbsp;个人信息
      </p>
      <div class="admin">
        <p>
          <Icon type="md-person" />
          &nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：{{admin.name}}
        </p>
        <p>
          <Icon type="md-mail" />
          &nbsp;邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：{{admin.email}}
        </p>
        <p>
          <Icon type="md-phone-portrait" />
          &nbsp;手机号码：{{admin.phone}}
        </p>
        <p>
          <Icon type="ios-time" />
          &nbsp;注册时间：{{admin.createTime}}
        </p>
        <p>
          <Icon type="md-clock" />
          &nbsp;修改时间：{{admin.updateTime}}
        </p>
        <router-link to="/home/modifyInfo" tag="span">
          <Button class="changeBtn" type="primary">修改</Button>
        </router-link>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      autoHeight: "",
      admin: {
        name: "",
        phone: "",
        email: "",
        createTime: "",
        updateTime: ""
      }
    };
  },
  beforeMount() {
    this.getMsg();
    this.autoHeight = window.innerHeight - 64 + "px";
  },
  methods: {
    formatTime(date) {
      let f =
        date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes(); //分
      let s =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds(); //秒
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日" +
        date.getHours() +
        ":" +
        f +
        ":" +
        s
      );
    },
    getMsg() {
      this.$axios
        .get("/api/admin", {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          this.admin.name = res.data.data.name;
          this.admin.phone = res.data.data.phone;
          this.admin.email = res.data.data.email;
          this.admin.createTime = this.$options.methods.formatTime(
            new Date(res.data.data.createTime)
          );
          this.admin.updateTime = this.$options.methods.formatTime(
            new Date(res.data.data.updateTime)
          );
        });
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  background: url("../../assets/bkg.png") no-repeat;
  border: 1px solid #fff;
  background-size: 100% 100%;
}
.inner {
  width: 430px;
  height: 425px;
  margin: auto;
  margin-top: 2%;
}
.title {
  font-size: 18px;
  text-align: center;
  color: #17233d;
}
.photo {
  font-size: 24px;
}
.admin p {
  font-size: 16px;
  text-align: left;
  line-height: 57px;
}
.changeBtn {
  margin-top: 8px;
  margin-left: 115px;
}
.admin {
  margin-left: 60px;
}
/* 让card出现的时候有动画效果 */
.move {
  animation: animated 0.5s;
}
@keyframes animated {
  0% {
    top: 0px;
    left: 0px;
  }
  50% {
    top: 0px;
    left: 3000px;
  }
  100% {
    top: 0px;
    left: 600px;
  }
}
</style>

