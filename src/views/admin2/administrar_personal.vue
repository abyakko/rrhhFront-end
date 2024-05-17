<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
//import personaService from '@/service/personaService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const checked = ref(false);
const toast = useToast();

//const uploadedFiles = ref([]);

const personal = ref(null);
const ciudads = ref(null);
const extensions = ref(null);
const personalDialog = ref(false);
const persona = ref({});
const contrato = ref({});
const item = ref({});
const selectedpersonal = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sexo = ref([
    { sexo: 'MASCULINO', value: 'M' },
    { sexo: 'FEMENINO', value: 'F' }
]);
//const personaService = new personaService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    axios
        .get(`${import.meta.env.API_BASE_URL}/personals`)
        .then((response) => {
            const apiData1 = response.data;
            console.log(response.data);
            personal.value = apiData1;
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la information', life: 3000 });
            console.log(error);
        });
    axios
        .get(`${import.meta.env.API_BASE_URL}/ciudads`)
        .then((response) => {
            const apiData2 = response.data;
            console.log(response.data);
            ciudads.value = apiData2;
            console.log(ciudads);
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información de ciudades', life: 3000 });
            console.log(error);
        });
    axios
        .get(`${import.meta.env.API_BASE_URL}/extencions`)
        .then((response) => {
            const apiData3 = response.data;
            console.log(response.data);
            extensions.value = apiData3;
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información de extenciones', life: 3000 });
            console.log(error);
        });
});

/*const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};*/

