<template>
  <div>
    <bread first="用户管理" second="用户列表"></bread>

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
    <el-table ref="singleTable" :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="姓名" width="120"></el-table-column>
      <el-table-column property="email" label="邮箱"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>

      <!-- 自定义列 -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              plain
              @click="showmessage(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              @click="del(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              plain
              @click="showRole(scope.row)"
            ></el-button>
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
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
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

    <!-- 修改弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editFormVisible">
      <el-form :model="editForm">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserMessage">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配角色" :visible.sync="ringhtFormVisible">
      <el-form :model="Role">
        <el-form-item label="当前用户">
          <span>{{Role.username}}</span>
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="Role.rid" placeholder="请选择角色">
            <el-option v-for="item in roleList" :label="item.roleName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ringhtFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  users,
  addUser,
  changeUserStatus,
  // showUser,
  editmessage,
  delUser,
  getRole,
  userRole
} from "../api/http";
// import {addUser } from "../api/http";

export default {
  data() {
    return {
      Role: {
        id: 0,
        rid: 0,
        username: ""
      },
      roleList: [],
      ringhtFormVisible: false,
      editForm: {
        id: "",
        email: "",
        mobile: 0,
        username: ""
      },
      editFormVisible: false,
      // 修改用户状态的参数
      status: {
        uId: 0,
        type: false
      },
      dialogFormVisible: false,
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
    changeRole() {
      userRole(this.Role).then(res => {
        // console.log(this.Role);
        if (res.data.meta.status == 200) {
          this.$message.success("分配成功");
          this.ringhtFormVisible = false;
          this.getUsers();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 已经来显示当前名字
    showRole(row) {
      // console.log(row);

      this.ringhtFormVisible = true;
      this.Role.username = row.username;
      // 下面是为上面的参数做提前准备
      // 我点哪一行,就把这个的角色显示在被选中的下拉框里  v-model:Role.rid绑定的,所以我们直接给他按文字他也能显示
      // this.Role.rid=row.role_name
      this.Role.id = row.id;

      // 但此时有个bug出现了,,,就是我发给一个用户分配一个角色后,,在给他分配不点即也会变成超级管理员,,
      // 使用为this.Role.rid=row.role_name 这里我们给了他一个文字
      // 最好不给文字,,给他id
      // 那我们就从角色列表里面去找角色id(rid)
      let rid=0;
      for (let i = 0; i < this.roleList.length; i++) {
        // 点这一行就可以拿到这一行的row,,打印row发现里面有 row.role_name去角色里表里面找这个名字的匹配就把他的
        if (this.roleList[i].roleName == row.role_name) {
          rid = this.roleList[i].id;
          break;
        }
      }
      this.Role.rid = rid;
    },
    // s删除用户
    del(row) {
      this.$confirm("确认要删除", "确认删除", {
        type: "warning"
      })
        .then(() => {
          delUser(row.id).then(res => {
            if (res.data.meta.status == 200) {
              this.$message.success("删除成功");
              this.getUsers();
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        })
        .catch(() => {
          this.$message.warning("已取消删除");
        });
    },

    // 点击确定按钮修改信息
    editUserMessage() {
      editmessage(this.editForm).then(res => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.editFormVisible = false;
          this.$message.success("更新成功");
          this.getUsers();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 点击修改按钮显示相关信息到页面
    // editUser(row) {
    //   this.editFormVisible = true;
    //   showUser(row.id).then(res => {
    //     this.editForm = res.data.data;
    //   });
    // },

    // 还可以有下面一种方法
    showmessage(row) {
      this.editFormVisible = true;
      // 直接把row这一行里面的信息赋值给editForm
      // this.editForm=row
      // 但是在输入框修改内容又我们取消的时候会出现修改的效果,,,是应为v-model双向绑定了,\
      // editForm,row都是对象,赋值后两个变量空间指向同一个地址,修改文本框里的值,,editForm也就变了,,同时row也变了
      this.editForm.username = row.username;
      this.editForm.email = row.email;
      this.editForm.mobile = row.mobile;
      this.editForm.id = row.id;
    },

    // 用户状态改变
    changeStatus(row) {
      this.status.uId = row.id;
      this.status.type = row.mg_state;
      changeUserStatus(this.status).then(res => {
        if (res.data.meta.status == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    getUsers() {
      if (this.searchParams.query != "") this.searchParams.pagenum = 1;

      // 获取用户列表
      users(this.searchParams).then(res => {
        // console.log(res);
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
              this.$message.success("新增成功");
              this.dialogFormVisible = false;
              this.getUsers();
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
    // 进入分配权限页面显示当前的角色
    getRole().then(res => {
      // console.log(res);
      this.roleList = res.data.data;
    });
  }
};
</script>

<style>

</style>