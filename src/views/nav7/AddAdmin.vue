<template>
	<el-form ref="form" :model="form" :rules="rules" label-width="80px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="账号">
			<el-input v-model="form.account"></el-input>
		</el-form-item>
		<el-form-item label="密码">
			<el-input v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit" :loading="listLoading">立即创建</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
                listLoading: false,
				form: {
					name: '',
                    account: '',
                    password: ''
                },
                rules: {
                    account:[
                        { required: true, message: '账号不能为空', trigger: 'blur' },
                        { max:16, message: '账号长度应小于16位', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { max:16, message: '密码长度应小于16位', trigger: 'blur' }
                    ],
                    name:[
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                        { max:30, message: '用户名应小于30个字符', trigger: 'blur' }
                    ]
                }
			}
		},
		methods: {
			onSubmit() {
				this.$refs.form.validate((valid) => {
          if (valid) {
            this.listLoading = true;
            let para = Object.assign(this.form);

            this.$axios.post('/v1/admin',para).then(response => {
              this.listLoading = false;
              //NProgress.done();
              let { message, code} = response.data;
              if (code !== 201) {
                this.$message({
                  message: message,
                  type: 'error'
                });
              } else {
                this.$message({
                  message: message,
                  type: 'success'
                });
              }
              this.$refs.form.resetFields()
            });
          } else {
            console.log('error submit!!');
            return false;
          }
      })
    }
	}
}


</script>