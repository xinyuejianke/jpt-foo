<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">成员列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="members" v-loading="loading">
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="birthday" label="生日"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button plain size="small" type="danger" @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除成员', type: 'disabled' }">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import memberModel from '../../model/member-model'

export default {
  components: {
  },
  setup() {
    const members = ref([])
    const editBookId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    onMounted(() => {
      getAllMembers()
    })

    const getAllMembers = async () => {
      try {
        loading.value = true
        members.value = await memberModel.getAllMembers()
        loading.value = false
      } catch (error) {
        loading.value = false
        if (error.code === 10020) {
          members.value = []
        }
      }
    }

    const handleEdit = id => {
      showEdit.value = true
      editBookId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await memberModel.deleteMember(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getBooks()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getAllMembers()
    }

    const indexMethod = index => index + 1

    return {
      members,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editBookId,
      indexMethod,
      handleDelete,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
