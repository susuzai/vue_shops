<template >
  <div>
    <h3>商品参数组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              checkStrictly: true,
            }"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签管理区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnsDisabled"
            @click="showAddDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" stripe border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnsDisabled"
            @click="showAddDialog"
            >添加属性</el-button
          >

          <!-- 静态属性表格 -->
          <el-table :data="onlyTabData" stripe border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数 或 静态属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 主体部分 -->
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数 或 静态属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体部分 -->
      <el-form
        :model="editForm"
        :rules="editFormRule"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有商品分类数组
      cateList: [],
      // 级联选择框的选中项id
      selectedKeys: [],
      // 默认选中的tab页签
      activeName: 'many',
      // 动态参数列表
      manyTabData: [],
      // 静态属性列表
      onlyTabData: [],
      // 控制添加对话框显示与隐藏,默认隐藏
      addDialogVisible: false,
      // 添加对话框验证规则
      addFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 添加动态参数数据
      addForm: {
        attr_name: ''
      },
      // 控制修改参数对话框的显示与隐藏,默认隐藏
      editDialogVisible: false,
      // 修改动态参数数据
      editForm: {
        attr_name: ''
      },
      // 修改对话框验证规则
      editFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 添加动态参数  静态属性按钮的启用禁用
    isBtnsDisabled () {
      return this.selectedKeys.length !== 3
    },
    // 获取分类id
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1]
      }
      return null
    },
    // 添加对话框标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    // 级联选择框选中值发生改变处理函数
    handleChange () {
      // 调用获取所有参数列表数据方法
      this.getParamsData()
    },
    // 点击tab处理函数
    handleTabClick () {
      // 调用获取所有参数列表数据方法
      this.getParamsData()
    },
    // 获取所有参数列表数据
    async getParamsData () {
      // 判断用户是否选中的是三级分类
      if (this.selectedKeys.length !== 3) {
        // 未选中三级选择框 清空选中数组
        this.selectedKeys = []
        // 清空动态参数 静态属性数组
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      // 选中三级分类  发送ajax请求获取动态参数 和 静态属性
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      // 处理attr_vals数据
      res.data.forEach((t) => {
        t.attr_vals = t.attr_vals ? t.attr_vals.split(',') : []
        t.inputVisible = false
        t.inputValue = ''
      })

      // 根据是动态参数 还是 静态属性进行分别保存
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else if (this.activeName === 'only') {
        this.onlyTabData = res.data
      }
    },
    // 点击 添加参数 按钮  显示动态参数对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击 添加对话框的确认按钮 进行添加参数
    addParams () {
      // 表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        // 验证不通过
        if (!valid) return
        // 验证通过
        // 发送ajax请求进行添加参数
        await this.$http.post(`categories/${this.cateId}/attributes`, {
          ...this.addForm,
          attr_sel: this.activeName
        })
        // 重新渲染页面
        this.getParamsData()
        // 关闭添加对话框
        this.addDialogVisible = false
      })
    },
    // 监听修改对话框关闭的处理函数
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击 修改对话框 确认按钮 处理函数
    editParams () {
      // 表单预验证
      this.$refs.editFormRef.validate(async (valid) => {
        // 验证不通过
        if (!valid) return
        // 验证通过
        // 发送ajax请求 进行修改参数
        await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        // 重新渲染页面
        this.getParamsData()
        // 关闭修改对话框
        this.editDialogVisible = false
      })
    },
    // 点击编辑 按钮 显示修改对话框
    async showEditDialog (row) {
      // 发送ajax请求 获取数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      // 给editForm赋值
      this.editForm = res.data
      // 显示修改对话框
      this.editDialogVisible = true
    },
    // 根据id进行删除该项参数
    removeParamsById (row) {
      // 弹出询问框咨询用户是否确认删除
      this.$confirm('确定要删除该项?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(async (action) => {
          // 点击是
          // 发送ajax请求 进行删除该项参数
          await this.$http.delete(
            `categories/${this.cateId}/attributes/${row.attr_id}`
          )
          // 重新渲染页面
          this.getParamsData()
        })
        .catch(() => {
          // 点击否
        })
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput (row) {
      row.inputVisible = true

      this.$nextTick((_) => {
        // 自动获取焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm (row) {
      // 判断文本框里是否有内容
      if (!row.inputValue.trim().length) {
        // 没有内容  清空输入框 并 隐藏输入框
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 填入了数据  发送ajax进行修改
      row.attr_vals.push(row.inputValue.trim())
      // 清空输入框
      row.inputValue = ''
      // 隐藏输入框
      row.inputVisible = false

      this.saveAttrVals(row)
    },
    // 保存参数处理函数
    async saveAttrVals (row) {
      // 发送ajax请求,进行修改数据
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(',')
        }
      )
      // 发送请求失败
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          showClose: true,
          duration: 3000
        })
      }
      // 成功
      this.$message({
        message: res.meta.msg,
        type: 'success',
        showClose: true,
        duration: 3000
      })
    },
    // 删除页签
    handleClosed (row, i) {
      // 删除参数页签
      row.attr_vals.splice(i, 1)
      // 调用保存参数页签的函数
      this.saveAttrVals(row)
    }
  }
}
</script>
<style lang="less" scope>
.cat-opt {
  margin: 15px 0;
}
.el-cascader {
  width: 220px !important;
}
.el-tag {
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px !important;
}
</style>
