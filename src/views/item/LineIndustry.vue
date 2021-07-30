<template>
  <div>
    <div id="chart" />
    <el-form ref="form" :model="form" inline>
      <el-form-item inline>
        <el-form-item label="行业" prop="code">
          <el-select v-model="form.code" placeholder="请选择" filterable>
            <el-option
              v-for="item in indecies"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
            align="right"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="drawLine">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let option = {
  title: {
    text: "折线图堆叠"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: []
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: []
  },
  yAxis: [
    yAxis("涨幅", "left", {
      show: true,
      lineStyle: {
        color: "#14364f",
        width: 1,
        type: "dashed" //实心，solid | dotted | dashed，
      }
    }),
    yAxis("价格", "right", {
      show: false
    }),
    yAxis(
      "市盈率",
      "right",
      {
        show: false
      },
      70
    )
  ],
  series: [],
  grid: [
    {
      left: "5%",
      right: "10%",
      top: "90%",
      bottom: "90%",
      containLabel: true
    }
  ]
};
function yAxis(name, position, splitLine, offset) {
  let y = {
    position: position,
    type: "value",
    name: name,
    nameTextStyle: {
      color: "#B0CEFC",
      padding: 10
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: "#B0CEFC"
      }
    },
    axisLine: {
      show: true
    },
    splitLine: splitLine
  };
  if (offset) {
    y.offset = offset;
  }
  return y;
}
export default {
  name: "multi-line",
  data() {
    return {
      form: {},
      indecies: []
    };
  },
  mounted() {
    this.listIndecies();
  },
  methods: {
    drawLine() {
      this.$post("http://localhost:8081/multiLine/list", this.form).then(
        data => {
          var chart = this.$echarts.init(document.getElementById("chart"));
          option.legend.data = data.titles;
          option.xAxis.data = data.dates;
          option.series = data.series;
          option.color = data.color;
          chart.setOption(option);
        }
      );
    },
    listIndecies() {
      this.$post("http://localhost:8081/item/listIndustries", {}).then(data => {
        this.indecies = data;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#chart {
  width: 1700px;
  height: 700px;
}
</style>
