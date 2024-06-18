import "dotenv/config.js"
import ollama, { type ChatResponse } from 'ollama'
type Config = {
    host?: string
    port?: number
    model: string
    doNotInstallModels?: Boolean
}
type Chat = {
    role: 'user' | string
    content: string
}
export class Ollama {
    chatLog: Chat[] 
    config: Config
    constructor(config: Config = {
        host: "localhost",
        port: 1134,
        model: process.env.OLLAMA_MODEL ||"phi" // lightest model
    }) {
        this.chatLog = []
        this.config  = config;
        this.init()
    }
    async init() {
const {models} = await ollama.list()
        if(!this.config.doNotInstallModels) {
if(models.length == 0 || models.find(m => !m.name.includes(this.config.model))) {
    await ollama.pull({
        model: this.config.model || "phi"
    }).then(() => {
        console.log(`!! Model installed.`)
    })
} 
}
    }
    get usermessages() {
        return this.chatLog.filter(e=>e.role=== "user")
    }
    async chat(message: Chat, callback: (part: ChatResponse) => void) {
        this.chatLog.push(message)
const response = await ollama.chat({
    model: this.config.model || "phi",
    messages: this.chatLog,
    stream: true
})
for await (const part of response) {
    callback(part)
    if(part.done) {
        this.chatLog.push({
            role: part.message.role,
            content: part.message.content
        })
    }
  }
    }
}