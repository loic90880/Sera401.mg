import React from "react";
import { construireLienUssdOrangeMoney, lancerPaiementOrangeMoney } from "../utils/orangeMoney";

export default function BoutonOrangeMoney({
  numeroVendeur,
  montantTotal,
  onAvantPaiement,
  label = "Payer via Orange Money",
}) {
  const ussd = construireLienUssdOrangeMoney(numeroVendeur, montantTotal);

  const handleClick = (e) => {
    if (typeof onAvantPaiement === "function") onAvantPaiement();
    if (!ussd) {
      e.preventDefault();
      alert("Numéro vendeur ou montant invalide pour Orange Money.");
      return;
    }
    lancerPaiementOrangeMoney(numeroVendeur, montantTotal);
  };

  return (
    <div className="space-y-2 w-full">
      <button
        type="button"
        onClick={handleClick}
        className="w-full py-3 px-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-sm"
      >
        <span>{label}</span>
        {montantTotal > 0 && (
          <span className="text-sm font-semibold opacity-95">
            ({Math.round(Number(montantTotal)).toLocaleString("fr-FR")} Ar)
          </span>
        )}
      </button>
      {ussd && (
        <p className="text-xs text-gray-500 text-center break-all">
          Code généré : <span className="font-mono font-medium">{ussd.codeBrut}</span>
        </p>
      )}
    </div>
  );
}
