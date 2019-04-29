<template>
    <Modal>
        <template slot="header">
            <h3 class="mb-0">Examen</h3>

            <div class="ml-auto">
                <PopperButton v-if="!m_loader_loading && examInstanceId !== -1">
                    <template slot="button-text">+</template>
                    <template slot="popper-content">
                        <button
                            v-if="!m_saver_saving"
                            class="btn btn-danger cursor-pointer m-1"
                            style="min-width: 150px"
                            @click="_delete"
                        >Effacer</button>
                        <button v-else class="btn m-1" style="min-width: 150px">Effacer</button>
                    </template>
                </PopperButton>
            </div>

            <button class="btn ml-2 cursor-pointer" @click="close">Fermer</button>

            <button
                v-if="!m_saver_saving && !m_loader_loading"
                class="btn btn-primary cursor-pointer ml-2"
                @click="m_saver_save"
            >{{ examInstanceId === -1 ? 'Ajouter' : 'Sauvegarder' }}</button>
            <button
                v-if="m_saver_saving && !m_loader_loading"
                class="btn ml-2"
            >{{ examInstanceId === -1 ? 'Ajouter' : 'Sauvegarder' }}</button>
        </template>

        <LoadingBar padding="5" v-if="m_loader_loading"></LoadingBar>

        <div v-else class="d-flex flex-row">
            <div style="width: 65%; border-right: 1px solid rgba(0, 0, 0, 0.15)">
                <div class="p-3">
                    <template v-if="!examIsFixed">
                        <label class="mb-0">Examen</label>
                        <VSelect
                            v-model="selectedExam"
                            :options="exams"
                            :allow-empty="false"
                            :show-labels="false"
                            :custom-label="resourceLabel"
                            track-by="id"
                        >
                            <template slot="noResult">Pas de résultats.</template>

                            <template slot="option" slot-scope="props">
                                <div class="d-flex">
                                    <span>{{ props.option.name }}</span>
                                    <span class="ml-auto">{{ props.option.length }}h</span>
                                </div>
                            </template>

                            <template slot="singleLabel" slot-scope="props">
                                <div class="d-flex">
                                    <span>{{ props.option.name }}</span>
                                    <span class="ml-auto">{{ props.option.length }}h</span>
                                </div>
                            </template>
                        </VSelect>
                    </template>

                    <template v-if="!classGroupIsFixed">
                        <!-- @TODO -->
                        <label class="mb-0">Groupe</label>
                        <VSelect
                            v-model="selectedClassGroup"
                            :options="classGroups"
                            :allow-empty="false"
                            :custom-label="resourceLabel"
                            track-by="id"
                            label="name"
                            deselect-label
                        >
                            <template slot="noResult">Pas de résultats.</template>
                        </VSelect>
                    </template>

                    <label class="mb-0 mt-2">Professeurs</label>
                    <VSelect
                        v-model="selectedTeachers"
                        :options="teachers"
                        :allow-empty="true"
                        :multiple="true"
                        :close-on-select="false"
                        :custom-label="resourceLabel"
                        track-by="id"
                        label="name"
                        deselect-label
                        placeholder="Sélectionner un professeur..."
                    >
                        <template slot="noResult">Pas de résultats.</template>
                    </VSelect>

                    <div class="form-group mt-2">
                        <label for="i_exameditor_name" class="mb-0">Examen parallèle?</label>
                        <YesNoToggler
                            v-model="instance.can_parallel"
                            :can-inherit="true"
                            :inherit-label="selectedExam.can_parallel === 1 ? '(oui)' : '(non)'"
                        ></YesNoToggler>
                    </div>
                </div>
            </div>

            <div style="width: 35%">
                <div class="simple-list simple-list-hover">
                    <div
                        class="list-item"
                        style="border-bottom: 1px solid rgba(0, 0, 0, 0.15)"
                        @click="instance.autoadd_classes = +(!instance.autoadd_classes)"
                    >
                        <input type="checkbox" :checked="instance.autoadd_classes === 1"> Toutes les classes
                    </div>
                    <div
                        v-for="(cls, i) of (selectedClassGroup || {}).classes"
                        :key="i"
                        :class="{'list-item-disabled': instance.autoadd_classes === 1}"
                        @click="toggleClassSelected(cls)"
                        class="list-item"
                    >
                        <input
                            :checked="selectedClasses.findIndex((c) => c.id === cls.id) !== -1 || instance.autoadd_classes === 1"
                            type="checkbox"
                        >
                        {{ cls.name }}
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'
import saver from '&/mixins/saver'

