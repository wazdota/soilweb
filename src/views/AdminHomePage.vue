<template>
<div class="body1">
    <el-container class="container">
        <el-header class="header" height="80px">
            <el-row class="logo-contain">
                <el-col :span="18" class="logo">
                    <span>土壤检测平台管理系统(V1.0)</span>
                </el-col>
                <el-col :span="6"><el-link icon="el-icon-close" @click="logout">安全退出</el-link></el-col>
            </el-row>
            <el-row>
                <el-col :span="24">欢迎来到土壤检测平台管理系统  今天是{{date}}</el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-tabs type="border-card">
                <el-tab-pane label="用户管理">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <el-card shadow="hover" @click.native="routerTo('/usersTable')">
                                <i class="el-icon-s-custom"></i>
                                用户列表
                            </el-card>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="信息管理">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <el-card shadow="hover" @click.native="routerTo('/infoTable')">
                                <i class="el-icon-edit-outline"></i>
                                信息列表
                            </el-card>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="数据库管理">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <el-card shadow="hover" @click.native="routerTo('/db_backup')">
                                <i class="el-icon-folder"></i>
                                数据库备份
                            </el-card>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="个人信息">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <el-card shadow="hover" @click.native="routerTo('/admin')">
                                <i class="el-icon-user"></i>
                                个人信息查看
                            </el-card>
                        </el-col>
                        <el-col :span="4">
                            <el-card shadow="hover" @click.native="routerTo('/adminPassword')">
                                <i class="el-icon-key"></i>
                                更改密码
                            </el-card>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-main>
        <el-footer>
            浙江大学生仪学院WAZ 制作
        </el-footer>
    </el-container>
</div>
</template>

<script>
export default {
    data(){
        return{
            date: '',
            user: null
        }
    },
    methods:{
        routerTo(address){
            this.$router.push({ path: address});
        },
        logout: function () {
			var _this = this;
			this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
			}).then(() => {
				sessionStorage.removeItem('Authorization');
				sessionStorage.removeItem('user');
				_this.$router.push('/login');
			}).catch(() => {
			});
		}
    },
    mounted(){
        var dateNow = new Date();
        var year = dateNow.getFullYear();
        var month = dateNow.getMonth() + 1;
        var day = dateNow.getDate();
        var week = "星期" + "日一二三四五六".charAt(dateNow.getDay());
        this.date = year + "年" + month + "月" + day + "日 " + week;
    }
}
</script>

<style scoped lang="scss">

    .container{
        margin: 180px auto;
        width: 1000px;
        .logo{
            font-size: 40px;
            color: rgba(14, 0, 78);
            -webkit-box-reflect: below -5px -webkit-gradient(linear, left top, 
	        left bottom, from(transparent), color-stop(60%, transparent) , to(rgba(14, 0, 78, 0.5)));
        }
    }
    .body1{
        position: absolute;
        height: 100%;
        width: 100%;
        background:radial-gradient(10000px 700px, rgb(210, 229, 248), rgb(0, 37, 73));
    } 
</style>

