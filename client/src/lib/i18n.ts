// Internationalization support for Hawaiian insurance app
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' }
};

export const translations = {
  en: {
    // Header
    'header.title': 'Aloha Shield AI',
    'header.subtitle': 'Licensed State of Hawaii Property & Casualty, Life & Health, and Notary Public',
    'header.coverage': 'Coverage',
    'header.claims': 'Claims',
    'header.support': 'Support',
    'header.account': 'Account',

    // Sidebar
    'sidebar.getQuote': 'Get Quote',
    'sidebar.quoteSubtitle': 'ETHquake, Flood, Volcano',
    'sidebar.documents': 'Documents',
    'sidebar.documentsSubtitle': 'Upload & Manage',
    'sidebar.fileClaim': 'File Claim',
    'sidebar.claimSubtitle': 'Natural disaster claims',
    'sidebar.myPolicies': 'My Policies',
    'sidebar.policiesSubtitle': 'View & manage',
    'sidebar.calculator': 'Premium Calculator',
    'sidebar.insuranceType': 'Insurance Type',
    'sidebar.ethquake': 'ETHquake (Blockchain/EtherISC)',
    'sidebar.flood': 'Flood (FEMA Coverage)',
    'sidebar.volcano': 'Volcano/Lava Insurance',
    'sidebar.coverage': 'Coverage Amount',
    'sidebar.estimatedPremium': 'Estimated Premium',
    'sidebar.hawaiiSpecialist': 'Hawaii Specialist',
    'sidebar.rating': '4.9/5 Rating',
    'sidebar.ethquakeTitle': 'ETHquake Blockchain Insurance',
    'sidebar.coverageTypes': 'ETHquake + FEMA Flood + Volcano Coverage',

    // Chat Interface
    'chat.welcome': 'Aloha! I\'m your Ethereum Blockchain Parametric Smart Contract Natural Disaster Insurance specialist. Licensed State of Hawaii Property & Casualty, Life & Health, and Notary Public. I can help you with:',
    'chat.ethquakeInsurance': 'ETHquake blockchain insurance (EtherISC)',
    'chat.femaCoverage': 'FEMA flood insurance coverage',
    'chat.volcanoInsurance': 'Volcano insurance (fire, explosion, ash fall)',
    'chat.lavaCoverage': 'Lava zone coverage via HPIA',
    'chat.smartContracts': 'Parametric smart contract policies',
    'chat.placeholder': 'Ask about ETHquake, flood, or volcano insurance...',
    'chat.send': 'Send',

    // Document Upload
    'documents.title': 'Document Upload & Management',
    'documents.uploadTitle': 'Upload Documents',
    'documents.documentType': 'Document Type',
    'documents.selectType': 'Select document type',
    'documents.propertyDeed': 'Property Deed',
    'documents.damageReport': 'Damage Report',
    'documents.insuranceForm': 'Insurance Form',
    'documents.photo': 'Photo/Image',
    'documents.inspectionReport': 'Inspection Report',
    'documents.other': 'Other',
    'documents.dragDrop': 'Drag & drop a document here, or click to select',
    'documents.supportedFormats': 'Supports PDF, images, and text documents (max 10MB)',
    'documents.uploading': 'Uploading and processing...',
    'documents.uploadedDocuments': 'Uploaded Documents',
    'documents.noDocuments': 'No documents uploaded yet.',
    'documents.loading': 'Loading documents...',
    'documents.needProfile': 'Please create a customer profile to upload documents.',

    // Quote Modal
    'quote.title': 'Get Your Hawaii Natural Disaster Insurance Quote',
    'quote.subtitle': 'Complete the form below to receive a personalized quote for ETHquake, flood, or volcano insurance coverage in the Hawaiian Islands.',
    'quote.personalInfo': 'Personal Information',
    'quote.firstName': 'First Name',
    'quote.lastName': 'Last Name',
    'quote.email': 'Email',
    'quote.phone': 'Phone (optional)',
    'quote.zipCode': 'ZIP Code',
    'quote.propertyInfo': 'Property Information',
    'quote.homeType': 'Home Type',
    'quote.homeAge': 'Home Age (years)',
    'quote.insuranceDetails': 'Insurance Details',
    'quote.coverageAmount': 'Coverage Amount',
    'quote.getQuote': 'Get Quote',
    'quote.creating': 'Creating quote...',

    // Common
    'common.month': 'month',
    'common.processing': 'Processing...',
    'common.failed': 'Failed',
    'common.completed': 'Completed',
    'common.pending': 'Pending',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel'
  },

  es: {
    // Header
    'header.title': 'Aloha Shield AI',
    'header.subtitle': 'Licenciado del Estado de Hawaii para Propiedad y Accidentes, Vida y Salud, y Notario Público',
    'header.coverage': 'Cobertura',
    'header.claims': 'Reclamos',
    'header.support': 'Soporte',
    'header.account': 'Cuenta',

    // Sidebar
    'sidebar.getQuote': 'Obtener Cotización',
    'sidebar.quoteSubtitle': 'ETHquake, Inundación, Volcán',
    'sidebar.documents': 'Documentos',
    'sidebar.documentsSubtitle': 'Subir y Gestionar',
    'sidebar.fileClaim': 'Presentar Reclamo',
    'sidebar.claimSubtitle': 'Reclamos por desastres naturales',
    'sidebar.myPolicies': 'Mis Pólizas',
    'sidebar.policiesSubtitle': 'Ver y gestionar',
    'sidebar.calculator': 'Calculadora de Primas',
    'sidebar.insuranceType': 'Tipo de Seguro',
    'sidebar.ethquake': 'ETHquake (Blockchain/EtherISC)',
    'sidebar.flood': 'Inundación (Cobertura FEMA)',
    'sidebar.volcano': 'Seguro de Volcán/Lava',
    'sidebar.coverage': 'Monto de Cobertura',
    'sidebar.estimatedPremium': 'Prima Estimada',
    'sidebar.hawaiiSpecialist': 'Especialista en Hawaii',
    'sidebar.rating': 'Calificación 4.9/5',
    'sidebar.ethquakeTitle': 'Seguro Blockchain ETHquake',
    'sidebar.coverageTypes': 'Cobertura ETHquake + FEMA Inundación + Volcán',

    // Chat Interface
    'chat.welcome': '¡Aloha! Soy su especialista en Seguros de Desastres Naturales con Contratos Inteligentes Paramétricos de Blockchain Ethereum. Licenciado del Estado de Hawaii para Propiedad y Accidentes, Vida y Salud, y Notario Público. Puedo ayudarle con:',
    'chat.ethquakeInsurance': 'Seguro blockchain ETHquake (EtherISC)',
    'chat.femaCoverage': 'Cobertura de seguro de inundación FEMA',
    'chat.volcanoInsurance': 'Seguro de volcán (fuego, explosión, caída de ceniza)',
    'chat.lavaCoverage': 'Cobertura de zona de lava vía HPIA',
    'chat.smartContracts': 'Pólizas de contratos inteligentes paramétricos',
    'chat.placeholder': 'Pregunte sobre seguros ETHquake, inundación o volcán...',
    'chat.send': 'Enviar',

    // Document Upload
    'documents.title': 'Carga y Gestión de Documentos',
    'documents.uploadTitle': 'Subir Documentos',
    'documents.documentType': 'Tipo de Documento',
    'documents.selectType': 'Seleccionar tipo de documento',
    'documents.propertyDeed': 'Escritura de Propiedad',
    'documents.damageReport': 'Informe de Daños',
    'documents.insuranceForm': 'Formulario de Seguro',
    'documents.photo': 'Foto/Imagen',
    'documents.inspectionReport': 'Informe de Inspección',
    'documents.other': 'Otro',
    'documents.dragDrop': 'Arrastre y suelte un documento aquí, o haga clic para seleccionar',
    'documents.supportedFormats': 'Admite PDF, imágenes y documentos de texto (máx. 10MB)',
    'documents.uploading': 'Subiendo y procesando...',
    'documents.uploadedDocuments': 'Documentos Subidos',
    'documents.noDocuments': 'No se han subido documentos aún.',
    'documents.loading': 'Cargando documentos...',
    'documents.needProfile': 'Por favor cree un perfil de cliente para subir documentos.',

    // Quote Modal
    'quote.title': 'Obtenga su Cotización de Seguro contra Desastres Naturales de Hawaii',
    'quote.subtitle': 'Complete el formulario a continuación para recibir una cotización personalizada para cobertura de seguro ETHquake, inundación o volcán en las Islas Hawaianas.',
    'quote.personalInfo': 'Información Personal',
    'quote.firstName': 'Nombre',
    'quote.lastName': 'Apellido',
    'quote.email': 'Correo Electrónico',
    'quote.phone': 'Teléfono (opcional)',
    'quote.zipCode': 'Código Postal',
    'quote.propertyInfo': 'Información de la Propiedad',
    'quote.homeType': 'Tipo de Casa',
    'quote.homeAge': 'Edad de la Casa (años)',
    'quote.insuranceDetails': 'Detalles del Seguro',
    'quote.coverageAmount': 'Monto de Cobertura',
    'quote.getQuote': 'Obtener Cotización',
    'quote.creating': 'Creando cotización...',

    // Common
    'common.month': 'mes',
    'common.processing': 'Procesando...',
    'common.failed': 'Fallido',
    'common.completed': 'Completado',
    'common.pending': 'Pendiente',
    'common.delete': 'Eliminar',
    'common.view': 'Ver',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar'
  }
};

export function getTranslation(key: string, language: string = 'en'): string {
  const langTranslations = translations[language as keyof typeof translations] || translations.en;
  return langTranslations[key as keyof typeof langTranslations] || translations.en[key as keyof typeof translations.en] || key;
}

export function getCurrentLanguage(): string {
  return localStorage.getItem('language') || 'en';
}

export function setCurrentLanguage(language: string): void {
  localStorage.setItem('language', language);
}