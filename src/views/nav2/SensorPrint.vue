<template>
	<section>
		<div class="pintThis">
			<el-table :data="sensors" highlight-current-row v-loading="listLoading" border size="mini" style="width: 100%;">
				<el-table-column prop="id" label="测点ID" width="100">
				</el-table-column>
				<el-table-column prop="name" label="测点名称" width="300">
				</el-table-column>
				<el-table-column prop="temp" label="测点温度(℃)" width="100">
				</el-table-column>
				<el-table-column prop="hum" label="测点湿度" width="100" :formatter="formatterHum">
				</el-table-column>
			</el-table>
		</div>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button @click="doPrint()">打印</el-button>
		</el-col>

	</section>
</template>

<script>
	export default {
		data() {
			return {
				sensors: [],
				listLoading: false,
			}
		},
		methods: {
			formatterHum: function(row, column){
				return row.hum + "%";
			},
			getSensors() {
				this.listLoading = true;
				//NProgress.start();
				this.$axios.get('/v1/all_sensors').then(response => {
					this.listLoading = false;
					let{message,code,value} = response.data;
					if(code!=200){
						this.$message({
                  			message: message,
                  			type: 'error'
                		});
					}else{
						this.sensors = value;
					}
				}).catch(() => {
					this.logining = false;
					this.$message({
						message: "请求超时",
						type: 'error'
					});
				});
			},
			doPrint() {
				var newstr = document.getElementsByClassName('pintThis')[0].innerHTML
      			document.body.innerHTML = newstr
      			window.print()
      			window.location.reload()
			}
		},
		mounted() {
			this.getSensors();
		}
	}

</script>

<style scoped>

</style>