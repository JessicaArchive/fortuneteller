require('dotenv').config();
const express = require('express');
const OpenAI = require("openai");

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/saju', async (req, res) => {
  try {
    const { birthDate, birthTime } = req.body;

    if (!birthDate || !birthTime) {
      return res.status(400).json({ error: '생년월일과 시간을 모두 입력해주세요.' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",  // GPT-4 모델 사용
      messages: [
        {
          role: "system",
          content: "당신은 명리학에 정통한 사주 전문가입니다."
        },
        {
          role: "user",
          content: `아래 제공된 생년월일과 시간을 바탕으로 사주 분석을 해주세요.

          생년월일시: ${birthDate}, ${birthTime}

          분석은 다음 JSON 형식에 따라 작성해주세요:
          {
          1. 사주 구성:
            - 사주 팔자의 천간과 지지를 분석하고, 오행(목, 화, 토, 금, 수)의 균형과 상생·상극 관계를 설명해주세요.
            - 사주에서 가장 중요한 용신(용신, 기신 등)을 찾아주고, 그것이 인생에 미치는 영향을 설명해주세요.

          2. 총운:
            - 금전운, 인간관계, 건강 운을 중심으로 오행과 명리학적 관점에서 풀이해주세요.
            - 특히, 특정한 대운이나 세운이 금전적/인간관계적 변화를 유발하는 시기를 강조해주세요.

          3. 올해 운세:
            - 올해의 세운과 대운을 분석하여 오행의 흐름에 따른 주요 변화 포인트를 설명해주세요.
            - 금전운, 인간관계, 건강을 오행의 변동과 연결해 자세히 설명해주세요.
        }

          명리학적 관점에서 깊이 있는 해석을 부탁드립니다. 용어는 한국어로 써주세요.`
        }
      ],
      max_tokens: 1000 // 응답의 최대 길이 설정
    });

    console.log('OpenAI API 응답:', JSON.stringify(response, null, 2));

    // 응답을 그대로 클라이언트에 전달
    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    res.status(500).json({ error: '사주를 가져오는 데 실패했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});