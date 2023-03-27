import Score from '../models/score.js'
import { openai } from '../config.js'

export const rateSourceCode = async (req, res) => {
  try {
    const code = req.body
    if (!code) {
      return res.status(400).json({ message: 'Code is required' })
    }
    // const scores = await analyzeCode(code)

    const scoreDocumentation = await analyzeDocumentationCode(code)
    // const scoreEntry = new Score({
    //   user: req.user._id,
    //   code,
    //   scores,
    // })

    // await scoreEntry.save()

    res.status(200).json({ scoreDocumentation })
  } catch (error) {
    console.error(error.response)
    res.status(500).json({ message: 'Internal server error' })
  }
}

async function analyzeDocumentationCode(code) {
  // console.log(code)
  const prompt = `Provide individual scores from 1 to 5 for the following code based on these criteria, explain the score:\n
    - Documentation (comments, consistency, clarity, function and class descriptions, etc.)\n
    - Error Messages (consistency, clarity, etc.) \n
    - Naming (variables, functions, classes, etc.) \n
    \n Code:\n${code}\nAnswer should be in the following format, one entry per line and all criteria must be there once except explanation. Example of format:\Documentation: 3\nExplanation: Could add more comments\n`

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 3000,
  })
  const text = response.data.choices[0].text.trim()
  const scoreLines = text.split('\n')
  console.log(scoreLines)
  const scores = parseOpenAiChoices(scoreLines)
  return scores
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
    - Problem Solving and Debugging\n\nCode:\n${code}\n`

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.5,
    // presencePenalty: 0,
    // frequencyPenalty: 0,
    n: 1,
    stream: false,
    // stop: null,
  })
  console.log(response.data)

  const text = response.data.choices[0].text.trim()
  const scoreLines = text.split('\n')
  const scores = parseOpenAiChoices(scoreLines)

  return scores
}

const parseOpenAiChoices = (choices) => {
  const scores = {}
  for (const choice of choices) {
    const [criterion, score] = choice.split(':')
    scores[criterion.trim()] = score.trim()
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
