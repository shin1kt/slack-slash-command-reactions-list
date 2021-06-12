import axios from 'axios'

export interface SlackUser {
  id: string,
  name: string,
  real_name: string
}

interface UserListResponse {
  ok: boolean,
  members: [
    {
      id: string,
      name: string,
      profile: {
        real_name: string,
      }
    }
  ]
}

/**
 * SlackAPIからユーザーリストを取得
 * @param {String} token 
 * @returns 
 */
const usersList = (async (token: string) => {
  const url = `https://slack.com/api/users.list?pretty=1`
  const options = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${token}`,
    }
  }
  const users = await axios.get<UserListResponse>(url, options).then((res): SlackUser[] => {
    return res.data.members.map((item) => {
      return {
        id: item.id,
        name: item.name,
        real_name: item.profile.real_name,
      }
    })
  })
  
  return users
})

export default usersList