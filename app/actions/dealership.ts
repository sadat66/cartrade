"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ── Create Dealership ─────────────────────────────────────────────
export async function createDealership(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    const name = (formData.get("name") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const operatingHours = (formData.get("operatingHours") as string)?.trim() || null;
    const phone = (formData.get("phone") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const logoFile = formData.get("logo") as File | null;

    if (!name || !location) {
        return { error: "Dealership name and location are required" };
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.dealership.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    // Upload logo if provided
    let logoUrl: string | null = null;
    if (logoFile && logoFile.size > 0) {
        const supabase = await createClient();
        const ext = logoFile.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `dealerships/${user.id}/${slug}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from("profile-pictures")
            .upload(filePath, logoFile, { upsert: true });
        if (uploadError) {
            console.error("Error uploading dealership logo:", uploadError);
            return { error: "Error uploading logo" };
        }
        const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
        logoUrl = data.publicUrl;
    }

    const dealership = await prisma.dealership.create({
        data: {
            name,
            slug,
            location,
            operatingHours,
            phone,
            description,
            logoUrl,
            ownerId: user.id,
        },
    });

    revalidatePath("/dealerships");
    revalidatePath("/dealership/manage");
    return { dealershipId: dealership.id, slug: dealership.slug };
}

// ── Update Dealership ─────────────────────────────────────────────
export async function updateDealership(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    const dealershipId = (formData.get("dealershipId") as string)?.trim();
    if (!dealershipId) return { error: "Missing dealership ID" };

    const dealership = await prisma.dealership.findFirst({
        where: { id: dealershipId, ownerId: user.id },
    });
    if (!dealership) return { error: "Dealership not found or unauthorized" };

    const name = (formData.get("name") as string)?.trim() || dealership.name;
    const location = (formData.get("location") as string)?.trim() || dealership.location;
    const operatingHours = (formData.get("operatingHours") as string)?.trim() ?? dealership.operatingHours;
    const phone = (formData.get("phone") as string)?.trim() ?? dealership.phone;
    const description = (formData.get("description") as string)?.trim() ?? dealership.description;
    const logoFile = formData.get("logo") as File | null;

    let logoUrl = dealership.logoUrl;
    if (logoFile && logoFile.size > 0) {
        const supabase = await createClient();
        const ext = logoFile.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `dealerships/${user.id}/${dealership.slug}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from("profile-pictures")
            .upload(filePath, logoFile, { upsert: true });
        if (!uploadError) {
            const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
            logoUrl = data.publicUrl;
        }
    }

    await prisma.dealership.update({
        where: { id: dealershipId },
        data: { name, location, operatingHours, phone, description, logoUrl },
    });

    revalidatePath("/dealerships");
    revalidatePath(`/dealerships/${dealership.slug}`);
    revalidatePath("/dealership/manage");
    return { success: true };
}

// ── Get User's Dealership ─────────────────────────────────────────
export async function getUserDealership() {
    const user = await getCurrentUser();
    if (!user) return null;

    return prisma.dealership.findFirst({
        where: { ownerId: user.id },
        include: { _count: { select: { vehicles: true } } },
    });
}

// ── Add Vehicle to Catalog ────────────────────────────────────────
export async function addDealershipVehicle(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    const dealershipId = (formData.get("dealershipId") as string)?.trim();
    if (!dealershipId) return { error: "Missing dealership ID" };

    // Verify ownership
    const dealership = await prisma.dealership.findFirst({
        where: { id: dealershipId, ownerId: user.id },
    });
    if (!dealership) return { error: "Dealership not found or unauthorized" };

    const title = (formData.get("title") as string)?.trim();
    const make = (formData.get("make") as string)?.trim();
    const model = (formData.get("model") as string)?.trim();
    const year = parseInt((formData.get("year") as string) ?? "0", 10);
    const mileageRaw = (formData.get("mileage") as string)?.trim();
    const mileage = mileageRaw ? parseInt(mileageRaw, 10) : null;
    const price = parseFloat((formData.get("price") as string) ?? "0");
    const description = (formData.get("description") as string)?.trim() || null;
    const bodyType = (formData.get("bodyType") as string)?.trim() || null;
    const transmission = (formData.get("transmission") as string)?.trim() || null;
    const drivetrain = (formData.get("drivetrain") as string)?.trim() || null;
    const color = (formData.get("color") as string)?.trim() || null;
    const condition = (formData.get("condition") as string)?.trim() || "used";

    if (!title || !make || !model || !year || price <= 0) {
        return { error: "Title, make, model, year and price are required" };
    }

    // Handle photos
    const photoFiles: File[] = [];
    for (let i = 1; i <= 5; i++) {
        const file = formData.get(`photo${i}`) as File | null;
        if (file && file.size > 0) photoFiles.push(file);
    }

    const vehicle = await prisma.dealershipVehicle.create({
        data: {
            dealershipId,
            title,
            make,
            model,
            year,
            mileage,
            price,
            description,
            bodyType,
            transmission,
            drivetrain,
            color,
            condition,
            imageUrls: [],
        },
    });

    // Upload photos
    if (photoFiles.length > 0) {
        const supabase = await createClient();
        const imageUrls: string[] = [];
        for (let i = 0; i < photoFiles.length; i++) {
            const file = photoFiles[i];
            const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
            const filePath = `dealerships/${user.id}/${dealership.slug}/vehicles/${vehicle.id}/${i}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from("profile-pictures")
                .upload(filePath, file, { upsert: true });
            if (!uploadError) {
                const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
                imageUrls.push(data.publicUrl);
            }
        }
        if (imageUrls.length > 0) {
            await prisma.dealershipVehicle.update({
                where: { id: vehicle.id },
                data: { imageUrls },
            });
        }
    }

    revalidatePath("/dealership/manage");
    revalidatePath(`/dealerships/${dealership.slug}`);
    return { vehicleId: vehicle.id };
}

// ── Update Vehicle ────────────────────────────────────────────────
export async function updateDealershipVehicle(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    const vehicleId = (formData.get("vehicleId") as string)?.trim();
    if (!vehicleId) return { error: "Missing vehicle ID" };

    const vehicle = await prisma.dealershipVehicle.findUnique({
        where: { id: vehicleId },
        include: { dealership: true },
    });
    if (!vehicle || vehicle.dealership.ownerId !== user.id) {
        return { error: "Vehicle not found or unauthorized" };
    }

    const title = (formData.get("title") as string)?.trim() || vehicle.title;
    const make = (formData.get("make") as string)?.trim() || vehicle.make;
    const model = (formData.get("model") as string)?.trim() || vehicle.model;
    const year = parseInt((formData.get("year") as string) ?? String(vehicle.year), 10);
    const mileageRaw = (formData.get("mileage") as string)?.trim();
    const mileage = mileageRaw ? parseInt(mileageRaw, 10) : vehicle.mileage;
    const price = parseFloat((formData.get("price") as string) ?? String(vehicle.price));
    const description = (formData.get("description") as string)?.trim() ?? vehicle.description;
    const bodyType = (formData.get("bodyType") as string)?.trim() ?? vehicle.bodyType;
    const transmission = (formData.get("transmission") as string)?.trim() ?? vehicle.transmission;
    const drivetrain = (formData.get("drivetrain") as string)?.trim() ?? vehicle.drivetrain;
    const color = (formData.get("color") as string)?.trim() ?? vehicle.color;
    const condition = (formData.get("condition") as string)?.trim() ?? vehicle.condition;
    const status = (formData.get("status") as string)?.trim() ?? vehicle.status;

    await prisma.dealershipVehicle.update({
        where: { id: vehicleId },
        data: { title, make, model, year, mileage, price, description, bodyType, transmission, drivetrain, color, condition, status },
    });

    revalidatePath("/dealership/manage");
    revalidatePath(`/dealerships/${vehicle.dealership.slug}`);
    return { success: true };
}

// ── Delete Vehicle ────────────────────────────────────────────────
export async function deleteDealershipVehicle(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    const vehicleId = (formData.get("vehicleId") as string)?.trim();
    if (!vehicleId) return { error: "Missing vehicle ID" };

    const vehicle = await prisma.dealershipVehicle.findUnique({
        where: { id: vehicleId },
        include: { dealership: true },
    });
    if (!vehicle || vehicle.dealership.ownerId !== user.id) {
        return { error: "Vehicle not found or unauthorized" };
    }

    await prisma.dealershipVehicle.delete({ where: { id: vehicleId } });

    revalidatePath("/dealership/manage");
    revalidatePath(`/dealerships/${vehicle.dealership.slug}`);
    return { success: true };
}
