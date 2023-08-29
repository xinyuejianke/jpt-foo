<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">排班列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="schedules" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="user.nickname" label="职员昵称"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="times" label="时间" show-overflow-tooltip>
          <template #default="scope">
            <div v-for="time in scope.row.times.split(',')">
              <el-tag type="info"> {{ time }} </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="availableTimes" label="可预约时间"></el-table-column>

        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button plain size="small" type="danger" @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除排班表', type: 'disabled' }">删除</el-button>
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
import scheduleModel from '../../model/schedule-model'

export default {
  setup() {
    const schedules = ref([])
    const editScheduleId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    onMounted(() => {
      getAllSchedules()
    })

    const getAllSchedules = async () => {
      try {
        loading.value = true
        schedules.value = await scheduleModel.getAllSchedules()
        loading.value = false
      } catch (error) {
        loading.value = false
        if (error.code === 10020) {
          schedules.value = []
        }
      }
    }

    const handleEdit = id => {
      showEdit.value = true
      editScheduleId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该排班, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await memberModel.deleteMember(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getAllSchedules()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getAllSchedules()
    }

    return {
      schedules,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editScheduleId,
      handleDelete,
    }
  },
  methods: {
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
