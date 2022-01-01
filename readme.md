# Foray watch Bot

This telegram bot records foray stats and timings so that you will have an estimation of what time the next foray will come.

<div align="center">
<a href="http://go.francisyzy.com/t-me-foray-watch-bot">
<img src="https://user-images.githubusercontent.com/24467184/147848697-ada79104-e67c-4584-a98c-988ddb2939d7.png" alt="TelegramQR">
</a>
</div>

<details>
<summary>DB Diagram</summary>
<img src="https://user-images.githubusercontent.com/24467184/145825290-74090e6c-83a1-4dbe-9679-476d2932977d.png" alt="DB Diagram">

</details>

<details>
<summary>Actions secrets</summary>
<p>
If you fork this project and want to deploy the project to AWS Lambda, you'll need the following to be set in Github Actions secrets

```
ADMIN_TELEGRAM_ID: For the owner of the bot to check stats
API_TOKEN: telegram API Key (Generate from botfather https://t.me/botfather)
AWS_ACCESS_KEY_ID: serverless requires this to deploy
AWS_SECRET_ACCESS_KEY: serverless requires this to deploy
DATABASE_URL: https://www.prisma.io/dataplatform connection string
```

</p>
</details>

Writeup on [Medium](http://go.francisyzy.com/foray-watch-bot-medium)
