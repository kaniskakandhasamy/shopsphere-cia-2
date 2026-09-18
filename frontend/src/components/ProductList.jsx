import React from 'react';
import ProductCard from './ProductCard';
import { FiInbox } from 'react-icons/fi';

const ProductList = ({ products, loading, emptyMessage = 'No products found' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse flex flex-col space-y-3"
          >
            <div className="aspect-square bg-slate-200 rounded-xl w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-5 bg-slate-200 rounded w-4/5"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="pt-2 flex justify-between items-center">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-9 w-9 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 my-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FiInbox className="text-3xl" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{emptyMessage}</h3>
        <p className="text-sm text-slate-500 max-w-md mt-1">
          Try adjusting your search terms, changing the category filter, or resetting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
