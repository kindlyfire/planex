<template>
    <div>
        <popper
            trigger="click"
            transition="fade"
            enter-active-class="fade-enter-active"
            leave-active-class="fade-leave-active"
            :options="{ placement: 'bottom-end' }"
            :visible-arrow="false"
            :disabled="disabled"
            ref="popper"
            @show="opened"
        >
            <div class="popper">
                <slot name="popper-content"></slot>
            </div>

            <button
                slot="reference"
                class="popper-reference btn btn-secondary"
                :disabled="disabled"
            >
                <slot name="button-text"></slot>
            </button>
        </popper>
    </div>
</template>

<script>
import popper from "vue-popperjs";

export default {
    props: ["disabled"],

    components: {
        popper
    },

    methods: {
        doClose() {
            this.$refs.popper.doClose();
        },

        opened() {
            this.$emit("show");
        }
    }
};
</script>
