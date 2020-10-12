<template >
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- logo -->
        <img src="../assets/heima.png" alt="" />
        <!-- 文本内容 -->
        <span>电商后台管理系统</span>
      </div>
      <!-- 退出按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体内容区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 切换菜单按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单列表数组
      menuList: [],
      // 图标对象
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 控制菜单的折叠属性
      isCollapse: false,
      // 被激活的菜单
      activePath: undefined
    }
  },
  created () {
    this.getMenuList()
    // 获取到存储在临时存储的激活菜单
    this.activePath = sessionStorage.activePath
  },
  methods: {
    logout () {
      // 清空token
      sessionStorage.clear()
      // 跳转到login页面
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      // 发送ajax请求进行获取
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      // 判断是否获取成功
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          showClose: true,
          duration: 3000
        })
      }
      // 获取成功
      // 给菜单列表赋值
      this.menuList = res.data
    },
    // 点击切换按钮实现菜单的折叠和展开
    toggleCollapse () {
      // 改变折叠属性值
      this.isCollapse = !this.isCollapse
    },
    // 保存被激活的菜单选项
    saveNavState (activePath) {
      // 保存到临时存储中
      sessionStorage.activePath = activePath
      // 给activepath重新赋值
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scope>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 8px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  color: #fff;
  cursor: pointer;
}
</style>
