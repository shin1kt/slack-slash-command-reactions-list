import dotenv from 'dotenv'
import express from 'express'
import slackVerifying, {SlackRequest} from '@/includes/slack-verifying'
import slackServer from '@/server/slack-server'

dotenv.config()
const token = process.env.SLACK_TOKEN ?? ''
const signingSecret = process.env.SLACK_SIGNING_SECRET ?? ''

const app = express()
app.use(express.json())
// 認証のためbodyの生データを取得できるようにする
app.use(express.urlencoded({ extended: true,
  verify: (req: SlackRequest, res, buf, encoding) => {
    req.rawBody = buf.toString(encoding as BufferEncoding ?? 'utf8')
  }
}))

// スラッシュコマンド対応ルート
app.post('/slash/reactions', async (req, res) => {
  // Slack確認
  slackVerifying(req as SlackRequest, res, signingSecret)
  await slackServer(token, req.body, res)
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

export default app;
