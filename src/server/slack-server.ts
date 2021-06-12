import reactionsListCommand from "../includes/reactions-list-command";
import express from "express";
import validator from "validator";

interface SlackServerParam {
  channel_id: string;
  text: string;
}

/**
 * サーバー本処理
 * @param {String} token
 * @param {Object} params
 * @param {express.Response} res
 * @returns
 */
const slackServer = async (
  token: string,
  params: SlackServerParam,
  res: express.Response
) => {
  const channelId = params.channel_id;
  const url = params.text;
  if (!url || !validator.isURL(url)) {
    res.status(200).send("引数に対象コメントのURLを指定してください").end();
    return;
  }

  // 引数からタイムスタンプ取得
  // クエリパラメータを除いた最後のパス（p000000000）から数値のみを取得して、小数点6桁で合わせる
  const timestamp = (
    Number(url.split("?")?.shift()?.split("/")?.pop()?.slice(1)) / 1000000
  ).toFixed(6);
  if (!Number(timestamp)) {
    res.status(200).send("引数の形式が正しくありません").end();
    return;
  }

  const blocks = await reactionsListCommand(token, channelId, timestamp);
  if (!blocks || blocks.length < 1) {
    res.status(200).send("データ取得失敗").end();
    return;
  }

  // 集計元URLも表示する
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: params.text,
    },
  });

  res.json({ blocks });
};

export default slackServer;
