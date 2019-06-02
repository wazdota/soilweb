<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="searchValue">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="page=1;getUsers()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="id" label="用户ID" width="100" sortable>
			</el-table-column>
			<el-table-column prop="account" label="账号" width="300" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="name" label="名称" width="300" sortable>
			</el-table-column>
			<el-table-column prop="count" label="测点数量" width="100" sortable>
			</el-table-column>
			<el-table-column prop="max" label="测点上限" width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">更改上限</el-button>
					<el-button size="small" @click="handlePassword(scope.row)">更改密码</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="更改上限" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="上限" prop="max">
					<el-input-number v-model="editForm.max" controls-position="right" :min="1"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="更改密码" :visible.sync="passwordFormVisible" :close-on-click-modal="false">
			<el-form :model="passwordForm" label-width="80px" :rules="passwordFormRules" ref="passwordForm">
				<el-form-item label="密码" prop="password">
					<el-input v-model="passwordForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="passwordFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="passwordSubmit" :loading="passwordLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	export default {
		data() {
			return {
				options: [{
					value: 'id',
					label: 'ID'
        		}, {
					  value: 'account',
					  label: '账号'
        		}, {
					value: 'name',
					label: '名称'
				}],
				searchValue: 'name',
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editForm: {
					id: 0,
					max: 0
				},

				passwordFormVisible: false,//编辑界面是否显示
				passwordLoading: false,
				passwordFormRules: {
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				//编辑界面数据
				passwordForm: {
					id: 0,
					password: ''
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					pageSize: 20
				};
				if(this.filters.name != null && this.filters.name != ''){
					if(this.searchValue == 'id')para.id = this.filters.name;
					else if(this.searchValue == 'account')para.account = this.filters.name;
					else if(this.searchValue == 'name')para.name = this.filters.name;
				}
				this.listLoading = true;
				//NProgress.start();
				this.$axios.get('/v1/users',{params:para}).then(response => {
					this.listLoading = false;
					let{message,code,value} = response.data;
					if(code!=200){
						this.$message({
                  			message: message,
                  			type: 'error'
                		});
					}else{
						this.total = value.total;
						this.users = value.list;
					}
				}).catch(() => {
					this.logining = false;
					this.$message({
						message: "请求超时",
						type: 'error'
					});
				});
			},
			//删除
			handleDel: function (row) {
				this.$confirm('确认删除该用户吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					this.$axios.delete("/v1/user/"+row.id).then((res) => {
						this.listLoading = false;
						let{message,code} = res.data;
						let type = code == 204 ? 'success' : 'error'
						this.$message({
							message: message,
							type: type
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.editFormVisible = true;
				this.editForm.id = row.id;
				this.editForm.max = row.max;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							this.$axios.put('/v1/user_a/' + this.editForm.id, para).then((res) => {
								this.editLoading = false;
								type = res.data.code == 201 ? 'success' : 'error';
								this.$message({
									message: res.data.message,
									type: type
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			handlePassword: function (row) {
				this.passwordFormVisible = true;
				this.passwordForm.id = row.id;
				this.passwordForm.password = '';
			},
			passwordSubmit: function () {
				this.$refs.passwordForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.passwordLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.passwordForm);
							this.$axios.put('/v1/user_a/' + this.passwordForm.id, para).then((res) => {
								this.passwordLoading = false;
								type = res.data.code == 201 ? 'success' : 'error';
								this.$message({
									message: res.data.message,
									type: type
								});
								this.$refs['passwordForm'].resetFields();
								this.passwordFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>