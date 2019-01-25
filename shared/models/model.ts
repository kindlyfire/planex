import AbstractImplementation from './abstract-implementation'

interface ResultSet {
    data: any
    error: any
}

interface FindOptions {}

export default abstract class Model {
    static _implementation = AbstractImplementation
    static readonly modelName = ''
    static readonly tableName = ''

    static setImplementation(impl: any) {
        Model._implementation = impl
    }

    static async find<T extends Model>(
        this: new () => T,
        search: any,
        options?: FindOptions
    ): Promise<T[]> {
        return await Model._implementation.execute('find', this, {
            search,
            options
        })
    }

    static async findOne<T extends Model>(
        this: new () => T,
        search: any,
        options?: FindOptions
    ): Promise<T> {
        return await Model._implementation.execute('findOne', this, {
            search,
            options
        })
    }
}
