<template>
  <div>
    <div style="margin-top: 20px;margin-bottom: 20px;" align="left">
      <el-select v-model="param.param.type" clearable placeholder="请选择">
        <el-option
          v-for="item in groupTypes"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="param.param.keyword"
        type="text"
        placeholder="请输入内容"
        style="width:150px"
        clearable
      />
      <el-button type="success" @click="currentChange(1)">查询</el-button>
      <el-button type="primary" @click="add()">新增</el-button>
    </div>
    <page-table ref="table" :url="url" :param="param" :columns="columns">
      <el-table-column slot="operate" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.code != scope.row.type"
            type="text"
            size="small"
            @click.native.prevent="del(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="scope.row.code != scope.row.type"
            type="text"
            size="small"
            @click.native.prevent="edit(scope.row.id)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </page-table>
    <el-dialog title="新增分组" :visible.sync="dialogFormVisible" center>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="编号" :label-width="formLabelWidth" prop="code">
          <el-input v-model="form.code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in groupTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageTable from './components/PageTable.vue'
export default {
  components: { PageTable },
  data() {
    return {
      param: {
        param: { type: '', keyword: '' },
        pageNum: 1,
        pageSize: 10
      },
      page: {},
      groupTypes: [],
      selectedGroup: '',
      groupMap: {},
      dialogFormVisible: false,
      form: {
        code: '',
        name: '',
        type: '',
        remark: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入CODE', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ]
      },
      formLabelWidth: '120px',
      editType: 0,
      url: 'http://localhost:8081/group/pageByKeyword',
      columns: [
        { label: '名称', prop: 'name' },
        { label: 'CODE', prop: 'code' },
        { label: '类型', prop: 'type', formatter: this.getTypeName },
        { label: '备注', prop: 'remark' },
        { slot: 'operate' }
      ]
    }
  },
  mounted() {
    this.listGroupType()
    this.currentChange(1)
  },
  methods: {
    add() {
      this.dialogFormVisible = true
      this.form.type = this.groupTypes[0].value
      if (this.$refs['form']) this.$refs['form'].resetFields()
      this.editType = 0
    },
    edit(id) {
      this.$post('http://localhost:8081/group/findById', { id: id }).then(
        data => {
          if (this.$refs['form']) this.$refs['form'].resetFields()
          this.form = data
          this.dialogFormVisible = true
          this.editType = 1
        }
      )
    },
    del(id) {
      this.$confirm('确认操作？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(() => {
        this.$post('http://localhost:8081/group/deleteById', { id: id }).then(
          data => {
            if (data === 1) {
              this.$message.success('删除成功')
              this.currentChange(1)
            } else {
              this.$message.error('删除失败')
            }
          }
        )
      })
    },
    listGroupType() {
      this.$post('http://localhost:8081/common/listGroupType', {}).then(data => {
        this.groupTypes = data
        this.groupTypes.forEach(i => {
          this.groupMap[i.value] = i.name
        })
      })
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const url =
            this.editType === 0
              ? 'http://localhost:8081/group/save'
              : 'http://localhost:8081/group/update'
          this.$post(url, this.form).then(data => {
            if (data === 1) {
              this.$message.success('保存成功')
              this.currentChange(1)
              this.dialogFormVisible = false
            } else {
              this.$message.error('保存失败')
            }
          })
        }
      })
    },
    currentChange(pageNum) {
      this.$refs.table.currentChange(pageNum)
    },
    getTypeName(row, column, value, index) {
      if (value) {
        return this.groupMap[value]
      }
    }
  }
}
</script>
