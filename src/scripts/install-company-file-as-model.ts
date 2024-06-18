// convert ur company data into a model
import path from"path"
import fs from "fs"
import ora from "ora"
const argv = Bun.argv.slice(2)
const datadir = argv[0] || path.join(__dirname, '..', 'data')
let prefixPrompt = `You are a support bot. Use the following data to help your client.\n`
let prompt = ``
let model = "phi"
const files = fs.readdirSync(datadir)
const configFile = files.find(f => f=='config.json')
if(configFile) {
try {
    const data = await Bun.file(path.join(datadir, configFile)).json()
if(data.prefixFile) {
  const pref =   await (Bun.file(path.join(datadir,data.prefixFile)).text())
  prefixPrompt += pref
} 
if(data.model) model = data.model
} catch (e) {
    console.error(`Bad config.json`)
}
}
// compile all .txt files to run with the model
const spinner1 = ora(`Loading txt files...`).start()
try {
    const txtFiles = files.filter(f=>f.endsWith('.txt'))
for(const txt of txtFiles ) {
const content = await Bun.file(path.join(datadir, txt)).text()
prompt += content
}
spinner1.succeed()
} catch (e) {
    spinner1.fail(`Loading txt caused error`)
    process.exit(1)
} finally {
    if(spinner1.isSpinning) spinner1.stop()
}

// finally write model in cwd
// console.log(``)
const spinner2 = ora('Writing file to disk..').start()
try {
    prompt = prefixPrompt + prompt
    let data = `FROM ${model}
# sets a custom system message to specify the behavior of the chat assistant
SYSTEM ${prompt}`
    await Bun.write(path.join(datadir, 'ModelFile'), data)
    await spinner2.succeed()
} catch (e) {
    spinner2.fail(`Failed to write model.`)
}
const spinner3 = ora(`Building Model File`).start()
let out = Bun.spawnSync({
    cmd: ["ollama", "create","-f", path.join(datadir, 'ModelFile'), "companymodel"],
    stdout: "pipe",
    stderr: "pipe"
})
// console.log(out.stderr.toString())
spinner3.succeed(`File Built`)
