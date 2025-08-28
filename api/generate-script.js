import OpenAI from 'openai';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { data, style, tone, target, hostStyle, structureType, duration, hostNames } = req.body;

    // 구성 타입별 시스템 프롬프트
    let structurePrompt = '';
    let sectionsGuide = '';
    
    if (structureType === 'storytelling') {
      structurePrompt = `
스토리텔링형 구성으로 감성적이고 경험 중심의 대본을 작성해주세요.
구조: 감성 훅 → 스토리 전개 → 여행 경험 → 핵심 혜택 → 감정 몰입 → 행동 유도`;
      
      if (duration === 90) {
        sectionsGuide = `
[00:00-00:10] 감성 훅 - 공감할 수 있는 상황 제시
[00:10-00:25] 스토리 전개 - 개인적 경험이나 이야기
[00:25-00:40] 여행 경험 - 구체적인 경험 묘사
[00:40-00:55] 핵심 혜택 - 가격과 포함사항
[00:55-01:10] 감정 몰입 - 감정적 어필
[01:10-01:30] 행동 유도 - 자연스러운 CTA`;
      } else {
        sectionsGuide = `
[00:00-00:08] 감성 훅 - 공감할 수 있는 상황
[00:08-00:18] 스토리 전개 - 간단한 경험 이야기
[00:18-00:30] 여행 경험 - 핵심 경험 묘사
[00:30-00:42] 핵심 혜택 - 가격과 혜택
[00:42-00:52] 감정 몰입 - 감정적 어필
[00:52-01:00] 행동 유도 - CTA`;
      }
    } else if (structureType === 'viral') {
      structurePrompt = `
숏폼 최적화형 구성으로 임팩트 있고 바이럴 요소가 강한 대본을 작성해주세요.
구조: 임팩트 훅 → 핵심 포인트 → 숨은 혜택 → 충격 가격 → 특별 조건 → 바이럴 요소 → 긴급 CTA`;
      
      if (duration === 90) {
        sectionsGuide = `
[00:00-00:05] 임팩트 훅 - 강력한 첫인상
[00:05-00:20] 핵심 포인트 - 주요 혜택 나열
[00:20-00:35] 숨은 혜택 - 추가 혜택 강조
[00:35-00:50] 충격 가격 - 가격의 임팩트
[00:50-01:05] 특별 조건 - 한정성 강조
[01:05-01:20] 바이럴 요소 - 공유하고싶은 요소
[01:20-01:30] 긴급 CTA - 즉시 행동 유도`;
      } else {
        sectionsGuide = `
[00:00-00:03] 임팩트 훅 - 강력한 어필
[00:03-00:15] 핵심 포인트 - 주요 혜택
[00:15-00:25] 숨은 혜택 - 추가 혜택
[00:25-00:35] 충격 가격 - 가격 임팩트
[00:35-00:45] 특별 조건 - 한정성
[00:45-00:55] 바이럴 요소 - 공유 요소
[00:55-01:00] 긴급 CTA - 즉시 행동`;
      }
    } else {
      // 기본형 (홈쇼핑 구조)
      structurePrompt = `
기본형 홈쇼핑 구성으로 체계적이고 정보 전달 중심의 대본을 작성해주세요.
구조: 인트로 → 상품 핵심 → 숙박&편의 → 항공&조건 → 포함&가격 → 특전 및 유의 → 엔딩`;
      
      if (duration === 90) {
        sectionsGuide = `
[00:00-00:08] 인트로 - 인사 및 상품 소개
[00:08-00:22] 상품 핵심 - 목적지와 핵심 활동
[00:22-00:36] 숙박&편의 - 호텔과 식사
[00:36-00:50] 항공&조건 - 항공편과 출발일
[00:50-01:04] 포함&가격 - 포함사항과 가격
[01:04-01:18] 특전 및 유의 - 추가 혜택과 주의사항
[01:18-01:30] 엔딩 - 마무리 및 링크 안내`;
      } else {
        sectionsGuide = `
[00:00-00:05] 인트로 - 인사 및 소개
[00:05-00:15] 상품 핵심 - 목적지와 활동
[00:15-00:25] 숙박&편의 - 호텔과 식사
[00:25-00:35] 항공&조건 - 항공편과 일정
[00:35-00:45] 포함&가격 - 포함사항과 가격
[00:45-00:55] 특전 및 유의 - 혜택과 주의사항
[00:55-01:00] 엔딩 - 마무리 및 CTA`;
      }
    }

    // 쇼호스트 스타일별 톤 가이드
    let styleGuide = '';
    switch (hostStyle) {
      case 'passionate':
        styleGuide = '열정적이고 에너지가 넘치는 홈쇼핑 스타일 - "와!", "정말!", "대박!", "말도 안되는!" 등의 감탄사 활용';
        break;
      case 'friendly':
        styleGuide = '친근하고 편안한 라이브커머스 스타일 - "어떠세요?", "정말 좋지 않나요?", "괜찮죠?" 등의 소통형 표현';
        break;
      case 'professional':
        styleGuide = '전문적이면서도 재미있는 스타일 - "전문가가 추천하는", "가성비 측면에서", "검증된" 등의 신뢰감 있는 표현';
        break;
    }

    const systemPrompt = `당신은 전문 쇼호스트 대본 작가입니다. 
여행상품을 위한 ${duration}초 길이의 ${style === 'one_host' ? '1인 진행' : '2인 진행'} 대본을 작성해주세요.

${structurePrompt}

스타일: ${styleGuide}
톤: ${tone}
타겟: ${target}

시간 구간 가이드:
${sectionsGuide}

${style === 'two_hosts' ? `
2인 진행시:
- 진행자명: ${hostNames?.host1 || '진행자1'}, ${hostNames?.host2 || '진행자2'}
- 자연스러운 대화 형식으로 작성
- 각 진행자별로 "진행자1:", "진행자2:" 형식으로 구분
` : ''}

중요 사항:
1. 정확히 제공된 상품 정보만 사용하고, 없는 정보는 추측하지 마세요
2. 각 섹션별 시간을 정확히 지켜주세요
3. ${duration}초에 맞는 적절한 분량으로 작성해주세요
4. 자연스럽고 매력적인 말투로 작성해주세요
5. 마지막에는 반드시 "자세한 내용은 아래 링크로 지금 확인하세요!" 또는 유사한 CTA로 마무리해주세요`;

    const userPrompt = `상품 정보:
상품명: ${data.product_name || '여행 상품'}
목적지: ${data.destination || ''}
기간: ${data.duration || ''}
항공사: ${data.airline || ''}
호텔: ${data.hotel || ''}
골프장: ${data.golf_course || ''}
라운드: ${data.rounds || ''}
식사: ${data.meals || ''}
가격: ${data.price || ''}
출발일: ${data.departure_dates || ''}
포함사항: ${Array.isArray(data.includes) ? data.includes.join(', ') : data.includes || ''}
불포함사항: ${Array.isArray(data.excludes) ? data.excludes.join(', ') : data.excludes || ''}
특전: ${Array.isArray(data.perks) ? data.perks.join(', ') : data.perks || ''}
주의사항: ${Array.isArray(data.cautions) ? data.cautions.join(', ') : data.cautions || ''}

위 정보를 바탕으로 ${structureType} 구성의 ${duration}초 ${style === 'one_host' ? '1인 진행' : '2인 진행'} 쇼호스트 대본을 작성해주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedScript = completion.choices[0].message.content;

    res.status(200).json({ 
      success: true, 
      script: generatedScript,
      usage: completion.usage,
      parameters: {
        structureType,
        hostStyle,
        duration,
        style
      }
    });

  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate script',
      details: error.message 
    });
  }
}
