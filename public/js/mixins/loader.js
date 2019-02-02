export default {
    data() {
        return {
            m_loader_loading: false
        }
    },

    created() {
        this.m_loader_load()
    },

    methods: {
        async m_loader_load() {
            this.m_loader_loading = true

            await this.m_loader_loader()

            this.m_loader_loading = false
        },

        async m_loader_loader() {
            console.log('Loader not implemented')
        }
    }
}
