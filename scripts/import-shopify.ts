
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const results: any[] = [];

async function importProducts() {
  console.log("Reading CSV...");
  
  fs.createReadStream('products_export_1 (4).csv')
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', async () => {
      const productsMap = new Map();

      for (const row of results) {
        if (!productsMap.has(row.Handle)) {
          // Main Product Data
          productsMap.set(row.Handle, {
            product: {
              name: row.Title,
              slug: row.Handle, // Shopify Handle is a perfect slug
              description: row['Body (HTML)'],
              brand: row.Vendor || 'Zapatos Cave',
              category: row['Product Category']?.toLowerCase() || 'training',
              is_active: row.Status === 'active',
              images: row['Image Src'] ? [{ url: row['Image Src'] }] : [],
              price: parseFloat(row['Variant Price']) || 0,
            },
            variants: []
          });
        }

        // Variant Data
        productsMap.get(row.Handle).variants.push({
          sku: row['Variant SKU'],
          price: parseFloat(row['Variant Price']),
          compare_at_price: parseFloat(row['Variant Compare At Price']) || null,
          stock_quantity: parseInt(row['Variant Inventory Qty']) || 0,
          option1_name: row['Option1 Name'],
          option1_value: row['Option1 Value'],
          option2_name: row['Option2 Name'],
          option2_value: row['Option2 Value'],
          variant_image: row['Variant Image'] || row['Image Src']
        });
      }

      for (const [handle, data] of productsMap) {
        // Calculate total stock for the parent product
        const totalStock = data.variants.reduce((sum: number, v: any) => sum + v.stock_quantity, 0);
        data.product.stock_quantity = totalStock;

        const { data: product, error: pError } = await supabase
          .from('products')
          .insert(data.product)
          .select()
          .single();

        if (pError) {
          console.error(`Error inserting ${handle}:`, pError.message);
          continue;
        }

        const variantsToInsert = data.variants.map((v: any) => ({
          ...v,
          product_id: product.id
        }));

        await supabase.from('product_variants').insert(variantsToInsert);
        console.log(`✅ Successfully imported: ${data.product.name} (${data.variants.length} variants)`);
      }
    });
}

importProducts();