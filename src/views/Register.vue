<template>
  <div class="wrapper" :style="{minHeight: autoHeight}">
    <Card class="inner">
      <p slot="title" class="title">
        <Icon type="md-happy" class="photo"></Icon>管理员注册
      </p>
      <Form
        ref="registerUser"
        :model="registerUser"
        :rules="ruleValidate"
        :label-width="80"
        style="margin-top:8px;margin-right:10px"
      >
        <FormItem label="姓名" prop="name">
          <Input v-model="registerUser.name" placeholder="请输入你的姓名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="registerUser.password" placeholder="请输入你的密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="pwdCheck">
          <Input type="password" v-model="registerUser.pwdCheck" placeholder="请再次输入你的密码"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <Input v-model="registerUser.phone" placeholder="请输入你的手机号"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="registerUser.email" placeholder="请输入你的邮箱"></Input>
        </FormItem>
        <FormItem style="margin-right: 65px;margin-bottom:10px">
          <Button type="info" @click="handleReset('registerUser')">重置</Button>
          <Button type="primary" @click="handleSubmit('registerUser')" class="reset">提交</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerUser.password) {
        callback(new Error("与第一次输入的密码不匹配"));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: "",
        password: "",
        phone: "",
        email: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 2,
            message: "姓名不少于两字",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码不小于六位",
            trigger: "blur"
          }
        ],
        pwdCheck: [
          {
            required: true,
            validator: validatePassCheck,
            trigger: "blur"
          },
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码不小于六位",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  beforeMount() {
    this.autoHeight = window.innerHeight + "px";
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/admin", this.registerUser)
            .then(res => {
              if (res.data.code >= 300) {
                this.$Message.error(res.data.msg);
              } else {
                this.$Message.success("注册成功！");
                this.$router.push("/login"); // auto redirect
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          this.$Message.error("信息格式不正确!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
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
.reset {
  margin-left: 12px;
}
.ivu-form-item {
  text-align: center;
}
</style>
