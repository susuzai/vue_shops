<template >
  <div>
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  created () {},
  methods: {
    logout () {
      // 清空token
      sessionStorage.clear()
      // 跳转到login页面
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scope>
</style>
