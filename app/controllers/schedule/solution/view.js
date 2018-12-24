
const { spawn } = require('child_process')
const tempWrite = require('temp-write')
const path = require('path')
const fs = require('fs')

const SCHOOL_DAYS = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi'
]

module.exports = (s) => {
    const Solution = s.model('solution')

    s.router.get('/:scheduleId/solution/:solutionId', async (ctx, next) => {
        let schedule = ctx.state.schedule
        let solution = await Solution.findOne('id = ?', ctx.params.solutionId)
        let data = JSON.parse(solution.solution_data).data
        let targetYear = ctx.request.query.filtre || '6G'

        let table = {
            columnTitles: [],
            rowTitles: [],
            breakLines: [],
            data: []
        }

        for (let y of Object.keys(data.classes)) {
            if (y.startsWith(targetYear)) {
                table.columnTitles.push(y)

                // let col = []

                // for (let i = 0; i < 9; i += 1) {
                //     if (data.classes[y][i]) {
                //         col.push(data.classes[y][i].map((item) => {
                //             item[0] = item[0].replace(y.substr(0, y.length - 1) + '_', '')
                //             return item
                //         }))
                //     }
                //     else {
                //         col.push([])
                //     }
                // }

                table.data.push(data.classes[y])
            }
        }

        // Exam deduplication
        // for (let i = 0; i < schedule.horizon; i += 1) {
        //     for (let j = 0; j < table.data.length - 1; j += 1) {
        //         let span = 1
        //         let k = 1

        //         if (table.data[j][i] === undefined) {
        //             continue
        //         }

        //         console.log('Start: ', table.data[j][i])

        //         while (table.data[j][i + k] !== undefined && table.data[j][i].label == table.data[j][i + k].label) {
        //             console.log('Found: ', table.data[j][i + k].label)
        //             delete table.data[j][i + k]
        //             k += 1
        //         }

        //         table.data[j][i].colspan = k
        //     }
        // }

        for (let i = 0; i < 9; i += 1) {
            table.rowTitles.push(SCHOOL_DAYS[(i + schedule.start_day) % SCHOOL_DAYS.length])
        
            if ((i + schedule.start_day + 1) % SCHOOL_DAYS.length == 0) {
                table.breakLines.push(i)
            }
        }

        if (!solution) {
            ctx.body = '404'
        }
        else {
            // console.log(JSON.stringify(table, null, 4))

            await ctx.render('schedule/solution/view.pug', {
                table,
                targetYear
            })
        }
    })

    s.router.post('/:scheduleId/solution/:solutionId', async (ctx, next) => {
        
    })
}