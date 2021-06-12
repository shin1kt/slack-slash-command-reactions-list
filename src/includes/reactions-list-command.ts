import usersList, { SlackUser } from "./slack-users-list";
import reactionsGet, { Reaction } from "./slack-reactions-get";
import conversationsMembers from "./slack-conversations-members";
import validator from "validator";

interface ReactionsList {
  icon: string;
  users: string[];
}

/**
 * SlackAPIからの値をつかってユーザとリアクションを突き合わせ
 * @param {String} token
 * @param {String} channelId
 * @param {String} timestamp
 * @returns
 */
const reactionsListCommand = async (
  token: string,
  channelId: string,
  timestamp: string
) => {
  const it = [
    await usersList(token),
    await reactionsGet(token, channelId, timestamp),
    await conversationsMembers(token, channelId),
  ];
  return await Promise.all(it).then((values) => {
    const users = values[0] as SlackUser[];
    const reactions = values[1] as Reaction[];
    const channelUsers = values[2] as string[];

    const answered: string[] = [];

    const blocks = reactions.map((reaction: Reaction) => {
      return {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:${reaction.name}: (${
            reaction.users.length
          }人) \n ${reaction.users
            .map((userId) => {
              answered.push(userId);
              return validator.escape(
                users.find((user) => user.id === userId)?.real_name ?? userId
              );
            })
            .join("\n")}`,
        },
      };
    });

    const unAnswered = channelUsers.reduce((res, userId) => {
      if (!answered.includes(userId)) {
        const name = validator.escape(
          users.find((user) => user.id === userId)?.real_name ?? userId
        );
        res.push(name);
      }
      return res;
    }, [] as string[]);

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:未回答: (${unAnswered.length}人) \n ${unAnswered.join("\n")}`,
      },
    });

    return blocks;
  });
};

export default reactionsListCommand;
