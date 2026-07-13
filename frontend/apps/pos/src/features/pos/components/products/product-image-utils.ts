export function validateImageFile(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

  if (!allowedTypes.includes(file.type)) {
    throw new Error("ຮອງຮັບສະເພາະ JPG, PNG ຫຼື WebP.")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("ຮູບຕ້ອງມີຂະໜາດບໍ່ເກີນ 5MB.")
  }
}
