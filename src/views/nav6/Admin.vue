<template>
    <div>
        <el-row><el-col :span="24" class="toolbar"><div class="grid-content bg-purple-dark">管理员信息</div></el-col></el-row>
        <el-row>
            <el-col :span="2"><div class="grid-content bg-purple">用户名:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{user.name}}</div></el-col>
        </el-row>
         <el-row>
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit"></el-button>
        </el-row>

        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @submit.native.prevent>
			    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				    <el-form-item label="用户名" prop="name">
					    <el-input v-model="editForm.name" auto-complete="off"></el-input>
				    </el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
    			  <el-button @click.native="editFormVisible = false">取 消</el-button>
    			  <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提 交</el-button>
  			  </span>
		    </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            user:null,
            editLoading: false,
            editFormVisible:false,
            editForm:{
              name: ''
            },
            editFormRules: {
					    name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                { max: 30, message:'名称在30字符内', trigger: 'blur' }
					    ]
            }
        }
    },
    methods:{
        getUser(){
            this.$axios.get('/v1/admin').then(response => {
				      let{message, code, value} = response.data;
				      if(code != 200) {
					      this.$message({
                  message: message,
                  type: 'error'
                });
				      } else {
					      this.user = value;
				      }
			      });
        },
        handleEdit(){
          this.editForm.name = this.user.name;
          this.editFormVisible = true;
        },
        editSubmit(){
           this.$refs.editForm.validate((valid) =>{
              if(valid){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
							    this.editLoading = true;
							    this.$axios.put('/v1/admin',{name:this.editForm.name}).then((res) => {
								    this.editLoading = false;
								    let{code,message} = res.data;
								    if(code == 201){
									    this.$message({
										    message: message,
										    type: 'success'
									    });
								    }
								    else{
									    this.$message({
										    message: message,
										    type: 'error'
									    });
								    }
								    this.editFormVisible = false;
								    this.getUser();
							    });
						    });
              }
            });
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