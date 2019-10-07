<template>
  <div class="wrapper" :style="{ minHeight: autoHeight }">
    <div
      class="success"
      v-if="this.tempWarn === '' && this.elecWarn === '' && this.pressWarn === ''"
    >
      <Alert type="success" show-icon closable>系统正常</Alert>
    </div>
    <Alert type="warning" show-icon closable v-if="this.tempWarn != ''">
      系统温度报警
      <template slot="desc">
        <p ref="warn">{{ tempWarn }}</p>
      </template>
      <span slot="close">不再提示</span>
    </Alert>
    <Alert type="warning" show-icon closable v-if="this.elecWarn != ''">
      系统电流报警
      <template slot="desc">
        <p ref="warn">{{ elecWarn }}</p>
      </template>
      <span slot="close">不再提示</span>
    </Alert>
    <Alert type="warning" show-icon closable v-if="this.pressWarn != ''">
      系统承重报警
      <template slot="desc">
        <p ref="warn">{{ pressWarn }}</p>
      </template>
      <span slot="close">不再提示</span>
    </Alert>

    <div class="adjust">
      <Row :gutter="20">
        <Col span="8" :offset="4">
          <p class="text">温度过高时请开启散热扇</p>
          <br />
          <div class="choose">
            <i-switch size="large" @on-change="change" v-model="fanBtn">
              <span slot="open">ON</span>
              <span slot="close">OFF</span>
            </i-switch>
          </div>
          <div class="fan">
            <img src="../../src/assets/fan.png" alt ref="img" />
          </div>
        </Col>
        <Col span="8">
          <Card>
            <p slot="title">
              <Icon type="md-cog"></Icon>PLC信息
            </p>
            <Form ref="plc" :model="plc">
              <FormItem label="运行状态">
                <i-switch v-model="plc.switch" size="large" disabled>
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
                </i-switch>
              </FormItem>
              <FormItem label="PLC选择">
                <CheckboxGroup v-model="plc.checkbox1">
                  <Checkbox label="国产" disabled></Checkbox>
                  <Checkbox label="三菱" disabled></Checkbox>
                  <Checkbox label="西门子" disabled></Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem label="控制设备">
                <CheckboxGroup v-model="plc.checkbox2">
                  <Checkbox label="电机" disabled style="opacity:5"></Checkbox>
                  <Checkbox label="滑台" disabled></Checkbox>
                  <Checkbox label="推杆" disabled></Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  data() {
    return {
      autoHeight: "",
      stompClient: "",
      timer: "",
      tempWarn: "", // over temperature warn
      elecWarn: "", // over electric current warn
      pressWarn: "", // overweight wran
      fanBtn: false,
      fanTimer: null,
      rotateVal: 0,
      plc: {
        switch: false,
        checkbox1: ["三菱"],
        checkbox2: ["电机", "滑台", "推杆"]
      }
    };
  },
  beforeMount() {
    this.autoHeight = window.innerHeight - 64 + "px";
  },
  mounted() {
    this.initWebSocket();
  },
  beforeDestroy() {
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    change(fanBtn) {
      this.$Message.info("指令下发中请耐心等待！");
      
      if (fanBtn) {
        this.$axios
          .get("/api/cmd/fan-open", { // open fan
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.code < 300) {
              this.$Message.success("打开散热扇指令下发成功！");
              clearInterval(this.fanTimer);
              this.fanTimer = setInterval(() => { // start animation
                this.rotateVal += 3;
                this.$refs.img.style.transform =
                  "rotate(" + this.rotateVal + "deg)";
                this.$refs.img.style.transition = "0.1s linear";
              }, 1);
            } else {
              this.$Message.error("打开散热扇指令下发失败！");
              this.fanBtn = false;
              clearInterval(this.fanTimer);
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      } else {
        this.$axios
          .get("/api/cmd/fan-close", { // close fan
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.code < 300) {
              this.$Message.success("关闭扇热扇指令下发成功！");
              clearInterval(this.fanTimer);
            } else {
              this.$Message.error("关闭扇热扇指令下发失败！");
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      }
    },
    initWebSocket() {
      this.connection();
    },
    connection() {
      this.stompClient = Stomp.over(new SockJS("http://47.111.134.50:8200/ws"));
      
      this.stompClient.connect(
        "guest",
        "guest",
        () => {
          this.stompClient.subscribe("/topic/msg", msg => { // subscribe topic than initialize data
            let body = JSON.parse(msg.body);
            this.plc.switch = true;
            if (body.temperatureWarn === "1") {
              this.tempWarn = "设备温度过高！请开启散热扇！";
            }
            if (body.humidityWarn === "1") {
              this.elecWarn = "设备电流过大！";
            }
            if (body.weightWarn === "1") {
              this.pressWarn = "设备受重超载！";
            }
            if (body.fan === "0") {
              this.fanBtn = false;
              clearInterval(this.fanTimer);
            } else if (body.fan === "1") {
              clearInterval(this.fanTimer);
              this.fanBtn = true; //风扇打开
              this.fanTimer = setInterval(() => {
                this.rotateVal += 3;
                this.$refs.img.style.transform =
                  "rotate(" + this.rotateVal + "deg)";
                this.$refs.img.style.transition = "0.1s linear";
              }, 1);
            }
          });
        },
        err => {
          this.$Message.error("webSocket连接错误！");
          console.log(err);
        },
        "/"
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 20px;
  width: 100%;
  background: url("../assets/bkg.png") no-repeat;
  background-size: 100% 100%;
  border: 1px solid #fff;
}
.adjust {
  margin-top: 20px;
}
.text {
  color: #08acf8;
  font-size: 16px;
}
.choose {
  margin-left: 60px;
}
.fan {
  margin-top: 10px;
  width: 128px;
  height: 128px;
  margin-left: 27px;
}
.ivu-switch-disabled {
  opacity: 20 !important;
}
.ivu-checkbox-input {
  opacity: 100 !important;
}
</style>

