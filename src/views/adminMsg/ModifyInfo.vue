<template>
  <div class="wrapper" :style="{minHeight: autoHeight}">
    <Card class="inner">
      <p slot="title" class="title">
        <Icon type="ios-card" />个人信息修改
      </p>
      <Form ref="admin" :model="admin" :rules="rules" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input v-model="admin.name"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <Input v-model="admin.phone"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="admin.email"></Input>
        </FormItem>
        <FormItem style="margin-left:53px">
          <Button type="info" @click="handleReset('admin')">重置</Button>
          <Button type="primary" @click="handleSubmit('admin')" class="reset">提交</Button>
          <router-link to="/home/personal" tag="span">
            <Button class="personal" type="success">返回</Button>
          </router-link>
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
    return {
      autoHeight: "",
      admin: {
        name: "",
        phone: "",
        email: ""
      },
      rules: {
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
    this.autoHeight = window.innerHeight - 64 + "px";
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .put("/api/admin", this.admin, {
              headers: { token: localStorage.getItem("token") }
            })
            .then(res => {
              if (res.data.data.row > 0) {
                this.$Message.success("修改成功！");
                this.$router.push("/home/personal"); // auto redirect
              } else {
                this.$Message.error("修改失败！");
              }
            })
            .catch(error => {
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
  background: url("../../assets/bkg.png") no-repeat;
  background-size: 100% 100%;
  border: 1px solid #fff;
}
.inner {
  width: 450px;
  height: 300px;
  margin: auto;
  margin-top: 7%;
}
.ivu-input-wrapper {
  width: 85%;
}
.title {
  font-size: 18px;
  text-align: center;
}
.photo {
  font-size: 24px;
}
.reset,
.personal {
  margin-left: 8px;
}
</style>

