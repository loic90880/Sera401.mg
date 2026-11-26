import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, ShoppingCart, User, Store, Heart, Bell, Plus, Trash2, Edit3,
  CheckCircle, Truck, Package, CreditCard, MapPin, Star, DollarSign,
  AlertCircle, Eye, LogOut, ShieldCheck, Tag
} from 'lucide-react';

const BRAND = 'sera 401.mg';

const CATEGORIES = [
  'Téléphones et accessoires',
  'Informatique et électronique',
  'Mode et vêtements',
  'Beauté et parfumerie',
  'Maison et décoration',
  'Santé et matériel médical',
  'Électroménager',
  'Alimentation',
  'Automobile et accessoires',
  'Sport et loisirs'
];

const VILLES_MADAGASCAR = [
  { nom: 'Antananarivo', fraisDomicile: 5000, fraisRelais: 3000, transporteur: 'MadaExpress Tana' },
  { nom: 'Mahajanga', fraisDomicile: 12000, fraisRelais: 8000, transporteur: 'Boeny Logistics' },
  { nom: 'Toamasina', fraisDomicile: 12000, fraisRelais: 8000, transporteur: 'Est Rapide' },
  { nom: 'Antsirabe', fraisDomicile: 9000, fraisRelais: 6000, transporteur: 'Vakinankaratra Fret' },
  { nom: 'Fianarantsoa', fraisDomicile: 11000, fraisRelais: 7500, transporteur: 'Betsileo Transit' },
  { nom: 'Toliara', fraisDomicile: 15000, fraisRelais: 10000, transporteur: 'Sud Express' },
  { nom: 'Antsiranana', fraisDomicile: 16000, fraisRelais: 11000, transporteur: 'Nord Cargo' }
];

const METHODES_PAIEMENT = [
  { id: 'mvola', nom: 'MVola', code: '034 / 038', couleur: 'bg-yellow-500 text-black' },
  { id: 'orange', nom: 'Orange Money', code: '032 / 037', couleur: 'bg-orange-500 text-white' },
  { id: 'airtel', nom: 'Airtel Money', code: '033', couleur: 'bg-red-600 text-white' },
  { id: 'cod', nom: 'Paiement à la livraison', code: 'Espèces', couleur: 'bg-emerald-600 text-white' },
  { id: 'virement', nom: 'Virement bancaire', code: 'BNI / BOA / BFV', couleur: 'bg-slate-700 text-white' }
];

const STATUTS_COMMANDE = [
  'En attente de paiement',
  'Paiement confirmé',
  'Commande confirmée',
  'En préparation',
  'Expédiée',
  'En livraison',
  'Livrée',
  'Annulée'
];

const formatMGA = (montant) =>
  new Intl.NumberFormat('fr-MG', { maximumFractionDigits: 0 }).format(Number(montant) || 0) + ' Ar';

const lireFichierBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const chargerStorage = (cle, defaut) => {
  try {
    const brut = localStorage.getItem(`sera401mg_${cle}`);
    return brut ? JSON.parse(brut) : defaut;
  } catch {
    return defaut;
  }
};

const LogoMarque = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2.5 text-left focus:outline-none group">
    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
      <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
        <path d="M6 12L10 28H26L30 12H6Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M13 12V9C13 6.79086 14.7909 5 17 5H19C21.2091 5 23 6.79086 23 9V12" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="18" cy="20" r="3" fill="#FB923C" />
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
    </div>
    <div>
      <span className="text-lg font-extrabold tracking-tight text-emerald-700 block">{BRAND}</span>
      <span className="block text-[10px] font-semibold uppercase tracking-widest text-orange-500 -mt-1">
        Marketplace • Madagascar
      </span>
    </div>
  </button>
);

