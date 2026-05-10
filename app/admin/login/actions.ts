"use server"

export async function verifyAdminAccessCode(code: string): Promise<boolean> {
  const validCode = process.env.ADMIN_ACCESS_CODE || "zapatos-ATELIER-2024"
  return code.trim() === validCode
}
