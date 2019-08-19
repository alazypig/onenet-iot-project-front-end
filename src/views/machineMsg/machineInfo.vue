<template>
  <!-- 设备信息页面 -->
  <div class="wrapper" :style="{minHeight: autoHeight}">
    <div class="excel">
      <Table border :columns="columns" :data="data1" class="move">
        <template slot-scope="{ row, index }" slot="action">
          <router-link to="/home/changeInfo" tag="span">
            <Button type="info" size="small">修改</Button>
          </router-link>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      autoHeight: "",
      columns: [
        {
          title: "ID 编号",
          key: "id",
          width: 200,
          align: "center"
        },
        {
          title: "设备名称",
          key: "name",
          width: 200,
          align: "center"
        },
        {
          title: "设备类型",
          key: "type",
          width: 200,
          align: "center"
        },
        {
          title: "设备描述",
          key: "describe",
          width: 400,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 100,
          align: "center"
        }
      ],
      data1: []
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
          let data = [];
          for (let i = 0; i < res.data.data.length; i++) {
            data.push({
              key: i,
              id: res.data.data[i].machineId,
              name: res.data.data[i].name,
              describe: res.data.data[i].machineDesc,
              type: res.data.data[i].type
            });
          }
          this.data1 = data;
        });
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
  animation: animated 0.5s;
}
.excel {
  width: 1103px;
  margin: auto;
  margin-top: 6%;
}
.changeBtn {
  margin: 20px 474px;
}
.move {
  animation: animated 0.5s;
}
@keyframes animated {
  0% {
    top: 0;
    left: 0;
  }
  50% {
    top: 0px;
    left: -400px;
  }
  100% {
    top: 0px;
    left: 200px;
  }
}
</style>