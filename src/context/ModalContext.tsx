"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductItem } from "@/data/products";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { PriceListModal } from "@/components/PriceListModal";
import { LoginModal } from "@/components/LoginModal";

interface ModalContextType {
  selectedProduct: ProductItem | null;
  openProductModal: (product: ProductItem) => void;
  closeProductModal: () => void;
  isPriceListModalOpen: boolean;
  openPriceListModal: () => void;
  closePriceListModal: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isPriceListModalOpen, setIsPriceListModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const openProductModal = (product: ProductItem) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  const openPriceListModal = () => setIsPriceListModalOpen(true);
  const closePriceListModal = () => setIsPriceListModalOpen(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        selectedProduct,
        openProductModal,
        closeProductModal,
        isPriceListModalOpen,
        openPriceListModal,
        closePriceListModal,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}

      {/* Global Modals rendered at root */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={closeProductModal}
        onOpenPriceList={() => {
          closeProductModal();
          openPriceListModal();
        }}
      />

      <PriceListModal
        isOpen={isPriceListModalOpen}
        onClose={closePriceListModal}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </ModalContext.Provider>
  );
};

export const useModals = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
