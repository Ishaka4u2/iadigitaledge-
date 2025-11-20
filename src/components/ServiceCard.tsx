// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }

      setLoading(false);
    };

    checkUser();

    // Listen for login/logout changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg font-medium animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
    doc.fontSize(9).fillColor('#666').text(`Generated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
  });
}

/**
 * NIN Improved: table-like with borders and photo
 */
async function createNinImproved(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Improved');

    // left column details
    const leftX = doc.x;
    const columnWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const photoSize = 120;

    // Photo on the right
    const photoX = doc.page.width - doc.page.margins.right - photoSize;
    const resolvedPhoto = await resolveImage(data.photoUrl);
    if (resolvedPhoto) {
      try { doc.image(resolvedPhoto, photoX, doc.y, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] }); } catch {}
    }

    doc.fontSize(13).text(data.fullName || '—', { continued: false });
    doc.moveDown(0.5);

    // info box
    doc.rect(leftX, doc.y, columnWidth, 120).stroke();
    doc.moveDown(0.5);
    doc.fontSize(11);
    const leftYStart = doc.y + 6;
    doc.text(`NIN: ${data.nin || '—'}`, leftX + 8, leftYStart);
    doc.text(`DOB: ${data.dob || '—'}`, leftX + 8);
    doc.text(`Gender: ${data.gender || '—'}`, leftX + 8);
    doc.text(`Phone: ${data.phone || '—'}`, leftX + 8);
    doc.text(`Address: ${data.address || '—'}`, leftX + 8);
    doc.moveDown(6);

    // QR
    const qrText = JSON.stringify({ type: 'nin_improved', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, leftX + 8, doc.y, { fit: [100, 100] });

    doc.moveDown(8);
    doc.fontSize(9).fillColor('#666').text(`Issued by: ${data.issuer || 'Platform'}`, { align: 'left' });
    doc.fillColor('black');
  });
}

/**
 * NIN Premium: styled official-looking slip
 */
async function createNinPremium(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Premium');

    doc.font('Helvetica-Bold').fontSize(20).text(data.fullName || '—');
    doc.moveDown(0.5);

    // Two-column key/value pairs
    const leftX = doc.x;
    const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2 - 10;

    doc.fontSize(11).font('Helvetica');
    doc.text(`NIN: ${data.nin || '—'}`, leftX, doc.y, { width: colWidth });
    doc.text(`DOB: ${data.dob || '—'}`, leftX + colWidth + 20, doc.y);
    doc.moveDown();

    doc.text(`Gender: ${data.gender || '—'}`, leftX, doc.y, { width: colWidth });
    doc.text(`Phone: ${data.phone || '—'}`, leftX + colWidth + 20, doc.y);
    doc.moveDown();

    if (data.address) {
      doc.text('Address:', leftX);
      doc.text(data.address, { indent: 10, continued: false });
      doc.moveDown();
    }

    // big QR + signature block
    const qrText = JSON.stringify({ type: 'nin_premium', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, (doc.page.width / 2) - 60, doc.y, { fit: [120, 120] });

    doc.moveDown(8);
    doc.text('Signature:', leftX);
    doc.moveDown(4);
    doc.fontSize(9).fillColor('#666').text(`Generated: ${dayjs().format('YYYY-MM-DD')}`);
    doc.fillColor('black');
  });
}

/**
 * BVN Slip (simple)
 */
async function createBvnSlip(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'BVN Slip');

    doc.fontSize(18).text(data.fullName || '—');
    doc.moveDown();

    doc.fontSize(12).text(`BVN: ${data.bvn || '—'}`);
    doc.text(`Phone: ${data.phone || '—'}`);
    doc.text(`DOB: ${data.dob || '—'}`);
    if (data.address) doc.text(`Address: ${data.address}`);

    const qrText = JSON.stringify({ type: 'bvn_slip', bvn: data.bvn ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, doc.page.width - doc.page.margins.right - 120, doc.y - 20, { fit: [100, 100] });

    doc.moveDown(6);
    doc.fontSize(10).fillColor('#666').text('This document is for verification purposes only.');
    doc.fillColor('black');
  });
}

/**
 * BVN Card (compact card-like layout)
 */
async function createBvnCard(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    // small landscape card
    const cardWidth = 350;
    const cardHeight = 200;
    doc.addPage({ size: [cardWidth, cardHeight], margin: 12 });
    doc.rect(12, 12, cardWidth - 24, cardHeight - 24).stroke();

    doc.fontSize(14).font('Helvetica-Bold').text('BVN CARD', 20, 20);
    doc.fontSize(11).font('Helvetica').text(`Name: ${data.fullName || '—'}`, 20, 46);
    doc.text(`BVN: ${data.bvn || '—'}`, 20, 64);
    doc.text(`Phone: ${data.phone || '—'}`, 20, 82);

    // photo right-side
    const photoX = cardWidth - 90;
    const resolvedPhoto = await resolveImage(data.photoUrl);
    if (resolvedPhoto) {
      try { doc.image(resolvedPhoto, photoX, 36, { width: 64, height: 80, fit: [64, 80] }); } catch {}
    }

    const qrText = JSON.stringify({ type: 'bvn_card', bvn: data.bvn ?? '' });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, photoX, 120, { width: 56, height: 56 });

    // no new page end: pdfFromDoc will end
  });
}

/**
 * Public API: generate specified template
 */
export async function generateNinSlip(type: NinSlipType, data: PersonData) {
  if (type === 'basic') return createNinBasic(data);
  if (type === 'improved') return createNinImproved(data);
  return createNinPremium(data);
}

export async function generateBvnTemplate(template: BvnTemplate, data: PersonData) {
  if (template === 'slip') return createBvnSlip(data);
  return createBvnCard(data);
             }
                          // src/services/pdfService.ts
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import QRCode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';

type NinSlipType = 'basic' | 'improved' | 'premium';
type BvnTemplate = 'slip' | 'card';

interface PersonData {
  fullName: string;
  nin?: string;
  bvn?: string;
  dob?: string;
  phone?: string;
  address?: string;
  gender?: string;
  photoUrl?: string; // optional URL to embed photo
  issuer?: string;
  issuedAt?: string;
  extra?: Record<string, any>;
}

const assetsDir = path.join(process.cwd(), 'assets'); // put logos/fonts here

async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'M', margin: 1 });
}

/**
 * Helper to inline an image (local or data URL) into PDFKit.
 * PDFKit can accept data URLs; to simplify, we support local files and data URLs.
 */
async function resolveImage(imagePathOrUrl?: string) {
  if (!imagePathOrUrl) return null;
  if (imagePathOrUrl.startsWith('data:')) return imagePathOrUrl;
  // try local file
  const possible = path.resolve(process.cwd(), imagePathOrUrl);
  if (await fs.pathExists(possible)) return possible;
  // fallback - returning URL (PDFKit can fetch remote images only if you fetch buffer)
  // fetch buffer
  const resp = await fetch(imagePathOrUrl);
  const buf = Buffer.from(await resp.arrayBuffer());
  const tmp = path.join(process.cwd(), 'tmp', `img-${Date.now()}.png`);
  await fs.ensureDir(path.dirname(tmp));
  await fs.writeFile(tmp, buf);
  return tmp;
}

/**
 * Core: produce PDF buffer from doc writer
 */
async function pdfFromDoc(writeFn: (doc: PDFKit.PDFDocument) => Promise<void> | void) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const p = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  await writeFn(doc);
  doc.end();
  return p;
}

/**
 * Draw common header with logo + title
 */
async function drawHeader(doc: PDFKit.PDFDocument, title: string) {
  const logoPath = path.join(assetsDir, 'logo.png');
  if (await fs.pathExists(logoPath)) {
    try { doc.image(logoPath, { fit: [90, 40] }); } catch {}
  }
  doc.fontSize(14).text(title, { align: 'right' });
  doc.moveDown(0.5);
  doc.strokeColor('#e0e0e0').lineWidth(1).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown();
}

/**
 * NIN Slip: Basic layout
 */
async function createNinBasic(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Basic');

    doc.fontSize(18).text(data.fullName || '—', { underline: true });
    doc.moveDown(0.4);

    doc.fontSize(12);
    doc.text(`NIN: ${data.nin || 'Not provided'}`);
    doc.text(`Date of Birth: ${data.dob || '—'}`);
    doc.text(`Gender: ${data.gender || '—'}`);
    doc.text(`Phone: ${data.phone || '—'}`);
    doc.moveDown();

    if (data.address) {
      doc.fontSize(11).text(`Address: ${data.address}`);
      doc.moveDown();
    }

    const qrText = JSON.stringify({ type: 'nin_basic', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    const qrImage = qrDataUrl;

    // place QR on right
    const x = doc.page.width - doc.page.margins.right - 120;
    const y = doc.y;
    doc.image(qrImage, x, y, { fit: [100, 100] });

    doc.moveDown(6);
    doc.fontSize(9).fillColor('#666').text(`Generated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
  });
}

