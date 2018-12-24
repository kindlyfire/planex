
const { spawn } = require('child_process')
const tempWrite = require('temp-write')
const path = require('path')
const fs = require('fs')

module.exports = (s) => {
    const Solution = s.model('solution')

    s.router.get('/:scheduleId/solution/create', async (ctx, next) => {
        // ctx.body = JSON.stringify(ctx.state.schedule); return

        await ctx.render('schedule/solution/create.pug')
    })

    s.router.post('/:scheduleId/solution/create', async (ctx, next) => {
        let solution = Solution.create({
            schedule_id: ctx.state.schedule.id,
            status: 'busy',
            solution_data: '{}'
        })

        await Solution.save(solution)

        ctx.redirect('/' + ctx.params.scheduleId)

        // 
        // Start solver
        // 

        // Dump schedule to JSON file
        let dataFile = await tempWrite(JSON.stringify(ctx.state.schedule))

        // Spawn solver
        let solver = spawn('python', ['-B', path.join(__dirname, '../../../../solver/main.py'), dataFile])
        
        // Save solver output
        // Will only be saved in db if there was an error 
        let output = ''

        solver.stdout.on('data', (data) => {
            output += data.toString('utf-8')
        })

        solver.stderr.on('data', (data) => {
            output += data.toString('utf-8')
        })

        solver.on('exit', async (code, signal) => {
            solution.solution_data = await new Promise((resolve, reject) => {
                fs.readFile(dataFile, { encoding: 'utf-8' }, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            })
            
            let data = JSON.parse(solution.solution_data)

            if (data.error !== undefined) {
                solution.solver_output = output
                solution.status = 'error'
            }
            else {
                solution.status = 'completed'
            }

            Solution.save(solution)
        })
    })
}