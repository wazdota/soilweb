<template>
<div>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号" clearable></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" clearable></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <el-button type="text" style="width:100%;" @click.native.prevent="handleRegister">>>前往注册</el-button>
    </el-form-item>
  </el-form>

  <el-dialog title="注册" :visible.sync="registerFormVisible" :close-on-click-modal="false">
			<el-form :model="registerForm" label-width="80px" :rules="registerFormRules" ref="registerForm">
				<el-form-item label="账号" prop="account">
					<el-input v-model="registerForm.account" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="密码" prop="password">
					<el-input v-model="registerForm.password" auto-complete="off" show-password></el-input>
				</el-form-item>
        <el-form-item label="重复密码" prop="cpassword">
					<el-input v-model="registerForm.cpassword" auto-complete="off" show-password></el-input>
				</el-form-item>
        <el-form-item label="用户名" prop="name">
					<el-input v-model="registerForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
    			<el-button @click.native="registerFormVisible = false">取 消</el-button>
    			<el-button type="primary" @click.native="registerSubmit" :loading="registerLoading">注 册</el-button>
  			</span>
		</el-dialog>
  </div>
  
</template>

<script>

export default {
  data () {
    return {
      logining: false,
      registerLoading:false,
      ruleForm2: {
        account: 'admin',
        checkPass: '123456'
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          // { validator: validaePass }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { validator: validaePass2 }
        ]
      },
      registerForm:{
        account:'',
        password:'',
        rpassword:'',
        name:''
      },
      registerFormRules:{
        account:[
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { max:16, message: '账号长度应小于16位', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { max:16, message: '密码长度应小于16位', trigger: 'blur' }
        ],
        cpassword:[
          { required: true, 
            validator:(rule,value,callback)=>{
              if(value===''){
                callback(new Error('请再次输入密码'))
              }
              else if(value!==this.registerForm.password){
                callback(new Error('两次输入密码不一致'))
              }
              else{
                callback()
              }
            },trigger:'blur'
          }
        ],
        name:[
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { max:30, message: '用户名应小于30个字符', trigger: 'blur' }
        ]
      },
      registerFormVisible:false,
    }
  },
  methods: {
    handleReset2 () {
      this.$refs.ruleForm2.resetFields()
    },
    handleSubmit2 (ev) {
      var _this = this
      this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var params = new URLSearchParams();
            params.append('username', this.ruleForm2.account);
            params.append('password', this.ruleForm2.checkPass);

            //var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            this.$axios.post('/user',{ username: this.ruleForm2.account, password: this.ruleForm2.checkPass }).then(response => {
              this.logining = false;
              //NProgress.done();
              let { message, code, value } = response.data;
              if (code !== 200) {
                this.$message({
                  message: message,
                  type: 'error'
                });
              } else {
                localStorage.setItem('user', JSON.stringify(value));
                this.$router.push({ path: '/sensorList'});
            }
            });
          } else {
            this.logining = false;
            this.$message({
                  message: "请求超时",
                  type: 'error'
            });
            console.log('error submit!!');
            return false;
          }
      })
    },
    handleRegister(){
      this.registerFormVisible = true;
			this.registerForm = {
				account:'',
        password:'',
        rpassword:'',
        name:''
			};
    },
    registerSubmit(){
      this.$refs.registerForm.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.registerLoading = true;
            //NProgress.start();
            let para = Object.assign({id:null,count:0}, this.registerForm);

            this.$axios.post('/add_user',para).then(response => {
              this.registerLoading = false;
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
              this.$refs.registerForm.resetFields()
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
<style >
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
  }
</style>
