<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2 class="d-flex flex-row">
                <div>Paramètres</div>
                <div class="ml-auto">
                    <PrimaryButton
                        @click="m_saver_save"
                        :disabled="!changed || errors.any()"
                    >Sauvegarder</PrimaryButton>
                </div>
            </h2>

            <div class="mcard">
                <AppInput
                    v-model="rSchedule.name"
                    v-validate="'required'"
                    data-vv-as="Nom"
                    label="Nom de l'horaire"
                    type="text"
                    name="name"
                ></AppInput>
                <span class="d-block">
                    <small>{{ errors.first('name') }}</small>
                </span>

                <label for="i_panesettings_startday" class="mt-3 mb-1">Jour de début</label>
                <VSelect
                    v-model="selectedDay"
                    :options="days"
                    track-by="value"
                    label="name"
                    class="mb-3"
                ></VSelect>

                <AppInput
                    v-model="rSchedule.days"
                    v-validate="'required|integer'"
                    data-vv-as="Nombre de jours"
                    label="Nombre de jours d'examens au total"
                    type="number"
                    name="length"
                ></AppInput>
                <span class="d-block">
                    <small>{{ errors.first('length') }}</small>
                </span>
            </div>

            <h2 class="mt-4">Actions</h2>

            <div class="mcard mt-2">
                <div class="d-flex flex-row align-items-end">
                    <div class="mr-2 w-100">
                        <AppInput
                            v-model="duplicateScheduleName"
                            label="Dupliquer l'horaire"
                            type="text"
                            placeholder="Nom du nouvel horaire"
                        ></AppInput>
                    </div>

                    <AppButton
                        @click="duplicateSchedule"
                        :disabled="duplicateScheduleName.length === 0"
                    >Dupliquer</AppButton>
                </div>

                <hr>

                <div class="mb-1">Effacer l'horaire</div>

                <AppButton type="danger" @click="deleteSchedule">Effacer</AppButton>
            </div>
        </div>
    </div>
</template>

<script>
import api from '&/utils/api'
import saver from '&/mixins/saver'

import VSelect from 'vue-multiselect'

export default {
    mixins: [saver],
    props: ['schedule'],

    components: {
        VSelect
    },

    data() {
        let days = [
            { name: 'Lundi', value: 1 },
            { name: 'Mardi', value: 2 },
            { name: 'Mercredi', value: 3 },
            { name: 'Jeudi', value: 4 },
            { name: 'Vendredi', value: 5 }
        ]

        return {
            rSchedule: {},
            selectedDay: days.find((d) => d.value === this.schedule.start_day),
            changed: false,

            // Schedule name if we want to duplicate
            duplicateScheduleName: '',

            days
        }
    },

    created() {
        this.rSchedule = JSON.parse(JSON.stringify(this.schedule))

        this.$nextTick(() => {
            this.changed = false
        })
    },

    watch: {
        selectedDay: {
            handler(v) {
                this.rSchedule.start_day = v.value
            }
        },
        rSchedule: {
            deep: true,
            handler(v) {
                this.changed = true
            }
        }
    },

    methods: {
        async m_saver_saver() {
            await api.put('/schedule/' + this.rSchedule.id, {}, this.rSchedule)

            // Global Vuex state should, one day, make this not needed
            this.schedule.name = this.rSchedule.name
            this.schedule.days = this.rSchedule.days

            this.changed = false
        },

        async deleteSchedule() {
            this.$root.$emit('loader_push')
            await api.delete('/schedule/' + this.schedule.id)
            this.$root.$emit('loader_pop')

            this.$router.push('/')
        },

        async duplicateSchedule() {
            this.$root.$emit('loader_push')
            let s = await api.post(
                '/actions/duplicate-schedule/' + this.schedule.id,
                { name: this.duplicateScheduleName }
            )
            this.$root.$emit('loader_pop')

            this.$router.push('/schedule/' + s.id)
        }
    }
}
</script>

<style scoped>
.mcard {
    background-color: white;
    /* border: 1px solid rgba(black, 0.15); */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    padding: 10px 15px;
    border-radius: 5px;
}
</style>
