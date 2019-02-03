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
            this.$root.$emit('loader_push')

            await this.m_loader_loader()

            this.$root.$emit('loader_pop')
        },

        async m_loader_loader() {
            console.log('Loader not implemented')
        }
    }
}
