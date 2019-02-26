export default {
	data() {
		return {
			m_saver_saving: false
		}
	},

	methods: {
		async m_saver_save() {
			this.$root.$emit('loader_push')

			await this.m_saver_saver()

			this.$root.$emit('loader_pop')
		},

		async m_saver_saver() {
			console.log('Saver not implemented')
		}
	}
}
