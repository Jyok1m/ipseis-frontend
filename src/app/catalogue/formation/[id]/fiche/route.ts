import { NextResponse } from "next/server";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import {
	getTrainingById,
	DEFAULT_ACCESSIBILITY,
	type Training,
} from "@/lib/api";
import { MODALITIES } from "@/lib/trainingModalities";
import { IPSEIS, HANDICAP_REFERENT } from "@/lib/siteInfo";

/**
 * Fiche programme d'une formation, au format PDF.
 *
 * Le PDF est produit à la volée depuis les données de la formation plutôt que
 * déposé en fichier : le modèle `Training` ne porte aucun champ de pièce
 * jointe, et une trentaine de PDF à régénérer à chaque correction de programme
 * aurait divergé du site en quelques semaines. Ici la fiche ne peut pas mentir,
 * elle est rendue à partir de ce qui est affiché.
 */

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 50;
const CONTENT_WIDTH = A4.width - MARGIN * 2;

// Palette de la charte (cf. tailwind.config.ts).
const COLORS = {
	univers: rgb(0x26 / 255, 0x3c / 255, 0x27 / 255),
	cohesion: rgb(0xff / 255, 0x4e / 255, 0x00 / 255),
	muted: rgb(0x5a / 255, 0x6a / 255, 0x5b / 255),
	rule: rgb(0xd8 / 255, 0xdd / 255, 0xd8 / 255),
};

/**
 * Les polices standard de PDF utilisent l'encodage WinAnsi : « œ », les
 * apostrophes typographiques et les tirets cadratins levaient une exception à
 * l'écriture, et une seule occurrence suffisait à faire échouer toute la fiche.
 * On les ramène à leurs équivalents encodables, puis on écarte ce qui resterait
 * hors jeu de caractères.
 */
function sanitize(input: string): string {
	return (input ?? "")
		.replace(/œ/g, "oe")
		.replace(/Œ/g, "OE")
		.replace(/[‘’‛]/g, "'")
		.replace(/[“”]/g, '"')
		.replace(/[–-]/g, "-")
		.replace(/…/g, "...")
		.replace(/[\u00A0\u202F]/g, " ")
		.replace(/[^\x20-\x7E\xA0-\xFF\u20AC]/g, "")
		.trim();
}

/** Découpe un texte pour qu'aucune ligne ne dépasse `maxWidth`. */
function wrap(
	text: string,
	font: PDFFont,
	size: number,
	maxWidth: number,
): string[] {
	const clean = sanitize(text);
	if (!clean) return [];

	const lines: string[] = [];
	let current = "";

	for (const word of clean.split(/\s+/)) {
		const candidate = current ? `${current} ${word}` : word;
		if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
			current = candidate;
			continue;
		}
		if (current) lines.push(current);
		// Un mot plus long que la colonne (URL, sigle) est coupé de force,
		// sinon il déborderait silencieusement dans la marge.
		if (font.widthOfTextAtSize(word, size) > maxWidth) {
			let chunk = "";
			for (const char of word) {
				if (font.widthOfTextAtSize(chunk + char, size) > maxWidth) {
					lines.push(chunk);
					chunk = char;
				} else {
					chunk += char;
				}
			}
			current = chunk;
		} else {
			current = word;
		}
	}
	if (current) lines.push(current);
	return lines;
}

/**
 * Curseur d'écriture : suit la position verticale et ouvre une page dès que la
 * suivante ne tient plus, ce qui évite de calculer une pagination à l'avance.
 */
class Cursor {
	private page: PDFPage;
	private y: number;

	constructor(
		private doc: PDFDocument,
		private fonts: { regular: PDFFont; bold: PDFFont },
	) {
		this.page = doc.addPage([A4.width, A4.height]);
		this.y = A4.height - MARGIN;
	}

	private ensure(space: number) {
		if (this.y - space >= MARGIN + 40) return;
		this.page = this.doc.addPage([A4.width, A4.height]);
		this.y = A4.height - MARGIN;
	}

	/** Ouvre une page si `space` points ne restent pas disponibles. */
	private reserve(space: number) {
		this.ensure(space);
	}

	gap(space: number) {
		this.ensure(space);
		this.y -= space;
	}

	text(
		content: string,
		{
			size = 10.5,
			bold = false,
			color = COLORS.univers,
			indent = 0,
			leading = 1.35,
		} = {},
	) {
		const font = bold ? this.fonts.bold : this.fonts.regular;
		const lineHeight = size * leading;
		for (const line of wrap(content, font, size, CONTENT_WIDTH - indent)) {
			this.ensure(lineHeight);
			this.y -= lineHeight;
			this.page.drawText(line, {
				x: MARGIN + indent,
				y: this.y,
				size,
				font,
				color,
			});
		}
	}

	/** Intitulé de section : filet + libellé en rouge orangé, comme sur le site. */
	heading(label: string) {
		// Un intitulé seul en pied de page, son contenu rejeté sur la suivante, se
		// lit comme une section vide : on réserve de quoi loger le titre et ses
		// premières lignes, sinon on ouvre la page tout de suite.
		this.reserve(78);
		this.gap(16);
		this.ensure(24);
		this.page.drawLine({
			start: { x: MARGIN, y: this.y - 4 },
			end: { x: A4.width - MARGIN, y: this.y - 4 },
			thickness: 0.75,
			color: COLORS.rule,
		});
		this.gap(10);
		this.text(label, { size: 12.5, bold: true, color: COLORS.cohesion });
		this.gap(4);
	}

