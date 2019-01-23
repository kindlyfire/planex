<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Résumé</h2>

            <div class="row pt-2">
                <div class="col-md-6">
                    <h5>Solutions</h5>

                    <div class="card">
                        <div class="card-body">Solutions (à faire)</div>
                    </div>
                </div>

                <div class="col-md-6">
                    <h5>Statistiques</h5>

                    <div class="card">
                        <div class="card-body">Statistiques (à faire)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["schedule"]
};
</script>
