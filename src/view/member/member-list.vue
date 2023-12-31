<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">成员列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="members" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column label="性别" prop="gender" :formatter="getGender"></el-table-column>
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

    <!-- 编辑页面 -->
    <member-modify v-else @editClose="editClose" :editMemberId="editMemberId"></member-modify>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import memberModel from '../../model/member-model'
import MemberModify from './member'

export default {
  data() {
    return {
      genders: { 'm': '男', 'f': '女' }
    }
  },
  components: {
    MemberModify
  },
  setup() {
    const members = ref([])
    const editMemberId = ref(1)
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
      editMemberId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await memberModel.deleteMember(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getAllMembers()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getAllMembers()
    }

    return {
      members,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editMemberId,
      handleDelete,
    }
  },
  methods: {
    getGender(prop) {
      return this.$data.genders[prop.gender]
    }
  }
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
