import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/product";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
    // Await params for Next.js 15+
    const { id } = await params;

    await connectToDB();

    // Fetch product with variants
    // Since images are just strings or objects in schema, lean() is good but we need serialization for Client Component
    const productDoc = await Product.findById(id).lean();

    if (!productDoc) {
        notFound();
    }

    // Serialize MongoDB ID and dates
    const product = {
        ...productDoc,
        _id: productDoc._id.toString(),
        createdAt: productDoc.createdAt?.toISOString(),
        updatedAt: productDoc.updatedAt?.toISOString(),
        // Serialize images (handle if they are objects with _id)
        images: productDoc.images?.map(img => {
            if (typeof img === 'object' && img !== null) {
                return {
                    ...img,
                    _id: img._id ? img._id.toString() : undefined
                };
            }
            return img;
        }) || [],
        variants: productDoc.variants?.map(v => ({
            ...v,
            _id: v._id ? v._id.toString() : undefined,
            // Serialize variant images
            images: v.images?.map(img => {
                if (typeof img === 'object' && img !== null) {
                    return {
                        ...img,
                        _id: img._id ? img._id.toString() : undefined
                    };
                }
                return img;
            }) || []
        })) || []
    };

    return <ProductClient product={product} />;
}
