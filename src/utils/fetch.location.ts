import axios from "axios"

export const fetchLocation = async (id: number, type: "province" | "city" | "district" | "subdistrict", parentId?: number) => {
  let apiUrl = ""

  switch (type) {
    case "province":
      apiUrl = "https://alamat.thecloudalert.com/api/provinsi/get/"
      break
    case "city":
      if (parentId === undefined) throw new Error("parentId is required for cities")
      apiUrl = `https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=${parentId}`
      break
    case "district":
      if (parentId === undefined) throw new Error("parentId is required for districts")
      apiUrl = `https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=${parentId}`
      break
    case "subdistrict":
      if (parentId === undefined) throw new Error("parentId is required for subdistricts")
      apiUrl = `https://alamat.thecloudalert.com/api/kelurahan/get/?d_kecamatan_id=${parentId}`
      break
    default:
      throw new Error("Invalid location type")
  }

  try {
    const response = await axios.get(apiUrl)
    const result = response.data.result.find((location: any) => location.id === String(id))
    return result ? result.text : null
  } catch (error) {
    console.error("Error fetching location:", error)
    return null
  }
}
