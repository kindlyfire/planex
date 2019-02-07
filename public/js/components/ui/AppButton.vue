<template>
    <button
        v-if="!disabled"
        class="btn cursor-pointer"
        :class="{ ...className, ['btn-' + type]: true }"
        @click="$emit('click')"
    >
        <slot></slot>
    </button>
    <button v-else class="btn" :class="className" disabled>
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        className: String,
        disabled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'primary'
        }
    }
}
</script>
