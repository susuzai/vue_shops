<template >
  <div>
    <h3>角色列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-row
              class="bdtop vcenter"
              :class="i1 == scope.row.children.length - 1 ? 'bdbottom' : ''"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限&三级权限 -->
              <el-col :span="19">
                <el-row
                  class="vcenter"
                  :class="i2 === 0 ? '' : 'bdtop'"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            ><el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            ><el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 主体部分 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
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
      // 角色列表数组
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏(默认隐藏)
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 角色id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色
    async getRoleList () {
      // 发送ajax请求,获取角色列表
      const { data: res } = await this.$http.get('roles')
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
      // 为角色列表赋值
      this.rolesList = res.data
    },
    // 点击"x"通过id,删除该权限
    removeRightById (role, rightId) {
      // 弹框进行询问用户是否删除
      this.$confirm('是否删除该项权限?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      })
        .then(async (action) => {
          // 点击是
          // 发送ajax请求,进行删除该权限
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          // 判断是否删除成功
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
          // 避免将展开项被完整渲染,直接赋值新数据
          role.children = res.data
        })
        .catch(() => {
          // 点击否
        })
    },
    // 展示分配权限的对话框方法
    async showSetRightDialog (role) {
      // 存储角色id
      this.roleId = role.id

      // 获取所有权限数据(树形结构)
      const { data: res } = await this.$http.get('rights/tree')
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          showClose: true,
          duration: 3000
        })
      }
      // 成功  给权限列表进行赋值
      this.rightsList = res.data
      // 递归获取三级节点id
      this.getLeafKeys(role, this.defKeys)
      // 显示对话框
      this.setRightDialogVisible = true
    },
    // 通过递归的方式,获取角色下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 判断节点是否为三级节点
      if (node.children) {
        // 不是三级节点  逐次遍历children
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      } else {
      // 是三级节点  向数组添加该id
        arr.push(node.id)
      }
    },
    // 关闭分配权限对话框触发的事件
    setRightDialogClosed () {
      // 将选中项存储的id值数组进行清空
      this.defKeys = []
    },
    // 点击 确定 发送ajax请求进行更新权限
    async allotRights () {
      // 保存已有权限中的全选和半选的id值
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 发送ajax请求 更改权限
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      })
      // 判断是否分配成功
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
      // 重新渲染到页面
      this.getRoleList()
      // 关闭对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
