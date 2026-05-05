import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Loader2, LogOut, Save, FileDown, ChevronDown, Plus, Trash2,
  TrendingUp, TrendingDown, ArrowLeft, CheckCircle
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RowData {
  id: string;
  label: string;
  values: number[];
}

interface CashflowData {
  encaissements: RowData[];
  decaissements: RowData[];
  soldeOuverture: number;
}

interface SavedProjection {
  id: string;
  name: string;
  start_month: number;
  start_year: number;
  data: CashflowData;
  updated_at: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DEFAULT_ENCAISSEMENTS: Omit<RowData, "values">[] = [
  { id: "e1", label: "Ventes de produits / services" },
  { id: "e2", label: "Revenus de reprise d'entreprise" },
  { id: "e3", label: "Subventions et aides reçues" },
  { id: "e4", label: "Apports personnels / mise de fonds" },
  { id: "e5", label: "Autres revenus" },
];

const DEFAULT_DECAISSEMENTS: Omit<RowData, "values">[] = [
  { id: "d1", label: "Loyer / espace de travail" },
  { id: "d2", label: "Salaires et charges sociales" },
  { id: "d3", label: "Remboursements de prêts" },
  { id: "d4", label: "Fournisseurs et inventaire" },
  { id: "d5", label: "Marketing et communications" },
  { id: "d6", label: "Honoraires professionnels" },
  { id: "d7", label: "Formation et développement" },
  { id: "d8", label: "Charges fixes (téléphone, assurances…)" },
  { id: "d9", label: "Autres dépenses" },
];

function makeDefaultData(): CashflowData {
  return {
    encaissements: DEFAULT_ENCAISSEMENTS.map(r => ({ ...r, values: Array(12).fill(0) })),
    decaissements: DEFAULT_DECAISSEMENTS.map(r => ({ ...r, values: Array(12).fill(0) })),
    soldeOuverture: 0,
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Formatting ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n === 0) return "—";
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
}

function fmtInput(n: number): string {
  return n === 0 ? "" : String(n);
}

// ── Main Component ─────────────────────────────────────────────────────────────

const OutilTresorerie = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Meta
  const [projectName, setProjectName] = useState("Ma projection de trésorerie");
  const [startMonth, setStartMonth] = useState(new Date().getMonth()); // 0-indexed
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Data
  const [data, setData] = useState<CashflowData>(makeDefaultData());

