// CSS Animation styles for Satbara AI Analyzer

export const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes modalEnter {
    from { opacity: 0; transform: translateY(24px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes backdropEnter {
    from { opacity: 0; backdrop-filter: blur(0px); }
    to { opacity: 1; backdrop-filter: blur(12px); }
  }
  @keyframes floatUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes staggerFade {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
    50% { box-shadow: 0 0 20px 4px rgba(251, 191, 36, 0.2); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes macPageEnter {
    from { 
      opacity: 0; 
      transform: translateX(60px) scale(0.96); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }
  @keyframes macPageExit {
    from { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
    to { 
      opacity: 0; 
      transform: translateX(-30px) scale(0.98); 
    }
  }
  @keyframes dropdownEnter {
    from { 
      opacity: 0; 
      transform: translateY(-8px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  .animate-page-enter {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-mac-page {
    animation: macPageEnter 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
  .animate-slide-up {
    animation: floatUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-slide-down {
    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-slide-right {
    animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-slide-left {
    animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-scale-in {
    animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-modal {
    animation: modalEnter 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
  .animate-backdrop {
    animation: backdropEnter 0.3s ease-out forwards;
  }
  .animate-dropdown {
    animation: dropdownEnter 0.2s cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
  .animate-stagger-1 { animation: staggerFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards; opacity: 0; }
  .animate-stagger-2 { animation: staggerFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
  .animate-stagger-3 { animation: staggerFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
  .animate-stagger-4 { animation: staggerFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
  .animate-stagger-5 { animation: staggerFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards; opacity: 0; }
  .animate-stagger-6 { animation: staggerFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
  
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0,0,0,0.5);
  }
  .hover-scale {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hover-scale:hover {
    transform: scale(1.02);
  }
  .hover-glow:hover {
    box-shadow: 0 0 30px -5px rgba(251, 191, 36, 0.3);
  }
  
  .btn-press {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-press:active {
    transform: scale(0.97);
  }
`;

export const printStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  @media print {
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      background: white !important;
      color: #000 !important;
      font-family: 'Inter', Arial, sans-serif !important;
      font-size: 8pt !important;
      line-height: 1.3 !important;
    }
    
    .no-print {
      display: none !important;
    }
    
    .print-only {
      display: block !important;
    }
    
    .print-header {
      border-bottom: 2px solid #000 !important;
      padding-bottom: 6px !important;
      margin-bottom: 10px !important;
    }
    
    .print-section {
      page-break-inside: avoid !important;
      margin-bottom: 8px !important;
    }
    
    .print-section-title {
      font-size: 9pt !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      border-bottom: 1px solid #000 !important;
      padding-bottom: 2px !important;
      margin-bottom: 5px !important;
      margin-top: 6px !important;
    }
    
    .print-label {
      font-size: 7pt !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      color: #555 !important;
    }
    
    .print-value {
      font-size: 8pt !important;
      font-weight: 500 !important;
      color: #000 !important;
    }
    
    .print-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 4px !important;
      margin: 4px 0 !important;
    }
    
    .print-box {
      border: 1px solid #ddd !important;
      padding: 5px !important;
      background: #f9f9f9 !important;
      margin-bottom: 5px !important;
    }
    
    .print-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 5px 0 !important;
      font-size: 7pt !important;
    }
    
    .print-table th {
      background: #e5e5e5 !important;
      border: 1px solid #000 !important;
      padding: 3px !important;
      text-align: left !important;
      font-weight: 700 !important;
    }
    
    .print-table td {
      border: 1px solid #ccc !important;
      padding: 3px !important;
    }
    
    .print-warning {
      border: 1px solid #d97706 !important;
      background: #fef3c7 !important;
      padding: 5px !important;
      margin: 5px 0 !important;
    }
    
    .print-footer {
      position: fixed !important;
      bottom: 3mm !important;
      left: 0 !important;
      right: 0 !important;
      text-align: center !important;
      font-size: 6pt !important;
      color: #666 !important;
      border-top: 1px solid #ccc !important;
      padding-top: 3px !important;
    }
  }
  
  .print-only {
    display: none;
  }
`;
