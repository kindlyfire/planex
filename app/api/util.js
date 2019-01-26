module.exports = {
    parseOptions(model, query = {}) {
        let keys = Object.keys(query)
        let res = {
            where: {},
            limit: 100
        }

        for (let k of keys) {
            // Special prop
            console.log(k)
            if (k[0] === '$') {
                if (k === '$limit') {
                    let limit = parseInt(query[k])
                    res.limit = limit > 1000 ? 1000 : limit
                } else if (k === '$offset') {
                    res.offset = parseInt(query[k])
                } else if (k === '$order') {
                    // UNSECURE ?
                    res.order = model.sequelize.literal(query[k])
                }
            }

            // Normal where
            else {
                if (!Object.keys(model.rawAttributes).includes(k)) {
                    throw new Error('Attribute ' + k + ' does not exist.')
                }

                res.where[k] = query[k]
            }
        }

        return res
    }
}