import Modal from '&/components/Modal'
import LoadingBar from '&/components/LoadingBar'
import PopperButton from '&/components/PopperButton'

import VSelect from 'vue-multiselect'

export default {
    mixins: [loader, saver],
    props: [
        'schedule',
        'examInstanceId',

        'exam',
        'examIsFixed',

        'classGroup',
        'classGroupIsFixed'
    ],

    components: {
        Modal,
        LoadingBar,
        PopperButton,
        VSelect
    },

    data() {
        return {
            instance: {
                exam_id: null,
                group_id: this.classGroupId,
                autoadd_classes: 1,
                teacher_id: null,
                description: '',
                teachers: [],
                classes: [],
                exam: {}
            },

            exams: [],
            teachers: [],
            classGroups: [],

            // Selected exam in the exam dropdown
            selectedExam: {},

            // Selected teachers in the teachers dropdown
            selectedTeachers: [],

            // Selected class group in the class groups dropdown
            selectedClassGroup: {},

            selectedClasses: []
        }
    },

    methods: {
        close() {
            this.$emit('closed')
        },

        async _delete() {
            // Should confirm !
            // This resource is too much of a hassle to add again
            // @TODO
            this.saving = true
            try {
                await api.delete('/exam-instance/' + this.instance.id)
                this.$emit('deleted', this.instance)
                this.close()
            } catch (e) {
                console.error(e)
            }
            this.saving = false
        },

        resourceLabel(r) {
            return r.name
        },

        toggleClassSelected(cls) {
            let length = this.selectedClasses.length

            this.selectedClasses = this.selectedClasses.filter(
                (c) => c.id !== cls.id
            )

            if (this.selectedClasses.length === length) {
                this.selectedClasses.push(cls)
            }
        },

        async m_loader_loader() {
            let res = await Promise.all([
                this.examInstanceId !== -1
                    ? api.get('/exam-instance/' + this.examInstanceId, {
                          $include: ['exams', 'teachers', 'classes'].join(',')
                      })
                    : this.instance,

                api.get('/exams', {
                    schedule_id: this.schedule.id,
                    $order: 'name:ASC'
                }),

                api.get('/teachers', {
                    schedule_id: this.schedule.id,
                    $order: 'name:ASC'
                }),

                api.get('/class-groups', {
                    schedule_id: this.schedule.id,
                    $include: 'classes',
                    $order: 'name:ASC'
                })
            ])

            this.instance = res[0]
            this.exams = res[1]
            this.teachers = res[2]
            this.classGroups = res[3]

            if (this.exam) {
                this.selectedExam = this.exams.find(
                    (e) => e.id === this.exam.id
                )
            } else {
                this.selectedExam = this.exams.find(
                    (e) => e.id === this.instance.exam_id
                )
            }

            if (this.classGroup) {
                this.selectedClassGroup = this.classGroups.find(
                    (e) => e.id === this.classGroup.id
                )
            } else {
                this.selectedClassGroup = this.classGroups.find(
                    (e) => e.id === this.instance.group_id
                )
            }

            this.selectedTeachers = this.teachers.filter(
                (t) => !!this.instance.teachers.find((t2) => t.id === t2.id)
            )
            this.selectedClasses = [...this.instance.classes]
        },

        async m_saver_saver() {
            // Update props on exam
            this.instance.schedule_id = this.schedule.id
            this.instance.exam_id = this.selectedExam.id
            this.instance.group_id = this.selectedClassGroup.id
            this.instance.teachers = this.selectedTeachers

            // These will be saved automagically
            if (this.instance.autoadd_classes) {
                this.instance.classes = this.selectedClassGroup.classes
            } else {
                this.instance.classes = this.selectedClasses
            }

            // Either update or create instance
            if (this.examInstanceId === -1) {
                // Create
                let tmpInstance = await api.post(
                    '/exam-instances',
                    {},
                    this.instance
                )

                this.instance.id = tmpInstance.id
            }

            // Update (in order to update relationships)
            await api.put(
                '/exam-instance/' + this.instance.id,
                {},
                this.instance
            )

            // Get again, this time with associations
            // Because api.post doesn't return any associations
            this.instance = await api.get(
                '/exam-instance/' + this.instance.id,
                {
                    $include: ['exams', 'teachers', 'classes'].join(',')
                }
            )

            // Needs update in case the exam was created
            this.selectedClasses = [...this.instance.classes]

            this.$emit('saved', this.instance)
            this.close()
        }
    }
}
</script>
