<template>
    <Modal>
        <template slot="header">
            <h3 class="mb-0">Groupe</h3>

            <div class="ml-auto">
                <PopperButton v-if="!m_loader_loading && groupId !== -1">
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

            <PrimaryButton
                :disabled="m_saver_saving || m_loader_loading"
                class-name="ml-2"
                @click="m_saver_save"
            >Sauvegarder</PrimaryButton>
        </template>

        <LoadingBar padding="5" v-if="m_loader_loading"></LoadingBar>

        <div v-else>
            <div class="d-flex flex-row">
                <div style="width: 60%; border-right: 1px solid rgba(0, 0, 0, 0.15)" class="p-3">
                    <div class="form-group">
                        <label for="i_groupeditor_name" class="mb-0">Nom</label>
                        <input
                            v-model="group.name"
                            type="text"
                            class="form-control"
                            id="i_groupeditor_name"
                        >
                    </div>

                    <p class="mb-0">
                        <a
                            href
                            @click.prevent="showAvailabilityEditor = true"
                        >Éditer les disponibilités</a>
                    </p>
                </div>
                <div style="width: 40%" class="text-muted comp-group-class-list">
                    <div class="gcl-list-container">
                        <div>
                            <div v-for="(cls, i) in classes" :key="i" class="gcl-list-item">
                                <div>{{ cls.name }}</div>
                                <div class="actions cursor-pointer" @click="removeClass(cls)">x</div>
                            </div>
                        </div>

                        <div v-for="(cls, i) in addedClasses" :key="i" class="gcl-list-item">
                            <div>{{ cls }}</div>
                            <div class="actions cursor-pointer" @click="removeAddedClass(i)">x</div>
                        </div>
                    </div>

                    <div class="gcl-input-container">
                        <input
                            type="text"
                            v-model="addClassName"
                            placeholder="Ajouter une classe..."
                            @keydown.enter="addClass"
                        >
                        <button class="cursor-pointer" @click="addClass">+</button>
                    </div>
                </div>
            </div>
        </div>

        <ModalEditorAvailability
            v-if="showAvailabilityEditor"
            :schedule="schedule"
            :columns="availabilityData"
            @closed="showAvailabilityEditor = false"
            @input="availabilitySaved"
        ></ModalEditorAvailability>
    </Modal>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'
import saver from '&/mixins/saver'

import Modal from '&/components/Modal'
import LoadingBar from '&/components/LoadingBar'
import PopperButton from '&/components/PopperButton'
import ModalEditorAvailability from '&/components/ModalEditorAvailability'

export default {
    mixins: [loader, saver],

    props: ['schedule', 'groupId'],

    components: {
        Modal,
        LoadingBar,
        PopperButton,
        ModalEditorAvailability
    },

    data() {
        return {
            group: {
                name: null,
                availability_json: '[]'
            },
            classes: [],
            addedClasses: [],
            addClassName: null,
            showAvailabilityEditor: false
        }
    },

    computed: {
        availabilityData() {
            return JSON.parse(this.group.availability_json)
        }
    },

    methods: {
        close() {
            this.$emit('closed')
        },

        availabilitySaved(v) {
            this.group.availability_json = JSON.stringify(v)
        },

        async m_loader_loader() {
            // @TODO: Could be done using API associations
            let res = await Promise.all([
                api.get('/class-group/' + this.groupId),
                api.get('/classes', {
                    group_id: this.groupId,
                    $order: 'name'
                })
            ])

            this.group = res[0]
            this.classes = res[1]
        },

        async m_saver_saver() {
            // Get classes again, sync changes
            let classes = await api.get('/classes', {
                group_id: this.groupId
            })

            let deletedClasses = classes.filter(
                (c) => this.classes.findIndex((d) => d.id == c.id) === -1
            )

            let resources = await Promise.all([
                ...deletedClasses.map(async (cls) => {
                    return api.delete('/class/' + cls.id)
                }),
                ...this.addedClasses.map(async (cls) => {
                    return api.post(
                        '/classes',
                        {},
                        {
                            name: cls,
                            group_id: this.groupId,
                            schedule_id: this.schedule.id
                        }
                    )
                }),
                api.put('/class-group/' + this.groupId, {}, this.group)
            ])

            // Automatically add added classes to exam instances if autoadd_classes = 1
            let examInstances = await api.get('/exam-instances', {
                'exams.schedule_id': this.schedule.id,
                group_id: this.group.id,
                autoadd_classes: 1,
                $include: ['exams', 'classes'].join(',')
            })

            await Promise.all(
                examInstances.map((ei) => {
                    ei.classes = [
                        ...ei.classes,
                        ...resources.slice(deletedClasses.length, -1)
                    ]
                    return api.put('/exam-instance/' + ei.id, {}, ei)
                })
            )

            this.$set(this, 'classes', [
                ...this.classes,
                ...resources.slice(deletedClasses.length, -1)
            ])
            this.$set(this, 'addedClasses', [])

            this.$emit('saved', this.group)
        },

        // Pressing "Effacer" inside popper submenu
        async _delete() {
            this.saving = true

            try {
                await api.delete('/class-group/' + this.groupId)

                this.$emit('deleted', this.group)
                this.close()
            } catch (e) {}

            this.saving = false
        },

        addClass() {
            if (!this.addClassName) {
                return
            }

            this.addedClasses.push(this.addClassName + '')
            this.addClassName = ''
        },

        removeClass(cls) {
            this.$set(
                this,
                'classes',
                this.classes.filter((c) => c.id !== cls.id)
            )
        },

        removeAddedClass(i) {
            this.addedClasses.splice(i, 1)
        }
    }
}
</script>
