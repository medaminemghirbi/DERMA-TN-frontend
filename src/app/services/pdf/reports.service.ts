import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor() {}

  generatePDF(data: any) {
    const doc = new jsPDF();

    data.forEach((item: any, index: number) => {
      let y = 20;

      // Certificate Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 128); // Dark Blue Color
      doc.text('Online Reservation Certificate', 105, y, { align: 'center' });
      y += 20;

      // Status
      let status = item.status.toLowerCase(); // Convert status to lowercase for consistency

      switch (status) {
        case 'approved':
          doc.setTextColor(0, 128, 0); // Green
          doc.text('Reservation: Accepted.', 10, y);
          break;
        case 'pending':
          doc.setTextColor(255, 165, 0); // Orange
          doc.text('Reservation: in progress..', 10, y);
          break;
        case 'rejected':
          doc.setTextColor(255, 0, 0); // Red
          doc.text('Reservation: Rejected :(', 10, y);
          break;
        default:
          doc.setTextColor(0, 0, 0); // Black
          doc.text(`Reservation: ${item.status}`, 10, y);
      }

      y += 15;

      // Horizontal Line
      doc.setDrawColor(0, 0, 128); // Dark Blue
      doc.line(10, y, 200, y);
      y += 10;

      // Doctor Information
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black
      doc.text('Doctor Information', 10, y);
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black

      const bullet = String.fromCharCode(8226); // Unicode for bullet point
      const xOffset = 10;
      const yOffset = 10;

      // Location
      doc.text(`${bullet} Gouvernament: ${item.doctor.location}`, xOffset, y);
      y += yOffset;

      // Description
      doc.text(`${bullet} Description: ${item.doctor.description}`, xOffset, y);
      y += yOffset;

      // Phone Number
      doc.text(`${bullet} Phone Number: ${item.doctor.phone_number ? '+216 ' + item.doctor.phone_number : '-'}`, xOffset, y);
      y += 10;

      // Horizontal Line
      doc.line(10, y, 200, y);
      y += 10;

      // Patient Information
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black
      doc.text('Patient Information', 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Patient: ${item.patient.firstname} ${item.patient.lastname}`, 10, y);
      y += 6;
      doc.text(`Patient Phone: +216 ${item.patient.phone_number}`, 10, y);
      y += 6;
      doc.text(`Date of Appointment: ${item.created_at}`, 10, y);
      y += 10;
      if (item.refus_reason && item.refus_reason.trim() !== '') {
        doc.text(`Reason for Refusal: ${item.refus_reason}`, 10, y);
        y += 10;
      }

      // Certificate Body Text
      y += 10;
      doc.setFontSize(12);
      doc.text(`This is to certify that ${item.patient.firstname} ${item.patient.lastname}`, 10, y);
      y += 6;
      doc.text(`has successfully reserved an appointment with Dr. ${item.doctor.firstname} ${item.doctor.lastname}`, 10, y);
      y += 6;
      doc.text(`via our platform on ${item.created_at}.`, 10, y);
      if (item.refus_reason && item.refus_reason.trim() !== '') {
        y += 6;
        doc.text(`The patient is advised to take necessary care cause no appointement are empty .`, 10, y);
  
      }
      y += 20;

      // Doctor's Signature Placeholder
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black
      doc.text('_________________________', 10, y);
      y += 10;
      doc.text('Doctor Signature', 10, y);

      // Add a new page if necessary
      if (index < data.length - 1) {
        doc.addPage();
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black
    doc.text('This document is generated for medical purposes only.', 105, doc.internal.pageSize.height - 10, { align: 'center' });

    // Save the PDF
    doc.save('medical_certificate.pdf');
  }
}
