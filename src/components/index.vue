<template>
  <el-container class="my-container">
    <el-header class="my-header">
      <img src="../assets/img/logo.png" alt />
      <span>电商后台管理</span>
      <a href="#" @click.prevent="loginOut">退出</a>
    </el-header>
    <el-container>
      <el-aside width="200px" class="my-aside">
        <!-- 文档里面可以知道unique-opened是展开单独一个下拉框,  router是以index为路径跳转  -->
        <el-menu class="el-menu-vertical-demo" :unique-opened="true" router>
          <el-submenu :index="''+index" v-for="(item,index) in menuList">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="subitem in item.children" :index="subitem.path"><i class="el-icon-menu"></i>
              {{subitem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="my-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from "../api/http";
export default {
  data() {
    return {
      menuList: []
    };
  },
  created() {
    menus().then(res => {
      console.log(res);
      this.menuList = res.data.data;
    });
  },
  methods: {
    loginOut() {
      this.$confirm("确定要退出吗?", "确认退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });

          // 退出之前删除token
          window.localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "请继续工作"
          });
        });
    }
  }
};
</script>

<style lang='less' scoped>
.my-container {
  height: 100%;

  .my-header {
    background-color: #b3c0d1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 24px;
      color: #ffffff;
    }
    a {
      color: orange;
    }
  }
  .my-aside {
    background-color: #ffffff;
  }
  .my-main {
    background-color: #e9eef3;
  }
}
</style>