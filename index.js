// 1. 주요 클래스 가져오기
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
// 2. 클라이언트 객체 생성 (Guilds관련, 메시지관련 인텐트 추가)
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});

// 3. 봇이 준비됐을때 한번만(once) 표시할 메시지
client.once(Events.ClientReady, readyClient => {
console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 4. 누군가 ping을 작성하면 pong으로 답장한다.
client.on('messageCreate', async (message) => {
  const channels = message;
  console.log(channels);
  // for(let channel of channels){
  //   console.log(channel.name + ': ' + channel.topic);
  // }
  if(channels.channelId === '1344541549958270998')
    if(message.content === '길드카드'){
        message.reply('pong');



        const url = "https://mhw-guild-card.vercel.app/post-card"; // 명령어 뒤에 URL을 입력해야 함

        if (!url) {
            return message.channel.send('스크린샷을 찍을 URL을 제공해주세요. 예: `!screenshot https://example.com`');
        }

        try {
            // Puppeteer로 웹사이트 스크린샷 찍기
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            const screenshotPath = path.join(__dirname, 'screenshot.png');
            await page.screenshot({ path: screenshotPath });
            await browser.close();

            // 스크린샷을 Discord 채팅으로 전송
            await message.channel.send({ files: [screenshotPath] });

            // 스크린샷 파일 삭제
            fs.unlinkSync(screenshotPath);
        } catch (error) {
            console.error(error);
            message.channel.send('스크린샷을 찍는 중 오류가 발생했습니다.');
        }
    }
})

// 5. 시크릿키(토큰)을 통해 봇 로그인 실행
client.login(token);