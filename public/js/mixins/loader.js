export default {
    data() {
        return {
            m_loader_loading: true
        }
    },

    created() {
        this.m_loader_load()
    },

    methods: {
        async m_loader_load() {
            this.$root.$emit('loader_push')
            this.m_loader_loading = true

            await this.m_loader_loader()

            this.m_loader_loading = false
            this.$root.$emit('loader_pop')
        },

        async m_loader_loader() {
            console.log('Loader not implemented')
        }
    }
}
