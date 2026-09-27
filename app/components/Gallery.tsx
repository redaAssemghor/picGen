"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Heart, Images, RefreshCw, X, ArrowUpRight } from "lucide-react";
import { Creation, MODELS } from "@/lib/generation";

export default function Gallery({ refresh = 0, compact = false }: { refresh?: number; compact?: boolean }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [images, setImages] = useState<Creation[]>([]);
  const [favorites, setFavorites] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Creation | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const revision = useRef(0);
  const cancelPending = useCallback(() => { revision.current++; }, []);
  const load = useCallback(async (next?: string) => {
    const version = ++revision.current;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/images?" + new URLSearchParams({ ...(favorites ? { favorites: "true" } : {}), ...(next ? { cursor: next } : {}) }));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load images.");
      if (version !== revision.current) return;
      setImages(previous => next ? [...previous, ...data.images] : data.images);
      setCursor(data.nextCursor);
    } catch (error) { if (version === revision.current) setError((error as Error).message); }
    finally { if (version === revision.current) setLoading(false); }
  }, [favorites]);
  useEffect(() => {
    setImages([]); setSelected(null); setCursor(null);
    if (isSignedIn) void load();
    return cancelPending;
  }, [isSignedIn, userId, load, refresh, cancelPending]);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  async function favorite(image: Creation) {
    setSaving(image.id); setError("");
    try {
      const response = await fetch("/api/images/" + image.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ favorite: !image.favorite }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save favorite.");
      setImages(previous => previous.map(item => item.id === image.id ? { ...item, favorite: data.favorite } : item).filter(item => !favorites || item.favorite));
      setSelected(previous => previous?.id === image.id ? { ...previous, favorite: data.favorite } : previous);
    } catch (error) { setError((error as Error).message); }
    finally { setSaving(null); }
  }
  if (!isLoaded) return <p className="muted-copy" role="status">Loading your library…</p>;
  if (!isSignedIn) return <div className="empty-state"><Images size={32} /><h2>Your ideas belong here.</h2><p>Sign in to save images, collect favorites, and pick up where you left off.</p><SignInButton mode="modal"><button className="button button-primary">Sign in to view your library</button></SignInButton></div>;
  return <section className="gallery-section">
    <div className="gallery-heading"><div><span className="eyebrow">{compact ? "KEEP EXPLORING" : "YOUR CREATIVE COLLECTION"}</span><h2>{compact ? "Recent creations" : "My library"}</h2></div><div className="gallery-tabs"><button aria-pressed={!favorites} onClick={() => setFavorites(false)}>All images</button><button aria-pressed={favorites} onClick={() => setFavorites(true)}><Heart size={14} />Favorites</button><button onClick={() => void load()} disabled={loading} aria-label="Refresh library"><RefreshCw size={16} /></button></div></div>
    {error && <p className="studio-error" role="alert">{error}</p>}
    {loading && !images.length ? <div className="gallery-grid">{[0,1,2].map(index => <div key={index} className="gallery-skeleton" aria-label="Loading image" />)}</div> : !images.length && !error ? <div className="empty-state"><Images size={30} /><h3>{favorites ? "A place for your favorites." : "Your first image is waiting to happen."}</h3><p>{favorites ? "Tap the heart on any creation to save it here." : "Describe something you would love to see."}</p>{!compact && <Link className="button button-primary" href="/generatepage">Create an image <ArrowUpRight size={16} /></Link>}</div> : <div className="gallery-grid">{images.map(image => <article className="creation-card" key={image.id}><button className="creation-preview" onClick={() => setSelected(image)} aria-label={"Preview: " + image.prompt}><Image src={"/api/images/" + image.id} alt={image.prompt} width={512} height={512} unoptimized /></button><div className="creation-info"><p>{image.prompt}</p><div><span>{MODELS[image.model as keyof typeof MODELS]?.name || image.model}</span><button aria-label={image.favorite ? "Remove favorite" : "Add favorite"} aria-pressed={image.favorite} disabled={saving === image.id} onClick={() => void favorite(image)}><Heart size={17} fill={image.favorite ? "currentColor" : "none"} /></button><a href={"/api/images/" + image.id + "?download=1"} aria-label="Download image"><Download size={17} /></a></div></div></article>)}</div>}
    {cursor && <button className="button button-secondary load-more" disabled={loading} onClick={() => void load(cursor)}>{loading ? "Loading…" : "Load more"}</button>}
    <dialog ref={dialog} className="image-dialog" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      {selected && <><button className="dialog-close" aria-label="Close preview" onClick={() => setSelected(null)}><X size={22} /></button><Image src={"/api/images/" + selected.id} alt={selected.prompt} width={1024} height={1024} unoptimized /><div className="dialog-details"><p>{selected.prompt}</p><span>{MODELS[selected.model as keyof typeof MODELS]?.name} · {selected.ratio} · Seed {selected.seed}</span><div className="studio-tools"><a className="button button-primary" href={"/api/images/" + selected.id + "?download=1"}><Download size={16} />Download</a><Link className="button button-secondary" href={"/generatepage?" + new URLSearchParams({ prompt: selected.prompt, model: selected.model, ratio: selected.ratio, style: selected.style, seed: String(selected.seed) })} onClick={() => setSelected(null)}>Reuse prompt <ArrowUpRight size={16} /></Link></div></div></>}
    </dialog>
  </section>;
}
