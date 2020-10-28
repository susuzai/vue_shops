<template>
  <div>
    <h3>添加商品组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="+activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                clearable
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  checkStrictly: true,
                }"
                @change="handleCascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="t"
                  border
                  v-for="(t, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片  action 是传到后端的api地址-->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" style="marginTop:15px;" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
    <!-- 主体内容 -->
      <img :src="previewPath" style="width:100%;">
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash
import _ from 'lodash'
export default {
  name: '',
  components: {},
  data () {
    return {
      activeIndex: '',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [], // 上传图片的路径
        // 商品描述详情
        goods_introduce: '',
        attrs: []
      },
      cateList: [],
      // 动态参数列表
      manyTabData: [],
      // 静态属性列表
      onlyTabData: [],
      // 上传图片配置请求头token
      headerObj: {
        Authorization: sessionStorage.token
      },
      // 图片预览地址
      previewPath: '',
      // 图片预览对话框是否显示
      previewVisible: false,

      addFormRule: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
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
      const { data: res } = await this.$http.get('categories')
      // 给商品分类列表赋值
      this.cateList = res.data
    },
    // 级联选择框值发生改变处理函数
    handleCascaderChange () {
      // 只允许级联选择框选中第三级
      if (this.addForm.goods_cat.length !== 3) {
        // 将选择框清空
        this.addForm.goods_cat = []
      }
    },
    // 如果没有选中三级级联选择框,tabs不能进行切换
    beforeTabLeave (newActiveName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message({
          message: '请先选择商品分类',
          type: 'error',
          showClose: true,
          duration: 2000
        })
        return false
      }
    },
    // 选择页签处理函数
    async tabClicked () {
      // 选择商品参数页签
      if (this.activeIndex === '1') {
        // 发送ajax请求,获取动态参数数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        // 处理attr_vals数据为数组
        res.data.forEach((t) => {
          t.attr_vals = t.attr_vals.length ? t.attr_vals.split(',') : []
        })
        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        // 发送ajax请求,获取静态数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        this.onlyTabData = res.data
      }
    },
    // 移除图片处理函数
    handleRemove (file) {
      // console.log(file)
      // 获取当前图片的路径
      const filePath = file.response.data.tmp_path
      // 找到当前图片的索引
      const index = this.addForm.pics.findIndex((t) => t.pic === filePath)
      // 根据索引删除当前图片
      this.addForm.pics.splice(index, 1)
    },
    // 图片预览处理函数
    handlePreview (file) {
      console.log(file)
      // 获取图片预览路径
      this.previewPath = file.response.data.url
      // 显示图片预览对话框
      this.previewVisible = true
    },
    // 图片上传成功处理函数
    handleSuccess (response) {
      this.addForm.pics.push({
        pic: response.data.tmp_path
      })
    },
    // 点击 添加商品 按钮 处理函数
    addGoods () {
      // 表单预验证
      this.$refs.addFormRef.validate(async valid => {
        // 验证不通过
        if (!valid) {
          return this.$message({
            message: '请填写必要的项目',
            type: 'warning',
            showClose: true,
            duration: 3000
          })
        }
        // 验证通过
        // 深拷贝addForm
        const form = _.cloneDeep(this.addForm)
        // 将goods_cat用 ","拼接
        form.goods_cat = form.goods_cat.length ? form.goods_cat.join(',') : ''
        // 处理动态参数
        this.manyTabData.forEach(t => {
          this.addForm.attrs.push({
            attr_id: t.attr_id,
            attr_value: t.attr_vals.join(',')
          })
        })
        // 处理静态属性
        this.onlyTabData.forEach(t => {
          this.addForm.attrs.push({
            attr_id: t.attr_id,
            attr_value: t.attr_vals
          })
        })
        // 将addForm的attrs
        form.attrs = this.addForm.attrs
        // 发送ajax请求 进行添加商品
        await this.$http.post('goods', form)
        // 跳转到商品页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 分类id
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
