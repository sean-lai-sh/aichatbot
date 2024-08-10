import { NextResponse } from "next/server";
import OpenAI from "openai";

// Change as needed to "Prime" the model to ensure proper responses. Use ChatGPT or Claude to get this
const systemPrompt = "You are a helper for forbes.com you are to help guide people to relevant articles to help troubleshoot their experience on the web"

// To Change: OpenAI is not working as intended
export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.json();

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            ...data,
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0].delta.content;
                    if(content){
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            }catch(error){
                controller.error(error);
            }finally{
                controller.close();
            }
        },
    });

    return new NextResponse(stream);
}