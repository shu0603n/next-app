# 環境構築の準備

## ①Git のインストール

[公式サイト](https://gitforwindows.org/)

## ②vscode のインストール

[公式サイト](https://code.visualstudio.com/download)

### 拡張機能

以下をインストール
![image](https://github.com/shu0603n/next-app/assets/61679407/791a6e65-0b6c-44d0-9153-34310e048b7d)

## ③node.js のインストール

[公式サイト](https://nodejs.org/en)

node.js をインストールすると npm が入っているはずなので以下のコマンドを実行する

### node.js のバージョンを確認

`node -v`

### npm のバージョンを確認

`npm -v`

## yarn をインストール

### npm 経由で yarn をインストール

`npm install -g yarn`

### yarn のバージョンを確認

`yarn -v`

# 環境構築手順

## リポジトリのクローン

任意のディレクトリで以下コマンドを実行
`git clone https://github.com/shu0603n/next-app.git`

## package.json からライブラリをインストール

クローンしたプロジェクトを vscode で開きターミナルを起動。
next-app 直下で以下コマンドを実施
`yarn`

# ローカルDB 設定
### 以下リンクからPostgreSQL 15.10をダウンロードし、インストールする
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

![image](https://github.com/user-attachments/assets/e6c9adc7-244a-4460-961e-e66ca920cdc0)

![image](https://github.com/user-attachments/assets/047a2f74-f87c-4065-b1f1-0d65fbb8519b)

![image](https://github.com/user-attachments/assets/befb292a-563b-42fd-8c75-44560dbbb4ba)

![image](https://github.com/user-attachments/assets/6ec8d795-9f33-450b-bf85-a2048726b10b)

パスワード：postgres
![image](https://github.com/user-attachments/assets/d209bdf0-9dcb-47fb-b595-2eafd09bb7d6)

![image](https://github.com/user-attachments/assets/0e38788b-8470-4842-b98c-f3713bac2757)

![image](https://github.com/user-attachments/assets/8f5c7dd4-0e25-475f-857c-7e5b68d69444)

![image](https://github.com/user-attachments/assets/da9f568e-7d95-4b4d-b5ba-7bd9128f81f3)

![image](https://github.com/user-attachments/assets/47520da0-5a8c-4514-81fc-39ac50147149)

![image](https://github.com/user-attachments/assets/654f1bd7-6563-494f-be92-bfda119b58fe)

postgresを入力

# pgAdmin 設定

## 本番環境DB 設定

HOST="ep-late-queen-16733624-pooler.us-east-1.postgres.vercel-storage.com"
USER="default"
PASSWORD="6RqIonDQNgY8"
DATABASE="verceldb"

![image](https://github.com/shu0603n/next-app/assets/61679407/a997e497-1bd5-46c1-a0e3-48633e5caa21)
![image](https://github.com/shu0603n/next-app/assets/61679407/cafa4439-0f24-40c9-afba-88b16c7cee33)

# DMP エクスポート/インポート
バックアップ
set PGPASSWORD=本番環境のパスワード
pg_dump --host="ep-late-queen-16733624-pooler.us-east-1.postgres.vercel-storage.com" --port="5432" --username="default" --dbname="verceldb" --format=c --blobs --no-owner --no-privileges --verbose --file="C:\Users\info\your_backup.backup"

リストア
set PGPASSWORD=ローカル環境のパスワード
スキーマ削除
psql --host="localhost" --port="5432" --username="postgres" --dbname="postgres" -c "DROP SCHEMA public CASCADE;"
スキーマ作成
psql --host="localhost" --port="5432" --username="postgres" --dbname="postgres" -c "CREATE SCHEMA public;"
リストア
pg_restore --host="localhost" --port="5432" --username="postgres" --dbname="postgres" --no-owner --verbose "C:\Users\info\your_backup.backup"


# 起動方法

`yarn dev`
[http://localhost:8081/](http://localhost:8081/)

# PRISMA 起動方法

`yarn prisma studio`

# docker(今は使ってない)

`docker-compose up -d`
`yarn install prisma ts-node --save-dev`

# Prisma マイグレーション方法

## DBに変更を加えた後は以下を実行する
db から prisma ファイルを生成
`yarn prisma db pull`
prisma ファイルを元にローカル prisma を更新
`yarn prisma generate`

## package.json変更を加えた後は以下を実行する
package.jsonkaからライブラリをインストール
`yarn`

## ビルドエラーの確認
`yarn next build`

# よくあるトラブル

### vsCode で yarn が使えない場合

powerShell を管理者モードで開き以下を実行
`Set-ExecutionPolicy RemoteSigned`

### vsCode で Git 操作ができない場合

`git config --global user.name "shunsuke murai"`
`git config --global user.email shu0603n@gmail.com`
