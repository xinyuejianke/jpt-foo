<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">排班列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="schedules" v-loading="loading">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="user.nickname" width="100" label="职员昵称"></el-table-column>
        <el-table-column prop="user.id" width="75" label="职员ID"></el-table-column>
        <el-table-column prop="date" width="110" label="日期"></el-table-column>
        <el-table-column prop="times" label="时间">
          <template #default="scope">
            <div class="tag-div">
              <div v-for="time in scope.row.times.split(',')">
                <el-tag type="info"> {{ time }} </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="availableTimes" label="可预约时间">
          <template #default="scope">
            <div class="tag-div">
              <div v-for="time in scope.row.availableTimes.split(',')">
                <el-tag type="success"> {{ time }} </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button plain size="small" type="danger" @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除排班表', type: 'disabled' }">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination :total="totalSchedules" :background="true" :page-size="rowsPerPage" v-if="refreshPagination"
          :current-page="currentPage" layout="prev, pager, next, jumper" @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑页面 -->
    <schedule-modify v-else @editClose="editClose" :editScheduleId="editScheduleId"></schedule-modify>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import scheduleModel from '../../model/schedule-model'
import ScheduleModify from './schedule'

export default {
  components: {
    ScheduleModify,
  },

  setup() {
    const schedules = ref([])
    const editScheduleId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    const refreshPagination = ref(true) // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
    const totalSchedules = ref(0)
    const rowsPerPage = ref(5)
    const currentPage = ref(1)

    onMounted(() => {
      getScheduleByPage()
    })

    /* 翻页 */
    const handlePageChange = async val => {
      currentPage.value = val
      await getScheduleByPage()
    }

    /* 获取管理员列表数据 */
    const getScheduleByPage = async () => {
      let res = {}
      try {
        loading.value = true
        res = await scheduleModel.getScheduleGoupByPage(currentPage.value - 1, rowsPerPage.value)
        loading.value = false
        schedules.value = res.schedules
        totalSchedules.value = res.totalSchedules
      } catch (e) {
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
        const res = await scheduleModel.deleteSchedule(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          ElMessage.success(`${res.message}`)
        }
        getScheduleByPage()
      })
    }

    const editClose = () => {
      showEdit.value = false
      getScheduleByPage()
    }

    return {
      schedules,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editScheduleId,
      handleDelete,

      refreshPagination,
      totalSchedules,
      currentPage,
      rowsPerPage,
      handlePageChange,
      getScheduleByPage,
    }
  },
  methods: {},
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
    margin-left: 3px;
    margin-bottom: 3px;
  }

  .tag-div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
