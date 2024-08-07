/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class ScheduleModel {
  // 类中的方法可以代表一个用户行为
  async createSchedule(data) {
    return _axios({
      method: 'post',
      url: 'v1/schedules',
      data,
    })
  }

  async getSchedule(userId, date) {
    return await get(`v1/schedules/${userId}/${date}`)
  }

  async getSchedule(scheduleId) {
    return await get(`v1/schedules/get/by/${scheduleId}`)
  }

  async getAllScheduleOnDate(date) {
    return await get(`v1/schedules/${date}`)
  }

  async getScheduleGoupByPage(pageNumber, rowsPerPage, date, userId) {
    return await get('v1/schedules/results/group/by/page', { pageNumber, rowsPerPage, date, userId })
  }

  async getAllSchedules() {
    return await get('v1/schedules/')
  }

  async updateSchedule(scheduleId, info) {
    return await put(`v1/schedules/${scheduleId}`, info)
  }

  async deleteSchedule(scheduleId) {
    return await _delete(`v1/schedules/${scheduleId}`)
  }
}

export default new ScheduleModel()
