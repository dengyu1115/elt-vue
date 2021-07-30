<template>
  <div>
    <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
      <el-button type="warning" @click="reload()">重新加载</el-button>
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
      url: 'http://localhost:8081/scale/pageByKeyword',
      columns: [
        { label: '名称', prop: 'name' },
        { label: 'CODE', prop: 'code' },
        { label: '日期', prop: 'date' },
        {
          label: '金额',
          prop: 'amount',
          align: 'right',
          formatter: this.amount
        },
        {
          label: '变动',
          prop: 'change',
          align: 'right',
          formatter: this.percent
        }
      ]
    }
  },
  mounted() {
    this.currentChange(1)
  },
  methods: {
    reload() {
      this.$confirm('确认操作？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(() => {
        this.$post('http://localhost:8081/scale/reload', {}).then(data => {
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