/**
 * NIN Improved: table-like with borders and photo
 */
async function createNinImproved(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Improved');

    // left column details
    const leftX = doc.x;
    const columnWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const photoSize = 120;

    // Photo on the right
    const photoX = doc.page.width - doc.page.margins.right - photoSize;
    const resolvedPhoto = await resolveImage(data.photoUrl);
    if (resolvedPhoto) {
      try { doc.image(resolvedPhoto, photoX, doc.y, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] }); } catch {}
    }

    doc.fontSize(13).text(data.fullName || '—', { continued: false });
    doc.moveDown(0.5);

    // info box
    doc.rect(leftX, doc.y, columnWidth, 120).stroke();
    doc.moveDown(0.5);
    doc.fontSize(11);
    const leftYStart = doc.y + 6;
    doc.text(`NIN: ${data.nin || '—'}`, leftX + 8, leftYStart);
    doc.text(`DOB: ${data.dob || '—'}`, leftX + 8);
    doc.text(`Gender: ${data.gender || '—'}`, leftX + 8);
    doc.text(`Phone: ${data.phone || '—'}`, leftX + 8);
    doc.text(`Address: ${data.address || '—'}`, leftX + 8);
    doc.moveDown(6);

    // QR
    const qrText = JSON.stringify({ type: 'nin_improved', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, leftX + 8, doc.y, { fit: [100, 100] });

    doc.moveDown(8);
    doc.fontSize(9).fillColor('#666').text(`Issued by: ${data.issuer || 'Platform'}`, { align: 'left' });
    doc.fillColor('black');
  });
}

