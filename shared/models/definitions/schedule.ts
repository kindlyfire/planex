import Model from '../model'

export default class Schedule extends Model {
    static readonly modelName = 'Schedule'
    static readonly tableName = 'schedules'

    name: string
}
