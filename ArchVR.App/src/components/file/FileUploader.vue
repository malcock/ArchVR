<script setup lang="ts">
import Dropzone, { type DropzoneFile } from "dropzone";
const { data } = useAuth();
const props = withDefaults(
  defineProps<{
    type?: "list" | "single" | "gallery";
    fileTypes?: string;
    multiple?: boolean;
    customMessage?: string;
    autoProcessQueue?: boolean;
  }>(),
  {
    type: "list",
    multiple: false,
    autoProcessQueue: true,
  }
);

const emit = defineEmits<{
  (e: "complete", files: DropzoneFile[]): void;
}>();

const dz = ref<Dropzone>();

const upload = async () => {
  console.log("starting upload...");
  const token = data.value?.user?.email;
  if (token) {
    dz.value!.options.headers = {
      Authorization: `Bearer ${token}`,
    };
    dz.value!.processQueue();
  }
};

const fileCount = computed(() => dz.value!.files.length);

onMounted(async () => {
  //get the access token
  const token = data.value?.user?.email;
  if (token) {
    dz.value = new Dropzone("div#formDropzone", {
      url: "/api/files/upload",
      autoProcessQueue: props.autoProcessQueue,
      acceptedFiles: props.fileTypes,

      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Headers":
          "Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name",
      },
      complete(file: any) {
        console.log(file);
      },
      success(file: DropzoneFile) {
        if (!props.multiple) {
          console.log("success", { file });
          emit("complete", [file]);
        }
      },
      successmultiple(files: DropzoneFile[], responseText: string) {
        console.log("successmultiple", { files, responseText });
      },
    });
  }
});

// const emitComplete = () => {
//   emit('complete',)
// }

defineExpose({
  upload,
  fileCount,
});
</script>

<template>
  <div id="formDropzone" class="dropzone">
    <div v-if="customMessage" class="dz-message">{{ customMessage }}</div>
  </div>
</template>

<style></style>