/**
 * NIN Premium: styled official-looking slip
 */
async function createNinPremium(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Premium');

    doc.font('Helvetica-Bold').fontSize(20).text(data.fullName || '—');
    doc.moveDown(0.5);

    // Two-column key/value pairs
    const leftX = doc.x;
    const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2 - 10;

    doc.fontSize(11).font('Helvetica');
    doc.text(`NIN: ${data.nin || '—'}`, leftX, doc.y, { width: colWidth });
    doc.text(`DOB: ${data.dob || '—'}`, leftX + colWidth + 20, doc.y);
    doc.moveDown();

    doc.text(`Gender: ${data.gender || '—'}`, leftX, doc.y, { width: colWidth });
    doc.text(`Phone: ${data.phone || '—'}`, leftX + colWidth + 20, doc.y);
    doc.moveDown();

    if (data.address) {
      doc.text('Address:', leftX);
      doc.text(data.address, { indent: 10, continued: false });
      doc.moveDown();
    }

    // big QR + signature block
    const qrText = JSON.stringify({ type: 'nin_premium', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, (doc.page.width / 2) - 60, doc.y, { fit: [120, 120] });

    doc.moveDown(8);
    doc.text('Signature:', leftX);
    doc.moveDown(4);
    doc.fontSize(9).fillColor('#666').text(`Generated: ${dayjs().format('YYYY-MM-DD')}`);
    doc.fillColor('black');
  });
}

