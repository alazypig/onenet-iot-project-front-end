<template>
  <div class="wrapper" :style="{minHeight: autoHeight}">
    <!-- 设备信息修改页面 -->
    <Card class="inner">
      <p slot="title" class="title">
        <Icon type="ios-create" />&nbsp;设备信息修改
      </p>
      <Form
        ref="machineInfo"
        :model="machineInfo"
        :label-width="60"
        style="margin-left:47px;margin-top:20px;"
      >
        <FormItem label="设备名称" prop="name">
          <Input v-model="machineInfo.name"></Input>
        </FormItem>
        <FormItem label="设备类型" prop="type">
          <Input v-model="machineInfo.type"></Input>
        </FormItem>
        <FormItem label="设备描述" prop="desc">
          <Input v-model="machineInfo.desc" type="textarea"></Input>
        </FormItem>
        <FormItem style="margin-left:5px;margin-top:40px">
          <Button type="info" @click="handleReset('machineInfo')">重置</Button>
          <Button type="primary" @click="handleSubmit('machineInfo')" class="reset">提交</Button>
          <router-link to="/home/machineInfo" tag="span">
            <Button class="back" type="success">返回</Button>
          </router-link>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      autoHeight: "",
      machineId: "",
      machineInfo: {
        name: "",
        type: "",
        desc: ""
      }
    };
  },
  beforeMount() {
    this.autoHeight = window.innerHeight - 64 + "px";
  },
  mounted() {
    this.getMachineId();
  },
  methods: {
    getMachineId() {
      this.$axios
        .get("/api/machine", {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          this.machineId = res.data.data[0].machineId;
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .put(`/api/machine/${this.machineId}`, this.machineInfo, {
              headers: { token: localStorage.getItem("token") }
            })
            .then(res => {
              if (res.data.data.row > 0) {
                this.$Message.success("修改成功！");
                this.$router.push("/home/machineInfo"); // auto redirect
              } else {
                this.$Message.error("修改失败！");
              }
            })
            .catch(error => {
              console.log(error);
            });
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
  height: 372px;
  margin: auto;
  margin-top: 4%;
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
.back {
  margin-left: 40px;
}
</style>

