<template>
    <section>
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
			<el-form-item label="传感器名称" prop="name">
				<el-input v-model="addForm.name" auto-complete="off"></el-input>
			</el-form-item>
            <el-form-item label="土壤类型" prop="type">
                <el-select v-model="addForm.type" value-key="id" placeholder="请选择" @change="change">
                    <el-option v-for="item in types" :label="item.name" :key="item.id" :value="item"></el-option>
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
        <div>
            <el-button type="primary" @click="onSubmit" :loading="addLoading">立即创建</el-button>
        </div>
    </section>
</template>

<script>
export default {
    data(){
        return{
            types:null,
            addLoading: false,
            addForm:{
                name:'',
                type:null
            },
            optionForm:{
                th:0,
                tl:0,
                hh:0,
                hl:0
            },
            addFormRules: {
				name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 30, message:'名称在30字符内', trigger: 'blur' }
				]
            },
            activeNames: []
        }
    },
    methods:{
        change(){
            this.optionForm.th=this.addForm.type.th;
            this.optionForm.tl=this.addForm.type.tl;
            this.optionForm.hh=this.addForm.type.hh;
            this.optionForm.hl=this.addForm.type.hl;
        },
        onSubmit(){
            var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
			}
            this.$refs.addForm.validate((valid) =>{
                    if(valid){
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$axios.post('/v1/sensor',{name:this.addForm.name,th:this.optionForm.th,tl:this.optionForm.tl,hh:this.optionForm.hh,hl:this.optionForm.hl,userId:user.id,infoId:this.addForm.type.id}).then((res) => {
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
							});
						});
                    }
            });
        }
    },
    mounted(){
        this.$axios.get('/v1/infos').then((response) => {
            this.types = response.data.value;
        });
    }
}
</script>