	bullets(items: string[]) {
		for (const item of items) {
			const y0 = this.y;
			this.text(item, { indent: 14 });
			// La puce est posée après coup, à la hauteur de la première ligne du
			// paragraphe : avant le rendu on ignore si un saut de page l'a déplacé.
			if (this.y < y0) {
				this.page.drawCircle({
					x: MARGIN + 4.5,
					y: y0 - 10.5 * 1.35 + 3.4,
					size: 1.9,
					color: COLORS.cohesion,
				});
			}
		}
	}

	/** Bloc « libellé » suivi d'une ou plusieurs lignes de valeur. */
	field(label: string, ...values: string[]) {
		const lines = values.filter((value) => sanitize(value));
		if (!lines.length) return;
		this.text(label, { size: 10, bold: true, color: COLORS.muted });
		for (const line of lines) this.text(line);
		this.gap(6);
	}
}

function buildFooter(doc: PDFDocument, font: PDFFont) {
	const pages = doc.getPages();
	const line1 = sanitize(
		`${IPSEIS.name} - ${IPSEIS.address.street}, ${IPSEIS.address.postalCode} ${IPSEIS.address.city} - ${IPSEIS.email} - ${IPSEIS.phone}`,
	);

	pages.forEach((page, index) => {
		page.drawText(line1, {
			x: MARGIN,
			y: MARGIN - 14,
			size: 7.5,
			font,
			color: COLORS.muted,
		});
		const pagination = `${index + 1} / ${pages.length}`;
		page.drawText(pagination, {
			x: A4.width - MARGIN - font.widthOfTextAtSize(pagination, 7.5),
			y: MARGIN - 14,
			size: 7.5,
			font,
			color: COLORS.muted,
		});
	});
}

async function buildPdf(training: Training): Promise<Uint8Array> {
	const doc = await PDFDocument.create();
	const regular = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);

	doc.setTitle(sanitize(`Fiche programme - ${training.title}`));
	doc.setAuthor(IPSEIS.name);
	doc.setSubject(sanitize("Programme de formation IPSEIS"));
	doc.setProducer(IPSEIS.name);

	const cur = new Cursor(doc, { regular, bold });

	cur.text(IPSEIS.name, { size: 20, bold: true, color: COLORS.cohesion });
	cur.text("Organisme de formation continue - Certifié Qualiopi", {
		size: 9,
		color: COLORS.muted,
	});
	cur.gap(18);

	if (training.theme)
		cur.text(training.theme.toUpperCase(), {
			size: 9.5,
			bold: true,
			color: COLORS.cohesion,
		});
	cur.text(training.title, { size: 18, bold: true, leading: 1.25 });

	if (training.introduction?.trim()) {
		cur.gap(10);
		cur.text(training.introduction, { color: COLORS.muted });
	}

	if (training.pedagogical_objectives?.length) {
		cur.heading("Objectifs pédagogiques");
		cur.bullets(training.pedagogical_objectives);
	}

	if (training.program?.length) {
		cur.heading("Programme");
		cur.bullets(training.program);
	}

	if (training.pedagogical_methods?.length) {
		cur.heading("Méthodes pédagogiques");
		cur.bullets(training.pedagogical_methods);
	}

	// Même garantie que sur la page : l'évaluation de la satisfaction est une
	// exigence Qualiopi, elle figure sur la fiche même si le champ l'a omise.
	const evaluations = [
		...(training.evaluation_methods ?? []),
		...(training.evaluation_methods?.some((m) => /satisfaction/i.test(m))
			? []
			: ["Évaluation de la satisfaction"]),
	];
	if (evaluations.length) {
		cur.heading("Méthodes d'évaluation");
		cur.bullets(evaluations);
	}

	cur.heading("Informations pratiques");
	cur.field("Public", training.audience);
	cur.field("Prérequis", training.prerequisites);
	cur.field("Intervenant", training.trainer);
	cur.field("Durée", training.duration);
	cur.field(
		"Nombre de participants",
		`${MODALITIES.intraLabel} : ${training.number_of_trainees}`,
		`${MODALITIES.interLabel} : ${MODALITIES.interCapacity}`,
	);
	cur.field(
		"Tarification",
		`${MODALITIES.intraLabel} : ${training.quote}`,
		`${MODALITIES.interLabel} : ${MODALITIES.interQuote}`,
	);
	cur.text(MODALITIES.priceNote, { size: 9, color: COLORS.muted });
	cur.gap(6);

	cur.heading("Délai d'accès");
	cur.text(
		"IPSEIS s'engage à vous répondre dans un délai maximum de 72 heures. La date de début de formation est déterminée avec vous, selon vos besoins, préférences et contraintes. En moyenne, le délai de mise en place de la formation est d'un mois.",
	);

	cur.heading("Accessibilité aux personnes en situation de handicap");
	cur.text(training.accessibility || DEFAULT_ACCESSIBILITY);
	cur.gap(6);
	cur.text(
		`Référente handicap : ${HANDICAP_REFERENT.name} - ${HANDICAP_REFERENT.email} - ${HANDICAP_REFERENT.phone}`,
		{ size: 9.5 },
	);

	buildFooter(doc, regular);

	return doc.save();
}

/** Nom de fichier proposé au téléchargement, sans accent ni espace. */
function fileName(title: string): string {
	const slug =
		sanitize(title)
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "") || "formation";
	return `ipseis-fiche-${slug}.pdf`;
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const training = await getTrainingById(id);

	if (!training) {
		return new NextResponse("Formation introuvable", { status: 404 });
	}

	const bytes = await buildPdf(training);

	// `Uint8Array` plutôt que le buffer brut : la réponse doit porter exactement
	// les octets du PDF, pas la totalité de l'ArrayBuffer sous-jacent.
	return new NextResponse(new Uint8Array(bytes), {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="${fileName(training.title)}"`,
			"Cache-Control":
				"public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
