<template>
    <div class="comp-yes-no-toggler">
        <div
            class="toggle toggle-yes"
            :class="{ 'active': value === 1 || (!canInherit && value === 0) }"
            @click="$emit('input', 1)"
        >
            <i class="fas fa-check"></i>
        </div>
        <div
            v-if="canInherit"
            class="toggle toggle-inherit"
            :class="{ 'active': value === 0 }"
            @click="$emit('input', 0)"
        >
            <i class="far fa-circle"></i>
            <span
                v-if="inheritLabel"
                style="display: inline-block; margin-left: 6px; font-size: 0.8em;"
            >{{ inheritLabel }}</span>
        </div>
        <div
            class="toggle toggle-no"
            :class="{ 'active': value === -1 }"
            @click="$emit('input', -1)"
        >
            <i class="fas fa-times"></i>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: Number,
        canInherit: {
            type: Boolean,
            default: false
        },
        inheritLabel: {
            type: String,
            default: ''
        }
    }
}
</script>

<style>
.comp-yes-no-toggler {
    width: 100%;
    display: flex;

    border: 1px solid rgb(232, 232, 232);
    border-radius: 4px;
}

.toggle {
    height: 40px;
    flex: 1 1 0;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background-color 0.05s, color 0.05s;
}

.toggle:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.toggle:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.toggle:not(:last-child) {
    border-right: 1px solid rgb(232, 232, 232);
}

.toggle-yes {
    color: #70ae98;
}
.toggle-yes.active {
    background-color: #70ae98;
    color: white;
}

.toggle-inherit {
    color: inherit;
}
.toggle-inherit.active {
    background-color: #9dabdd;
    color: white;
}

.toggle-no {
    color: #e58b88;
}
.toggle-no.active {
    background-color: #e58b88;
    color: white;
}
</style>
