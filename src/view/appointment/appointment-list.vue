<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">预约列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="appointments" v-loading="loading">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="employee.id" label="职员ID"></el-table-column>
        <el-table-column prop="employee.nickname" label="职员昵称"></el-table-column>
        <el-table-column prop="member.id" label="顾客ID"></el-table-column>
        <el-table-column prop="member.nickname" label="顾客昵称"></el-table-column>
        <el-table-column prop="dateTime" width="110" label="日期">
          <template #default="scope">{{scope.row.dateTime.split('T')[0]}}</template>
        </el-table-column>
        <el-table-column prop="dateTime" label="时间">
          <template #default="scope">{{scope.row.dateTime.split('T')[1].substring(0,5)}}</template>
        </el-table-column>

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
    <!-- <schedule-modify v-else @editClose="editClose" :editScheduleId="editScheduleId"></schedule-modify> -->
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import scheduleModel from '../../model/schedule-model'
import appointmentModel from '../../model/appointment-model'
// import ScheduleModify from './schedule'

export default {
  // components: {
  //   ScheduleModify
  // },
  setup() {
    const schedules = ref([])
    const appointments = ref([])
    const editAppointmentId = ref(1)
    const editScheduleId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    onMounted(() => {
      getAllSchedules()
      getAllAppointments()
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

    const getAllAppointments = async () => {
      try {
        loading.value = true
        appointments.value = await appointmentModel.getAllAppointments()
        loading.value = false
      } catch (error) {
        if (error.code === 10020) {
          appointments.value = []
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
        const res = await scheduleModel.deleteSchedule(id)
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
      appointments,
      schedules,
      loading,
      showEdit,
      editScheduleId,
      editAppointmentId,
      editClose,
      handleEdit,
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

  .el-tag {
    margin-left: 2px;
    margin-bottom: 2px;
  }

  .tag-div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
