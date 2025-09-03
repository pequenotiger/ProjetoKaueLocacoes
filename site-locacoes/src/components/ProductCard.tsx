import { Product } from "@/types";
import Link from "next/link";

// Adicionamos "export" aqui
export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-gray-700 text-base mb-4">
                    {product.description}
                </p>
                <Link 
                    href={`/products/${product.id}`} // Supondo que haverá uma página de detalhes do produto
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                    Ver detalhes
                </Link>
            </div>
        </div>
    );
}

// A linha "export default ProductCard;" foi removida.