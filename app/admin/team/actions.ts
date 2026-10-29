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

  // Extract selective permissions from the form checkboxes (returns "on" if checked)
  const permissions = {
    can_edit_pricing: formData.get("perm_pricing") === "on",
    can_manage_inventory: formData.get("perm_inventory") === "on",
    can_process_orders: formData.get("perm_orders") === "on",
    can_view_customers: formData.get("perm_customers") === "on",
  }

  // 2. Initialize Admin Client (Bypasses RLS & standard Auth rules)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  // 3. Create the user and inject permissions into metadata
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
      role: "employee",
      name: name,
      permissions: permissions // Securely stored in Supabase Auth
    }
  })

  // 4. Return errors or success for createEmployee
  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/team")
  return { success: true }
}


// --- COMPLETELY SEPARATE FUNCTION BELOW ---

export async function getTeamMembers() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  const { data, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    return { error: error.message, users: [] }
  }

  // Filter out the main admin accounts so we only see the employees
  const employees = data.users.filter(
    (user) => user.user_metadata?.role === "employee"
  )

  return { users: employees }
}

// --- Add these below your existing getTeamMembers function ---

export async function updateEmployee(prevState: any, formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string

  const permissions = {
    can_edit_pricing: formData.get("perm_pricing") === "on",
    can_edit_discounts: formData.get("perm_discounts") === "on",
    discount_limit: Number(formData.get("discount_limit")) || 0, // Captures the KES limit
    can_manage_inventory: formData.get("perm_inventory") === "on",
    can_process_orders: formData.get("perm_orders") === "on",
    can_view_customers: formData.get("perm_customers") === "on",
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  // We package the new metadata
  const updateData: any = {
    user_metadata: { 
      role: "employee",
      name: name,
      permissions: permissions 
    }
  }

  // Only update the password if you actually typed a new one
  if (password && password.trim().length >= 6) {
    updateData.password = password
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/team")
  return { success: true }
}

export async function deleteEmployee(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  
  if (error) return { error: error.message }
  
  revalidatePath("/admin/team")
  return { success: true }
}