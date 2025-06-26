import axiosCustom from "lib/axios";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosCustom.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
