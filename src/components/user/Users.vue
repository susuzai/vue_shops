<template >
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- 搜索框$添加区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 状态开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editShowDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
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

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogColsed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogColsed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      // 定义正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/
      // 进行检测
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      // 非法邮箱
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号校验规则
    var checkMobile = (rule, value, callback) => {
      // 定义正则表达式
      const regMobile = /^1[34578]\d{9}$/
      // 进行检测
      if (regMobile.test(value)) {
        // 合法手机号
        return callback()
      }
      // 非法手机号
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户列表数组
      userList: [],
      // 总数
      total: 0,
      // 控制添加用户对话框显示与隐藏(默认隐藏)
      addDialogVisible: false,
      // 控制修改用户对话框显示与隐藏(默认隐藏)
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        // 用户名验证规则
        username: [
          // 必填
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // 长度
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 密码验证规则
        password: [
          // 必填
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 长度
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 邮箱验证规则
        email: [
          // 必填
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        // 手机号验证规则
        mobile: [
          // 必填
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        // 邮箱验证规则
        email: [
          // 必填
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        // 手机号验证规则
        mobile: [
          // 必填
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取用户列表
    this.getUserList()
  },
  methods: {
    // 获取用户列表方法
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      // 判断用户列表是否获取成功
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          showClose: true,
          duration: 3000
        })
      }
      // 成功
      // 给用户列表和总数赋值
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize发生改变的事件
    handleSizeChange (size) {
      // 将最新的页数保存到queryInfo中
      this.queryInfo.pagesize = size
      // 重新渲染用户列表
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (page) {
      // 将最新的页码值保存到queryInfo中
      this.queryInfo.pagenum = page
      // 重新渲染用户列表
      this.getUserList()
    },
    // switch开关状态发生改变
    async userStateChanged (userinfo) {
      // 发生ajax请求,改变状态值
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      // 判断是否成功
      if (res.meta.status !== 200) {
        // 失败需要将mg_state重置
        userinfo.mg_state = !userinfo.mg_state
        return this.$message({
          message: '修改用户状态失败',
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
    // 点击添加用户控制对话框显示
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 监听添加用户对话框关闭事件
    addDialogColsed () {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改用户对话框关闭事件
    editDialogColsed () {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮添加新用户
    addUser () {
      // 调用对表单进行验证的方法
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        // 判断是否预校验成功
        if (!valid) {
          // 预校验失败
          return
        }
        // 预校验成功 发送ajax请求,添加新用户
        const { data: res } = await this.$http.post('users', this.addForm)
        // 判断是否成功
        if (res.meta.status !== 201) {
          // 失败
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
        // 将添加用户对话框关闭
        this.addDialogVisible = false
        // 重新渲染用户列表
        this.getUserList()
      })
    },
    // 点击编辑用户信息按钮显示对话框
    async editShowDialog (id) {
      // 发送ajax请求,获取该项的用户信息
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      // 判断是否获取成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          showClose: true,
          duration: 3000
        })
      }
      // 成功
      // 给editForm进行赋值
      this.editForm = res.data
      // 显示修改用户对话框
      this.editDialogVisible = true
    },
    // 点击确定按钮修改用户信息
    editUser () {
      // 表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          // 预验证不通过
          return
        }
        // 预验证成功  发送ajax请求进行修改用户信息
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        // 判断是否修改成功
        if (res.meta.status !== 200) {
          // 失败
          return this.$message({
            message: res.meta.msg,
            type: 'success',
            showClose: true,
            duration: 3000
          })
        }
        // 修改成功
        // 重新渲染用户列表页面
        this.getUserList()
        // 关闭修改用户对话框
        this.editDialogVisible = false
        // 提示用户
        this.$message({
          message: res.meta.msg,
          type: 'success',
          showClose: true,
          duration: 3000
        })
      })
    },
    // 点击删除按钮  根据id进行删除用户
    removeUserById (id) {
      // 弹框询问用户是否删除
      this.$confirm('是否确定删除该用户?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      }).then(async action => {
        // 点击是
        // 发送ajax请求,删除该用户
        const { data: res } = await this.$http.delete(`users/${id}`)
        // 判断是否删除成功
        if (res.meta.status !== 200) {
          return this.$message({
            message: res.meta.msg,
            type: 'error',
            showClose: true,
            duration: 3000
          })
        }
        // 成功
        // 重新渲染页面
        this.getUserList()

        // 提示用户
        this.$message({
          message: res.meta.msg,
          type: 'success',
          showClose: true,
          duration: 3000
        })
      }).catch(() => {
        // 点击否
      })
    }
  }
}
</script>
<style lang="less" scope>
</style>
