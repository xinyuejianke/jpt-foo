<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">预约列表</div>

        <div>
          <!-- 员工ID筛选器：下拉框 -->
          <el-dropdown v-model="targetEmployee" @command="handleEmployeeFilter">
            <el-button>
              {{ targetEmployee.id ? `${targetEmployee.id} : ${targetEmployee.nickname}` : 'ID : 员工昵称' }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-model="employees" icon="el-icon-user-solid" v-for="(employee, index) in employees"
                  :key="index" :command="employee">
                  {{ employee.id }} : {{ employee.nickname }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button type="danger" @click="handleResetFilter">重制筛选器</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="appointments" v-loading="loading">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="userId" label="职员ID"></el-table-column>
        <el-table-column prop="userNickname" label="职员昵称"></el-table-column>
        <el-table-column prop="memberId" label="顾客ID"></el-table-column>
        <el-table-column prop="memberNickname" label="顾客昵称"></el-table-column>
        <el-table-column prop="dateTime" width="110" label="日期">
          <template #default="scope">{{ scope.row.dateTime.split('T')[0] }}</template>
        </el-table-column>
        <el-table-column prop="dateTime" label="时间">
          <template #default="scope">{{ scope.row.dateTime.split('T')[1].substring(0, 5) }}</template>
        </el-table-column>
        <el-table-column prop="comment" label="附言">
          <template #default="scope">
            {{ scope.row.comment === null || scope.row.comment.trim().length === 0 ? '暂无' : scope.row.comment }}
          </template>
        </el-table-column>
        <el-table-column prop="advice" label="备注">
          <template #default="scope">
            {{ scope.row.advice === null || scope.row.advice.trim().length === 0 ? '暂无' : scope.row.advice }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <!-- <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button> -->
            <el-button plain size="small" type="danger" @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除排班表', type: 'disabled' }">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination :total="totalAppointments" :background="true" :page-size="rowsPerPage" v-if="refreshPagination"
          :current-page="currentPage" layout="prev, pager, next, jumper" @current-change="handlePageChange">
        </el-pagination>
      </div>

    </div>

  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import appointmentModel from '../../model/appointment-model'
import userModel from '../../lin/model/user'

export default {
  setup() {
    const appointments = ref([])
    const editAppointmentId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    const totalAppointments = ref(0)
    const rowsPerPage = ref(5)
    const currentPage = ref(1)

    const refreshPagination = ref(true) // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件

    const appointmentFilter = reactive({ userId: '', userNickname: '', memberId: '', dateTime: '' })
    const employees = ref([])

    onMounted(() => {
      getAllAppointments()
    })

    const getAllAppointments = async () => {
      try {
        loading.value = true
        employees.value = await userModel.getAllEmployees()
        const res = await appointmentModel.getAppointmentsGoupByPage(
          currentPage.value - 1,
          rowsPerPage.value,
          '',
          appointmentFilter.userId
        )

        appointments.value = res.appointments
        totalAppointments.value = res.totalAppointments
        loading.value = false
      } catch (error) {
        if (error.code === 10020) {
          appointments.value = []
        }
      }
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该预约, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await appointmentModel.deleteAppointment(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getAllAppointments()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
    }

    /* 翻页 */
    const handlePageChange = async val => {
      currentPage.value = val
      await getAllAppointments()
    }

    const handleEmployeeFilter = employee => {
      //set selected employee as target employee
      appointmentFilter.userId = employee.id
      appointmentFilter.userNickname = employee.nickname
      getAllAppointments()
    }

    const handleResetFilter = () => {
      appointmentFilter.userId = null
      appointmentFilter.userNickname = null
      appointmentFilter.memberId = null
      appointmentFilter.dateTime = null
      getAllAppointments()
    }

    return {
      appointments,
      loading,
      showEdit,
      editAppointmentId,
      editClose,
      handleDelete,

      totalAppointments,
      currentPage,
      rowsPerPage,
      refreshPagination,
      handlePageChange,

      appointmentFilter,
      targetEmployee: appointmentFilter,
      employees,
      handleEmployeeFilter,
      handleResetFilter,
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
