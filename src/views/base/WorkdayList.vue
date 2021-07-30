<template>
  <div>
    <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
      <el-date-picker
        v-model="param.id"
        type="year"
        value-format="yyyy"
        placeholder="选择年"
      />
      <el-button type="success" @click="query()">查询</el-button>
      <el-button type="primary" @click="loadLatest()">加载最新</el-button>
    </div>
    <el-table
      ref="table"
      :data="list"
      border
      :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="month" label="月份" />
      <template v-for="h in hearders">
        <el-table-column :key="h" :label="h">
          <template slot-scope="scope">
            <div>{{ scope.row.dates[scope.row.month + '-' + h] }}</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
const typeMap = { '0': '工作日', '1': '节假日' }
export default {
  data() {
    return {
      param: {
        id: ''
      },
      list: [],
      hearders: []
    }
  },
  mounted() {
    this.init()
    this.query()
  },
  methods: {
    init() {
      const date = new Date().toDateString()
      this.param.id = date.substring(date.length - 4, date.length)
      for (let i = 1; i < 32; i++) {
        let date = '0' + i
        date = date.substring(date.length - 2, date.length)
        this.hearders[i - 1] = date
      }
    },
    query() {
      this.$post(
        'http://localhost:8081/workday/listMonthByYear',
        this.param
      ).then(data => {
        this.list = data
        this.list.forEach(item => {
          for (let i = 1; i < 32; i++) {
            let date = '0' + i
            date =
              item.month + '-' + date.substring(date.length - 2, date.length)
            const type = item.dates[date]
            item.dates[date] = typeMap[type]
          }
        })
      })
    },
    loadLatest() {
      this.$post('http://localhost:8081/workday/loadByYear', this.param).then(
        data => {
          this.query()
        }
      )
    }
  }
}
</script>
