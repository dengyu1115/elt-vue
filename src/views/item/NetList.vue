<template>
  <div>
    <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
      <el-button type="warning" @click="reload()">重新加载</el-button>
      <el-button type="primary" @click="loadLatest()">加载最新</el-button>
      <el-date-picker
        v-model="param.param.date"
        align="right"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="pickerOptions"
      />
      <el-input
        v-model="param.param.keyword"
        type="text"
        placeholder="请输入内容"
        style="width:150px"
        clearable
      />
      <el-button type="success" @click="currentChange(1)">查询</el-button>
    </div>
    <page-table ref="table" :url="url" :param="param" :columns="columns" />
  </div>
</template>

<script>
import PageTable from './components/PageTable.vue'
export default {
  components: { PageTable },
  data() {
    return {
      param: {
        param: { date: '', keyword: '' },
        pageNum: 1,
        pageSize: 10
      },
      page: {},
      marketMap: {},
      selected: [],
      pickerOptions: {
        disabledDate(time) {
          const date = time.getDay()
          return date === 0 || date === 6
        }
      },
      url: 'http://localhost:8081/net/pageByDateAndKeyword',
      columns: [
        { label: '名称', prop: 'name' },
        { label: 'CODE', prop: 'code' },
        { label: '日期', prop: 'date' },
        { label: '净值最新', prop: 'net', align: 'right', formatter: this.net },
        {
          label: '净值累计',
          prop: 'netTotal',
          align: 'right',
          formatter: this.net
        },
        {
          label: '涨幅最新',
          prop: 'rate',
          align: 'right',
          formatter: this.hundred
        },
        {
          label: '涨幅累计',
          prop: 'rateTotal',
          align: 'right',
          formatter: this.hundred
        }
      ]
    }
  },
  mounted() {},
  methods: {
    loadLatest() {
      this.$post('http://localhost:8081/net/loadLatest', {}).then(data => {
        this.$message.success('加载完成，共' + data + '条')
        this.currentChange(1)
      })
    },
    reload() {
      this.$confirm('确认操作？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(() => {
        this.$post('http://localhost:8081/net/reload', {}).then(data => {
          this.$message.success('加载完成，共' + data + '条')
          this.currentChange(1)
        })
      })
    },
    currentChange(pageNum) {
      this.$refs.table.currentChange(pageNum)
    }
  }
}
</script>
