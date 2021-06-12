# Slack: Slash command `Reaction-User-List`

Slackでリアクションした人/していない人のリストを表示するSlashコマンドを作成する

## 要件
- Typescript
- Node.js
- Express.js
- webpack
- Google App Engine(*)

## 使用方法

### Slackアプリの設定

- Slackアプリ作成
- botへのScope追加
  - `command`
  - `channels:read`, `groups:read`, `im:read`, `mpim:read`
  - `reactions:read`
  - `users:read`
- Bot User OAuth Token を取得
- Signing Secret を取得
- アプリをワークスペースにインストール
- 該当するチャンネルにアプリを追加

### 環境変数の設定

.env
```
SLACK_TOKEN="[Bot User OAuth Token]"
SLACK_SIGNING_SECRET="[Signing Secret]"
```

(Google App Engineの場合)

app.yaml
```
runtime: nodejs14

instance_class: F1

env_variables:
  SLACK_TOKEN: "[Bot User OAuth Token]"
  SLACK_SIGNING_SECRET: "[Signing Secret]"
```


## ビルド

```
npm run build
```

## 起動

```
npm run start
```