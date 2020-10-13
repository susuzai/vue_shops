<template >
  <div>
    <h3>权限列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 权限列表表格 -->
        <el-table :data="rightsList" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                  <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
                  <el-tag type="warning" v-else>三级</el-tag>
              </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表方法
    async getRightsList () {
      // 发送ajax请求进行获取
      const { data: res } = await this.$http.get('rights/list')
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
      // 给权限列表进行赋值
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less" scope>
</style>
