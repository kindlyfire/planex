<template>
    <div>
        <VPopper
            trigger="click"
            transition="fade"
            enter-active-class="fade-enter-active"
            leave-active-class="fade-leave-active"
            :options="{ placement: placement }"
            :visible-arrow="true"
            :disabled="disabled"
            ref="popper"
            @show="$emit('show')"
        >
            <div class="popper" :style="{ width: width === 'auto' ? 'auto' : width + 'px' }">
                <slot name="popper-content"></slot>
                <slot></slot>
            </div>

            <button slot="reference" class="btn btn-secondary" :disabled="disabled">
                <slot name="button-text"></slot>
            </button>
        </VPopper>
    </div>
</template>

<script>
import VPopper from 'vue-popperjs'

export default {
    props: {
        disabled: Boolean,
        placement: {
            type: String,
            default: 'bottom-end'
        },
        width: {
            type: [Number, String],
            default: 'auto'
        }
    },

    components: {
        VPopper
    },

    methods: {
        doClose() {
            this.$refs.popper.doClose()
        }
    }
}
</script>
