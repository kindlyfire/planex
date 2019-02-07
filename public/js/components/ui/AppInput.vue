<template>
    <div class="form-group mb-0 w-100">
        <label v-if="label" :for="'id_inc_' + inc" class="mb-1">{{ label }}</label>
        <input
            v-model="rValue"
            :type="type"
            :class="classes"
            :disabled="disabled"
            :placeholder="placeholder"
            class="form-control"
        >
    </div>
</template>

<script>
export default {
    props: {
        value: [String, Number],
        type: String,
        disabled: Boolean,
        classes: String,
        label: String,
        placeholder: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            rValue: this.value,
            inc: (this.$root.$data.inc += 1) - 1
        }
    },

    watch: {
        value: {
            handler(v) {
                this.rValue = v
            }
        },

        rValue: {
            handler(v) {
                if (this.type === 'number') {
                    v = parseFloat(v)
                }

                this.$emit('input', v)
            }
        }
    }
}
</script>
