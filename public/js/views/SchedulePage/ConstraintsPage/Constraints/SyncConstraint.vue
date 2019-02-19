<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <div class="p-3">
                    <p class="m-0">Premier examen</p>
                    <ExamInstanceSelector v-model="jsonData.selectedInstance1" :schedule="schedule"></ExamInstanceSelector>
                </div>
            </div>
            <div class="col-md-6">
                <div class="p-3">
                    <p class="m-0">Second examen</p>
                    <ExamInstanceSelector v-model="jsonData.selectedInstance2" :schedule="schedule"></ExamInstanceSelector>
                </div>
            </div>
        </div>

        <p class="m-0 pl-3 pr-3 pb-3 text-muted">
            Une contrainte de capacité sera ajoutée automatiquement si certains
            professeurs sont commun aux deux examens.
        </p>
    </div>
</template>

<script>
import ExamInstanceSelector from './ExamInstanceSelector'

export default {
    props: {
        constraint: Object,
        schedule: Object,
        jsonData: Object
    },

    components: {
        ExamInstanceSelector
    }
}
</script>
