<template>
  <!-- 实时数据页面 -->
  <div class="wrapper">
    <div class="inner">
      <Row :style="{'width': autoWidth}">
        <!-- 温度 -->
        <Col span="8" :style="{'height': autoHeight}">
          <div id="temp" class="myChart"></div>
        </Col>
        <!-- 湿度 -->
        <Col span="8" :style="{'height': autoHeight}">
          <div id="humi" class="myChart"></div>
        </Col>
        <!-- 电压 -->
        <Col span="8" :style="{'height': autoHeight}">
          <div id="volt" class="myChart"></div>
        </Col>
      </Row>
      <Row :style="{'width': autoWidth}">
        <!-- 电流 -->
        <Col span="8" :style="{'height': autoHeight}">
          <div id="elec" class="myChart"></div>
        </Col>
        <!-- 压力 -->
        <Col span="8" :style="{'height': autoHeight}">
          <div id="press" class="myChart"></div>
        </Col>
        <!-- 功率 -->
        <Col span="8" :style="{'height': autoHeight}">
          <div id="power" class="myChart"></div>
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
      autoWidth: "",
      autoHeight: "",
      stompClient: "",
      timer: "",
      tempValue: 0,
      humiValue: 0,
      voltValue: 0,
      elecValue: 0,
      pressValue: 0,
      powerValue: 0
    };
  },
  beforeMount() {
    this.autoWidth = window.screen.availWidth - 200 + "px";
    this.autoHeight = parseInt((window.innerHeight - 64) / 2) + "px";
  },
  mounted() {
    this.initWebSocket();
    this.init(); // init chart
  },
  beforeDestroy() {
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    init() { // init chart
      let temp = this.$echarts.init(document.getElementById("temp"));
      let humi = this.$echarts.init(document.getElementById("humi"));
      let volt = this.$echarts.init(document.getElementById("volt"));
      let elec = this.$echarts.init(document.getElementById("elec"));
      let press = this.$echarts.init(document.getElementById("press"));
      let power = this.$echarts.init(document.getElementById("power"));
      temp.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} ℃" //标题，值，单位
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        width: "auto",
        height: "auto",
        series: [
          {
            name: "温度",
            type: "gauge",
            min: 10,
            max: 70,
            splitNumber: 6,
            radius: "85%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[5 / 6, "lime"], [1, "#ff4500"]],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: "#2d8cf0",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff"
              }
            },
            data: [{ value: this.tempValue, name: "温度℃" }]
          }
        ]
      });
      humi.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} %RH" //标题，值，单位
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        width: "auto",
        height: "auto",
        series: [
          {
            name: "湿度",
            type: "gauge",
            min: 40,
            max: 70,
            splitNumber: 6,
            radius: "85%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[4 / 6, "lime"], [1, "#ff4500"]],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: "#2d8cf0",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff"
              }
            },
            data: [{ value: this.humiValue, name: "湿度%RH" }]
          }
        ]
      });
      volt.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} V" //标题，值，单位
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        width: "auto",
        height: "auto",
        series: [
          {
            name: "电压",
            type: "gauge",
            min: 20,
            max: 28,
            splitNumber: 8,
            radius: "85%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[5 / 8, "lime"], [1, "#ff4500"]],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: "#2d8cf0",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff"
              }
            },
            data: [{ value: this.voltValue, name: "电压V" }]
          }
        ]
      });
      elec.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} A" //标题，值，单位
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        width: "auto",
        height: "auto",
        series: [
          {
            name: "电流",
            type: "gauge",
            min: 0,
            max: 5,
            splitNumber: 10,
            radius: "85%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[4 / 5, "lime"], [1, "#ff4500"]],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: "#2d8cf0",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff"
              }
            },
            data: [{ value: this.elecValue, name: "电流A" }]
          }
        ]
      });
      press.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} Kg" //标题，值，单位
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        width: "auto",
        height: "auto",
        series: [
          {
            name: "压力",
            type: "gauge",
            min: 0,
            max: 6,
            splitNumber: 6,
            radius: "85%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[5 / 6, "lime"], [1, "#ff4500"]],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: "#2d8cf0",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff"
              }
            },
            data: [{ value: this.pressValue, name: "压力Kg" }]
          }
        ]
      });
      power.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} W" //标题，值，单位
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        width: "auto",
        height: "auto",
        series: [
          {
            name: "功率",
            type: "gauge",
            min: 0,
            max: 150,
            splitNumber: 15,
            radius: "85%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[18 / 25, "lime"], [1, "#ff4500"]],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: "#2d8cf0",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 5,
              offsetCenter: [0, "50%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                color: "#fff"
              }
            },
            data: [{ value: this.powerValue, name: "功率W" }]
          }
        ]
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
            this.tempValue = body.temperature;
            this.humiValue = body.humidity;
            this.voltValue = body.voltage;
            this.elecValue = body.electric;
            this.pressValue = body.weight;
            this.powerValue = body.power;
            let temp = this.$echarts.init(document.getElementById("temp"));
            let humi = this.$echarts.init(document.getElementById("humi"));
            let volt = this.$echarts.init(document.getElementById("volt"));
            let elec = this.$echarts.init(document.getElementById("elec"));
            let press = this.$echarts.init(document.getElementById("press"));
            let power = this.$echarts.init(document.getElementById("power"));
            temp.setOption({
              series: [
                {
                  data: [{ value: this.tempValue, name: "温度℃" }]
                }
              ]
            });
            humi.setOption({
              series: [
                {
                  data: [{ value: this.humiValue, name: "湿度%RH" }]
                }
              ]
            });
            volt.setOption({
              series: [
                {
                  data: [{ value: this.voltValue, name: "电压V" }]
                }
              ]
            });
            elec.setOption({
              series: [
                {
                  data: [{ value: this.elecValue, name: "电流A" }]
                }
              ]
            });
            press.setOption({
              series: [
                {
                  data: [{ value: this.pressValue, name: "压力Kg" }]
                }
              ]
            });
            power.setOption({
              series: [
                {
                  data: [{ value: this.powerValue, name: "功率W" }]
                }
              ]
            });
          });
        },
        err => {
          this.$Message.error("WebSocket连接错误！");
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
/* 仪表盘样式 */
.myChart {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #363e4f;
}
.ivu-input-wrapper {
  width: 30%;
}
</style>