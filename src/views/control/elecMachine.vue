<template>
  <!-- 电机信息页面及控制页面 -->
  <div class="wrapper">
    <!-- 电机信息 -->
    <Row :gutter="20">
      <!-- 仪表盘 -->
      <Col span="8">
        <Card>
          <div id="dashBoard" class="myChart"></div>
        </Card>
      </Col>
      <!-- 折线图 -->
      <Col span="16">
        <Card>
          <div id="brokenLine" class="line" :style="{width: autoWidth}"></div>
          <!-- 日期选择查询 -->
          <div class="selectTime">
            <Form :model="timeSelect">
              <FormItem>
                <DatePicker
                  type="datetimerange"
                  placeholder="请选择日期和时间"
                  style="width: 300px"
                  v-model="value"
                ></DatePicker>
                <Button type="primary" :size="buttonSize1" class="sure" @click="handleQuery()">查询</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </Col>
    </Row>
    <br />
    <!-- 电机开关转向速度信息 -->
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="md-cog"></Icon>电机的状态
          </p>
          <Form ref="elecCtrl" :model="elecCtrl">
            <FormItem label="运行状态">
              <i-switch v-model="elecCtrl.switch" size="large" disabled>
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>
            <FormItem label="转向" prop="turn">
              <RadioGroup v-model="elecCtrl.turn">
                <Radio label="1" disabled>
                  <Icon type="ios-redo" />顺时针（正转）
                </Radio>
                <Radio label="0" disabled>
                  <Icon type="ios-undo" />逆时针（反转）
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem style="margin-left:36px">
              <Button type="primary" @click="modal = true">控制</Button>
              <Button type="info" @click="handleStop" style="margin-left: 35px">停止</Button>
              <!-- 弹框设置电机的状态 -->
              <Modal title="设置电机的状态" v-model="modal" :mask-closable="false" @on-ok="control">
                <Form ref="changeForm" :model="changeForm">
                  <FormItem label="转向" prop="turn">
                    <RadioGroup v-model="changeForm.turn">
                      <Radio label="1">
                        <Icon type="ios-redo" />顺时针（正转）
                      </Radio>
                      <Radio label="0">
                        <Icon type="ios-undo" />逆时针（反转）
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="转速" prop="speed">
                    <RadioGroup v-model="changeForm.speed">
                      <Radio label="slow">慢速（350~450r/min）</Radio>
                      <Radio label="middle">中速（450~550r/min）</Radio>
                      <Radio label="fast">快速（550~650r/min）</Radio>
                    </RadioGroup>
                  </FormItem>
                </Form>
              </Modal>
            </FormItem>
            <!-- 电机图片 -->
            <div class="photo">
              <img src="../../assets/elec.png" alt title="电机" />
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  data() {
    return {
      autoWidth: "",
      stompClient: "",
      timer: "",
      elecCtrl: {
        turn: "",
        switch: false
      },
      buttonSize1: "small", // search button size
      value: "",
      timeSelect: {
        start: "",
        end: ""
      },
      realSpeed: 0,
      time: [], // time data
      speed: [], // speed data
      modal: false,
      changeForm: {
        turn: "",
        speed: ""
      }
    };
  },
  beforeMount() {
    this.defaultHistory();
    this.autoWidth = window.screen.availWidth - 750 + "px";
  },
  mounted() {
    this.initWebSocket();
    this.init();
  },
  beforeDestroy() {
    this.disconnect();
    clearInterval(this.timer);
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
    init() {
      let dashBoard = this.$echarts.init(document.getElementById("dashBoard"));
      let brokenLine = this.$echarts.init(
        document.getElementById("brokenLine")
      );
      dashBoard.setOption({
        series: [
          {
            name: "设备参数",
            type: "gauge",
            detail: { formatter: "{value}r/min" },
            data: [{ value: this.realSpeed, name: "转速" }],
            min: 300,
            max: 700,
            title: {
              color: "#08acf8"
            },
            splitNumber: 8,
            fontWeight: "bloder",
            radius: "80%",
            axisLine: {
              lineStyle: {
                color: [[7 / 8, "#91c7ae"], [1, "#c23531"]]
              }
            }
          }
        ]
      });
      brokenLine.showLoading({
        // loading animation
        text: "加载中",
        color: "#4cbbff",
        textColor: "#4cbbff",
        maskColor: "rgba(255, 255, 255, 0.8)"
      });
      brokenLine.setOption({
        // show history data
        title: {
          text: "电机转速记录(单位r/min)"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["电机转速"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            restore: {}
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.time
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: "电机转速",
            type: "line",
            stack: "总量",
            data: this.speed
          }
        ]
      });
    },
    handleStop() {
      this.$Message.info("指令下发中请耐心等待！");
      this.$axios
        .get("/api/cmd/motor-stop", {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code < 300) {
            this.$Message.success("电机停止指令发送成功！");
          } else if (res.data.code >= 300) {
            this.$Message.error("电机停止指令发送失败！");
          }
        })
        .catch(error => {
          this.$Message.error("接口或处理逻辑出错！");
          console.log(error);
        });
    },
    control() {
      this.$Message.info("指令下发中请耐心等待！");
      if (this.changeForm.turn === "1") {
        this.$axios
          .get("/api/cmd/motor-forward", {
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.code < 300) {
              this.$Message.success("控制电机正转指令下发成功！");
            } else if (res.data.code >= 300) {
              this.$Message.error("控制电机正转指令下发失败！");
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      } else if (this.changeForm.turn === "0") {
        this.$axios
          .get("/api/cmd/motor-reverse", {
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            console.log(this.elecCtrl.turn);
            console.log(typeof this.elecCtrl.turn);
            if (res.data.code < 300) {
              this.$Message.success("控制电机反转指令下发成功！");
            } else if (res.data.code >= 300) {
              this.$Message.error("控制电机反转指令下发失败！");
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      }
      if (this.changeForm.speed === "slow" && this.elecCtrl.switch) {
        this.$axios
          .get("/api/cmd/motor-slow", {
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.code < 300) {
              this.$Message.success("控制电机慢速指令下发成功！");
            } else if (res.data.code >= 300) {
              this.$Message.error("控制电机慢速指令下发失败！");
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      } else if (this.changeForm.speed === "middle" && this.elecCtrl.switch) {
        this.$axios
          .get("/api/cmd/motor-middle", {
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.code < 300) {
              this.$Message.success("控制电机中速指令下发成功！");
            } else if (res.data.code >= 300) {
              this.$Message.error("控制电机中速指令下发失败！");
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      } else if (this.changeForm.speed === "fast" && this.elecCtrl.switch) {
        this.$axios
          .get("/api/cmd/motor-fast", {
            headers: { token: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.code < 300) {
              this.$Message.success("控制电机快速指令下发成功！");
            } else if (res.data.code >= 300) {
              this.$Message.error("控制电机快速指令下发失败！");
            }
          })
          .catch(error => {
            this.$Message.error("接口或处理逻辑出错！");
            console.log(error);
          });
      }
    },
    defaultHistory() {
      // show history data
      let defaultEnd = Number(new Date());
      let defaultStart = defaultEnd - 24 * 60 * 60 * 1000;
      this.$axios
        .get(`/api/status/${defaultStart}/${defaultEnd}`, {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code >= 300) {
            this.$Message.error(res.data.msg);
          } else {
            if (res.data.data.length === 0) {
              this.$Message.error("默认时间段内没有相关数据！");
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.time.push(
                this.$options.methods.formatTime(
                  new Date(res.data.data[i].createTime)
                )
              );
              this.speed.push(res.data.data[i].motorSpeed);
            }
            let brokenLine = this.$echarts.init(
              document.querySelector("#brokenLine")
            );
            brokenLine.hideLoading();
            brokenLine.setOption({
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: this.time
                }
              ],
              series: [
                {
                  name: "电机转速",
                  type: "line",
                  stack: "总量",
                  data: this.speed
                }
              ]
            });
          }
        });
    },
    handleQuery() {
      this.timeSelect.start = Number(this.value[0]);
      this.timeSelect.end = Number(this.value[1]);
      this.time = [];
      this.speed = [];
      let brokenLine = this.$echarts.init(document.querySelector("brokenLine"));
      brokenLine.showLoading({
        // loading animation
        text: "加载中",
        color: "#4cbbff",
        textColor: "#4cbbff",
        maskColor: "rgba(255, 255, 255, 0.8)"
      });
      this.$axios
        .get(`/api/status/${this.timeSelect.start}/${this.timeSelect.end}`, {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code >= 300) {
            this.$Message.error(res.data.msg);
          } else {
            if (res.data.data.length === 0) {
              this.$Message.error("默认时间段内没有相关数据！");
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.time.push(
                this.$options.methods.formatTime(
                  new Date(res.data.data[i].createTime)
                )
              );
              this.speed.push(res.data.data[i].motorSpeed);
            }
            brokenLine.hideLoading();
            brokenLine.setOption({
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: this.time
                }
              ],
              series: [
                {
                  name: "电机转速",
                  type: "line",
                  stack: "总量",
                  label: {
                    normal: {
                      show: true,
                      position: "top"
                    }
                  },
                  data: this.speed
                }
              ]
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initWebSocket() {
      this.connection();
    },
    connection() {
      let socket = new SockJS("http://47.111.134.50:8200/ws");
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        "guest",
        "guest",
        () => {
          this.stompClient.subscribe("/topic/msg", msg => {
            let body = JSON.parse(msg.body);
            switch (body.motorOpen) {
              case "0":
                this.elecCtrl.switch = false;
                this.realSpeed = 0;
                this.elecCtrl.turn = "9";
                break;
              case "1":
                this.elecCtrl.switch = true;
                this.elecCtrl.turn = "1";
                this.realSpeed = body.motorSpeed;
                break;
              case "2":
                this.elecCtrl.switch = true;
                this.elecCtrl.turn = "0";
                this.realSpeed = body.motorSpeed;
                break;
              default:
                break;
            }
            let dashBoard = this.$echarts.init(
              document.querySelector("#dashBoard")
            );
            dashBoard.setOption({
              series: [
                {
                  data: [{ value: this.realSpeed, name: "转速" }]
                }
              ]
            });
          });
        },
        err => {
          this.$Message.error("WebSocket连接错误!");
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
  margin: 20px;
}
/* 仪表盘样式 */
.myChart {
  display: block;
  width: 320px;
  height: 389px;
}
/* 折线图样式 */
.line {
  display: block;
  height: 300px;
}
/* 电机图片样式 */
.photo {
  position: absolute;
  top: 73px;
  right: 245px;
}
/* 时间选择框样式 */
.selectTime {
  margin-top: 32px;
  text-align: center;
}
.sure {
  margin-left: 8px;
}
.ivu-switch-disabled {
  opacity: 20 !important;
}
</style>

