import OpenAI from "openai";

export class AIService {
    openai: OpenAI;
    
    constructor() {
        this.openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    }

    async getAIResponse(inputText: string, existingData: string): Promise<string> {
        try {
            console.log(`Reading userGuide: ${inputText}.`);
            const fs = require('fs');
            const userGuideContent = fs.readFileSync('userGuide.md', 'utf8');
            console.log(`Getting AI response on: ${inputText}.`);
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "user", 

                        content: `${prompt}\n
                        Here is the message you're responding to. Please keep the message short, no more than a paragraph or two. Just respond to this message: ${inputText}\n\n\n
                        Everything below is just context so you can answer questions that might be asked to you:
                        Here is the documentation for your API so you know what your functionality is ${userGuideContent}\n
                        Here is all the existing data in the application for reference: ${existingData}\n
                        `
                    }
                ]
            });
            let responseToUser = response.choices[0].message.content;
            if (!responseToUser) responseToUser = "Couldn't fetch a response - smells like enemy interference to me. I've alerted the boys in IT, but for now, stay sharp and try again in a bit. Keep your eyes peeled, soldier!"
            return responseToUser;
        } catch (error) {
            console.log(`Error getting AI response: ${error}`);
            throw error;
        }
    }
}


const prompt = `
You are clean bot, a discord bot who's job it is to keep the house clean. You send reminders and manage tasks.
Speak as if the bot itself is writing the docs, so in first person. The bot has the attitude of a cranky, paranoid x-military officer, that's the style and persona you should adopt when responding.
`