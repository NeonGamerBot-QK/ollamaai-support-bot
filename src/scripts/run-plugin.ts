import "dotenv/config"
import path from "path"
const prompt = () => new Promise((res) => process.stdin.on('data', (d) => res(d.toString())))
import fs from "fs"
const mappedFiles = fs.readdirSync(__dirname + '/plugins')
console.log(`
Run Plugin:
${mappedFiles.map((e,i) => `${i+1}: ${e.replace('.ts', '')}`)}
Type the # of the one you want to run
`)
// console.log(0)
const int = parseFloat(await prompt()) - 1
// console.log(2)

console.log(`You choose ${mappedFiles[int]} (#${int}).`)

const file = await import("./plugins/"+mappedFiles[int])
console.log(file)
await file.default()