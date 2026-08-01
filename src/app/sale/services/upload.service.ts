import { httpService } from "@/services/httpService"

import { apiPaths } from "@/constants/apiPaths"

export async function uploadImageRequest(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await httpService.post<{ url: string }>(apiPaths.uploadImage, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return data
}
