import axios from "axios";

interface ConversationsMembersResponse {
  ok: boolean;
  members: string[];
}

/**
 * チャンネルメンバーを取得
 * @param {String} token
 * @param {String} channelId
 * @returns
 */
const conversationsMembers = async (token: string, channelId: string) => {
  const url = `https://slack.com/api/conversations.members?channel=${channelId}&pretty=1`;
  const options = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };
  const users = await axios
    .get<ConversationsMembersResponse>(url, options)
    .then((res) => {
      return res.data.members ?? [];
    });

  return users;
};

export default conversationsMembers;