export default function App() {
  const [utilisateurs, setUtilisateurs] = useState(() => chargerStorage('users', []));
  const [utilisateurActif, setUtilisateurActif] = useState(() => chargerStorage('currentUser', null));
  const [boutiques, setBoutiques] = useState(() => chargerStorage('shops', []));
  const [produits, setProduits] = useState(() => chargerStorage('products', []));
  const [commandes, setCommandes] = useState(() => chargerStorage('orders', []));
  const [panier, setPanier] = useState(() => chargerStorage('cart', []));
  const [favoris, setFavoris] = useState(() => chargerStorage('wishlist', []));
  const [avis, setAvis] = useState(() => chargerStorage('reviews', []));
  const [notifications, setNotifications] = useState(() => chargerStorage('notifications', []));

  const [vue, setVue] = useState('accueil');
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('Toutes');
  const [villeFiltre, setVilleFiltre] = useState('Toutes');
  const [triCatalogue, setTriCatalogue] = useState('recent');
  const [produitSelectionneId, setProduitSelectionneId] = useState(null);
  const [boutiqueSelectionneeId, setBoutiqueSelectionneeId] = useState(null);
  const [ongletClient, setOngletClient] = useState('commandes');
  const [ongletVendeur, setOngletVendeur] = useState('apercu');
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem('sera401mg_users', JSON.stringify(utilisateurs)); }, [utilisateurs]);
  useEffect(() => { localStorage.setItem('sera401mg_currentUser', JSON.stringify(utilisateurActif)); }, [utilisateurActif]);
  useEffect(() => { localStorage.setItem('sera401mg_shops', JSON.stringify(boutiques)); }, [boutiques]);
  useEffect(() => { localStorage.setItem('sera401mg_products', JSON.stringify(produits)); }, [produits]);
  useEffect(() => { localStorage.setItem('sera401mg_orders', JSON.stringify(commandes)); }, [commandes]);
  useEffect(() => { localStorage.setItem('sera401mg_cart', JSON.stringify(panier)); }, [panier]);
  useEffect(() => { localStorage.setItem('sera401mg_wishlist', JSON.stringify(favoris)); }, [favoris]);
  useEffect(() => { localStorage.setItem('sera401mg_reviews', JSON.stringify(avis)); }, [avis]);
  useEffect(() => { localStorage.setItem('sera401mg_notifications', JSON.stringify(notifications)); }, [notifications]);

  const notifierToast = (message, type = 'succes') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const ajouterNotification = (userId, titre, message) => {
    setNotifications((prev) => [{
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      userId, titre, message, lu: false, date: new Date().toLocaleString('fr-FR')
    }, ...prev]);
  };

  const maBoutique = useMemo(
    () => (utilisateurActif ? boutiques.find((b) => b.proprietaireId === utilisateurActif.id) || null : null),
    [boutiques, utilisateurActif]
  );

  const mesNotifications = useMemo(
    () => (utilisateurActif ? notifications.filter((n) => n.userId === utilisateurActif.id) : []),
    [notifications, utilisateurActif]
  );

  const produitsFiltres = useMemo(() => {
    return produits
      .filter((p) => {
        const q = recherche.toLowerCase();
        const matchTexte = p.nom.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categorie.toLowerCase().includes(q);
        const matchCat = categorieFiltre === 'Toutes' || p.categorie === categorieFiltre;
        const matchVille = villeFiltre === 'Toutes' || p.ville === villeFiltre;
        return matchTexte && matchCat && matchVille;
      })
      .sort((a, b) => {
        const prixA = a.promo > 0 ? a.prix * (1 - a.promo / 100) : a.prix;
        const prixB = b.promo > 0 ? b.prix * (1 - b.promo / 100) : b.prix;
        if (triCatalogue === 'prix_asc') return prixA - prixB;
        if (triCatalogue === 'prix_desc') return prixB - prixA;
        if (triCatalogue === 'ventes') return (b.ventes || 0) - (a.ventes || 0);
        return b.creeLe - a.creeLe;
      });
  }, [produits, recherche, categorieFiltre, villeFiltre, triCatalogue]);

  const totalPanier = useMemo(() => {
    return panier.reduce((acc, item) => {
      const prod = produits.find((p) => p.id === item.produitId);
      if (!prod) return acc;
      const prixFinal = prod.promo > 0 ? prod.prix * (1 - prod.promo / 100) : prod.prix;
      return acc + prixFinal * item.quantite;
    }, 0);
  }, [panier, produits]);

  const ajouterAuPanier = (produit, quantite = 1) => {
    if (produit.stock <= 0) {
      notifierToast('Ce produit est en rupture de stock.', 'erreur');
      return;
    }
    setPanier((prev) => {
      const existant = prev.find((i) => i.produitId === produit.id);
      if (existant) {
        return prev.map((i) => (i.produitId === produit.id ? { ...i, quantite: Math.min(produit.stock, i.quantite + quantite) } : i));
      }
      return [...prev, { produitId: produit.id, quantite: Math.min(produit.stock, quantite) }];
    });
    notifierToast(`"${produit.nom}" ajouté au panier.`);
  };

  const basculerFavori = (produitId) => {
    if (!utilisateurActif) {
      notifierToast('Connectez-vous pour gérer vos favoris.', 'erreur');
      setVue('auth');
      return;
    }
    const cle = `${utilisateurActif.id}_${produitId}`;
    setFavoris((prev) => (prev.includes(cle) ? prev.filter((f) => f !== cle) : [...prev, cle]));
  };

  const estFavori = (produitId) => (utilisateurActif ? favoris.includes(`${utilisateurActif.id}_${produitId}`) : false);

  const CarteProduit = ({ produit }) => {
    const boutique = boutiques.find((b) => b.id === produit.boutiqueId);
    const prixFinal = produit.promo > 0 ? Math.round(produit.prix * (1 - produit.promo / 100)) : produit.prix;
    const avisProduit = avis.filter((a) => a.cibleId === produit.id && a.type === 'produit');
    const noteMoyenne = avisProduit.length ? (avisProduit.reduce((s, a) => s + a.note, 0) / avisProduit.length).toFixed(1) : null;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group">
        <div onClick={() => { setProduitSelectionneId(produit.id); setVue('produit'); }} className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer">
          {produit.image ? (
            <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
              <Package className="w-10 h-10 mb-1" />
              <span className="text-xs text-center">{produit.categorie}</span>
            </div>
          )}
          {produit.promo > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">-{produit.promo}%</span>
          )}
          {produit.stock <= 0 && (
            <span className="absolute inset-0 bg-black/50 text-white font-bold text-sm flex items-center justify-center">Rupture de stock</span>
          )}
          <button onClick={(e) => { e.stopPropagation(); basculerFavori(produit.id); }} className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center">
            <Heart className={`w-4 h-4 ${estFavori(produit.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span className="truncate max-w-[65%]">{boutique?.nom || 'Boutique'}</span>
              <span className="flex items-center gap-0.5 text-emerald-700 font-medium"><MapPin className="w-3 h-3" /> {produit.ville}</span>
            </div>
            <h3 onClick={() => { setProduitSelectionneId(produit.id); setVue('produit'); }} className="font-semibold text-gray-800 text-sm line-clamp-2 cursor-pointer hover:text-emerald-700 mb-1.5">
              {produit.nom}
            </h3>
            {noteMoyenne && (
              <div className="flex items-center gap-1 text-xs text-amber-500 mb-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-semibold text-gray-700">{noteMoyenne}</span>
                <span className="text-gray-400">({avisProduit.length})</span>
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-gray-50">
            <div className="flex items-baseline gap-2 mb-2.5">
              <span className="text-base font-extrabold text-emerald-700">{formatMGA(prixFinal)}</span>
              {produit.promo > 0 && <span className="text-xs text-gray-400 line-through">{formatMGA(produit.prix)}</span>}
            </div>
            <button
              onClick={() => ajouterAuPanier(produit, 1)}
              disabled={produit.stock <= 0}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VueAuthentification = () => {
    const [modeInscription, setModeInscription] = useState(false);
    const [form, setForm] = useState({ nom: '', email: '', telephone: '', ville: 'Antananarivo', quartier: '', motDePasse: '', role: 'client' });

    const soumettre = (e) => {
      e.preventDefault();
      if (modeInscription) {
        if (utilisateurs.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
          notifierToast('Cet email est déjà utilisé.', 'erreur');
          return;
        }
        const nouvelUtilisateur = { id: 'usr_' + Date.now(), ...form, creeLe: new Date().toLocaleDateString('fr-FR') };
        setUtilisateurs((prev) => [...prev, nouvelUtilisateur]);
        setUtilisateurActif(nouvelUtilisateur);
        ajouterNotification(nouvelUtilisateur.id, `Bienvenue sur ${BRAND}`, 'Votre compte est prêt.');
        notifierToast('Compte créé avec succès !');
        setVue(form.role === 'vendeur' ? 'vendeur' : 'accueil');
      } else {
        const trouve = utilisateurs.find((u) => u.email.toLowerCase() === form.email.toLowerCase() && u.motDePasse === form.motDePasse);
        if (!trouve) {
          notifierToast('Email ou mot de passe incorrect.', 'erreur');
          return;
        }
        setUtilisateurActif(trouve);
        notifierToast(`Bon retour, ${trouve.nom} !`);
        setVue('accueil');
      }
    };

    return (
      <div className="max-w-md mx-auto my-10 bg-white rounded-3xl shadow-lg border border-gray-100 p-7">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">{modeInscription ? `Créer un compte ${BRAND}` : `Connexion à ${BRAND}`}</h2>
          <p className="text-sm text-gray-500 mt-1">Achetez et vendez partout à Madagascar</p>
        </div>
        <form onSubmit={soumettre} className="space-y-4">
          {modeInscription && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet</label>
                <input required type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone</label>
                  <input required type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="034 00 000 00" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ville</label>
                  <select value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                    {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Quartier / Adresse</label>
                <input required type="text" value={form.quartier} onChange={(e) => setForm({ ...form, quartier: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setForm({ ...form, role: 'client' })} className={`py-2 px-3 rounded-xl text-xs font-bold border ${form.role === 'client' ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'border-gray-200 text-gray-600'}`}>Client Acheteur</button>
                <button type="button" onClick={() => setForm({ ...form, role: 'vendeur' })} className={`py-2 px-3 rounded-xl text-xs font-bold border ${form.role === 'vendeur' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600'}`}>Vendeur / Boutique</button>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse e-mail</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input required type="password" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md">
            {modeInscription ? "S'inscrire gratuitement" : 'Se connecter'}
          </button>
        </form>
        <div className="mt-5 text-center text-xs text-gray-600">
          {modeInscription ? 'Déjà inscrit ?' : 'Nouveau ici ?'}{' '}
          <button onClick={() => setModeInscription(!modeInscription)} className="text-orange-600 font-bold hover:underline">
            {modeInscription ? 'Se connecter' : 'Créer un compte'}
          </button>
        </div>
      </div>
    );
  };

  const VueEspaceVendeur = () => {
    const [formBoutique, setFormBoutique] = useState({
      nom: maBoutique?.nom || '',
      description: maBoutique?.description || '',
      ville: maBoutique?.ville || utilisateurActif?.ville || 'Antananarivo',
      telephonePaiement: maBoutique?.telephonePaiement || utilisateurActif?.telephone || '',
      logo: maBoutique?.logo || ''
    });
    const [formProduit, setFormProduit] = useState({
      id: null, nom: '', categorie: CATEGORIES[0], prix: '', promo: 0, stock: 1,
      ville: maBoutique?.ville || 'Antananarivo', description: '', image: ''
    });

    if (!utilisateurActif) {
      return (
        <div className="max-w-lg mx-auto my-12 bg-white p-8 rounded-3xl text-center shadow-sm border border-gray-100">
          <Store className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Ouvrez votre boutique sur {BRAND}</h2>
          <p className="text-sm text-gray-500 mt-2 mb-5">Connectez-vous ou inscrivez-vous gratuitement pour vendre vos produits.</p>
          <button onClick={() => setVue('auth')} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm">Connexion / Inscription</button>
        </div>
      );
    }

    const sauvegarderBoutique = (e) => {
      e.preventDefault();
      if (maBoutique) {
        setBoutiques((prev) => prev.map((b) => (b.id === maBoutique.id ? { ...b, ...formBoutique } : b)));
        notifierToast('Boutique mise à jour.');
      } else {
        setBoutiques((prev) => [...prev, { id: 'shp_' + Date.now(), proprietaireId: utilisateurActif.id, ...formBoutique, creeLe: new Date().toLocaleDateString('fr-FR') }]);
        notifierToast('Votre boutique est créée !');
      }
    };

    if (!maBoutique) {
      return (
        <div className="max-w-xl mx-auto my-8 bg-white rounded-3xl shadow-md border border-gray-100 p-7">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Créer ma boutique gratuitement</h2>
          <form onSubmit={sauvegarderBoutique} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nom de la boutique *</label>
              <input required type="text" value={formBoutique.nom} onChange={(e) => setFormBoutique({ ...formBoutique, nom: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ville *</label>
                <select value={formBoutique.ville} onChange={(e) => setFormBoutique({ ...formBoutique, ville: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                  {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Numéro Mobile Money *</label>
                <input required type="tel" value={formBoutique.telephonePaiement} onChange={(e) => setFormBoutique({ ...formBoutique, telephonePaiement: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Logo de la boutique</label>
              <input type="file" accept="image/*" onChange={async (e) => setFormBoutique({ ...formBoutique, logo: await lireFichierBase64(e.target.files[0]) })} className="w-full text-xs text-gray-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
              <textarea required rows={3} value={formBoutique.description} onChange={(e) => setFormBoutique({ ...formBoutique, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm">Lancer ma boutique</button>
          </form>
        </div>
      );
    }

    const mesProduits = produits.filter((p) => p.boutiqueId === maBoutique.id);
    const mesCommandesVendeur = commandes.filter((c) => c.articles.some((a) => a.boutiqueId === maBoutique.id));
    const revenuTotal = mesCommandesVendeur
      .filter((c) => c.statut !== 'Annulée' && c.statut !== 'En attente de paiement')
      .reduce((sum, c) => sum + c.articles.filter((a) => a.boutiqueId === maBoutique.id).reduce((s, a) => s + a.prixUnitaire * a.quantite, 0), 0);

    const enregistrerProduit = (e) => {
      e.preventDefault();
      const payload = {
        nom: formProduit.nom, categorie: formProduit.categorie, prix: Number(formProduit.prix),
        promo: Number(formProduit.promo) || 0, stock: Number(formProduit.stock),
        ville: formProduit.ville, description: formProduit.description, image: formProduit.image
      };
      if (formProduit.id) {
        setProduits((prev) => prev.map((p) => (p.id === formProduit.id ? { ...p, ...payload } : p)));
        notifierToast('Produit mis à jour.');
      } else {
        setProduits((prev) => [{ id: 'prd_' + Date.now(), boutiqueId: maBoutique.id, ...payload, ventes: 0, creeLe: Date.now() }, ...prev]);
        notifierToast('Produit publié !');
      }
      setFormProduit({ id: null, nom: '', categorie: CATEGORIES[0], prix: '', promo: 0, stock: 1, ville: maBoutique.ville, description: '', image: '' });
      setOngletVendeur('produits');
    };

    const changerStatutCommande = (commande, nouveauStatut) => {
      setCommandes((prev) => prev.map((c) => (c.id === commande.id ? { ...c, statut: nouveauStatut } : c)));
      ajouterNotification(commande.clientId, `Commande #${commande.id.slice(-6)} : ${nouveauStatut}`, `${maBoutique.nom} a mis à jour votre commande.`);
      notifierToast(`Statut : ${nouveauStatut}`);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 overflow-hidden flex items-center justify-center">
              {maBoutique.logo ? <img src={maBoutique.logo} alt="" className="w-full h-full object-cover" /> : <Store className="w-8 h-8 text-emerald-700" />}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">{maBoutique.nom}</h1>
              <p className="text-xs text-gray-500">{maBoutique.ville} • {maBoutique.telephonePaiement}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'apercu', label: 'Tableau de bord' },
              { id: 'produits', label: `Produits (${mesProduits.length})` },
              { id: 'publier', label: '+ Publier' },
              { id: 'commandes', label: `Commandes (${mesCommandesVendeur.length})` },
              { id: 'parametres', label: 'Paramètres' }
            ].map((t) => (
              <button key={t.id} onClick={() => setOngletVendeur(t.id)} className={`px-4 py-2 rounded-xl text-xs font-bold ${ongletVendeur === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {ongletVendeur === 'apercu' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Revenus confirmés</span>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatMGA(revenuTotal)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Commandes</span>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{mesCommandesVendeur.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Produits actifs</span>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{mesProduits.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Stock faible (≤ 3)</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{mesProduits.filter((p) => p.stock <= 3).length}</p>
            </div>
          </div>
        )}

        {ongletVendeur === 'produits' && (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-600 uppercase">
                  <th className="p-4">Produit</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mesProduits.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4 font-semibold">{p.nom}</td>
                    <td className="p-4 font-bold text-emerald-700">{formatMGA(p.prix)} {p.promo > 0 && `(-${p.promo}%)`}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => { setFormProduit(p); setOngletVendeur('publier'); }} className="p-2 rounded-lg bg-blue-50 text-blue-600"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setProduits((prev) => prev.filter((item) => item.id !== p.id))} className="p-2 rounded-lg bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {ongletVendeur === 'publier' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 border border-gray-100">
            <h2 className="text-lg font-extrabold mb-4">{formProduit.id ? 'Modifier le produit' : 'Publier un produit'}</h2>
            <form onSubmit={enregistrerProduit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nom *</label>
                <input required type="text" value={formProduit.nom} onChange={(e) => setFormProduit({ ...formProduit, nom: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Catégorie *</label>
                  <select value={formProduit.categorie} onChange={(e) => setFormProduit({ ...formProduit, categorie: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Ville *</label>
                  <select value={formProduit.ville} onChange={(e) => setFormProduit({ ...formProduit, ville: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                    {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Prix (Ar) *</label>
                  <input required type="number" min="100" value={formProduit.prix} onChange={(e) => setFormProduit({ ...formProduit, prix: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Promo (%)</label>
                  <input type="number" min="0" max="90" value={formProduit.promo} onChange={(e) => setFormProduit({ ...formProduit, promo: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Stock *</label>
                  <input required type="number" min="0" value={formProduit.stock} onChange={(e) => setFormProduit({ ...formProduit, stock: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Photo</label>
                <input type="file" accept="image/*" onChange={async (e) => setFormProduit({ ...formProduit, image: await lireFichierBase64(e.target.files[0]) })} className="w-full text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description *</label>
                <textarea required rows={3} value={formProduit.description} onChange={(e) => setFormProduit({ ...formProduit, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm">Enregistrer</button>
            </form>
          </div>
        )}

        {ongletVendeur === 'commandes' && (
          <div className="space-y-4">
            {mesCommandesVendeur.map((cmd) => (
              <div key={cmd.id} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">#{cmd.id.slice(-6)} — {cmd.clientNom} ({cmd.clientTelephone})</p>
                    <p className="text-xs text-gray-500">{cmd.typeLivraison} : {cmd.ville}, {cmd.quartier} ({cmd.transporteur})</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">{cmd.statut}</span>
                    <p className="text-sm font-extrabold text-emerald-700 mt-1">{formatMGA(cmd.total)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-xs flex flex-wrap justify-between items-center gap-2">
                  <span>Paiement : <strong>{cmd.methodePaiement}</strong> ({cmd.modePaiement}) {cmd.referencePaiement && `• Réf: ${cmd.referencePaiement}`}</span>
                  {cmd.preuvePaiement && (
                    <a href={cmd.preuvePaiement} download={`preuve_${cmd.id.slice(-6)}.png`} className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                      Télécharger preuve
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  {STATUTS_COMMANDE.map((st) => (
                    <button key={st} onClick={() => changerStatutCommande(cmd, st)} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${cmd.statut === st ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {ongletVendeur === 'parametres' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 border border-gray-100">
            <h2 className="text-lg font-extrabold mb-4">Paramètres boutique</h2>
            <form onSubmit={sauvegarderBoutique} className="space-y-4">
              <input required type="text" value={formBoutique.nom} onChange={(e) => setFormBoutique({ ...formBoutique, nom: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              <input required type="tel" value={formBoutique.telephonePaiement} onChange={(e) => setFormBoutique({ ...formBoutique, telephonePaiement: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              <textarea rows={3} value={formBoutique.description} onChange={(e) => setFormBoutique({ ...formBoutique, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm">Enregistrer</button>
            </form>
          </div>
        )}
      </div>
    );
  };

  const VueCheckout = () => {
    const [ville, setVille] = useState(utilisateurActif?.ville || 'Antananarivo');
    const [quartier, setQuartier] = useState(utilisateurActif?.quartier || '');
    const [typeLivraison, setTypeLivraison] = useState('domicile');
    const [methode, setMethode] = useState('mvola');
    const [modePaiement, setModePaiement] = useState('automatique');
    const [referencePaiement, setReferencePaiement] = useState('');
    const [preuvePaiement, setPreuvePaiement] = useState('');

    if (!utilisateurActif) {
      return (
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl text-center shadow">
          <h2 className="text-lg font-bold mb-3">Connectez-vous pour commander</h2>
          <button onClick={() => setVue('auth')} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm">Connexion</button>
        </div>
      );
    }

    const infoVille = VILLES_MADAGASCAR.find((v) => v.nom === ville) || VILLES_MADAGASCAR[0];
    const fraisLivraison = typeLivraison === 'domicile' ? infoVille.fraisDomicile : infoVille.fraisRelais;
    const totalGlobal = totalPanier + fraisLivraison;

    const validerCommande = (e) => {
      e.preventDefault();
      if (panier.length === 0) return;

      const articlesCommande = panier.map((item) => {
        const prod = produits.find((p) => p.id === item.produitId);
        const prixUnitaire = prod.promo > 0 ? Math.round(prod.prix * (1 - prod.promo / 100)) : prod.prix;
        return { produitId: prod.id, boutiqueId: prod.boutiqueId, nom: prod.nom, quantite: item.quantite, prixUnitaire };
      });

      const statutInitial =
        methode === 'cod' ? 'Commande confirmée'
          : modePaiement === 'automatique' && referencePaiement.trim() ? 'Paiement confirmé'
            : 'En attente de paiement';

      const nouvelleCommande = {
        id: 'CMD_' + Date.now(),
        clientId: utilisateurActif.id,
        clientNom: utilisateurActif.nom,
        clientTelephone: utilisateurActif.telephone,
        articles: articlesCommande,
        sousTotal: totalPanier,
        fraisLivraison,
        total: totalGlobal,
        ville,
        quartier,
        typeLivraison: typeLivraison === 'domicile' ? 'Livraison à domicile' : 'Point relais',
        transporteur: infoVille.transporteur,
        methodePaiement: METHODES_PAIEMENT.find((m) => m.id === methode)?.nom,
        modePaiement: methode === 'cod' ? 'À la livraison' : modePaiement === 'automatique' ? 'Automatique' : 'Manuel',
        referencePaiement,
        preuvePaiement,
        statut: statutInitial,
        date: new Date().toLocaleString('fr-FR')
      };

      setProduits((prev) =>
        prev.map((p) => {
          const achete = articlesCommande.find((a) => a.produitId === p.id);
          return achete ? { ...p, stock: Math.max(0, p.stock - achete.quantite), ventes: (p.ventes || 0) + achete.quantite } : p;
        })
      );

      setCommandes((prev) => [nouvelleCommande, ...prev]);
      setPanier([]);
      ajouterNotification(utilisateurActif.id, 'Commande enregistrée', `Commande #${nouvelleCommande.id.slice(-6)} créée.`);
      notifierToast('Commande validée !');
      setOngletClient('commandes');
      setVue('client');
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-6">Paiement & Livraison</h1>
        <form onSubmit={validerCommande} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-emerald-600" /> Livraison</h2>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setTypeLivraison('domicile')} className={`p-3 rounded-2xl border text-left ${typeLivraison === 'domicile' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                  <p className="font-bold text-xs">À domicile</p>
                  <p className="text-xs text-emerald-700 font-semibold">{formatMGA(infoVille.fraisDomicile)}</p>
                </button>
                <button type="button" onClick={() => setTypeLivraison('relais')} className={`p-3 rounded-2xl border text-left ${typeLivraison === 'relais' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                  <p className="font-bold text-xs">Point relais</p>
                  <p className="text-xs text-emerald-700 font-semibold">{formatMGA(infoVille.fraisRelais)}</p>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={ville} onChange={(e) => setVille(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                  {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
                </select>
                <input required type="text" value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Quartier / Point relais" className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <p className="text-xs text-gray-500">Transporteur : <strong>{infoVille.transporteur}</strong></p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-500" /> Paiement</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {METHODES_PAIEMENT.map((m) => (
                  <button key={m.id} type="button" onClick={() => setMethode(m.id)} className={`p-3 rounded-2xl border text-left ${methode === m.id ? 'border-orange-500 bg-orange-50/40' : 'border-gray-200'}`}>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${m.couleur}`}>{m.nom}</span>
                    <p className="text-[11px] text-gray-500">{m.code}</p>
                  </button>
                ))}
              </div>

              {methode !== 'cod' && (
                <div className="pt-3 border-t space-y-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setModePaiement('automatique')} className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border ${modePaiement === 'automatique' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200'}`}>Automatique (Réf.)</button>
                    <button type="button" onClick={() => setModePaiement('manuel')} className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border ${modePaiement === 'manuel' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200'}`}>Manuel (Preuve)</button>
                  </div>
                  {modePaiement === 'automatique' ? (
                    <input required type="text" value={referencePaiement} onChange={(e) => setReferencePaiement(e.target.value)} placeholder="Référence transaction" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  ) : (
                    <input required type="file" accept="image/*" onChange={async (e) => setPreuvePaiement(await lireFichierBase64(e.target.files[0]))} className="w-full text-xs" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 h-fit space-y-4">
            <div className="flex justify-between text-xs"><span>Articles</span><span>{formatMGA(totalPanier)}</span></div>
            <div className="flex justify-between text-xs"><span>Livraison</span><span>{formatMGA(fraisLivraison)}</span></div>
            <div className="flex justify-between font-extrabold text-base border-t pt-3"><span>Total</span><span className="text-emerald-700">{formatMGA(totalGlobal)}</span></div>
            <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm">Confirmer la commande</button>
          </div>
        </form>
      </div>
    );
  };

  const VueEspaceClient = () => {
    const [profilForm, setProfilForm] = useState({
      nom: utilisateurActif?.nom || '', telephone: utilisateurActif?.telephone || '',
      ville: utilisateurActif?.ville || 'Antananarivo', quartier: utilisateurActif?.quartier || ''
    });

    if (!utilisateurActif) {
      return (
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl text-center shadow">
          <button onClick={() => setVue('auth')} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm">Se connecter</button>
        </div>
      );
    }

    const mesCommandes = commandes.filter((c) => c.clientId === utilisateurActif.id);
    const mesProduitsFavoris = produits.filter((p) => favoris.includes(`${utilisateurActif.id}_${p.id}`));

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold">{utilisateurActif.nom}</h1>
            <p className="text-xs text-gray-500">{utilisateurActif.ville} • {utilisateurActif.quartier}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'commandes', label: `Commandes (${mesCommandes.length})` },
              { id: 'favoris', label: `Favoris (${mesProduitsFavoris.length})` },
              { id: 'paiements', label: 'Paiements' },
              { id: 'notifications', label: `Notifications (${mesNotifications.length})` },
              { id: 'profil', label: 'Profil' }
            ].map((t) => (
              <button key={t.id} onClick={() => setOngletClient(t.id)} className={`px-4 py-2 rounded-xl text-xs font-bold ${ongletClient === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {ongletClient === 'commandes' && (
          <div className="space-y-4">
            {mesCommandes.map((cmd) => (
              <div key={cmd.id} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-sm">#{cmd.id.slice(-6)} • {cmd.date}</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{cmd.statut}</span>
                </div>
                <p className="text-xs text-gray-500">{cmd.typeLivraison} : {cmd.ville}, {cmd.quartier} ({cmd.transporteur})</p>
                <p className="text-sm font-extrabold text-emerald-700">{formatMGA(cmd.total)}</p>
              </div>
            ))}
          </div>
        )}

        {ongletClient === 'favoris' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mesProduitsFavoris.map((p) => <CarteProduit key={p.id} produit={p} />)}
          </div>
        )}

        {ongletClient === 'paiements' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-2 text-xs">
            {mesCommandes.map((c) => (
              <div key={c.id} className="flex justify-between py-2 border-b">
                <span>#{c.id.slice(-6)} — {c.methodePaiement} ({c.modePaiement})</span>
                <span className="font-bold text-emerald-700">{formatMGA(c.total)}</span>
              </div>
            ))}
          </div>
        )}

        {ongletClient === 'notifications' && (
          <div className="space-y-2">
            {mesNotifications.map((n) => (
              <div key={n.id} className="bg-white p-4 rounded-2xl border border-gray-100 text-xs">
                <p className="font-bold">{n.titre}</p>
                <p className="text-gray-600">{n.message}</p>
              </div>
            ))}
          </div>
        )}

        {ongletClient === 'profil' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const maj = { ...utilisateurActif, ...profilForm };
            setUtilisateurActif(maj);
            setUtilisateurs((prev) => prev.map((u) => (u.id === maj.id ? maj : u)));
            notifierToast('Profil mis à jour.');
          }} className="max-w-lg bg-white rounded-3xl p-6 border border-gray-100 space-y-3">
            <input required type="text" value={profilForm.nom} onChange={(e) => setProfilForm({ ...profilForm, nom: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <input required type="tel" value={profilForm.telephone} onChange={(e) => setProfilForm({ ...profilForm, telephone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <select value={profilForm.ville} onChange={(e) => setProfilForm({ ...profilForm, ville: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
            </select>
            <input required type="text" value={profilForm.quartier} onChange={(e) => setProfilForm({ ...profilForm, quartier: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm">Enregistrer</button>
          </form>
        )}
      </div>
    );
  };

  const VueDetailProduit = () => {
    const produit = produits.find((p) => p.id === produitSelectionneId);
    const [note, setNote] = useState(5);
    const [commentaire, setCommentaire] = useState('');
    const [cibleAvis, setCibleAvis] = useState('produit');
    if (!produit) return null;
    const boutique = boutiques.find((b) => b.id === produit.boutiqueId);
    const prixFinal = produit.promo > 0 ? Math.round(produit.prix * (1 - produit.promo / 100)) : produit.prix;
    const avisLies = avis.filter((a) => a.cibleId === produit.id || a.cibleId === boutique?.id);

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <button onClick={() => setVue('accueil')} className="text-xs font-bold text-emerald-700">← Retour</button>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
            {produit.image ? <img src={produit.image} alt="" className="w-full h-full object-cover" /> : <Package className="w-14 h-14 text-gray-300" />}
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-700">{produit.categorie}</span>
            <h1 className="text-2xl font-extrabold">{produit.nom}</h1>
            <p className="text-2xl font-extrabold text-emerald-700">{formatMGA(prixFinal)}</p>
            <p className="text-sm text-gray-600">{produit.description}</p>
            {boutique && (
              <button onClick={() => { setBoutiqueSelectionneeId(boutique.id); setVue('boutique'); }} className="text-xs font-bold text-orange-600 underline">
                Boutique : {boutique.nom} ({boutique.ville})
              </button>
            )}
            <button onClick={() => ajouterAuPanier(produit, 1)} className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm">
              Ajouter au panier
            </button>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4">
          <h3 className="font-bold">Avis ({avisLies.length})</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!utilisateurActif) { setVue('auth'); return; }
            setAvis((prev) => [{ id: 'rev_' + Date.now(), type: cibleAvis, cibleId: cibleAvis === 'produit' ? produit.id : boutique?.id, auteurNom: utilisateurActif.nom, note: Number(note), commentaire, date: new Date().toLocaleDateString('fr-FR') }, ...prev]);
            setCommentaire('');
            notifierToast('Avis publié.');
          }} className="space-y-3">
            <div className="flex gap-2">
              <button type="button" onClick={() => setCibleAvis('produit')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${cibleAvis === 'produit' ? 'bg-emerald-50 border-emerald-600' : ''}`}>Produit</button>
              <button type="button" onClick={() => setCibleAvis('vendeur')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${cibleAvis === 'vendeur' ? 'bg-orange-50 border-orange-500' : ''}`}>Vendeur</button>
            </div>
            <select value={note} onChange={(e) => setNote(e.target.value)} className="px-3 py-2 rounded-xl border text-sm bg-white">
              <option value="5">5/5</option><option value="4">4/5</option><option value="3">3/5</option><option value="2">2/5</option><option value="1">1/5</option>
            </select>
            <textarea required rows={2} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border text-sm" />
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Publier</button>
          </form>
          {avisLies.map((a) => (
            <div key={a.id} className="p-3 rounded-xl bg-gray-50 text-xs">
              <strong>{a.auteurNom}</strong> ({a.type}) — {'★'.repeat(a.note)}
              <p className="mt-1">{a.commentaire}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const VueVitrineBoutique = () => {
    const boutique = boutiques.find((b) => b.id === boutiqueSelectionneeId);
    if (!boutique) return null;
    const produitsBoutique = produits.filter((p) => p.boutiqueId === boutique.id);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-emerald-700 text-white rounded-3xl p-7">
          <h1 className="text-2xl font-extrabold">{boutique.nom}</h1>
          <p className="text-xs text-emerald-100">{boutique.ville}</p>
          <p className="text-sm mt-2">{boutique.description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {produitsBoutique.map((p) => <CarteProduit key={p.id} produit={p} />)}
        </div>
      </div>
    );
  };

  const produitsPromo = produits.filter((p) => p.promo > 0);
  const meilleuresVentes = [...produits].sort((a, b) => (b.ventes || 0) - (a.ventes || 0)).slice(0, 5);
  const nouveauxProduits = [...produits].sort((a, b) => b.creeLe - a.creeLe).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-xs font-bold flex items-center gap-2 ${toast.type === 'erreur' ? 'bg-red-600' : 'bg-emerald-700'}`}>
          <CheckCircle className="w-4 h-4" /> {toast.message}
        </div>
      )}

      <div className="bg-emerald-900 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>{BRAND} — Marketplace de Madagascar</span>
          <button onClick={() => setVue('vendeur')} className="text-orange-300 font-bold hover:underline">Ouvrir une boutique</button>
        </div>
      </div>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <LogoMarque onClick={() => { setCategorieFiltre('Toutes'); setVue('accueil'); }} />

          <div className="hidden md:flex flex-1 max-w-xl items-center bg-gray-100 rounded-2xl px-3.5 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); if (vue !== 'catalogue') setVue('catalogue'); }}
              placeholder={`Rechercher sur ${BRAND}...`}
              className="w-full bg-transparent text-sm outline-none"
            />
            <select value={villeFiltre} onChange={(e) => setVilleFiltre(e.target.value)} className="text-xs font-semibold text-gray-600 bg-transparent border-l pl-2 ml-2 outline-none">
              <option value="Toutes">Tout Madagascar</option>
              {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setVue('vendeur')} className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold">
              <Store className="w-4 h-4" /> Vendeur
            </button>
            {utilisateurActif ? (
              <>
                <button onClick={() => { setOngletClient('notifications'); setVue('client'); }} className="relative p-2.5 rounded-xl bg-gray-100">
                  <Bell className="w-4 h-4" />
                </button>
                <button onClick={() => setVue('client')} className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <User className="w-4 h-4" /> {utilisateurActif.nom.split(' ')[0]}
                </button>
                <button onClick={() => { setUtilisateurActif(null); setVue('accueil'); }} className="p-2.5 rounded-xl text-gray-400 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => setVue('auth')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Connexion</button>
            )}
            <button onClick={() => setVue('panier')} className="relative p-2.5 rounded-xl bg-orange-500 text-white">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">
                {panier.reduce((s, i) => s + i.quantite, 0)}
              </span>
            </button>
          </div>
        </div>

        <nav className="border-t border-gray-100 bg-white overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 whitespace-nowrap">
            <button onClick={() => { setCategorieFiltre('Toutes'); setVue('catalogue'); }} className={`px-3 py-1 rounded-lg text-xs font-bold ${categorieFiltre === 'Toutes' && vue === 'catalogue' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              Toutes les catégories
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => { setCategorieFiltre(cat); setVue('catalogue'); }} className={`px-3 py-1 rounded-lg text-xs ${categorieFiltre === cat && vue === 'catalogue' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:bg-emerald-50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {vue === 'auth' && <VueAuthentification />}
        {vue === 'vendeur' && <VueEspaceVendeur />}
        {vue === 'client' && <VueEspaceClient />}
        {vue === 'checkout' && <VueCheckout />}
        {vue === 'produit' && <VueDetailProduit />}
        {vue === 'boutique' && <VueVitrineBoutique />}

        {vue === 'panier' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-extrabold mb-6">Panier</h1>
            {panier.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border">Panier vide.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {panier.map((item) => {
                    const prod = produits.find((p) => p.id === item.produitId);
                    if (!prod) return null;
                    const prixFinal = prod.promo > 0 ? Math.round(prod.prix * (1 - prod.promo / 100)) : prod.prix;
                    return (
                      <div key={item.produitId} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{prod.nom}</p>
                          <p className="text-xs font-extrabold text-emerald-700">{formatMGA(prixFinal)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setPanier((prev) => prev.map((i) => i.produitId === prod.id ? { ...i, quantite: Math.max(1, i.quantite - 1) } : i))} className="w-7 h-7 rounded bg-gray-100 font-bold">-</button>
                          <span className="text-xs font-bold">{item.quantite}</span>
                          <button onClick={() => setPanier((prev) => prev.map((i) => i.produitId === prod.id ? { ...i, quantite: Math.min(prod.stock, i.quantite + 1) } : i))} className="w-7 h-7 rounded bg-gray-100 font-bold">+</button>
                          <button onClick={() => setPanier((prev) => prev.filter((i) => i.produitId !== prod.id))} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white p-6 rounded-3xl border h-fit space-y-4">
                  <div className="flex justify-between font-bold"><span>Total</span><span className="text-emerald-700">{formatMGA(totalPanier)}</span></div>
                  <button onClick={() => setVue('checkout')} className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm">Commander</button>
                </div>
              </div>
            )}
          </div>
        )}

        {vue === 'catalogue' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-2xl border">
              <h1 className="font-extrabold">{categorieFiltre === 'Toutes' ? 'Catalogue' : categorieFiltre} ({produitsFiltres.length})</h1>
              <div className="flex gap-2">
                <select value={villeFiltre} onChange={(e) => setVilleFiltre(e.target.value)} className="px-3 py-2 rounded-xl border text-xs bg-white">
                  <option value="Toutes">Toutes les villes</option>
                  {VILLES_MADAGASCAR.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
                </select>
                <select value={triCatalogue} onChange={(e) => setTriCatalogue(e.target.value)} className="px-3 py-2 rounded-xl border text-xs bg-white">
                  <option value="recent">Récents</option>
                  <option value="prix_asc">Prix ↑</option>
                  <option value="prix_desc">Prix ↓</option>
                  <option value="ventes">Ventes</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {produitsFiltres.map((p) => <CarteProduit key={p.id} produit={p} />)}
            </div>
          </div>
        )}

        {vue === 'accueil' && (
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
            <section className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-orange-500 text-white p-8 md:p-12 shadow-lg">
              <div className="max-w-2xl space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold">{BRAND} • Madagascar</span>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Achetez et vendez partout à Madagascar.</h1>
                <p className="text-sm md:text-base text-emerald-50">MVola, Orange Money, Airtel Money, virement ou paiement à la livraison. Livraison à domicile ou point relais.</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => setVue('catalogue')} className="px-6 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm">Explorer</button>
                  <button onClick={() => setVue('vendeur')} className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm">Créer ma boutique</button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-extrabold mb-4">Catégories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => { setCategorieFiltre(cat); setVue('catalogue'); }} className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-emerald-500 text-left">
                    <span className="text-xs font-bold text-gray-800 line-clamp-2">{cat}</span>
                    <span className="block text-[11px] text-gray-400 mt-1">{produits.filter((p) => p.categorie === cat).length} article(s)</span>
                  </button>
                ))}
              </div>
            </section>

            {produits.length === 0 ? (
              <section className="bg-white rounded-3xl p-10 border text-center space-y-3">
                <h2 className="text-xl font-extrabold">{BRAND} est prêt</h2>
                <p className="text-sm text-gray-500">Créez votre boutique dans l'espace vendeur et publiez vos premiers produits.</p>
                <button onClick={() => setVue('vendeur')} className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm">Ouvrir ma boutique</button>
              </section>
            ) : (
              <>
                {produitsPromo.length > 0 && (
                  <section>
                    <h2 className="text-lg font-extrabold mb-4">Promotions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {produitsPromo.slice(0, 5).map((p) => <CarteProduit key={p.id} produit={p} />)}
                    </div>
                  </section>
                )}
                <section>
                  <h2 className="text-lg font-extrabold mb-4">Nouveaux produits</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {nouveauxProduits.map((p) => <CarteProduit key={p.id} produit={p} />)}
                  </div>
                </section>
                <section>
                  <h2 className="text-lg font-extrabold mb-4">Meilleures ventes</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {meilleuresVentes.map((p) => <CarteProduit key={p.id} produit={p} />)}
                  </div>
                </section>
              </>
            )}

            {boutiques.length > 0 && (
              <section>
                <h2 className="text-lg font-extrabold mb-4">Boutiques populaires</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {boutiques.map((b) => (
                    <div key={b.id} onClick={() => { setBoutiqueSelectionneeId(b.id); setVue('boutique'); }} className="bg-white p-5 rounded-2xl border cursor-pointer flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 overflow-hidden flex items-center justify-center">
                        {b.logo ? <img src={b.logo} alt="" className="w-full h-full object-cover" /> : <Store className="w-6 h-6 text-emerald-700" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{b.nom}</p>
                        <p className="text-xs text-gray-500">{b.ville}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12 py-6 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <LogoMarque onClick={() => setVue('accueil')} />
          <p>© {new Date().getFullYear()} {BRAND} — Madagascar</p>
        </div>
      </footer>
    </div>
  );
}
