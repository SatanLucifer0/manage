<template>
  <div>
    <!-- 父子组件传值 -->
  <bread first="权限管理" second="权限列表"></bread>

      <!-- 表格 -->
    <el-table  :data="tableData" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称"></el-table-column>
      <el-table-column property="path" label="路径"></el-table-column>
      <el-table-column property="level" label="层级"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getringht} from '../api/http'

export default {
  data(){
    return{
      tableData:[],
    }
  },
  created() {
    getringht('list').then(res=>{
      console.log(res);
      let data=res.data.data
      // swith里面的的是严格匹配 switch是全等判断（值要相等类型也要相等）
      // 就是括号里的的条件和匹配项里面的条件
      for(let i=0;i<data.length;i++){
        switch(data[i].level){
          case '0':
           data[i].level='一级';
           break;  
           case '1':
           data[i].level='二级';
           break;  
           case '2':
           data[i].level='三级';
           break;  
           default:
           break;
        }
        this.tableData=data
      }
    })
  },
}
</script>

<style>

</style>