<template>
  <div>
    <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
      <el-button type="warning" @click="reload()">重新加载</el-button>
      <el-button type="primary" @click="loadLatest()">加载最新</el-button>
      <el-input
        v-model="param.param"
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
        param: '',
        pageNum: 1,
        pageSize: 10
      },
      page: {},
      marketMap: {},
      selected: [],
      url: 'http://localhost:8081/item/pageByKeyword',
      columns: [
        { label: '名称', prop: 'name' },
        { label: 'CODE', prop: 'code' },
        { label: '市场', prop: 'market', formatter: this.getMarketName },
        { label: '类型', prop: 'type' }
      ]
    }
  },
  mounted() {
    this.listMarkets()
    this.currentChange(1)
  },
  methods: {
    listMarkets() {
      this.$post('http://localhost:8081/item/listMarkets', {}).then(data => {
        data.forEach(i => {
          this.marketMap[i.value] = i.name
        })
      })
    },
    loadLatest() {
      this.$post('http://localhost:8081/item/loadLatest', {}).then(data => {
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
        this.$post('http://localhost:8081/item/reload', {}).then(data => {
          this.$message.success('加载完成，共' + data + '条')
          this.currentChange(1)
        })
      })
    },
    currentChange(pageNum) {
      this.param.pageNum = pageNum
      this.query()
    },
    currentChange(pageNum) {
      this.$refs.table.currentChange(pageNum)
    },
    getMarketName(row, column, value, index) {
      if (value) {
        return this.marketMap[value]
      }
    }
  }
}
</script>
