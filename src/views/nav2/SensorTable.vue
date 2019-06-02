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
					<el-button type="primary" v-on:click="page=1;getSensors()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="sensors" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="测点ID" width="100" sortable>
			</el-table-column>
			<el-table-column prop="name" label="测点名称" width="300" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="temp" label="测点温度(℃)" width="100" sortable>
			</el-table-column>
			<el-table-column prop="hum" label="测点湿度(%)" width="100" sortable>
			</el-table-column>
            <el-table-column prop="th" label="温度上限" width="100" sortable>
			</el-table-column>
            <el-table-column prop="tl" label="温度下限" width="100" sortable>
			</el-table-column>
            <el-table-column prop="hh" label="湿度上限" width="100" sortable>
			</el-table-column>
            <el-table-column prop="hl" label="湿度下限" width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleSensor(scope.row)">查看详情</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

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
					value: 'name',
					label: '名称'
				}],
				searchValue: 'name',
				filters: {
					name: ''
				},
				sensors: [],
				total: 0,
				page: 1,
				listLoading: false,

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getSensors();
			},
			getSensors() {
				let para = {
					page: this.page,
					pageSize: 20
				};
				if(this.filters.name != null && this.filters.name != ''){
					if(this.searchValue == 'id')para.id = this.filters.name;
					else if(this.searchValue == 'name')para.name = this.filters.name;
				}
				this.listLoading = true;
				//NProgress.start();
				this.$axios.get('/v1/sensors',{params:para}).then(response => {
					this.listLoading = false;
					let{message,code,value} = response.data;
					if(code!=200){
						this.$message({
                  			message: message,
                  			type: 'error'
                		});
					}else{
						this.total = value.total;
						this.sensors = value.list;
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
				this.$confirm('确认删除该测点吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					this.$axios.delete('/v1/sensor/'+row.id).then((res) => {
						this.listLoading = false;
						let {code,message} = res.data;
						if(code == 204){
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
						this.getSensors();
					}).catch(() => {
						this.listLoading = false;
						this.$message({
								message: "请求超时",
								type: 'error'
						});
					});
				}).catch(() => {

				});
            },
            handleSensor: function(row){
                let sensor = Object.assign({}, row);
                sessionStorage.setItem('sensor', JSON.stringify(sensor));
                this.$router.push({path: '/sensor'});
            }
		},
		mounted() {
			this.getSensors();
		}
	}

</script>

<style scoped>

</style>