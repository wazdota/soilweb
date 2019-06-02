<template>
	<section>
		
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

		<ul class="sslist" ref="allList" v-loading="listLoading">
            <li v-for="(item,index) in sensors" class="sensorList item" style="width:160px;height:160px;position:relative;float:left;list-style: none;border:1px solid #DCDFE6;margin-right: -1px; margin-bottom: -1px;" @click="deleteon?handleDel(item):handleEdit(item)" @mouseover="showMeg(index,true)" @mouseout="showMeg(index,false)">
                <span class="humAndTemp" style="position:absolute;text-align:center;width:160px;height:160px;text-align:center;display:block">
					<el-progress type="circle" :percentage="item.hum" :color="item.hum<item.hl?'#F56C6C':(item.hum>item.hh?'#409EFF':'#67C23A')"></el-progress>
					<el-progress :percentage="item.temp+40" :color="item.temp<item.tl?'#409EFF':(item.temp>item.th?'#F56C6C':'#67C23A')" status="text">{{item.temp}}℃</el-progress>
					<span>{{item.id}}:{{item.name}}</span>
                </span>
				<span class="sensorMeg" :class="'sensorMeg'+index" style="position:absolute;text-align:center;width:160px;height:160px;display:none;background:rgba(255,255,255,0.8)">
					<span style="display:block;line-height:50px">测点名:{{item.name}}</span>
					<span style="display:block;line-height:50px">温度:{{item.temp}}℃</span>
					<span style="display:block;line-height:50px">湿度:{{item.hum}}%</span>
				</span>
				<span class="deleteIcon" :class="'deleteIcon'+index" style="position:absolute;text-align:center;display:none;width:160px;background:rgba(255,255,255,0.9)">
					<i class="el-icon-delete" style="font-size: 100px;display:inline-block;line-height:160px;color:#DCDFE6"></i>
				</span>
            </li>
			<li class="addSensor" @click="handleAdd" style="float:left;width:160px;height:160px;text-align:center;display:block;list-style: none;border:1px solid #DCDFE6;margin-right: -1px; margin-bottom: -1px;"><i class="el-icon-circle-plus" style="font-size: 160px;color:#EBEEF5"></i></li>
		</ul>

		<el-col :span="24" class="toolbar">
			<el-button type="danger" icon="el-icon-delete" circle @click.native="deleteon = true" :disabled="deleteon"></el-button>
			<el-button type="success" icon="el-icon-check" circle @click.native="deleteon = false" :disabled="!deleteon"></el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<el-dialog title="新建" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="传感器名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
    			<el-button @click.native="addFormVisible = false">取 消</el-button>
    			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提 交</el-button>
  			</span>
		</el-dialog>
	</section>
</template>

<script>
import { clearInterval, setInterval } from 'timers';
	export default {
		data() {
			return {
				timer: null,
				filters: {
					name: ''
				},
				options: [{
					value: 'id',
					label: 'ID'
        		}, {
					value: 'name',
					label: '名称'
				}],
				searchValue: 'name',
				websock: null,
				sensors: [],
				listLoading: false,
				deleteon:false,
				total: 0,
				page: 1,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' },
						{ max: 30, message:'名称在30字符内', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
				}

			}
		},
		methods: {
			getSensors() {
				let para = {
					page: this.page,
					pageSize: 40
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
					this.listLoading = false;
					this.$message({
						message: "请求超时",
						type: 'error'
					});
				});
			},
			//删除
			handleDel: function (item) {
				this.$confirm('确认删除该传感器吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: item.id };
					this.$axios.delete('/v1/sensor/'+item.id).then((res) => {
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
			handleEdit: function(sensor){
				sessionStorage.setItem('sensor', JSON.stringify(sensor));
				this.$router.push({ path: '/sensor'});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
				};
			},
			//新增
			addSubmit: function () {
				var user = sessionStorage.getItem('user');
				user = JSON.parse(user);
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({id:null,temp:null,hum:null,th:30.0,tl:0.0,hh:70.0,hl:50.0,userId:user.id,infoId:1}, this.addForm);
							this.$axios.post('/v1/sensor',para).then((res) => {
								this.addLoading = false;
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
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getSensors();
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			showMeg(i,status){
				this.$refs.allList.getElementsByClassName('sensorMeg'+i)[0].style.display=(status&&!this.deleteon)?'block':'none';
				this.$refs.allList.getElementsByClassName('deleteIcon'+i)[0].style.display=(status&&this.deleteon)?'block':'none';
			},
			initWebSocket: function (id) {
							let _this = this;
							var heartCheck = {
								timeout: 20000,
								clear: function(){
									clearInterval(_this.timer);
									return this;
								},
								start: function(){
									_this.timer = setInterval(function(){
										_this.websocket.send("HeartBeat");
									}, this.timeout)
								}
							}
                this.websock = new WebSocket("ws://localhost:9003/websocket/"+id);
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onclose = this.websocketclose;
              },
              websocketonopen: function () {
								console.log("WebSocket连接成功");
								heartCheck.start();
              },
              websocketonerror: function (e) {
                console.log("WebSocket连接发生错误");
              },
              websocketonmessage: function (e) {
								if(e.data == 101){}
								else{
              		var da = JSON.parse(e.data);
                	for(var p in this.sensors){
										if(this.sensors[p].id == da.sensorId){
											this.sensors[p].temp = da.temp;
											this.sensors[p].hum = da.hum;
										}
									}
								}
								heartCheck.clear().start();
              },
              websocketclose: function (e) {
								console.log("connection closed");
								heartCheck.clear();
              }
		},
		mounted() {
			this.getSensors();
			var user = sessionStorage.getItem('user');
			if(user){
				user = JSON.parse(user);
				this.initWebSocket(user.id);
			}
		},
		destroyed(){
			this.websock.close();
			if(this.timer){
				clearInterval(this.timer);
			}
		}
	}

</script>

<style scoped>

</style>