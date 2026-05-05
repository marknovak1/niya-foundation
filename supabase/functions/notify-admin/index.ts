const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ADMIN_EMAIL = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") ?? "info@niyafondation.org";
const FROM_EMAIL = "noreply@niyafondation.org";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const payload = await req.json();
    const adminPanelUrl = "https://niyafondation.org/admin";
    let subject = "";
    let html = "";

    if (payload.type === "new_listing") {
      subject = `Nouvelle annonce soumise — ${payload.listing_name}`;
      html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:#1a3a5c;padding:24px;border-radius:8px 8px 0 0;text-align:center"><h1 style="color:white;margin:0;font-size:20px">Fondation NIYA</h1><p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px">Notification — Nouvelle annonce</p></div><div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px"><h2 style="color:#1a3a5c;margin-top:0">Une nouvelle annonce a été soumise</h2><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr><td style="padding:8px 0;color:#6b7280;width:140px">Entreprise</td><td style="padding:8px 0;font-weight:600">${payload.listing_name}</td></tr><tr><td style="padding:8px 0;color:#6b7280">Catégorie</td><td style="padding:8px 0">${payload.listing_category ?? "—"}</td></tr><tr><td style="padding:8px 0;color:#6b7280">Localisation</td><td style="padding:8px 0">${payload.listing_location ?? "—"}</td></tr><tr><td style="padding:8px 0;color:#6b7280">Prix demandé</td><td style="padding:8px 0">${payload.listing_price ?? "—"}</td></tr><tr><td style="padding:8px 0;color:#6b7280">Soumis par</td><td style="padding:8px 0">${payload.seller_email ?? "—"}</td></tr></table><p style="color:#374151">Cette annonce est en attente de votre approbation avant d'être publiée.</p><div style="text-align:center;margin-top:28px"><a href="${adminPanelUrl}" style="background:#1a3a5c;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">Approuver ou rejeter l'annonce</a></div></div><p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px">Fondation NIYA · niyafondation.org</p></div>`;
    } else if (payload.type === "new_inquiry") {
      subject = `Nouvel intérêt d'acheteur — ${payload.listing_name}`;
      html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:#1a3a5c;padding:24px;border-radius:8px 8px 0 0;text-align:center"><h1 style="color:white;margin:0;font-size:20px">Fondation NIYA</h1><p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px">Notification — Demande d'acheteur</p></div><div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px"><h2 style="color:#1a3a5c;margin-top:0">Un membre a manifesté son intérêt</h2><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr><td style="padding:8px 0;color:#6b7280;width:140px">Annonce</td><td style="padding:8px 0;font-weight:600">${payload.listing_name}</td></tr><tr><td style="padding:8px 0;color:#6b7280">Acheteur potentiel</td><td style="padding:8px 0">${payload.buyer_email ?? "—"}</td></tr><tr><td style="padding:8px 0;color:#6b7280">Message</td><td style="padding:8px 0">${payload.inquiry_message || "Aucun message"}</td></tr></table><p style="color:#374151">Connectez-vous au panneau d'administration pour gérer cette demande.</p><div style="text-align:center;margin-top:28px"><a href="${adminPanelUrl}" style="background:#1a3a5c;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">Voir les demandes</a></div></div><p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px">Fondation NIYA · niyafondation.org</p></div>`;
    } else {
      return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `Fondation NIYA <${FROM_EMAIL}>`, to: [ADMIN_EMAIL], subject, html }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
