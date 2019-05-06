<template>
    <div>
        <el-row><el-col :span="24" class="toolbar"><div class="grid-content bg-purple-dark">用户信息</div></el-col></el-row>
        <el-row>
            <el-col :span="2"><div class="grid-content bg-purple">用户名:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{user.name}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2"><div class="grid-content bg-purple">已有传感器数:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{user.count}}</div></el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data(){
        return{
            user:null
        }
    },
    methods:{
        getUser(){
            var usr = localStorage.getItem('user');
			      this.user = JSON.parse(usr);
        }
    },
    mounted(){
        this.getUser();
    }
}
</script>

<style>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #d3dce6;
  }
  
  .grid-content {
    border-radius: 4px;
    min-height: 20px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
