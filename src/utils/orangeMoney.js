export function formaterNumeroMvolaOuOrange(numero) {
  const chiffres = String(numero || "").replace(/\D/g, "");
  if (chiffres.startsWith("261") && chiffres.length >= 12) {
    return "0" + chiffres.slice(3, 12);
  }
  return chiffres.slice(0, 10);
}

export function construireLienUssdOrangeMoney(numeroVendeur, prixTotal) {
  const num = formaterNumeroMvolaOuOrange(numeroVendeur);
  const montant = Math.round(Number(prixTotal) || 0);
  if (!num || montant <= 0) return null;

  const codeBrut = `#144*1*1*${num}*${num}*${montant}*1#`;
  return {
    codeBrut,
    href: `tel:${codeBrut.replace(/#/g, "%23")}`,
  };
}

export function lancerPaiementOrangeMoney(numeroVendeur, prixTotal) {
  const ussd = construireLienUssdOrangeMoney(numeroVendeur, prixTotal);
  if (!ussd) {
    alert("Vérifiez le numéro du vendeur et le montant total avant de payer.");
    return false;
  }
  window.location.href = ussd.href;
  return true;
}
