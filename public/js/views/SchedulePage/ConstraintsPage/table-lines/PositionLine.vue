<template>
    <div class="advanced-table-content-line with-border-between w-100">
        <div style="width: 30%" class="advanced-table-content-cell no-border">Position</div>
        <div class="advanced-table-content-cell no-border text-muted">
            <template
                v-if="examInstance"
            >{{ examInstance['class-group'].name }} ({{ examInstance.exam.name }})</template>
        </div>
    </div>
</template>

<script>
import api from '&/utils/api'

export default {
    props: ['constraint'],

    data() {
        return {
            // Get the first linked exam instance (if there is one)
            examInstance: this.constraint['exam-instances']
                ? this.constraint['exam-instances'].find((v) => !!v)
                : null
        }
    }
}
</script>
