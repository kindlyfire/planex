<template>
    <div class="advanced-table">
        <div class="advanced-table-header">
            <slot name="header"></slot>
        </div>
        <div class="advanced-table-columns">
            <div
                class="advanced-table-column"
                v-for="(column, i) in columns"
                :key="i"
                :style="{width: column.width}"
            >{{ column.label }}</div>
        </div>
        <div class="advanced-table-content">
            <div
                class="advanced-table-content-line"
                :class="{actionable}"
                v-for="(item, i) in items"
                :key="i"
                @click="itemClick(item)"
            >
                <div
                    class="advanced-table-content-cell"
                    v-for="(column, i) in columns"
                    :key="i"
                    :style="{width: column.width}"
                >
                    <template v-if="!column.key && column.slot">
                        <slot :name="column.slot"></slot>
                    </template>

                    <template v-else-if="column.key">{{ item[column.key] }}</template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["items", "columns", "actionable"],

    methods: {
        itemClick(item) {
            this.$emit("click", item);
        }
    }
};
</script>
