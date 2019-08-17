<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="my-bread">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-col>
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model.trim="searchParams.query"
          class="input-with-select"
          @input="getUsers"
        >
          <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="success" plain @click="dialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-col>

    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      @current-change="handleCurrentChange"
      style="width: 100%"
      border
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="姓名" width="120"></el-table-column>
      <el-table-column property="email" label="邮箱"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>

      <!-- 自定义列 -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
            <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchParams.pagenum"
      :page-sizes="[5, 10, 15, 20,]"
      :page-size="searchParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 新增弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { users, addUser } from "../api/http";
// import {addUser } from "../api/http";

export default {
  data() {
    return {
      dialogFormVisible: true,

      form: {
        password: "",
        username: "",
        email: "",
        mobile: ""
      },

      // 参数传过来是一个对象,,这边设置一个对象变量来接收
      searchParams: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },

      tableData: [],
      total: 0,
      currentRow: null,

      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },

  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getUsers() {
      if(this.searchParams.query!='')
      this.searchParams.pagenum=1;

      // 获取用户列表
      users(this.searchParams).then(res => {
        console.log(res);
        this.tableData = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 页容量改变事件
    handleSizeChange(size) {
      this.searchParams.pagesize = size;
      this.searchParams.pagenum = 1;
      this.getUsers();
    },
    // 点击的页码展示相应的页的内容
    handleCurrentChange(page) {
      this.searchParams.pagenum = page;
      this.getUsers();
    },

    // 表单验证的按钮点击事件
    submitForm(formName) {
      // 整个表单的提交验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证通过发送请求
          addUser(this.form).then(res => {
            // console.log(res);
            if (res.data.meta.status == 201) {
              (this.dialogFormVisible = true), this.getUsers();
            } else {
              this.$message.error("新增失败");
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getUsers();
  }
};
</script>

<style lang="less" scoped>
.my-bread {
  background-color: #d3dce6;
  height: 45px;
  line-height: 45px;
  padding-left: 15px;
}
</style>