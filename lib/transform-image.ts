export async function transformImage(file: File): Promise<Blob | null> {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("https://ghibli-backend.vercel.app/transform", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      console.error("Failed to transform image:", await response.text())
      return null
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
