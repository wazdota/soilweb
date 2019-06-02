<template>
	<section>

		<!--列表-->
		<el-table :data="infos" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="id" label="信息ID" width="100" sortable>
			</el-table-column>
			<el-table-column prop="name" label="名称" width="120" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="th" label="温度上限" width="100" sortable>
			</el-table-column>
			<el-table-column prop="tl" label="温度下限" width="100" sortable>
			</el-table-column>
            <el-table-column prop="hh" label="湿度上限" width="100" sortable>
			</el-table-column>
            <el-table-column prop="hl" label="湿度下限" width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" v-on:click="handleAdd">添加信息</el-button>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="温度上限" prop="th">
                    <el-slider v-model="editForm.th" show-input :min="editForm.tl" :max="60"></el-slider>
                </el-form-item>
                <el-form-item label="温度下限" prop="tl">
                    <el-slider v-model="editForm.tl" show-input :min="-40" :max="editForm.th"></el-slider>
                </el-form-item>
                <el-form-item label="湿度上限" prop="hh">
                    <el-slider v-model="editForm.hh" show-input :min="editForm.hl"></el-slider>
                </el-form-item>
                <el-form-item label="湿度下限" prop="hl">
                    <el-slider v-model="editForm.hl" show-input :max="editForm.hh"></el-slider>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

        <el-dialog title="新建" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="温度上限" prop="th">
                    <el-slider v-model="addForm.th" show-input :min="addForm.tl" :max="60"></el-slider>
                </el-form-item>
                <el-form-item label="温度下限" prop="tl">
                    <el-slider v-model="addForm.tl" show-input :min="-40" :max="addForm.th"></el-slider>
                </el-form-item>
                <el-form-item label="湿度上限" prop="hh">
                    <el-slider v-model="addForm.hh" show-input :min="addForm.hl"></el-slider>
                </el-form-item>
                <el-form-item label="湿度下限" prop="hl">
                    <el-slider v-model="addForm.hl" show-input :max="addForm.hh"></el-slider>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	export default {
		data() {
			return {
				infos: [],
				total: 0,
				page: 1,
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
                    id: 0,
					name: '',
					th: 0,
					tl: 0,
					hh: 0,
					hl: 0
                },
                
                addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					th: 0,
					tl: 0,
					hh: 0,
					hl: 0
				}
			}
		},
		methods: {
			getInfos() {
				this.listLoading = true;
				//NProgress.start();
				this.$axios.get('/v1/infos').then(response => {
					this.listLoading = false;
					let{message,code,value} = response.data;
					if(code!=200){
						this.$message({
                  			message: message,
                  			type: 'error'
                		});
					}
						this.infos = value;
					
				}).catch(() => {
					this.listLoading = false;
					this.$message({
						message: "请求超时",
						type: 'error'
					});
				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							this.$axios.put('/v1/info/'+para.id,para).then(response => {
                                this.editLoading = false;
                                let{message,code,value} = response.data;
                                let megType = (code == 201) ? 'success' : 'error';
                                this.$message({
                                    message: message,
                                    type: megType
                                });
                                this.getInfos();
                            }).catch(() => {
						        this.editLoading = false;
						        this.$message({
								    message: "请求超时",
								    type: 'error'
						        });
					        });
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							this.$axios.post('/v1/info',para).then(response => {
                                this.addLoading = false;
                                let{message,code,value} = response.data;
                                let megType = (code == 201) ? 'success' : 'error';
                                this.$message({
                                    message: message,
                                    type: megType
                                });
                                this.getInfos();
                            }).catch(() => {
						        this.addLoading = false;
						        this.$message({
								    message: "请求超时",
								    type: 'error'
						        });
					        });
						});
					}
				});
			},
			handleAdd(){
				this.addFormVisible = true;
				this.addForm= {
					name: '',
					th: 0,
					tl: 0,
					hh: 0,
					hl: 0
				}
			}
		},
		mounted() {
			this.getInfos();
		}
	}

</script>

<style scoped>

</style>