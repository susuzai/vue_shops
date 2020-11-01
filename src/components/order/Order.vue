<template>
  <div>
    <h3>订单列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单数据表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAddressEditDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="adressDialogClosed">
      <!-- 主体内容 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRule"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
        <!-- 级联选择框 -->
        <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部确认 取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流显示对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="50%">
        <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: '',
  components: {},
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      orderList: [],
      total: 0,
      // 控制编辑对话框的显示与隐藏
      addressVisible: false,
      // 地址表单
      addressForm: { address1: [], address2: '' },
      // 验证规则
      addressFormRule: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 控制物流信息显示与隐藏
      progressDialogVisible: false,
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      // 发送ajax请求 获取订单列表
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 点击编辑按钮 显示编辑对话框
    showAddressEditDialog () {
      this.addressVisible = true
    },
    // 关闭对话框 清空输入框
    adressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击地址  显示物流信息
    async showProgressDialog () {
      // 发送ajax请求获取物流信息

      // 请求有问题 !!!  后台接口没有处理好

      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // console.log(res)
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-col {
  margin-bottom: 20px;
}
.el-cascader{
  width: 100% !important;
}
</style>
