<template>
    <section>
        <el-table :data="files" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="name" label="文件名" width="400" sortable>
			</el-table-column>
			<el-table-column label="下载" width="150">
				<template scope="scope">
					<el-button size="small" icon="el-icon-download" type="text" @click="handleDl(scope.row)"></el-button>
				</template>
			</el-table-column>
		</el-table>
    </section>
</template>

<script>
export default {
    data(){
        return{
            files: [],
            listLoading: false,
            buLoading: false
        }
    },
    methods:{
        handleDl(row){
            window.open("http://localhost:9003/v1/download?name="+row.name,'_blank');
        },
        getFiles(){
            this.listLoading = true;
            this.$axios.get('/v1/file').then(response => {
                this.listLoading = false;
                let{code,message,value} = response.data;
                if(code!=200){
                    this.$message({
                  	message: message,
                  	type: 'error'
                	});
                }
                else{
                    this.files = value;
                }
            })
        }
    },
    mounted(){
        this.getFiles();
    }
}
</script>

