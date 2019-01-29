module.exports = {
    parseOptions(model, query = {}, models) {
        let keys = Object.keys(query)
        let res = {
            where: {},
            limit: 100,
            include: []
        }

        for (let k of keys) {
            // Special prop
            if (k[0] === '$') {
                if (k === '$limit') {
                    let limit = parseInt(query[k])
                    res.limit = limit > 1000 ? 1000 : limit
                } else if (k === '$offset') {
                    res.offset = parseInt(query[k])
                } else if (k === '$order') {
                    // UNSECURE ?
                    res.order = model.sequelize.literal(query[k])
                } else if (k === '$include') {
                    let modelNames = ('' + query[k]).split(',')

                    for (let modelName of modelNames) {
                        let subNames = modelName.split('.')

                        this.deepModelInclude(res.include, subNames, models)
                    }
                } else if (k === '$count') {
                    res.attributes = {
                        include: [
                            [
                                model.sequelize.fn(
                                    'COUNT',
                                    model.sequelize.col('id')
                                ),
                                'count'
                            ]
                        ]
                    }
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
    },

    deepModelInclude(include, subNames, models) {
        let ref = { include }
        models = Object.values(models)

        for (let subName of subNames) {
            let newRef = ref.include.find((i) => i.model.name === subName)

            if (!newRef) {
                newRef = {
                    model: models.find((m) => m.name === subName),
                    include: []
                }

                if (!newRef.model) {
                    throw new Error('Could not find model with name ' + subName)
                }

                ref.include.push(newRef)
            }

            ref = newRef
        }
    }
}
