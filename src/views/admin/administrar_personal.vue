<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
//import personaService from '@/service/personaService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();

//const uploadedFiles = ref([]);

const personal = ref(null);
const usuarios = ref(null);
const usuario = ref(null);
const usuarioDialog = ref(false);
const persona = ref({});
const selectedpersonal = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const mostrarfiltro = ref(true);
const personaSeleccionada = ref(null);
const personalSeleccionado = ref({});
//const personaService = new personaService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    axios
        .get(`${import.meta.env.API_BASE_URL}/usuarios`)
        .then((response) => {
            const apiData1 = response.data;
            console.log(response.data);
            usuarios.value = apiData1;
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la information de ususario', life: 3000 });
            console.log(error);
        });
    axios
        .get(`${import.meta.env.API_BASE_URL}/personals`)
        .then((response) => {
            const apiData2 = response.data;
            console.log(response.data);
            personal.value = apiData2;
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la information de personal', life: 3000 });
            console.log(error);
        });
});

/*const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};*/

const openNew = () => {
    usuario.value = {};
    submitted.value = false;
    usuarioDialog.value = true;
};
const hideDialog = () => {
    usuarioDialog.value = false;
    submitted.value = false;
};
const editpersona = (editpersona) => {
    mostrarfiltro.value = !mostrarfiltro.value;
    usuario.value = { ...editpersona };
    // Convertir la contraseña MD5 a texto sin cifrar y asignarla al objeto usuario.value
    //usuario.value.password = convertBcryptToPlainText(editpersona.password);
    // Mostrar en la consola el resultado
    console.log("Usuario editado:", usuario.value);
    usuarioDialog.value = true;
};
/*
const convertBcryptToPlainText = async (bcryptPassword) => {
    try {
        // Supongamos que tienes un valor específico para comparar (puede ser una cadena vacía si no necesitas la comparación)
        const comparisonValue = 'valor_de_comparacion';

        // Comparar el valor de comparación con el hash bcrypt para verificar la contraseña
        const match = await bcrypt.compare(comparisonValue, bcryptPassword);

        if (match) {
        // Si la contraseña es válida, devolver la contraseña en texto plano
        return comparisonValue;
        } else {
        console.log("La contraseña no coincide");
        return null;
        }
    } catch (error) {
        console.error("Error al verificar la contraseña:", error);
        return null;
    }
};

const convertMD5toPlainText2 = (md5Password) => {
    console.log("Contraseña en formato MD5 recibida:", md5Password);
    const bytes = CryptoJS.enc.Hex.parse(md5Password);
    const plainText = CryptoJS.enc.Utf8.stringify(bytes);
    console.log("Contraseña convertida a texto sin cifrar:", plainText);
    return plainText;
};
const convertMD5toPlainText = (md5Password) => {
    console.log("Contraseña en formato MD5 recibida:", md5Password);

    const bytes = CryptoJS.enc.Hex.parse(md5Password);
    const plainText = bytes.toString();

    console.log("Contraseña convertida a texto sin cifrar:", plainText);

    return plainText;
};*/


const guardarPersonal = async () => {
    submitted.value = true;
    console.log(usuarios.value);

    if (usuarios.value.nombres) {
        if (usuarios.value.id) {
            axios
                .put(`${import.meta.env.API_BASE_URL}/usuarios` + usuarios.value.id, {
                    cod_ide: usuarios.value.cod_ide,
                    expedido: usuarios.value.expedido.value,
                    nombres: usuarios.value.nombres,
                    ap_paterno: usuarios.value.ap_paterno,
                    ap_materno: usuarios.value.ap_materno,
                    fecha_nac: usuarios.value.fecha_nac,
                    nacionalidad: usuarios.value.nacionalidad,
                    domicilio: usuarios.value.domicilio,
                    ciudad: usuarios.value.ciudad.value,
                    sexo: usuarios.value.sexo.value
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
                    cod_ide: usuarios.value.cod_ide,
                    expedido: usuarios.value.expedido.value,
                    nombres: usuarios.value.nombres,
                    ap_paterno: usuarios.value.ap_paterno,
                    ap_materno: usuarios.value.ap_materno,
                    fecha_nac: usuarios.value.fecha_nac,
                    nacionalidad: usuarios.value.nacionalidad,
                    domicilio: usuarios.value.domicilio,
                    ciudad: usuarios.value.ciudad.value,
                    sexo: usuarios.value.sexo.value
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
        usuarioDialog.value = false;
        usuarios.value = {};
    }
};
/*
const obtenerFechaActual = () => {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
};*/
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
                            <Button label="Registrar nuevo usuario" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>
                </Toolbar>
                <!--TABLA-->
                <DataTable
                    ref="dt"
                    :value="usuarios"
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
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="cod_ide" header="Nº CARNET" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº CARNET</span>
                            {{ slotProps.data.personals.cod_ide }} - {{ slotProps.data.expedido }}
                        </template>
                    </Column>
                    <Column field="nombres" header="NOMBRE COMPLETO" :sortable="true" headerStyle="width:14%; min-width:23rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">NOMBRE COMPLETO</span>
                            {{ slotProps.data.personals.ap_paterno }} &nbsp; {{ slotProps.data.personals.ap_materno }} &nbsp; {{ slotProps.data.personals.nombres }}
                        </template>
                    </Column>
                    <Column field="email" header="EMAIL" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">EMAIL</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="nivel_id" header="NIVEL" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">NIVEL</span>
                            {{ slotProps.data.nivel_id }}
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
                <Dialog v-model:visible="usuarioDialog" :style="{ width: '70rem' }" header="Personal Detalle" :modal="true" class="p-fluid">
                    <!--DATOS DEL PERSONAL-->
                    <div class="mostrarfiltro" v-if="mostrarfiltro">
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
                    </div>
                    <div class="field">
                        <label for="email"><b>EMAIL</b></label>
                        <InputText id="email" v-model.trim="usuario.email" required="true" autofocus :class="{ 'p-invalid': submitted && !usuario.email }" placeholder="EMAIL" />
                    </div>
                    <div class="field">
                        <label for="password"><b>CONTRASEÑA</b></label>
                        <Password
                            id="password"
                            v-model.trim="usuario.password"
                            promptLabel="Choose a password"
                            weakLabel="Too simple"
                            mediumLabel="Average complexity"
                            strongLabel="Complex password"
                            required="true"
                            autofocus
                            :class="{ 'p-invalid': submitted && !usuario.password }"
                            placeholder="CONTRASEÑA"
                            toggleMask
                        />
                    </div>
                    <div class="field">
                        <label for="nivel"><b>NIVEL</b></label>
                        <InputText id="nivel" v-model.trim="usuario.nivel" required="true" autofocus :class="{ 'p-invalid': submitted && !usuario.email }" placeholder="NIVEL" />
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