const openNew = () => {
    persona.value = {};
    submitted.value = false;
    personalDialog.value = true;
};
const hideDialog = () => {
    personalDialog.value = false;
    submitted.value = false;
};
const editpersona = (editpersona) => {
    persona.value = { ...editpersona };
    console.log(persona);
    personalDialog.value = true;
};
const guardarPersonal = async () => {
    submitted.value = true;
    console.log(persona.value);

    if (persona.value.nombres) {
        if (persona.value.id) {
            axios
                .put(`${import.meta.env.API_BASE_URL}/personals` + persona.value.id, {
                    cod_ide: persona.value.cod_ide,
                    expedido: persona.value.expedido.value,
                    nombres: persona.value.nombres,
                    ap_paterno: persona.value.ap_paterno,
                    ap_materno: persona.value.ap_materno,
                    fecha_nac: persona.value.fecha_nac,
                    nacionalidad: persona.value.nacionalidad,
                    domicilio: persona.value.domicilio,
                    ciudad: persona.value.ciudad.value,
                    sexo: persona.value.sexo.value
                })
                .then((result) => {
                    console.log(result);
                    toast.add({ severity: 'success', summary: 'Exitoso', detail: 'result'.result, life: 3000 });
                    window.location.reload();
                })
                .catch((err) => {
                    toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo actualisar', life: 3000 });
                    console.log(err);
                });
        } else {
            axios
                .post(`${import.meta.env.API_BASE_URL}/personals`,{ 
                    cod_ide: persona.value.cod_ide,
                    expedido: persona.value.expedido.value,
                    nombres: persona.value.nombres,
                    ap_paterno: persona.value.ap_paterno,
                    ap_materno: persona.value.ap_materno,
                    fecha_nac: persona.value.fecha_nac,
                    nacionalidad: persona.value.nacionalidad,
                    domicilio: persona.value.domicilio,
                    ciudad: persona.value.ciudad.value,
                    sexo: persona.value.sexo.value
                })
                .then((result) => {
                    console.log(result);
                    toast.add({ severity: 'success', summary: 'Exitoso', detail: 'result'.result, life: 3000 });
                    window.location.reload();
                })
                .catch((err) => {
                    toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo insertar', life: 3000 });
                    console.log(err);
                });

            toast.add({ severity: 'success', summary: 'Exitoso', detail: "result", life: 3000 });
        }
        personalDialog.value = false;
        persona.value = {};
    }
};
/*
const obtenerFechaActual = () => {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
};*/
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < personal.value.length; i++) {
        if (personal.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};
const exportCSV = () => {
    dt.value.exportCSV();
};
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
/*
const onUpload = (event) => {
    // Obtener información sobre los archivos subidos
    const files = event.files;

    // Almacenar información en uploadedFiles para referencia posterior
    uploadedFiles.value = files;

    // Mostrar información en la consola
    console.log('Archivos subidos:', files);

    // Lógica adicional, por ejemplo, enviar al backend de Laravel
    //sendFilesToBackend(files);

    // Mostrar mensaje de éxito
    toast.add({ severity: 'info', summary: 'Success', detail: 'File(s) Uploaded', life: 3000 });
};*/
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Registrar datos de contrato" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="personal"
                    v-model:selection="selectedpersonal"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} personas"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">ADMINISTRAR PERSONAL</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                        <!--'cod_ide','expedido','ap_paterno',
                        'ap_materno','nombres','fecha_nac',
                        'nacionalidad','domicilio','ciudad',
                        'sexo','fecha_registro'-->
                    </template>
                    <!--TABLA-->
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="cod_ide" header="COD_ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">COD_ID</span>
                            {{ slotProps.data.cod_ide }}
                        </template>
                    </Column>
                    <Column field="expedido" header="EXPEDIDO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">COD_ID</span>
                            {{ slotProps.data.expedido }}
                        </template>
                    </Column>
                    <Column field="nombres" header="NOMBRES" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombres</span>
                            {{ slotProps.data.nombres }}
                        </template>
                    </Column>
                    <Column field="ap_paterno" header="AP. PATERNO" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">AP. PATERNO</span>
                            {{ slotProps.data.ap_paterno }}
                        </template>
                    </Column>
                    <Column field="ap_materno" header="AP. MATERNO" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">AP. MATERNO</span>
                            {{ slotProps.data.ap_materno }}
                        </template>
                    </Column>
                    <Column field="fecha_nac" header="FECHA NACIMIENTO" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Nac.</span>
                            {{ slotProps.data.fecha_nac }}
                        </template>
                    </Column>
                    <Column field="nacionalidad" header="NACIONALIDAD" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nacionalidad</span>
                            {{ slotProps.data.nacionalidad }}
                        </template>
                    </Column>
                    <Column field="domicilio" header="DOMICILIO" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Domicilio</span>
                            {{ slotProps.data.domicilio }}
                        </template>
                    </Column>
                    <Column field="ciudad" header="CIUDAD" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ciudad</span>
                            {{ slotProps.data.ciudad }}
                        </template>
                    </Column>
                    <Column field="sexo" header="SEXO" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Sexo</span>
                            {{ slotProps.data.sexo }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;" header="OPCIONES">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editpersona(slotProps.data)" />
                            <!--<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeletepersona(slotProps.data)" />-->
                        </template>
                    </Column>
                </DataTable>
                <!--REGISTRO NUEVO-->
                <Dialog v-model:visible="personalDialog" :style="{ width: '70rem' }" header="Personal Detalle" :modal="true" class="p-fluid">
                    <img :src="'demo/images/persona/' + persona.image" :alt="persona.image" v-if="persona.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                    <DataTable
                        ref="dt"
                        :value="personal"
                        v-model:selection="selectedpersonal"
                        dataKey="id"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} personas"
                        responsiveLayout="scroll"
                    >
                        <Column field="cod_ide" header="COD_ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">COD_ID</span>
                                {{ slotProps.data.cod_ide }}
                            </template>
                        </Column>
                        <Column field="nombres" header="NOMBRES" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nombres</span>
                                {{ slotProps.data.nombres }}
                            </template>
                        </Column>
                    </DataTable>
                    <div class="field">
                        <label for="cod_ide"><b>COD. IDE.</b></label>
                        <InputText id="cod_ide" v-model.trim="personal.cod_ide" readonly/>
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
                    </div>
                    <div class="field">
                        <label for="extension" class="mb-1"><b>EXTENSION</b></label>
                        <Dropdown id="seleccionarExpedido" v-model="persona.expedido" :options="extensiones" optionLabel="lugar" placeholder="SELECCIONAR EXPEDIDO">
                            <!-- Utilizamos el slot #option para personalizar cómo se muestra cada opción en el dropdown -->
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'persona-badge status-' + slotProps.value.value">{{ slotProps.value.lugar }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="field">
                        <label for="nombres"><b>NOMBRES</b></label>
                        <InputText id="nombres" v-model.trim="persona.nombres" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.nombres }" placeholder="NOMBRES"/>
                        <small class="p-invalid" v-if="submitted && !persona.nombres">Nombres es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="ap_paterno"><b>APELLIDO PATERNO</b></label>
                        <InputText id="ap_paterno" v-model.trim="persona.ap_paterno" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.ap_paterno }" placeholder="APELLIDO PATERNO"/>
                        <small class="p-invalid" v-if="submitted && !persona.ap_paterno">Apellido es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="ap_materno"><b>APELLIDO MATERNO</b></label>
                        <InputText id="ap_materno" v-model.trim="persona.ap_materno" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.ap_materno }" placeholder="APELLIDO MATERNO"/>
                        <small class="p-invalid" v-if="submitted && !persona.ap_materno">Nombres es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="fecha_nac"><b>FECHA DE NACIMIENTO</b></label>
                        <InputText id="fecha_nac" type="date" v-model.trim="persona.fecha_nac" required="true" autofocus placeholder="FECHA DE NACIMIENTO"  />
                        <small class="p-invalid" v-if="submitted && !persona.fecha_nac">Nombres es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="nacionalidad"><b>NACIONALIDAD</b></label>
                        <InputText id="nacionalidad" v-model.trim="persona.nacionalidad" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.nacionalidad }" placeholder="NACIONALIDAD"/>
                        <small class="p-invalid" v-if="submitted && !persona.nacionalidad">Nombres es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="domicilio"><b>DOMICILIO</b></label>
                        <InputText id="domicilio" type="text" v-model.trim="persona.domicilio" required="true" autofocus placeholder="DOMICILIO"  />
                    </div>
                    <div class="field">
                        <label for="seleccionarciudades" class="mb-3"><b>CIUDADES</b></label>
                        <Dropdown id="seleccionarciudades" v-model="persona.ciudads" :options="ciudads" optionLabel="nombre_ciudad" placeholder="Seleccionar la ciudad">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'persona-badge status-' + slotProps.value.value">{{ slotProps.value.id }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="field">
                        <label for="sexo" class="mb-1"><b>GENERO</b></label>
                        <Dropdown id="sexo" v-model="persona.sexo" :options="sexo" optionLabel="sexo" placeholder="SELECCIONAR GENERO">
                            <!-- Utilizamos el slot #option para personalizar cómo se muestra cada opción en el dropdown -->
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'persona-badge status-' + slotProps.value.value">{{ slotProps.value.sexo }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <!--
                    <div class="grid">
                        <div class="col-12">
                            <div class="card">
                                <h5>Advanced</h5>
                                <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload />
                                <h5>Basic</h5>
                                <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000" @uploader="onUpload" customUpload />
                            </div>
                        </div>
                        <Toast />
                    </div>
                    -->
                    <div class="field">
                        <label for="tipo_contra" class="mb-1"><b>ITEM</b></label>
                        <Checkbox id="tipo_contra" v-model="checked" :binary="true" />
                    </div>
                    <div class="field">
                        <label for="fecha_inicio"><b>FECHA DE INICIO</b></label>
                        <InputText id="fecha_inicio" type="date" v-model.trim="persona.fecha_nac" required="true" autofocus placeholder="FECHA DE NACIMIENTO"  />
                        <small class="p-invalid" v-if="submitted && !contrato.fecha_nac">la fecha de inicio es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="fecha_fin"><b>FECHA DE FINALIZACION</b></label>
                        <InputText id="fecha_fin" type="date" v-model.trim="persona.fecha_nac" required="true" autofocus placeholder="FECHA DE NACIMIENTO"  />
                        <small class="p-invalid" v-if="submitted && !persona.fecha_nac">la fecha de finalizacion es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="cite"><b>CITE</b></label>
                        <InputText id="cite" v-model.trim="persona.cod_ide" required="true" :disabled="!checked" autofocus :class="{ 'p-invalid': submitted && !persona.cod_ide }" placeholder="COD. IDE."/>
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
                    </div>
                    <div class="field">
                        <label for="monto_total"><b>MONTO TOTAL</b></label>
                        <InputText id="monto_total" v-model.trim="persona.cod_ide" required="true" :disabled="!checked" autofocus :class="{ 'p-invalid': submitted && !persona.cod_ide }" placeholder="COD. IDE."/>
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
                    </div>
                    <div class="field">
                        <label for="monto_total_literal"><b>MONTO TOTAL LITERAL</b></label>
                        <InputText id="monto_total_literal" v-model.trim="persona.cod_ide" required="true" :disabled="!checked" autofocus :class="{ 'p-invalid': submitted && !persona.cod_ide }" placeholder="COD. IDE."/>
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
                    </div>
                    <div class="field">
                        <label for="pagos"><b>PAGOS</b></label>
                        <InputText id="pagos" v-model.trim="persona.cod_ide" required="true" :disabled="!checked" autofocus :class="{ 'p-invalid': submitted && !persona.cod_ide }" placeholder="COD. IDE."/>
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
                    </div>
                    <div class="field">
                        <label for="observaciones"><b>OBSERVACIONES</b></label>
                        <InputText id="observaciones" v-model.trim="persona.cod_ide" required="true" :disabled="!checked" autofocus :class="{ 'p-invalid': submitted && !persona.cod_ide }" placeholder="COD. IDE."/>
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarPersonal" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
