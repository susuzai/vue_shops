<template >
  <div>
    <h3>商品分类组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树形控件 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 自定义列  是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightred"></i>
        </template>

        <!-- 自定义列  排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 自定义列  操作 -->
        <template slot="opt" slot-scope="scope">
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
            @click="removeCateById(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 主体内容 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              checkStrictly: true,
            }"
            clearable
            @change="handleCascaderChange"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <!-- 主体区域 -->
      <p>当前的id:{{ editCateForm.cat_id }}</p>
      <p>当前的等级:{{ editCateForm.cat_level }}</p>
      <el-form
        :model="editCateForm"
        :rules="editCateRules"
        ref="editCateFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      cateList: [],
      // 表格数据定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // 自定义模板列
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 模板名称
          template: 'isOk',
          // 指定该列为模板列
          type: 'template'
        },
        {
          label: '排序',
          // 模板名称
          template: 'order',
          // 指定该列为模板列
          type: 'template'
        },
        {
          label: '操作',
          // 模板名称
          template: 'opt',
          // 指定该列为模板列
          type: 'template'
        }
      ],
      // 总数据条数
      total: 0,
      // 控制添加分类对话框显示与隐藏(默认隐藏)
      addCateDialogVisible: false,
      // 添加分类数据列表
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加分类验证规则
      addCateRules: {
        // 必填
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      // 级联选择框 选中项的id
      selectedKeys: [],
      // 控制编辑分类对话框显示与隐藏(默认隐藏)
      editCateDialogVisible: false,
      // 修改分类数据
      editCateForm: [],
      // 验证规则
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      // 发送ajax请求 获取商品分类数据
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      // 给商品列表赋值
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      // 发送ajax请求 进行获取
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 监听pagesize发生改变的函数
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      // 重新渲染页面
      this.getCateList()
    },
    // 当前页 pagenum发生改变的函数
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      // 重新渲染页面
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog () {
      // 获取父级分类列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 级联选择框发生值改变触发的处理函数
    handleCascaderChange () {
      // 判断选中数组 selectedKeys 是否有值
      if (this.selectedKeys.length > 0) {
        // 更新selectedKeys数组
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 没有进行选中级联选择框 那么就默认为添加一级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定按钮,进行更新分类列表
    addCate () {
      // 表单预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        // 预验证不通过
        if (!valid) return
        // 预验证通过
        // 发送ajax请求  进行添加分类
        await this.$http.post('categories', this.addCateForm)
        // 重新渲染页面
        this.getCateList()
        // 关闭添加分类对话框
        this.addCateDialogVisible = false
      })
    },
    // 关闭添加分类对话框  清空表单数据 以及 级联选择框
    addCateDialogClosed () {
      // 清空表单数据 以及 级联选择框
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击 删除 按钮通过id进行删除分类
    async removeCateById (row) {
      // 询问用户是否进行删除
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(async (action) => {
          // 点击是
          // 发送ajax请求进行删除分类
          await this.$http.delete(`categories/${row.cat_id}`)
          // 重新渲染页面
          this.getCateList()
        })
        .catch(() => {
          // 点击否
        })
    },
    // 关闭编辑分类对话框处理函数
    editCateDialogClosed () {
      // 重置表单
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击编辑按钮 显示编辑分类对话框  并渲染数据
    async showEditDialog (row) {
      // 发送ajax请求 获取数据
      const { data: res } = await this.$http.get(`categories/${row.cat_id}`)
      this.editCateForm = res.data
      // 显示编辑分类对话框
      this.editCateDialogVisible = true
    },
    // 点击确认按钮 发送ajax请求 编辑分类  重新渲染到页面
    async  editCate () {
      // 发送ajax请求
      await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
      // 重新渲染到页面
      this.getCateList()
      // 关闭编辑分类对话框
      this.editCateDialogVisible = false
    }
  }
}
</script>
<style lang="less" scope>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
