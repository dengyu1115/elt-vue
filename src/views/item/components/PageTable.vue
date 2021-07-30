<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="page.list"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
    >
      <el-table-column label="序号" type="index" width="80" align="center">
        <template scope="scope">
          <span>{{
            (page.pageNum - 1) * page.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <template v-for="(col, index) in columns">
        <slot v-if="col.slot" :name="col.slot" />
        <el-table-column
          v-else-if="col.selection"
          :key="index"
          type="selection"
          width="55"
        />
        <el-table-column
          v-else
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :formatter="col.formatter"
          :align="col.align"
          header-align="center"
        />
      </template>
    </el-table>
    <el-pagination
      :current-page="param.pageNum"
      :page-size="param.pagesize"
      :total="page.total"
      :page-sizes="[5, 10, 20, 40]"
      layout="prev, sizes, pager, next"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    param: Object,
    columns: Array,
    loading: Function
  },
  data() {
    return {
      page: {},
      selected: []
    }
  },
  mounted() {},
  methods: {
    query() {
      this.$post(this.url, this.param).then(data => {
        this.page = data
      })
    },
    currentChange(pageNum) {
      this.param.pageNum = pageNum
      this.query()
    },
    sizeChange(pageSize) {
      this.param.pageSize = pageSize
      this.query()
    },
    getSelected() {
      this.selected = []
      this.$refs.table.selection.forEach(i => {
        this.selected.push(i)
      })
      return this.selected
    }
  }
}
</script>
