<template>
    <Modal>
        <template slot="header">
            <p>Header</p>
        </template>

        <p>Content</p>
    </Modal>
</template>

<script>
import api from '&/utils/api'

import Modal from '&/components/Modal'

export default {
    props: ['schedule'],

    components: {
        Modal
    }
}
</script>
