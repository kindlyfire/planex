module.exports = {
    parseOptions(model, query = {}, models) {
        let keys = Object.keys(query)
        let res = {
            where: {},
            limit: 100,
            include: []
        }

        // Special props first
        for (let k of keys.filter((k) => k[0] === '$')) {
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
                res.attributes = [
                    [
                        model.sequelize.fn('COUNT', model.sequelize.col('*')),
                        'count'
                    ]
                ]
            } else {
                throw new Error('Unknown option ' + k)
            }
        }

        // WHERE
        for (let k of keys.filter((k) => k[0] !== '$')) {
            this.deepWhere(res, ('' + k).split('.'), query[k])
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
    },

    // Deep where
    // Can search through relations
    // Ex: GET /exam_instances with exams.schedule_id=2
    //     to get all exam instances who's exam belongs to the schedule with id=2
    deepWhere(ref, subNames, value) {
        // Everything except last subName is an association name
        // We need to get the target model
        for (let subName of subNames.slice(0, -1)) {
            ref = (ref.include || []).find((i) => i.model.name === subName)

            if (!ref) {
                throw new Error('Could not find model with name ' + subName)
            }
        }

        ref.where = ref.where || {}
        ref.where[subNames[subNames.length - 1]] = value
    },

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    },

    // Returns attributes the user may update
    getAllowedAttributes(row, model, allowed = []) {
        let ks = Object.keys(row)

        return Object.keys(model.rawAttributes).filter(
            (attr) =>
                !['id', 'created_at', 'updated_at']
                    .filter((k) => !allowed.includes(k))
                    .includes(attr) && ks.includes(attr)
        )
    },

    // Returns an object with only the data the user can update
    onlyAllowedAttributes(row, model, allowed = []) {
        let ks = this.getAllowedAttributes(row, model, allowed)
        let obj = {}

        for (let k of ks) {
            obj[k] = row[k]
        }

        return obj
    }
}
