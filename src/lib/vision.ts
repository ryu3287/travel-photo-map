const VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY!
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`

// Visionが返すラベルを日本語に変換するマップ（例）
const LABEL_TRANSLATIONS: Record<string, string> = {
  Mountain: '山',
  Sea: '海',
  Ocean: '海',
  Beach: 'ビーチ',
  City: '都市',
  Building: '建物',
  Forest: '森',
  River: '川',
  Lake: '湖',
  Food: '食べ物',
  Restaurant: 'レストラン',
  Temple: '寺社',
  Shrine: '神社',
  Sunset: '夕日',
  Sunrise: '朝日',
  Night: '夜景',
  Snow: '雪',
  Flower: '花',
  Animal: '動物',
  Museum: '美術館・博物館',
}

function translateLabel(label: string): string {
  return LABEL_TRANSLATIONS[label] || label
}

export async function analyzeImageWithVision(imageBase64: string): Promise<string[]> {
  try {
    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 8 },
              { type: 'LANDMARK_DETECTION', maxResults: 3 },
            ],
          },
        ],
      }),
    })

    const data = await response.json()
    const result = data.responses?.[0]

    const tags: string[] = []

    // ランドマーク（観光地など）
    const landmarks = result?.landmarkAnnotations || []
    for (const lm of landmarks) {
      if (lm.score > 0.6) tags.push(lm.description)
    }

    // 一般ラベル
    const labels = result?.labelAnnotations || []
    for (const label of labels) {
      if (label.score > 0.75) {
        const translated = translateLabel(label.description)
        if (!tags.includes(translated)) tags.push(translated)
      }
    }

    return tags.slice(0, 6)
  } catch (error) {
    console.error('Vision API error:', error)
    return []
  }
}
