// run a console based stdout script
import {Ollama} from '../index'
export default function ConsolePlugin() {
    const client = new Ollama({ model: 'phi' })
    let writing = false;
    console.clear()
    process.stdin.on('data', (data) => {
        if(writing) return process.stdout.write('\b');
        const req = data.toString()
        writing = true;
        client.chat({ role: 'user', content: req }, (part) => {
process.stdout.write(part.message.content)
if(part.done) {
    process.stdout.write('\n>')
    writing = false;
}
        })
    })
    process.stdout.write(`Welcome to support bot via ollama ai.\n>`)
} 