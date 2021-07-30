<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6"><div>&nbsp;</div></el-col>
      <el-col :span="12">
        <el-select
          v-model="idGroup"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="queryGroups"
          @change="refresh"
        >
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="add()">添加</el-button>
        <el-button type="warning" @click="remove(1)">移除</el-button>
      </el-col>
      <el-col :span="6"><div>&nbsp;</div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
          <el-input
            v-model="paramNotIn.param.keyword"
            type="text"
            placeholder="请输入内容"
            style="width:150px"
            clearable
          />
          <el-button type="success" @click="currentNotIn(1)">查询</el-button>
        </div>
        <page-table
          ref="tableNotIn"
          :url="urlNotIn"
          :param="paramNotIn"
          :columns="columns"
        />
      </el-col>
      <el-col :span="12">
        <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
          <el-input
            v-model="paramIn.param.keyword"
            type="text"
            placeholder="请输入内容"
            style="width:150px"
            clearable
          />
          <el-button type="success" @click="currentIn(1)">查询</el-button>
        </div>
        <page-table
          ref="tableIn"
          :url="urlIn"
          :param="paramIn"
          :columns="columns"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PageTable from './components/PageTable.vue'

export default {
  components: { PageTable },
  data() {
    return {
      paramIn: {
        param: { idGroup: '' },
        pageNum: 1,
        pageSize: 10
      },
      paramNotIn: {
        param: { idGroup: '' },
        pageNum: 1,
        pageSize: 10
      },
      inGroupPage: {},
      notInGroupPage: {},
      marketMap: {},
      selectedAdd: [],
      selectedRemove: [],
      groupParam: {
        param: { keyword: '' },
        pageNum: 1,
        pageSize: 10
      },
      groups: [],
      idGroup: '',
      groupLoading: false,
      urlIn: 'http://localhost:8081/item/pageInGroupByKeyword',
      urlNotIn: 'http://localhost:8081/item/pageNotInGroupByKeyword',
      columns: [
        { selection: 'selection' },
        { label: '名称', prop: 'name' },
        { label: 'CODE', prop: 'code' },
        { label: '市场', prop: 'market', formatter: this.getMarketName },
        { label: '类型', prop: 'type' }
      ]
    }
  },
  mounted() {
    this.listMarkets()
    this.queryGroups()
  },
  methods: {
    refresh() {
      if (this.idGroup === '') {
        this.inGroupPage = {}
        this.notInGroupPage = {}
      } else {
        this.currentIn(1)
        this.currentNotIn(1)
      }
    },
    listMarkets() {
      this.$post('http://localhost:8081/item/listMarkets', {}).then(data => {
        data.forEach(i => {
          this.marketMap[i.value] = i.name
        })
      })
    },
    queryGroups(keyword) {
      this.groupParam.param.keyword = keyword
      this.$post(
        'http://localhost:8081/group/pageByKeyword',
        this.groupParam
      ).then(data => {
        this.groups = data.list
      })
    },
    currentIn(pageNum) {
      this.paramIn.param.idGroup = this.idGroup
      this.$refs.tableIn.currentChange(pageNum)
    },
    currentNotIn(pageNum) {
      this.paramNotIn.param.idGroup = this.idGroup
      this.$refs.tableNotIn.currentChange(pageNum)
    },
    add() {
      if (this.idGroup === '') {
        this.$message.error('请选择分组')
        return
      }
      this.selectedAdd = []
      this.$refs.tableNotIn.getSelected().forEach(i => {
        this.selectedAdd.push({ idItem: i.id, idGroup: this.idGroup })
      })
      this.$post(
        'http://localhost:8081/itemGroup/batchSave',
        this.selectedAdd
      ).then(data => {
        this.refresh()
      })
    },
    remove() {
      if (this.idGroup === '') {
        this.$message.error('请选择分组')
        return
      }
      this.selectedRemove = []
      this.$refs.tableIn.getSelected().forEach(i => {
        this.selectedRemove.push({ idItem: i.id, idGroup: this.idGroup })
      })
      this.$post(
        'http://localhost:8081/itemGroup/deleteByIds',
        this.selectedRemove
      ).then(data => {
        this.refresh()
      })
    },
    getMarketName(row, column, value, index) {
      if (value) {
        return this.marketMap[value]
      }
    }
  }
}
</script>