  // UI state
  const [saves, setSaves] = useState<SavedProjection[]>([]);
  const [savesOpen, setSavesOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) navigate("/member/login");
  }, [user, loading, navigate]);

  // Load saved projections list
  useEffect(() => {
    if (!user) return;
    supabase
      .from("cashflow_projections")
      .select("id, name, start_month, start_year, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data: rows }) => {
        if (rows) setSaves(rows as SavedProjection[]);
        setLoadingData(false);
      });
  }, [user]);

  // ── Computed values ──────────────────────────────────────────────────────────

  const totalEncaissements = data.encaissements.reduce(
    (acc, row) => row.values.map((v, i) => (acc[i] || 0) + v),
    Array(12).fill(0) as number[]
  );

  const totalDecaissements = data.decaissements.reduce(
    (acc, row) => row.values.map((v, i) => (acc[i] || 0) + v),
    Array(12).fill(0) as number[]
  );

  const fluxNet = totalEncaissements.map((e, i) => e - totalDecaissements[i]);

  const soldeCloture = fluxNet.reduce((acc: number[], flux, i) => {
    const prev = i === 0 ? data.soldeOuverture : acc[i - 1];
    acc.push(prev + flux);
    return acc;
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const updateCell = useCallback(
    (section: "encaissements" | "decaissements", rowId: string, colIdx: number, raw: string) => {
      const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
      setData(prev => ({
        ...prev,
        [section]: prev[section].map(r =>
          r.id === rowId
            ? { ...r, values: r.values.map((v, i) => (i === colIdx ? val : v)) }
            : r
        ),
      }));
    },
    []
  );

  const addRow = (section: "encaissements" | "decaissements") => {
    setData(prev => ({
      ...prev,
      [section]: [
        ...prev[section],
        { id: uid(), label: "Nouvelle ligne", values: Array(12).fill(0) },
      ],
    }));
  };

  const removeRow = (section: "encaissements" | "decaissements", rowId: string) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter(r => r.id !== rowId),
    }));
  };

  const updateLabel = (section: "encaissements" | "decaissements", rowId: string, label: string) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(r => (r.id === rowId ? { ...r, label } : r)),
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      name: projectName,
      start_month: startMonth,
      start_year: startYear,
      data,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (currentId) {
      ({ error } = await supabase.from("cashflow_projections").update(payload).eq("id", currentId));
    } else {
      const { data: inserted, error: err } = await supabase
        .from("cashflow_projections")
        .insert(payload)
        .select("id")
        .single();
      error = err;
      if (inserted) setCurrentId(inserted.id);
    }

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      // refresh list
      const { data: rows } = await supabase
        .from("cashflow_projections")
        .select("id, name, start_month, start_year, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (rows) setSaves(rows as SavedProjection[]);
    }
    setSaving(false);
  };

  const handleLoad = async (proj: SavedProjection) => {
    const { data: full } = await supabase
      .from("cashflow_projections")
      .select("*")
      .eq("id", proj.id)
      .single();
    if (full) {
      setCurrentId(full.id);
      setProjectName(full.name);
      setStartMonth(full.start_month);
      setStartYear(full.start_year);
      setData(full.data as CashflowData);
    }
    setSavesOpen(false);
  };

  const handleNew = () => {
    setCurrentId(null);
    setProjectName("Ma projection de trésorerie");
    setStartMonth(new Date().getMonth());
    setStartYear(new Date().getFullYear());
    setData(makeDefaultData());
    setSavesOpen(false);
  };

  const handlePrint = () => window.print();

  // ── Month headers ────────────────────────────────────────────────────────────

  const monthHeaders = Array.from({ length: 12 }, (_, i) => {
    const idx = (startMonth + i) % 12;
    return MONTHS_FR[idx].slice(0, 3);
  });

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f5f6fa] print:bg-white">
      {/* ── Header ── */}
      <header className="bg-white border-b sticky top-0 z-20 print:hidden">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/member" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Tableau de bord</span>
            </Link>
            <div className="h-5 w-px bg-border" />
            <Link to="/" className="flex items-center gap-3">
              <Logo size="sm" />
            </Link>
            <span className="text-sm font-semibold text-[#141772] hidden md:inline">
              Outil de trésorerie
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Load saves */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSavesOpen(v => !v)}
                className="gap-1"
              >
                Mes projections
                <ChevronDown className="h-3 w-3" />
              </Button>
              {savesOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg w-72 z-50 overflow-hidden">
                  <div className="p-2 border-b">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-primary" onClick={handleNew}>
                      <Plus className="h-4 w-4" /> Nouvelle projection
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {saves.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-4 text-center">Aucune projection sauvegardée</p>
                    ) : (
                      saves.map(s => (
                        <button
                          key={s.id}
                          onClick={() => handleLoad(s)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0"
                        >
                          <p className="text-sm font-medium truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {MONTHS_FR[s.start_month]} {s.start_year} · Modifié le {new Date(s.updated_at).toLocaleDateString("fr-CA")}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter PDF</span>
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1 bg-[#141772] hover:bg-[#0e1155] text-white"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{saved ? "Sauvegardé!" : "Sauvegarder"}</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Print Header (hidden on screen) ── */}
      <div className="hidden print:block p-8 pb-4">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#141772]">{projectName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {MONTHS_FR[startMonth]} {startYear} — {MONTHS_FR[(startMonth + 11) % 12]} {startMonth > 0 ? startYear + 1 : startYear}
            </p>
          </div>
          <p className="text-sm text-gray-400">Fondation NIYA · niyafondation.org</p>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 print:px-8 print:py-0">

        {/* Project meta row */}
        <div className="flex flex-wrap gap-4 items-end mb-6 print:hidden">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Nom du projet
            </label>
            <Input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="font-semibold text-[#141772] border-[#141772]/20 focus-visible:ring-[#141772]/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Mois de départ
            </label>
            <select
              value={startMonth}
              onChange={e => setStartMonth(Number(e.target.value))}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#141772]/30"
            >
              {MONTHS_FR.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Année
            </label>
            <select
              value={startYear}
              onChange={e => setStartYear(Number(e.target.value))}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#141772]/30"
            >
              {[2024, 2025, 2026, 2027, 2028].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Solde d'ouverture
            </label>
            <Input
              type="number"
              value={fmtInput(data.soldeOuverture)}
              onChange={e => setData(prev => ({ ...prev, soldeOuverture: parseFloat(e.target.value) || 0 }))}
              className="w-36"
              placeholder="0"
            />
          </div>
        </div>

        {/* ── Spreadsheet ── */}
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm print:shadow-none print:border-0">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "1100px" }}>
            <thead>
              <tr className="bg-[#141772] text-white">
                <th className="text-left px-4 py-3 font-semibold w-52 sticky left-0 bg-[#141772] z-10">
                  Catégorie
                </th>
                {monthHeaders.map((m, i) => (
                  <th key={i} className="text-right px-2 py-3 font-medium text-white/80 w-20">
                    {m}
                  </th>
                ))}
                <th className="text-right px-3 py-3 font-semibold w-24 border-l border-white/20">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {/* ── ENCAISSEMENTS ── */}
              <SectionHeader label="💰 Encaissements" colSpan={14} color="#e8f5e9" textColor="#1b5e20" />

              {data.encaissements.map(row => (
                <DataRow
                  key={row.id}
                  row={row}
                  onCellChange={(colIdx, val) => updateCell("encaissements", row.id, colIdx, val)}
                  onLabelChange={label => updateLabel("encaissements", row.id, label)}
                  onRemove={() => removeRow("encaissements", row.id)}
                />
              ))}

              <AddRowButton label="+ Ajouter une ligne" onClick={() => addRow("encaissements")} colSpan={14} />

              <TotalRow
                label="Total encaissements"
                values={totalEncaissements}
                color="#1b5e20"
                bg="#c8e6c9"
              />

              {/* ── DÉCAISSEMENTS ── */}
              <SectionHeader label="📤 Décaissements" colSpan={14} color="#fce4e4" textColor="#b71c1c" />

              {data.decaissements.map(row => (
                <DataRow
                  key={row.id}
                  row={row}
                  onCellChange={(colIdx, val) => updateCell("decaissements", row.id, colIdx, val)}
                  onLabelChange={label => updateLabel("decaissements", row.id, label)}
                  onRemove={() => removeRow("decaissements", row.id)}
                />
              ))}

              <AddRowButton label="+ Ajouter une ligne" onClick={() => addRow("decaissements")} colSpan={14} />

              <TotalRow
                label="Total décaissements"
                values={totalDecaissements}
                color="#b71c1c"
                bg="#ffcdd2"
              />

              {/* ── RÉSUMÉ ── */}
              <SectionHeader label="📊 Résumé mensuel" colSpan={14} color="#e8eaf6" textColor="#141772" />

              <SummaryRow
                label="Flux net mensuel"
                values={fluxNet}
                positiveColor="#1b5e20"
                negativeColor="#b71c1c"
                icon={(v) => v >= 0
                  ? <TrendingUp className="h-3 w-3 inline mr-1" />
                  : <TrendingDown className="h-3 w-3 inline mr-1" />}
              />

              <SummaryRow
                label="Solde de clôture"
                values={soldeCloture}
                positiveColor="#141772"
                negativeColor="#b71c1c"
                bold
              />
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground mt-4 text-center print:mt-8">
          Outil de projection de trésorerie — Fondation NIYA · Les données sont sauvegardées dans votre espace membre sécurisé.
        </p>
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 1.5cm; }
          input, select, button { display: none !important; }
          td input { display: table-cell !important; border: none; background: transparent; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ label, colSpan, color, textColor }: {
  label: string; colSpan: number; color: string; textColor: string;
}) {
  return (
    <tr style={{ backgroundColor: color }}>
      <td
        colSpan={colSpan}
        className="px-4 py-2 font-semibold text-xs uppercase tracking-widest sticky left-0"
        style={{ color: textColor, backgroundColor: color }}
      >
        {label}
      </td>
    </tr>
  );
}

function DataRow({ row, onCellChange, onLabelChange, onRemove }: {
  row: RowData;
  onCellChange: (colIdx: number, val: string) => void;
  onLabelChange: (label: string) => void;
  onRemove: () => void;
}) {
  const rowTotal = row.values.reduce((a, b) => a + b, 0);
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 group transition-colors">
      <td className="px-2 py-1 sticky left-0 bg-white group-hover:bg-gray-50/50 z-10">
        <div className="flex items-center gap-1">
          <input
            value={row.label}
            onChange={e => onLabelChange(e.target.value)}
            className="w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#141772]/20 rounded px-1 py-0.5"
          />
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-0.5 print:hidden"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
      {row.values.map((val, i) => (
        <td key={i} className="px-1 py-1">
          <input
            type="number"
            value={fmtInput(val)}
            onChange={e => onCellChange(i, e.target.value)}
            className="w-full text-right text-sm bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#141772]/20 rounded px-1 py-0.5 tabular-nums"
            placeholder="—"
          />
        </td>
      ))}
      <td className="px-3 py-1 text-right font-medium text-sm tabular-nums border-l border-gray-100">
        {fmt(rowTotal)}
      </td>
    </tr>
  );
}

function AddRowButton({ label, onClick, colSpan }: {
  label: string; onClick: () => void; colSpan: number;
}) {
  return (
    <tr className="print:hidden">
      <td colSpan={colSpan} className="px-4 py-1">
        <button
          onClick={onClick}
          className="text-xs text-[#141772]/60 hover:text-[#141772] transition-colors font-medium"
        >
          {label}
        </button>
      </td>
    </tr>
  );
}

function TotalRow({ label, values, color, bg }: {
  label: string; values: number[]; color: string; bg: string;
}) {
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <tr style={{ backgroundColor: bg }}>
      <td className="px-4 py-2 font-bold text-sm sticky left-0 z-10" style={{ color, backgroundColor: bg }}>
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="px-2 py-2 text-right font-semibold text-sm tabular-nums" style={{ color }}>
          {fmt(v)}
        </td>
      ))}
      <td className="px-3 py-2 text-right font-bold text-sm tabular-nums border-l border-gray-200" style={{ color }}>
        {fmt(total)}
      </td>
    </tr>
  );
}

function SummaryRow({ label, values, positiveColor, negativeColor, bold, icon }: {
  label: string;
  values: number[];
  positiveColor: string;
  negativeColor: string;
  bold?: boolean;
  icon?: (v: number) => React.ReactNode;
}) {
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <tr className="border-b border-gray-200">
      <td className={`px-4 py-2.5 text-sm sticky left-0 bg-white z-10 ${bold ? "font-bold" : "font-medium"}`}>
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`px-2 py-2.5 text-right text-sm tabular-nums ${bold ? "font-bold" : "font-medium"}`}
          style={{ color: v >= 0 ? positiveColor : negativeColor }}
        >
          {icon?.(v)}{fmt(v)}
        </td>
      ))}
      <td
        className={`px-3 py-2.5 text-right text-sm tabular-nums border-l border-gray-200 ${bold ? "font-bold" : "font-medium"}`}
        style={{ color: total >= 0 ? positiveColor : negativeColor }}
      >
        {fmt(total)}
      </td>
    </tr>
  );
}

export default OutilTresorerie;
