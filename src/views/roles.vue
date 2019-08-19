<template>
  <div>
    <bread first="权限管理" second="角色列表"></bread>

    <el-button>添加角色</el-button>
    <!-- 表单 -->
    <!-- 表格 -->
    <el-table :data="tableData" border>
      <!-- 让每一行出现下拉箭头 -->
      <el-table-column type="expand">
        <!-- 获取到table内部管理的数据 -->
        <template slot-scope="scope">
          <el-row v-for="tag in scope.row.children">
            <el-col :span="4">
              <el-tag
                :key="tag.id"
                closable
                @close="delRight(sope.row.id,tag.id,sope.row)"
              >{{tag.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in tag.children">
                <el-col :span="6">
                  <el-tag
                    :key="level2.id"
                    closable
                    type="success"
                    @close="delRight(sope.row.id,level2.id,sope.row)"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    type="warning"
                    class="my-style"
                    @close="delRight(sope.row.id,level3.id,sope.row)"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column property="roleDesc" label="角色描述"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              plain
              @click="showList(scope.row)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击√的时候弹出对话框 -->
    <el-dialog title="权限分配" :visible.sync="dialogVisible">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expand-all="true"
        :default-checked-keys="[]"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRole, getringht } from "../api/http";
export default {
  name: "roleList",
  data() {
    return {
      data: [],
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      tableData: []
    };
  },
  methods: {
    // 点击哪一行,,就把那一行的拥有的权限默认选中,,,
    // 首先要绑定一个  ref="tree"
    // 然后看文档通过key设置或者获取
    showList(row) {
      this.dialogVisible = true;

      // 下面解决了有id来设置默认选择项,这里我们要怎么样找到id
      // 点击哪一行就拿到这一行的数据遍历出他所有id

      let list = [];
      // 遍历1级权限
      // for( let i = 0; i <  row.children.length; i++){

      //     list.push( row.children[i].id )

      //     // 遍历2级权限
      //     let level2 = row.children[i].children;
      //     for(let j = 0; j < level2.length; j++){

      //         list.push(level2[j].id)

      //         //遍历3级权限
      //         let level3 = level2[j].children;
      //         for( let z = 0; z < level3.length; z++){

      //             list.push( level3[z].id )
      //         }
      //     }
      // }
      // 这里我们会发现在选中一级或者二级是,,三级会默认全部选中,,即是三级里面有的权限是没哟的,
      // 所以我们只要push遍历的三级id就行,,,当三级id只要有一个选中,,一级二级的就默认选中了

      // 用递归遍历DOM树行结构更好
      function getId(item) {
        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            //  每个子元素可能还有自己的子元素
            getId(item.children[i]);
          }
        } else {
          //代表没有子元素了
          list.push(item.id);
        }
      }
      getId(row);

      // 从这里可以看出,,我在数组里面传什么id就相应权限的id默认选中
      // 但是在这里我们对话框是懒加载,,页面打开还没有用到它就不会创建他,,所以找不到tree,,得到的是undefined
      // 创建是一个异步操作,,,打开对话框this.dialogVisible= true;就马上到下面这句了,,,
      // 渲染不到，，但可以用updated里面写这句,数据一旦改变就调用updated,,浪费性能
      // 这里用 nextTick 回调行数
      // this.$refs.tree.setCheckedKeys([3]);  数组里面是key值但我们绑定到了id

      //   下一次dom更新调用，它相当于就是setTimeout，只不过它的执行时机是下一次dom更新后才调用
      this.$nextTick(() => {
        // console.log(this.$refs.tree);
        this.$refs.tree.setCheckedKeys(list);
      });
    },
    // 每个权限标签的删除事件
    // 前面2个参数死接口要求的,,,后面那个参数是在删除以后刷新数据接收刷新的数据而设的
    delRight(roleId, rightId, row) {
      delRoleRight(roleId, rightId).then(res => {
        // 这个接口如果取消权限成功，状态为200
        // 其次，data.data里会返回剩余的权限
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("删除权限成功");
          // 返回剩余的权限给row  权限的标签是用row,children生成的
          row.children = res.data.data;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    }
  },
  created() {
    getRole().then(res => {
      console.log(res);
      this.tableData = res.data.data;
    });

    getringht("tree").then(res => {
      console.log(res);
      this.data = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
.my-style {
  margin-right: 10px;
  margin-bottom: 15px;
}
</style>