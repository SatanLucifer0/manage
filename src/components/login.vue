<template>
  <div class="login">
    <div class="login-from">
      <h2>登录界面</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="登录账号" prop="userName">
          <el-input type="text" v-model="ruleForm.userName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="btnStyle">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from '../api/http'

export default {
  data() {
    return {
      ruleForm: {userName: "admin",password: "123456"},
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         
          // 发送请求,,并且传的参数是一个对象
          login(this.ruleForm).then(res=>{
            console.log(res);
            
            if(res.data.meta.status==200){
              this.$message.success({
                message:"登录成功",
                duration:1000
              });
              // 但此时我只要输入正确网址就可以进入主页,,需要注册导航守卫
              // axios默认不带token 也不会保存和自动发送
              // 在登录后保存token
              window.localStorage.setItem('token',res.data.data.token)

              this.$router.push('/index');
            }else{
               this.$message.error(res.data.meta.msg)
            } 
          })
        } else {
          // ----------------
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #324152;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-from {

  width: 460px;
  height: 320px;
  border-radius: 5px;
  background-color: #fff;
  padding: 40px;
  h2{
    margin-bottom: 10px;
  }
  .btnStyle{
    width: 100%;
    margin-top: 10px;
  }
}
</style>