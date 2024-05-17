<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
//import personaService from '@/service/personaService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const checked = ref(false);
const checked1 = ref(false);
const toast = useToast();

const personal = ref(null);
const ciudads = ref(null);
const extensions = ref(null);
const personalDialog = ref(false);
const personalDialogShow = ref(false);
const contratoDialog = ref(false);
const persona = ref({});
const contrato = ref({});
const cargosalario = ref({});
const discapacidad = ref({});
const selectedpersonal = ref(null);
const dt = ref(null);
const filters = ref({});
const personaSeleccionada = ref(null);
const personalSeleccionado = ref({});
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
    //asig await
    const FuncionRetornodeAPI = async()=>{

        const respuesta = await axios.get(`${import.meta.env.API_BASE_URL}/personals`)
        console.log(respuesta.data);
    }
    FuncionRetornodeAPI();


    
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

const openNew = () => {
    persona.value = {};
    submitted.value = false;
    personalDialog.value = true;
};
const openNew2 = () => {
    persona.value = {};
    submitted.value = false;
    contratoDialog.value = true;
};
const hideDialog = () => {
    personalDialog.value = false;
    submitted.value = false;
};
const hideDialog2 = () => {
    contratoDialog.value = false;
    discapacidad.value = {};
    contrato.value = {};
    cargosalario.value = {};
    submitted.value = false;
    personaSeleccionada.value = null;
    personalSeleccionado.value = {};
};
const editpersona = (editpersona) => {
    persona.value = { ...editpersona };
    console.log(persona);
    personalDialog.value = true;
};
const showpersona = (showpersona) => {
    persona.value = { ...showpersona };
    console.log(persona);
    personalDialogShow.value = true;
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
                    toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo actualizar', life: 3000 });
                    console.log(err);
                });
        } else {
            axios
                .post(`${import.meta.env.API_BASE_URL}/personals`, {
                    cod_ide: persona.value.cod_ide,
                    expedido: 'LP',
                    nombres: persona.value.nombres,
                    ap_paterno: persona.value.ap_paterno,
                    ap_materno: persona.value.ap_materno,
                    fecha_nac: persona.value.fecha_nac,
                    nacionalidad: persona.value.nacionalidad,
                    domicilio: persona.value.domicilio,
                    ciudad: 'LP',
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
const guardarContrato = async () => {
    submitted.value = true;
    //insercion de items
    if (checked.value) {
        console.log('El checkbox está seleccionado.ITEMS');
        console.log(contrato.value);
        axios
            .post(`${import.meta.env.API_BASE_URL}/items`, {
                num_item: 1,
                fecha_inicio: contrato.value.fecha_inicio,
                fecha_baja: contrato.value.fecha_baja,
                personal_id: personalSeleccionado.value.id
            })
            .then((result) => {
                console.log(result);
                toast.add({ severity: 'success', summary: 'Exitoso', detail: 'result'.result, life: 3000 });
                window.location.reload();
            })
            .catch((err) => {
                toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo insertar item', life: 3000 });
                console.log(err);
            });
    } else {
        //insercion de contrato
        console.log('El checkbox no está seleccionado.CONTRATO');
        console.log('contrato datos', contrato.value);
        console.log('discapacidad datos', discapacidad.value);
        axios
            .post(`${import.meta.env.API_BASE_URL}/contratos`, {
                num_cont: 1,
                cite: contrato.value.cite,
                fecha_inicio: contrato.value.fecha_inicio,
                fecha_fin_contrato: contrato.value.fecha_fin,
                monto_total: contrato.value.monto_total,
                monto_total_literal: contrato.value.monto_total_literal,
                pagos: contrato.value.pagos,
                observaciones: contrato.value.observaciones,
                personal_id: personalSeleccionado.value.id
            })
            .then((result) => {
                console.log(result);
                toast.add({ severity: 'success', summary: 'Exitoso', detail: 'result'.result, life: 3000 });
                window.location.reload();
            })
            .catch((err) => {
                toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo insertar contrato', life: 3000 });
                console.log('datos enviados');
                console.log(err);
            });
        toast.add({ severity: 'success', summary: 'Exitoso', detail: "result", life: 3000 });
    }
    //insercion de cargo salario
    axios
        .post(`${import.meta.env.API_BASE_URL}/cargosalarios`, {
            direccion: cargosalario.value.direccion,
            unidad: cargosalario.value.unidad,
            puesto: cargosalario.value.puesto,
            haber_basico: cargosalario.value.haber_basico,
            nivel: cargosalario.value.nivel,
            personal_id: personalSeleccionado.value.id
        })
        .then((result) => {
            console.log(result);
            toast.add({ severity: 'success', summary: 'Exitoso', detail: 'result'.result, life: 3000 });
            window.location.reload();
        })
        .catch((err) => {
            toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo insertar cargo salario', life: 3000 });
            console.log('datos enviados');
            console.log(err);
        });
    //insercion de discapacidad
    if (checked1.value) {
        axios
            .post(`${import.meta.env.API_BASE_URL}/discapacidads`, {
                grado_disca: discapacidad.value.grado_disca,
                tipo_disca: discapacidad.value.tipo_disca,
                carnet_disca: discapacidad.value.carnet_disca,
                tutor: discapacidad.value.tutor,
                personal_id: personalSeleccionado.value.id
            })
            .then((result) => {
                console.log(result);
                toast.add({ severity: 'success', summary: 'Exitoso', detail: 'result'.result, life: 3000 });
                window.location.reload();
            })
            .catch((err) => {
                toast.add({ severity: 'danger', summary: 'Problema', detail: 'No se pudo insertar discapacidad', life: 3000 });
                console.log('datos enviados');
                console.log(err);
            });
    } else {
        console.log('no tiene discapacidad');
    }
    contratoDialog.value = false;
    contrato.value = {};
    discapacidad.value = {};
    cargosalario.value = {};
    personaSeleccionada.value = null;
    personalSeleccionado.value = {};
};
const filtrarPersonas = (query) => {
    if (!query || !query.value) {
        console.log('Datos sin filtrar:', personal.value);
        return personal.value;
    } else {
        // Filtra las personas por cod_ide
        console.log('Query:', query.value);
        return personal.value.filter((persona) => {
            console.log('Persona.cod_ide:', persona.cod_ide);

            // Verifica que persona.cod_ide no sea null o undefined
            if (persona.cod_ide !== null && persona.cod_ide !== undefined) {
                // Realiza la comparación sin convertir a minúsculas
                return persona.cod_ide.includes(query.value);
            } else {
                // En caso de que persona.cod_ide sea null o undefined, no incluir en los resultados
                console.log('error:');
                return false;
            }
        });
    }
};
// Observador para actualizar el nombre seleccionado cuando cambia la persona seleccionada
watch(personaSeleccionada, (newVal) => {
    personalSeleccionado.value = obtenerNombrePorCodId(newVal);
    console.table(personalSeleccionado.value);
});

const obtenerNombrePorCodId = (codIde) => {
    const persona = personal.value.find((p) => p.cod_ide === codIde);

    return persona ? persona : {};
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
                            <Button label="Nuevo Personal" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Realizar contrato" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew2" />
                        </div>
                    </template>
                </Toolbar>
                <!--TABLA-->
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
                            <h5 class="m-0">LISTA DEL PERSONAL</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <!--TABLA-->
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="cod_ide" header="Nº CARNET" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº CARNET</span>
                            {{ slotProps.data.cod_ide }} - {{ slotProps.data.expedido }}
                        </template>
                    </Column>
                    <Column field="nombres" header="NOMBRE COMPLETO" :sortable="true" headerStyle="width:14%; min-width:23rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">NOMBRE COMPLETO</span>
                            {{ slotProps.data.ap_paterno }} &nbsp; {{ slotProps.data.ap_materno }} &nbsp; {{ slotProps.data.nombres }}
                        </template>
                    </Column>
                    <Column field="tipo_cont" header="TIPO CONTRATO" :sortable="true" headerStyle="width:14%; min-width:12rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Nac.</span>
                            {{ slotProps.data.fecha_nac }}
                        </template>
                    </Column>
                    <Column field="discapacidad" header="DISCAPACIDAD" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Nac.</span>
                            {{ slotProps.data.fecha_nac }}
                        </template>
                    </Column>
                    <Column field="n_archivo" header="ARCHIVO" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Nac.</span>
                            {{ slotProps.data.fecha_nac }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;" header="OPCIONES">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editpersona(slotProps.data)" />
                            <Button icon="pi pi-eye" @click="showpersona(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <!--REGISTER NEW-->
                <Dialog v-model:visible="personalDialog" header="Personal Detalle" :modal="true" class="p-fluid" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="field">
                        <label for="cod_ide"><b>COD. IDE.</b></label>
                        <InputText id="cod_ide" v-model.trim="persona.cod_ide" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.cod_ide }" placeholder="COD. IDE." />
                        <small class="p-invalid" v-if="submitted && !persona.cod_ide">COD. IDE. es obligatorio</small>
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
                    <div class="p-grid p-fluid">
                        <div class="p-col-12 p-md-6">
                            <div class="field">
                                <label for="nombres"><b>NOMBRES</b></label>
                                <InputText id="nombres" v-model.trim="persona.nombres" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.nombres }" placeholder="NOMBRES"/>
                                <small class="p-invalid" v-if="submitted && !persona.nombres">Nombres es requerido.</small>
                            </div>
                        </div>
                        <div class="p-col-12 p-md-6">
                            <div class="field">
                                <label for="ap_paterno"><b>APELLIDO PATERNO</b></label>
                                <InputText id="ap_paterno" v-model.trim="persona.ap_paterno" required="true" autofocus :class="{ 'p-invalid': submitted && !persona.ap_paterno }" placeholder="APELLIDO PATERNO"/>
                                <small class="p-invalid" v-if="submitted && !persona.ap_paterno">Apellido es requerido.</small>
                            </div>
                        </div>
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
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarPersonal" />
                    </template>
                </Dialog>
                <!--REALIZAR CONTRATO-->
                <Dialog v-model:visible="contratoDialog" :style="{ width: '70rem' }" header="Personal Detalle" :modal="true" class="p-fluid">
                    <!--DATOS DEL PERSONAL-->
                    <div class="field">
                        <label for="persona">Seleccionar Persona:</label>
                        <Dropdown v-model="personaSeleccionada" :options="personal" option-label="cod_ide" option-value="cod_ide" placeholder="Buscar por Cod_id" :filter="true" @filter="filtrarPersonas" />
                    </div>
                    <div class="field" v-if="personaSeleccionada">
                        <label><b>DATOS DEL PERSONAL</b></label>
                        <label for="persona_id" v-if="false">{{ personalSeleccionado.id }}</label>
                        <DataTable :value="[personalSeleccionado]" class="borderless-table">
                            <Column field="cod_ide" header="Cod_ide"></Column>
                            <Column field="nombres" header="Nombres"></Column>
                            <Column field="ap_paterno" header="Apellido Paterno"></Column>
                            <Column field="ap_materno" header="Apellido Materno"></Column>
                        </DataTable>
                    </div>
                    <!--DATOS PARA CONTRATO POR ITEM O CONTRATO-->
                    <div class="field">
                        <label><b>DATOS DEL CONTRATO</b></label>
                    </div>
                    <div class="field">
                        <label for="tipo_contra" class="mb-1"><b>ITEM</b></label>
                        <Checkbox id="tipo_contra" v-model="checked" :binary="true" />
                    </div>
                    <div class="field">
                        <label for="fecha_inicio"><b>FECHA DE INICIO</b></label>
                        <InputText id="fecha_inicio" type="date" v-model.trim="contrato.fecha_inicio" required="true" :class="{ 'p-invalid': submitted && !contrato.fecha_inicio }" autofocus placeholder="FECHA DE NACIMIENTO" />
                    </div>
                    <div class="field">
                        <label for="fecha_fin"><b>FECHA DE FINALIZACION</b></label>
                        <InputText id="fecha_fin" type="date" v-model.trim="contrato.fecha_fin" required="true" autofocus placeholder="FECHA DE NACIMIENTO" />
                    </div>
                    <div class="field" v-if="!checked">
                        <label for="cite"><b>CITE</b></label>
                        <InputText id="cite" v-model.trim="contrato.cite" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="!checked">
                        <label for="monto_total"><b>MONTO TOTAL</b></label>
                        <InputText id="monto_total" v-model.trim="contrato.monto_total" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="!checked">
                        <label for="monto_total_literal"><b>MONTO TOTAL LITERAL</b></label>
                        <InputText id="monto_total_literal" v-model.trim="contrato.monto_total_literal" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="!checked">
                        <label for="pagos"><b>PAGOS</b></label>
                        <InputText id="pagos" v-model.trim="contrato.pagos" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="!checked">
                        <label for="observaciones"><b>OBSERVACIONES</b></label>
                        <InputText id="observaciones" v-model.trim="contrato.observaciones" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <!--CARGO QUE OCUPA Y SALARIO-->
                    <div class="field">
                        <label><b>CARGO - SALARIO</b></label>
                    </div>
                    <div class="field">
                        <label for="direccion"><b>DIRECCION</b></label>
                        <InputText id="direccion" v-model.trim="cargosalario.direccion" required="true" autofocus placeholder="DIRECCION" />
                    </div>
                    <div class="field">
                        <label for="unidad"><b>UNIDAD</b></label>
                        <InputText id="unidad" v-model.trim="cargosalario.unidad" required="true" autofocus placeholder="UNIDAD" />
                    </div>
                    <div class="field">
                        <label for="puesto"><b>PUESTO</b></label>
                        <InputText id="puesto" v-model.trim="cargosalario.puesto" required="true" autofocus placeholder="PUESTO" />
                    </div>
                    <div class="field">
                        <label for="haber_basico"><b>HABER BASICO</b></label>
                        <InputText id="haber_basico" v-model.trim="cargosalario.haber_basico" required="true" autofocus placeholder="HABER BASICO" />
                    </div>
                    <div class="field">
                        <label for="nivel"><b>NIVEL</b></label>
                        <InputText id="nivel" v-model.trim="cargosalario.nivel" required="true" autofocus placeholder="NIVEL" />
                    </div>
                    <!--REGISTRO DE DISCAPACIDAD-->
                    <div class="field">
                        <label for="tipo_contra" class="mb-1"><b>DISCAPACIDAD</b></label>
                        <Checkbox id="tipo_contra" v-model="checked1" :binary="true" />
                    </div>
                    <div class="field" v-if="checked1">
                        <label><b>DATOS DISCAPACIDAD</b></label>
                    </div>
                    <div class="field" v-if="checked1">
                        <label for="grado_dica"><b>GRADO DISCAPACIDAD</b></label>
                        <InputText id="grado_disca" v-model.trim="discapacidad.grado_dica" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="checked1">
                        <label for="tipo_disca"><b>TIPO DE DISCAPACIDAD</b></label>
                        <InputText id="tipo_disca" v-model.trim="discapacidad.tipo_disca" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="checked1">
                        <label for="carnet_disca"><b>CARNET DE DISCAPACIDAD</b></label>
                        <InputText id="carnet_disca" v-model.trim="discapacidad.carnet_disca" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <div class="field" v-if="checked1">
                        <label for="tutor"><b>TUTOR</b></label>
                        <InputText id="tutor" v-model.trim="discapacidad.tutor" required="true" autofocus placeholder="COD. IDE." />
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog2" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarContrato" />
                    </template>
                </Dialog>
                <!--SHOW PERSONA-->
                <Dialog v-model:visible="personalDialogShow" :style="{ width: '70rem' }" header="Personal Detalle" :modal="true" class="p-fluid">
                    <p>{{ persona }}</p>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
