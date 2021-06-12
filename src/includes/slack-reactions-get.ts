import axios from "axios";

export interface Reaction {
  count: number;
  name: string;
  users: string[];
}

interface ReactionsGetResponse {
  message?: {
    reactions: Reaction[];
  };
  file?: {
    reactions: Reaction[];
  };
  ok: boolean;
}

/**
 * SlackAPIからリアクションリストを取得
 * @param {String} token
 * @param {String} channelId
 * @param {String} timestamp
 * @returns
 */
const reactionsGet = async (
  token: string,
  channelId: string,
  timestamp: string
) => {
  const url = `https://slack.com/api/reactions.get?channel=${channelId}&timestamp=${timestamp}&pretty=1`;
  const options = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };
  const users = await axios
    .get<ReactionsGetResponse>(url, options)
    .then((res) => {
      return res.data.message?.reactions ?? res.data.file?.reactions ?? [];
    });

  return users;
};

export default reactionsGet;
