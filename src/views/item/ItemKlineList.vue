<template>
  <div>
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
        param: {},
        pageNum: 1,
        pageSize: 10
      },
      marketMap: {},
      url: 'http://localhost:8081/kline/pageByItem',
      columns: [
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
        }
      ]
    }
  },
  mounted() {
    this.listMarkets()
    this.param.param.code = this.getUrlParam('code')
    this.param.param.market = this.getUrlParam('market')
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
    currentChange(pageNum) {
      this.$refs.table.currentChange(pageNum)
    },
    getMarketName(row, column, value, index) {
      if (value) {
        return this.marketMap[value]
      }
    },
    getUrlParam(name) {
      return (
        decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
            window.location.href
          ) || [, ''])[1].replace(/\+/g, '%20')
        ) || null
      )
    }
  }
}
</script>
