/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class MemberModel {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createMember(data) {
    return _axios({
      method: 'post',
      url: 'v1/member',
      data,
    })
  }

  async getMember(id) {
    return await get(`v1/member/${id}`)
  }

  async updateMember(id, info) {
    return await put(`v1/member/${id}`, info)
  }

  async deleteMember(id) {
    return await _delete(`v1/member/${id}`)
  }

  async getAllMembers() {
    return _axios({
      method: 'get',
      url: 'v1/member/list/all',
      handleError: true,
    })
  }
}

export default new MemberModel()