/**
 * BVN Slip (simple)
 */
async function createBvnSlip(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'BVN Slip');

    doc.fontSize(18).text(data.fullName || '—');
    doc.moveDown();

    doc.fontSize(12).text(`BVN: ${data.bvn || '—'}`);
    doc.text(`Phone: ${data.phone || '—'}`);
    doc.text(`DOB: ${data.dob || '—'}`);
    if (data.address) doc.text(`Address: ${data.address}`);

    const qrText = JSON.stringify({ type: 'bvn_slip', bvn: data.bvn ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, doc.page.width - doc.page.margins.right - 120, doc.y - 20, { fit: [100, 100] });

    doc.moveDown(6);
    doc.fontSize(10).fillColor('#666').text('This document is for verification purposes only.');
    doc.fillColor('black');
  });
}

/**
 * BVN Card (compact card-like layout)
 */
async function createBvnCard(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    // small landscape card
    const cardWidth = 350;
    const cardHeight = 200;
    doc.addPage({ size: [cardWidth, cardHeight], margin: 12 });
    doc.rect(12, 12, cardWidth - 24, cardHeight - 24).stroke();

    doc.fontSize(14).font('Helvetica-Bold').text('BVN CARD', 20, 20);
    doc.fontSize(11).font('Helvetica').text(`Name: ${data.fullName || '—'}`, 20, 46);
    doc.text(`BVN: ${data.bvn || '—'}`, 20, 64);
    doc.text(`Phone: ${data.phone || '—'}`, 20, 82);

    // photo right-side
    const photoX = cardWidth - 90;
    const resolvedPhoto = await resolveImage(data.photoUrl);
    if (resolvedPhoto) {
      try { doc.image(resolvedPhoto, photoX, 36, { width: 64, height: 80, fit: [64, 80] }); } catch {}
    }

    const qrText = JSON.stringify({ type: 'bvn_card', bvn: data.bvn ?? '' });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, photoX, 120, { width: 56, height: 56 });

    // no new page end: pdfFromDoc will end
  });
}

/**
 * Public API: generate specified template
 */
export async function generateNinSlip(type: NinSlipType, data: PersonData) {
  if (type === 'basic') return createNinBasic(data);
  if (type === 'improved') return createNinImproved(data);
  return createNinPremium(data);
}

export async function generateBvnTemplate(template: BvnTemplate, data: PersonData) {
  if (template === 'slip') return createBvnSlip(data);
  return createBvnCard(data);
    }
                                      // src/services/pdfService.ts
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import QRCode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';

type NinSlipType = 'basic' | 'improved' | 'premium';
type BvnTemplate = 'slip' | 'card';

interface PersonData {
  fullName: string;
  nin?: string;
  bvn?: string;
  dob?: string;
  phone?: string;
  address?: string;
  gender?: string;
  photoUrl?: string; // optional URL to embed photo
  issuer?: string;
  issuedAt?: string;
  extra?: Record<string, any>;
}

const assetsDir = path.join(process.cwd(), 'assets'); // put logos/fonts here

async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'M', margin: 1 });
}

/**
 * Helper to inline an image (local or data URL) into PDFKit.
 * PDFKit can accept data URLs; to simplify, we support local files and data URLs.
 */
async function resolveImage(imagePathOrUrl?: string) {
  if (!imagePathOrUrl) return null;
  if (imagePathOrUrl.startsWith('data:')) return imagePathOrUrl;
  // try local file
  const possible = path.resolve(process.cwd(), imagePathOrUrl);
  if (await fs.pathExists(possible)) return possible;
  // fallback - returning URL (PDFKit can fetch remote images only if you fetch buffer)
  // fetch buffer
  const resp = await fetch(imagePathOrUrl);
  const buf = Buffer.from(await resp.arrayBuffer());
  const tmp = path.join(process.cwd(), 'tmp', `img-${Date.now()}.png`);
  await fs.ensureDir(path.dirname(tmp));
  await fs.writeFile(tmp, buf);
  return tmp;
}

