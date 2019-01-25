export default abstract class AbstractImplementation {
    static async execute<T>(
        action: string,
        model: T,
        data: any
    ): Promise<any> {}
}
