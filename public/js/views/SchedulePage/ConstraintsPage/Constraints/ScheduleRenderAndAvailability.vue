<template>
    <div>
        <div class="editor-container">
            <div
                v-for="(col, i) in rColumns"
                :key="i"
                :style="{width: (95 / rColumns.length) + '%'}"
                class="editor-column"
            >
                <p class="m-0 text-center">Jour {{ i + 1 }}</p>
                <div class="column-inner">
                    <div
                        v-for="n in dayLength"
                        :key="n"
                        @click="cellClicked(i, n - 1)"
                        :class="{ 'entry-blocked': col.indexOf(n - 1) !== -1, 'entry-active': activeCells.includes(`${i}_${n - 1}`), 'text-muted': !activeCells.includes(`${i}_${n - 1}`) }"
                        class="column-entry d-flex align-items-center justify-content-center no-select"
                    >{{ n }}</div>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-lg-4">
                <div class="d-flex flex-row align-items-center">
                    <div style="width: 35px;" class="editor-column">
                        <div class="column-inner">
                            <div class="column-entry"></div>
                        </div>
                    </div>
                    <div class="ml-2">Disponible</div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="d-flex flex-row align-items-center">
                    <div style="width: 35px;" class="editor-column">
                        <div class="column-inner">
                            <div class="column-entry entry-blocked"></div>
                        </div>
                    </div>
                    <div class="ml-2">Non disponible</div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="d-flex flex-row align-items-center">
                    <div style="width: 35px;" class="editor-column">
                        <div class="column-inner">
                            <div class="column-entry entry-active"></div>
                        </div>
                    </div>
                    <div class="ml-2">Période sélectionnée</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        schedule: Object,
        columns: Array,
        exam: Object,
        examInstance: Object,
        startTime: Array
    },

    data() {
        let cols = JSON.parse(JSON.stringify(this.columns))

        // Make sure the size is right
        if (cols.length < this.schedule.days) {
            cols = [
                ...cols,
                ...new Array(this.schedule.days - cols.length)
                    .fill()
                    .map(() => [])
            ]
        } else if (cols.length > this.schedule.days) {
            cols = cols.slice(0, this.schedule.days)
        }

        return {
            // columns to display
            rColumns: cols,

            // Length of each day in periods
            dayLength: 4,

            selectedStartTime: this.startTime || null
        }
    },

    watch: {
        columns(v) {
            let cols = JSON.parse(JSON.stringify(v))

            // Make sure the size is right
            if (cols.length < this.schedule.days) {
                cols = [
                    ...cols,
                    ...new Array(this.schedule.days - cols.length)
                        .fill()
                        .map(() => [])
                ]
            } else if (cols.length > this.schedule.days) {
                cols = cols.slice(0, this.schedule.days)
            }

            this.rColumns = cols
        },

        startTime(v) {
            this.selectedStartTime = v
        }
    },

    computed: {
        activeCells() {
            if (!this.selectedStartTime || !this.exam || !this.examInstance) {
                return []
            }

            return new Array(this.exam.length).fill().map((_, i) => {
                return (
                    this.selectedStartTime[0] +
                    '_' +
                    (this.selectedStartTime[1] + i)
                )
            })
        }
    },

    methods: {
        // i and j, both sero-indexed
        // i = day
        // j = period
        cellClicked(i, j) {
            if (!this.exam || !this.examInstance) {
                return
            }

            this.selectedStartTime = [
                i,
                Math.floor(j / this.exam.length) * this.exam.length
            ]

            this.$emit('start-time', this.selectedStartTime)

            console.log(this.selectedStartTime)
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
}

.editor-column {
    width: 100%;

    flex: 0 0 auto;
}

.column-inner {
    border-radius: 5px;

    background-color: rgba(black, 0.3);
}

.column-entry {
    height: 35px;

    &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-top: 1px solid rgba(black, 0.1);
    }

    &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border-bottom: 1px solid rgba(black, 0.1);
    }

    &:not(:last-child) {
        border-bottom: 1px solid rgba(black, 0.15);
    }
}

.entry-blocked {
    background-color: rgba(black, 0.7);
}

.entry-active {
    background-color: #2b579a;
    color: white;
}
</style>
