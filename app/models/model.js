module.exports = (s, options) => {
    return {
        async find(query, data) {
            let res

            if (!query) {
                res = await s.db.query('SELECT * FROM ' + options.tableName)
            } else {
                res = await s.db.query(
                    'SELECT * FROM ' + options.tableName + ' WHERE ' + query,
                    data
                )
            }

            return res[0]
        },

        async findOne(query, data) {
            let res
            if (!query) {
                res = await s.db.query(
                    'SELECT * FROM ' + options.tableName + ' LIMIT 1'
                )
            } else {
                res = await s.db.query(
                    'SELECT * FROM ' +
                        options.tableName +
                        ' WHERE ' +
                        query +
                        ' LIMIT 1',
                    data
                )
            }

            if (res[0].length > 0) {
                return res[0][0]
            } else {
                return null
            }
        },

        async save(obj, silent = false) {
            let keys = Object.keys(obj)
            let query

            // Update created_data / updated_date
            if (options.emptyRow) {
                if (options.emptyRow.created_date !== undefined) {
                    if (!obj.created_date) {
                        obj.created_date = new Date()
                            .toISOString()
                            .slice(0, 19)
                            .replace('T', ' ')
                    }
                }

                if (options.emptyRow.updated_date !== undefined) {
                    if (!obj.updated_date) {
                        obj.updated_date = new Date()
                            .toISOString()
                            .slice(0, 19)
                            .replace('T', ' ')
                    }

                    if (!silent) {
                        obj.updated_date = new Date()
                            .toISOString()
                            .slice(0, 19)
                            .replace('T', ' ')
                    }
                }
            }

            if (keys.indexOf('id') === -1 || obj.id === null) {
                query =
                    'INSERT INTO ' +
                    options.tableName +
                    '(' +
                    keys.join(', ') +
                    ') VALUES(' +
                    '?, '.repeat(keys.length - 1) +
                    '?)'
            } else {
                query = 'UPDATE ' + options.tableName + ' SET '
                query += keys.join(' = ?, ') + ' = ? '
                query += 'WHERE id = ' + obj.id
            }

            let res = await s.db.query(query, Object.values(obj))
            console.log(res[0])
            if (res[0].insertId) {
                obj.id = res[0].insertId
            }

            return res[0]
        },

        create(base = {}) {
            let newObj = {}

            if (options.emptyRow) {
                for (let k of Object.keys(options.emptyRow)) {
                    newObj[k] = options.emptyRow[k]
                }
            }

            for (let k of Object.keys(base)) {
                newObj[k] = base[k]
            }

            return newObj
        },

        delete(model) {
            if (!model || !model.id) {
                return false
            }

            let res = s.db.query(
                'DELETE FROM ' + options.tableName + ' WHERE id = ?',
                model.id
            )

            console.log(res)
        },

        tryApply(model, data, props = null) {
            if (!props) {
                let tableColumns = Object.keys(options.emptyRow)
                props = Object.keys(data).filter((v) =>
                    tableColumns.includes(v)
                )
            }

            for (let k of props) {
                if (data[k] !== undefined) {
                    model[k] = data[k]
                }
            }

            return true
        }
    }
}
