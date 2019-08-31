<template>
  <div class="wrapper" :style="{minHeight: autoHeight}">
    <Card class="inner">
      <p slot="title" class="title">
        <Icon type="md-happy" class="photo"></Icon>管理员登录
      </p>
      <Form
        ref="loginUser"
        :model="loginUser"
        :rules="ruleInline"
        style="width: 240px;margin-left:43px;margin-top:8px;"
      >
        <FormItem prop="name">
          <Input type="text" v-model="loginUser.name" placeholder="请输入姓名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="loginUser.password" placeholder="请输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Checkbox v-model="config.remember">记住密码</Checkbox>
        </FormItem>
        <FormItem>
          <Button type="info" @click="handleCancel('loginUser')">重置</Button>
          <Button type="primary" @click="handleSubmit('loginUser')" class="cancel">登录</Button>
        </FormItem>
        <div>
          <p class="register">
            还没有账号？马上
            <router-link to="/register">注册</router-link>
          </p>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
const Base64 = require("js-base64").Base64;
export default {
  data() {
    return {
      autoHeight: "",
      loginUser: {
        name: "",
        password: ""
      },
      config: {
        remember: ""
      },
      ruleInline: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码长度不小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  beforeMount() {
    this.autoHeight = window.innerHeight + "px";
  },
  created() {
    // load data from cookie
    let name = this.getCookie("name");
    let password = Base64.decode(this.getCookie("password"));
    if (name) {
      // if exisit
      this.loginUser.name = name;
      this.loginUser.password = password;
      this.config.remember = true;
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/account", this.loginUser)
            .then(res => {
              if (res.data.code >= 300) {
                this.$Message.error(res.data.msg);
              } else {
                localStorage.setItem("token", res.data.data.token);
                this.$Message.success("登录成功！欢迎您！");
                this.$router.push("/home");
                this.setUserInfo(); // save user login status
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$Message.error("账号或密码格式不对！");
        }
      });
    },
    handleCancel(name) {
      this.$refs[name].resetFields();
      this.config.remember = false;
      this.loginUser = "";
    },
    setUserInfo() {
      // save to cookie
      if (this.config.remember) {
        this.setCookie("name", this.loginUser.name);
        this.setCookie("password", Base64.encode(this.loginUser.password));
      } else {
        this.setCookie("name", "");
        this.setCookie("password", "");
      }
    },
    // get cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // save cookie
    setCookie(cName, value, days) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + days);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (days == null ? "" : ";expires=" + exdate.toGMTString());
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  background: url("../assets/loginBkg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.inner {
  width: 360px;
  position: absolute;
  top: 34%;
  right: 10%;
}
.title {
  font-size: 18px;
  text-align: center;
}
.photo {
  font-size: 22px;
}
.cancel {
  margin-left: 12px;
}
.register {
  text-align: center;
}
.ivu-form-item {
  text-align: center;
}
</style>