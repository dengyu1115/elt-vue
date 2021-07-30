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
    <page-table ref="table" :url="url" :param="param" :columns="columns">
      <el-table-column slot="operate" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            @click="detail(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
    </page-table>
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
      url: 'http://localhost:8081/kline/pageByDateAndKeyword',
      columns: [
        { label: '名称', prop: 'name' },
        { label: 'CODE', prop: 'code' },
        { label: '所属市场', prop: 'market', formatter: this.getMarketName },
        { label: '日期', prop: 'date' },
        { label: '最新', prop: 'latest', align: 'right', formatter: this.net },
        { label: '今开', prop: 'open', align: 'right', formatter: this.net },
        { label: '最高', prop: 'high', align: 'right', formatter: this.net },
        { label: '最低', prop: 'low', align: 'right', formatter: this.net },
        {
          label: '周平均',
          prop: 'avgWeek',
          align: 'right',
          formatter: this.net
        },
        {
          label: '月平均',
          prop: 'avgMonth',
          align: 'right',
          formatter: this.net
        },
        {
          label: '季平均',
          prop: 'avgSeason',
          align: 'right',
          formatter: this.net
        },
        {
          label: '年平均',
          prop: 'avgYear',
          align: 'right',
          formatter: this.net
        },
        { slot: 'operate' }
      ]
    }
  },
  mounted() {
    this.listMarkets()
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
      this.$post('http://localhost:8081/kline/loadLatest', {}).then(data => {
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
        this.$post('http://localhost:8081/kline/reload', {}).then(data => {
          this.$message.success('加载完成，共' + data + '条')
          this.currentChange(1)
        })
      })
    },
    currentChange(pageNum) {
      this.$refs.table.currentChange(pageNum)
    },
    getMarketName(row, column, value, index) {
      if (value) {
        return this.marketMap[value]
      }
    },
    detail(item) {
      const router = this.$router.resolve({
        path: '/itemKlineList',
        query: { code: item.code, market: item.market }
      })
      window.open(router.href, '_blank')
    }
  }
}
</script>
