<template>
    <div>
        <el-row><el-col :span="24" class="toolbar"><div class="grid-content bg-purple-dark">基本信息</div></el-col></el-row>
        <el-row>
            <el-col :span="2"><div class="grid-content bg-purple">传感器ID:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{sensorId}}</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple">传感器名称:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{sensorName}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2"><div class="grid-content bg-purple">当前温度:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{sensorTemp}}℃</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple">当前湿度:</div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple-light">{{sensorHum}}%</div></el-col>
        </el-row>

        <el-row><el-col :span="24" class="toolbar"><el-button type="primary" icon="el-icon-edit" circle @click="handleEdit"></el-button></el-col></el-row>

        <el-row><el-col :span="24" class="toolbar"><div class="grid-content bg-purple-dark">趋势图</div></el-col></el-row>
        <el-row><div id="tempTrend" ref="tempTrend" style="width: 600px; height: 300px;"></div></el-row>
        <el-row><div id="humTrend" ref="humTrend" style="width: 600px; height: 300px;"></div></el-row>

        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="传感器名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="土壤类型" prop="type">
                    <el-select v-model="editForm.type" value-key="id" placeholder="请选择" @change="change">
                        <el-option v-for="item in types" :label="item.name" :key="item.id" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
			</el-form>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="高级设置" name="1">
                    <el-form :model="optionForm" label-width="80px" ref="optionForm">
                        <el-form-item label="温度上限" prop="th">
                            <el-slider v-model="optionForm.th" show-input :min=this.optionForm.tl :max=60></el-slider>
                        </el-form-item>
                        <el-form-item label="温度下限" prop="tl">
                            <el-slider v-model="optionForm.tl" show-input :min=-40 :max=this.optionForm.th></el-slider>
                        </el-form-item>
                        <el-form-item label="湿度上限" prop="hh">
                            <el-slider v-model="optionForm.hh" show-input :min=this.optionForm.hl></el-slider>
                        </el-form-item>
                        <el-form-item label="湿度下限" prop="hl">
                            <el-slider v-model="optionForm.hl" show-input :max=this.optionForm.hh></el-slider>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
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
                sensorId:0,
                sensorName:'',
                sensorTemp:0,
                sensorHum:0,
                tempData:[],
                humData:[],
                sensor:null,
                tempTrend:null,
                humTrend:null,
                activeNames:null,
                editFormVisible:false,
                editLoading:false,
                types:null,
                editForm:{
                    name:'',
                    type:null
                },
                optionForm:{
                    th:0,
                    tl:0,
                    hh:0,
                    hl:0
                },
                editFormRules: {
					name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { max: 30, message:'名称在30字符内', trigger: 'blur' }
					]
                },
            }
        },
        methods:{
            drawTempChart(){
                var dateTime=new Date();
                dateTime=dateTime.setDate(dateTime.getDate()-1);
                dateTime=new Date(dateTime);
                this.tempTrend.setOption({
                    title:{
                        left:'center',
                        text:'温度趋势图',
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getFullYear()+ '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' : ' + params.value[1];
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis:{
                        type:'time',
                        splitLine:{
                            show:false
                        }
                    },
                    yAxis:{
                        type:'value',
                        boundaryGap: ['20%', '20%'],
                        axisLabel: {
                            formatter: function (val) {
                            return val + '℃';
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                        startValue: dateTime,
                        end: 100
                    }, {
                        startValue: dateTime,
                        end: 100,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series:[{
                        name:'temp',
                        type:'line',
                        hoverAnimation: false,
                        showSymbol: false,
                        smooth: true,
                        data:this.tempData
                    }]
                })
            },
            drawHumChart(){
                var dateTime=new Date();
                dateTime=dateTime.setDate(dateTime.getDate()-1);
                dateTime=new Date(dateTime);
                this.humTrend.setOption({
                    title:{
                        left:'center',
                        text:'湿度趋势图',
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getFullYear()+ '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' : ' + params.value[1] + '%';
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis:{
                        type:'time',
                        splitLine:{
                            show:false
                        }
                    },
                    yAxis:{
                        type:'value',
                        axisLabel: {
                            formatter: function (val) {
                            return val + '%';
                            }
                        },
                        boundaryGap: ['20%', '20%'],
                        splitLine: {
                            show: false
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                        startValue: dateTime,
                        end: 100
                    }, {
                        startValue: dateTime,
                        end: 100,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series:[{
                        name:'hum',
                        type:'line',
                        hoverAnimation: false,
                        showSymbol: false,
                        smooth: true,
                        data:this.humData
                    }]
                })
            },
            getSensor(){
                this.$axios.get('/sensor',{params:{id:this.sensorId}}).then(response => {
                    this.sensor = response.data.value;
                    this.sensorId = this.sensor.id;
                    this.sensorName = this.sensor.name || '';
                    this.sensorTemp = this.sensor.temp;
                    this.sensorHum = this.sensor.hum;
                    sessionStorage.setItem('sensor', JSON.stringify(this.sensor));
                })
            },
            change(){
                this.optionForm.th=this.editForm.type.th;
                this.optionForm.tl=this.editForm.type.tl;
                this.optionForm.hh=this.editForm.type.hh;
                this.optionForm.hl=this.editForm.type.hl;
            },
            handleEdit(){
                this.editFormVisible = true;
                this.activeNames = null;
                let type1={
                    id:this.sensor.infoId,
                };
				this.editForm = {
                    name: this.sensor.name,
                    type:type1
                };
                this.optionForm = {
                    th:this.sensor.th,
                    tl:this.sensor.tl,
                    hh:this.sensor.hh,
                    hl:this.sensor.hl
                };
            },
            editSubmit(){
                this.$refs.editForm.validate((valid) =>{
                    if(valid){
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$axios.put('/sensor/'+this.sensor.id,{id:this.sensor.id,name:this.editForm.name,temp:null,hum:null,th:this.optionForm.th,tl:this.optionForm.tl,hh:this.optionForm.hh,hl:this.optionForm.hl,userId:this.sensor.userId,infoId:this.editForm.type.id}).then((res) => {
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
								this.getSensor();
							});
						});
                    }
                });
            }
        },
        mounted(){
            var sensor1 = sessionStorage.getItem('sensor');
			if (sensor1) {
				this.sensor = JSON.parse(sensor1);
				this.sensorId = this.sensor.id;
                this.sensorName = this.sensor.name || '';
                this.sensorTemp = this.sensor.temp;
                this.sensorHum = this.sensor.hum;
            }
            this.tempTrend = this.$echarts.init(document.getElementById('tempTrend'));
            this.humTrend = this.$echarts.init(document.getElementById('humTrend'));
            this.tempTrend.showLoading();
            this.humTrend.showLoading();
            this.$axios.get('/histories', {params:{sensorId:this.sensorId}}).then((response) => {
                let data = response.data.value;
                for(var p in data){
                    let temp = {
                        name: data[p].date,
                        value: [
                            data[p].date,
                            data[p].temp
                        ]
                    };
                    this.tempData.push(temp);
                    let hum = {
                        name: data[p].date,
                        value: [
                            data[p].date,
                            data[p].hum
                        ]
                    };
                    this.humData.push(hum);
                }
                this.tempTrend.hideLoading();
                this.drawTempChart();
                this.humTrend.hideLoading();
                this.drawHumChart();
            }).catch(() => {

            });
            this.$axios.get('/infos').then((response) => {
                this.types = response.data.value;
            });
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