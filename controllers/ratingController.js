import Score from '../models/score.js'

export const rateSourceCode = async (req, res) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ message: 'Code is required' })
    }

    const scores = await analyzeCode(code)

    const scoreEntry = new Score({
      user: req.user._id,
      code,
      scores,
    })

    await scoreEntry.save()

    res.status(200).json({ scores })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

async function analyzeCode(code) {
  const prompt = `Provide individual scores from 1 to 5 for the following code based on these criteria:\n
    - Documentation
    - Code Quality
    - Project Organization
    - Error Handling and Robustness
    - Test Coverage
    - Version Control and Collaboration
    - Performance Optimisation
    - Security
    - Problem Solving and Debugging\n\nCode:\n${code}`

  const response = await axios.post(
    'https://api.openai.com/v1/engines/davinci-codex/completions',
    {
      prompt: prompt,
      max_tokens: 200,
      n: 1,
      stop: null,
      temperature: 0.5,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHAT_GPT_KEY}`,
      },
    },
  )

  const text = response.data.choices[0].text.trim()
  const scoreLines = text.split('\n')
  const scores = {}

  for (const line of scoreLines) {
    const [criterion, score] = line.split(':')
    scores[criterion.trim()] = parseInt(score.trim())
  }

  return scores
}

export const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
    res.status(200).json({ scores })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  rateSourceCode,
  getUserScores,
}
