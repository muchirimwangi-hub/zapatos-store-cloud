"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function createEmployee(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  // 1. Enforce Domain
  if (!email.toLowerCase().endsWith("@zapatoscave.com")) {
    return { error: "Security restriction: Email must end with @zapatoscave.com" }
  }

  // 2. Initialize Admin Client (Bypasses RLS & standard Auth rules)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  // 3. Create the user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-verifies so they can log in instantly
    user_metadata: { 
      role: "employee",
      name: name 
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/team")
  return { success: true }
}