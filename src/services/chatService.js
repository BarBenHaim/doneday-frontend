import axios from 'axios'

const BASE_URL = 'https://api.openai.com/v1/completions'
const API_KEY = 'sk-proj-KlazichQ2l0j77H3rxTqT3BlbkFJ1mAFLXizl7TsNqKdsr7A'

export async function getAiGeneratedTasks(message) {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: 'davinci-002',
                prompt: message,
                max_tokens: 150,
                temperature: 0.7,
                n: 1,
                stop: ['\n'],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        )

        const answer = response.data.choices[0].text.trim()
        return answer.split('\n').map(task => task.trim())
    } catch (error) {
        console.error('Error fetching AI generated tasks:', error.response ? error.response.data : error.message)
        throw error
    }
}
