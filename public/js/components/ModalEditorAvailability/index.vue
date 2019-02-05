<template>
    <Modal :width="850">
        <template slot="header">
            <h3 class="mb-0">Disponibilité</h3>

            <button class="btn ml-auto cursor-pointer" @click="$emit('closed')">Annuler</button>

            <PrimaryButton class-name="ml-2" @click="save">Confirmer</PrimaryButton>
        </template>

        <div class="p-3">
            <div
                class="editor-container"
                @mouseup="() => { mousedown = false; alreadyTargets = [] }"
                @mouseleave="() => { mousedown = false; alreadyTargets = [] }"
                @mousedown="() => { mousedown = true; return false }"
            >
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
                            @mousedown="toggleCell(i, n - 1)"
                            @mouseover="cellHover(i, n - 1)"
                            :class="{ 'entry-blocked': col.indexOf(n - 1) !== -1 }"
                            class="column-entry d-flex align-items-center justify-content-center text-muted no-select"
                        >{{ n }}</div>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-lg-6">
                    <div class="d-flex flex-row align-items-center">
                        <div style="width: 35px;" class="editor-column">
                            <div class="column-inner">
                                <div class="column-entry"></div>
                            </div>
                        </div>
                        <div class="ml-2">Disponible</div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="d-flex flex-row align-items-center">
                        <div style="width: 35px;" class="editor-column">
                            <div class="column-inner">
                                <div class="column-entry entry-blocked"></div>
                            </div>
                        </div>
                        <div class="ml-2">Non disponible</div>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import Modal from '&/components/Modal'

export default {
    props: {
        schedule: Object,
        columns: Array
    },

    components: {
        Modal
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

            // Is the mouse down ?
            mousedown: false,

            // What nodes have already been toggled ?
            alreadyTargets: []
        }
    },

    watch: {
        columns(v) {
            this.rColumns = JSON.parse(JSON.stringify(v))
        }
    },

    methods: {
        // i and j, both sero-indexed
        // i = day
        // j = period
        toggleCell(i, j) {
            if (this.alreadyTargets.indexOf(`${i}_${j}`) !== -1) {
                return
            }
            this.alreadyTargets.push(`${i}_${j}`)

            if (this.rColumns[i].indexOf(j) !== -1) {
                this.$set(
                    this.rColumns,
                    i,
                    this.rColumns[i].filter((v) => v !== j)
                )
            } else {
                this.rColumns[i].push(j)
            }
        },

        cellHover(i, j) {
            if (this.mousedown) {
                this.toggleCell(i, j)
            }

            return false
        },

        save() {
            this.$emit('input', JSON.parse(JSON.stringify(this.rColumns)))

            setTimeout(() => this.$emit('closed'), 100)
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
    border: 1px solid rgba(black, 0.15);
    border-radius: 5px;

    background-color: rgba(black, 0.3);
}

.column-entry {
    height: 35px;

    &:not(:last-child) {
        border-bottom: 1px solid rgba(black, 0.15);
    }
}

.entry-blocked {
    background-color: rgba(black, 0.7);
}
</style>
