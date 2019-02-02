export default {
    data() {
        return {
            m_saver_saving: false
        }
    },

    methods: {
        async m_saver_save() {
            this.m_saver_saving = true

            await this.m_saver_saver()

            this.m_saver_saving = false
        },

        async m_saver_saver() {
            console.log('saver not implemented')
        }
    }
}
