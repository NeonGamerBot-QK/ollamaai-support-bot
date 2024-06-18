import path from "path"
const files = [
    "run-plugin.ts",
    "install-company-file-as-model.ts"
]
files.map(f => {
    console.log(`Compiling ${f}`)
    const out = Bun.spawnSync({
        cmd: ["bun", "build", "--compile", "--outfile", `bin/${f.replace('.ts', '')}`, path.join(__dirname, f)],
        cwd: path.join(__dirname, '..', '..')
    })
    console.log(out.stdout.toString(), out.stderr.toString())
})
