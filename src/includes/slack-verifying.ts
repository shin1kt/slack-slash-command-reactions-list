import crypto from "crypto";
import express from "express";

export interface SlackRequest extends express.Request {
  rawBody: string;
}

const slackVerifying = async (
  req: SlackRequest,
  res: express.Response,
  signingSecret: string
) => {
  const rawBody = req.rawBody;
  const timestamp = String(req.headers["x-slack-request-timestamp"]) ?? "";

  // リクエスト時間5分ずれたらエラー
  if (
    Math.abs(
      parseInt(timestamp, 10) - Math.floor(new Date().getTime() / 1000)
    ) >
    60 * 5
  ) {
    res.sendStatus(403);
    return;
  }

  // 取得したrawBodyとSLACK_SIGNING_SECRETで認証処理
  const actualSignature = req.headers["x-slack-signature"];
  const sigBaseString = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto.createHmac("sha256", signingSecret);
  const digest = hmac.update(sigBaseString).digest("hex");
  const expectedSignature = `v0=${digest}`;
  if (actualSignature !== expectedSignature) {
    res.sendStatus(403);
    return;
  }
};

export default slackVerifying;