/**
 * Core: produce PDF buffer from doc writer
 */
async function pdfFromDoc(writeFn: (doc: PDFKit.PDFDocument) => Promise<void> | void) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const p = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  await writeFn(doc);
  doc.end();
  return p;
}

/**
 * Draw common header with logo + title
 */
async function drawHeader(doc: PDFKit.PDFDocument, title: string) {
  const logoPath = path.join(assetsDir, 'logo.png');
  if (await fs.pathExists(logoPath)) {
    try { doc.image(logoPath, { fit: [90, 40] }); } catch {}
  }
  doc.fontSize(14).text(title, { align: 'right' });
  doc.moveDown(0.5);
  doc.strokeColor('#e0e0e0').lineWidth(1).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown();
}

/**
 * NIN Slip: Basic layout
 */
async function createNinBasic(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Basic');

    doc.fontSize(18).text(data.fullName || '—', { underline: true });
    doc.moveDown(0.4);

    doc.fontSize(12);
    doc.text(`NIN: ${data.nin || 'Not provided'}`);
    doc.text(`Date of Birth: ${data.dob || '—'}`);
    doc.text(`Gender: ${data.gender || '—'}`);
    doc.text(`Phone: ${data.phone || '—'}`);
    doc.moveDown();

    if (data.address) {
      doc.fontSize(11).text(`Address: ${data.address}`);
      doc.moveDown();
    }

    const qrText = JSON.stringify({ type: 'nin_basic', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    const qrImage = qrDataUrl;

    // place QR on right
    const x = doc.page.width - doc.page.margins.right - 120;
    const y = doc.y;
    doc.image(qrImage, x, y, { fit: [100, 100] });

    doc.moveDown(6);
    doc.fontSize(9).fillColor('#666').text(`Generated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
  });
}

/**
 * NIN Improved: table-like with borders and photo
 */
async function createNinImproved(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Improved');

    // left column details
    const leftX = doc.x;
    const columnWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const photoSize = 120;

    // Photo on the right
    const photoX = doc.page.width - doc.page.margins.right - photoSize;
    const resolvedPhoto = await resolveImage(data.photoUrl);
    if (resolvedPhoto) {
      try { doc.image(resolvedPhoto, photoX, doc.y, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] }); } catch {}
    }

    doc.fontSize(13).text(data.fullName || '—', { continued: false });
    doc.moveDown(0.5);

    // info box
    doc.rect(leftX, doc.y, columnWidth, 120).stroke();
    doc.moveDown(0.5);
    doc.fontSize(11);
    const leftYStart = doc.y + 6;
    doc.text(`NIN: ${data.nin || '—'}`, leftX + 8, leftYStart);
    doc.text(`DOB: ${data.dob || '—'}`, leftX + 8);
    doc.text(`Gender: ${data.gender || '—'}`, leftX + 8);
    doc.text(`Phone: ${data.phone || '—'}`, leftX + 8);
    doc.text(`Address: ${data.address || '—'}`, leftX + 8);
    doc.moveDown(6);

    // QR
    const qrText = JSON.stringify({ type: 'nin_improved', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, leftX + 8, doc.y, { fit: [100, 100] });

    doc.moveDown(8);
    doc.fontSize(9).fillColor('#666').text(`Issued by: ${data.issuer || 'Platform'}`, { align: 'left' });
    doc.fillColor('black');
  });
}

/**
 * NIN Premium: styled official-looking slip
 */
async function createNinPremium(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'NIN Slip - Premium');

    doc.font('Helvetica-Bold').fontSize(20).text(data.fullName || '—');
    doc.moveDown(0.5);

    // Two-column key/value pairs
    const leftX = doc.x;
    const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2 - 10;

    doc.fontSize(11).font('Helvetica');
    doc.text(`NIN: ${data.nin || '—'}`, leftX, doc.y, { width: colWidth });
    doc.text(`DOB: ${data.dob || '—'}`, leftX + colWidth + 20, doc.y);
    doc.moveDown();

    doc.text(`Gender: ${data.gender || '—'}`, leftX, doc.y, { width: colWidth });
    doc.text(`Phone: ${data.phone || '—'}`, leftX + colWidth + 20, doc.y);
    doc.moveDown();

    if (data.address) {
      doc.text('Address:', leftX);
      doc.text(data.address, { indent: 10, continued: false });
      doc.moveDown();
    }

    // big QR + signature block
    const qrText = JSON.stringify({ type: 'nin_premium', nin: data.nin ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, (doc.page.width / 2) - 60, doc.y, { fit: [120, 120] });

    doc.moveDown(8);
    doc.text('Signature:', leftX);
    doc.moveDown(4);
    doc.fontSize(9).fillColor('#666').text(`Generated: ${dayjs().format('YYYY-MM-DD')}`);
    doc.fillColor('black');
  });
}

/**
 * BVN Slip (simple)
 */
async function createBvnSlip(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    await drawHeader(doc, 'BVN Slip');

    doc.fontSize(18).text(data.fullName || '—');
    doc.moveDown();

    doc.fontSize(12).text(`BVN: ${data.bvn || '—'}`);
    doc.text(`Phone: ${data.phone || '—'}`);
    doc.text(`DOB: ${data.dob || '—'}`);
    if (data.address) doc.text(`Address: ${data.address}`);

    const qrText = JSON.stringify({ type: 'bvn_slip', bvn: data.bvn ?? '', name: data.fullName });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, doc.page.width - doc.page.margins.right - 120, doc.y - 20, { fit: [100, 100] });

    doc.moveDown(6);
    doc.fontSize(10).fillColor('#666').text('This document is for verification purposes only.');
    doc.fillColor('black');
  });
}

/**
 * BVN Card (compact card-like layout)
 */
async function createBvnCard(data: PersonData) {
  return pdfFromDoc(async (doc) => {
    // small landscape card
    const cardWidth = 350;
    const cardHeight = 200;
    doc.addPage({ size: [cardWidth, cardHeight], margin: 12 });
    doc.rect(12, 12, cardWidth - 24, cardHeight - 24).stroke();

    doc.fontSize(14).font('Helvetica-Bold').text('BVN CARD', 20, 20);
    doc.fontSize(11).font('Helvetica').text(`Name: ${data.fullName || '—'}`, 20, 46);
    doc.text(`BVN: ${data.bvn || '—'}`, 20, 64);
    doc.text(`Phone: ${data.phone || '—'}`, 20, 82);

    // photo right-side
    const photoX = cardWidth - 90;
    const resolvedPhoto = await resolveImage(data.photoUrl);
    if (resolvedPhoto) {
      try { doc.image(resolvedPhoto, photoX, 36, { width: 64, height: 80, fit: [64, 80] }); } catch {}
    }

    const qrText = JSON.stringify({ type: 'bvn_card', bvn: data.bvn ?? '' });
    const qrDataUrl = await generateQrDataUrl(qrText);
    doc.image(qrDataUrl, photoX, 120, { width: 56, height: 56 });

    // no new page end: pdfFromDoc will end
  });
}

/**
 * Public API: generate specified template
 */
export async function generateNinSlip(type: NinSlipType, data: PersonData) {
  if (type === 'basic') return createNinBasic(data);
  if (type === 'improved') return createNinImproved(data);
  return createNinPremium(data);
}

export async function generateBvnTemplate(template: BvnTemplate, data: PersonData) {
  if (template === 'slip') return createBvnSlip(data);
  return createBvnCard(data);
                 }
    
