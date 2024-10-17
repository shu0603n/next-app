# 環境構築の準備

## ①Gitのインストール
[公式サイト](https://gitforwindows.org/)

## ②vscodeのインストール
[公式サイト](https://code.visualstudio.com/download)

### 拡張機能
以下をインストール
![image](https://github.com/shu0603n/next-app/assets/61679407/791a6e65-0b6c-44d0-9153-34310e048b7d)


## ③node.jsのインストール
[公式サイト](https://nodejs.org/en)

node.jsをインストールするとnpmが入っているはずなので以下のコマンドを実行する

### node.jsのバージョンを確認
`node -v`
### npmのバージョンを確認
`npm -v`

## yarnをインストール

### npm 経由でyarnをインストール
`npm install -g yarn`
### yarnのバージョンを確認
`yarn -v`

# 環境構築手順

## リポジトリのクローン
任意のディレクトリで以下コマンドを実行
`git clone https://github.com/shu0603n/next-app.git`

## package.jsonからライブラリをインストール
クローンしたプロジェクトをvscodeで開きターミナルを起動。
next-app直下で以下コマンドを実施
`yarn`

# pgAdmin設定
HOST="ep-late-queen-16733624-pooler.us-east-1.postgres.vercel-storage.com"
USER="default"
PASSWORD="6RqIonDQNgY8"
DATABASE="verceldb"

![image](https://github.com/shu0603n/next-app/assets/61679407/a997e497-1bd5-46c1-a0e3-48633e5caa21)
![image](https://github.com/shu0603n/next-app/assets/61679407/cafa4439-0f24-40c9-afba-88b16c7cee33)


# 起動方法
`yarn dev`
[http://localhost:8081/](http://localhost:8081/)

# PRISMA起動方法
`yarn prisma studio`

# docker(今は使ってない)
`docker-compose up -d`
`yarn install prisma ts-node --save-dev`

# Prismaマイグレーション方法
dbからprismaファイルを生成
`yarn prisma db pull`
prismaファイルを元にローカルprismaを更新
（※DBの内容が初期化されるため、本番環境には行わないこと。）
`yarn prisma generate`
`yarn prisma generate <テーブル名>`

# よくあるトラブル
### vsCodeでyarnが使えない場合
powerShellを管理者モードで開き以下を実行
`Set-ExecutionPolicy RemoteSigned`

### vsCodeでGit操作ができない場合
`git config --global user.name "shunsuke murai"`
`git config --global user.email shu0603n@gmail.com`

