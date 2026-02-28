export type ToolId =
  | "pdf-to-word"
  | "word-to-pdf"
  | "compress-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "compress-image"
  | "resize-image"
  | "convert-image"
  | "remove-background"
  | "adjust-image"
  | "compound-interest"
  | "loan-simulator"
  | "percentage-calculator"
  | "bio-generator"
  | "hashtag-generator"
  | "character-counter"
  | "qr-generator"
  | "password-generator"
  | "age-calculator"
  | "unit-converter";

export const toolPaths: Record<ToolId, { en: string; pt: string; es: string }> =
  {
    "pdf-to-word": {
      en: "pdf-to-word-converter",
      pt: "converter-pdf-para-word",
      es: "convertidor-pdf-a-word",
    },
    "word-to-pdf": {
      en: "word-to-pdf-converter",
      pt: "converter-word-para-pdf",
      es: "convertidor-word-a-pdf",
    },
    "compress-pdf": {
      en: "compress-pdf",
      pt: "compactar-pdf",
      es: "comprimir-pdf",
    },
    "merge-pdf": { en: "merge-pdf", pt: "unir-pdf", es: "unir-pdf" },
    "split-pdf": { en: "split-pdf", pt: "dividir-pdf", es: "dividir-pdf" },
    "compress-image": {
      en: "image-compressor",
      pt: "compressor-de-imagem",
      es: "compresor-de-imagen",
    },
    "resize-image": {
      en: "resize-image",
      pt: "redimensionar-imagem",
      es: "redimensionar-imagen",
    },
    "convert-image": {
      en: "convert-jpg-png",
      pt: "converter-jpg-png",
      es: "convertir-jpg-png",
    },
    "remove-background": {
      en: "background-remover",
      pt: "removedor-de-fundo",
      es: "eliminador-de-fondo",
    },
    "adjust-image": {
      en: "adjust-image",
      pt: "ajustar-imagem",
      es: "ajustar-imagen",
    },
    "compound-interest": {
      en: "compound-interest-calculator",
      pt: "calculadora-de-juros-compostos",
      es: "calculadora-de-interes-compuesto",
    },
    "loan-simulator": {
      en: "loan-simulator",
      pt: "simulador-de-emprestimo",
      es: "simulador-de-prestamo",
    },
    "percentage-calculator": {
      en: "percentage-calculator",
      pt: "calculadora-de-porcentagem",
      es: "calculadora-de-porcentajes",
    },
    "bio-generator": {
      en: "bio-generator",
      pt: "gerador-de-bio",
      es: "generador-de-bio",
    },
    "hashtag-generator": {
      en: "hashtag-generator",
      pt: "gerador-de-hashtags",
      es: "generador-de-hashtags",
    },
    "character-counter": {
      en: "character-counter",
      pt: "contador-de-caracteres",
      es: "contador-de-caracteres",
    },
    "qr-generator": {
      en: "qr-code-generator",
      pt: "gerador-de-qr-code",
      es: "generador-de-codigo-qr",
    },
    "password-generator": {
      en: "password-generator",
      pt: "gerador-de-senha",
      es: "generador-de-contrasenas",
    },
    "age-calculator": {
      en: "age-calculator",
      pt: "calculadora-de-idade",
      es: "calculadora-de-edad",
    },
    "unit-converter": {
      en: "unit-converter",
      pt: "conversor-de-medidas",
      es: "conversor-de-unidades",
    },
  };

export const categories = [
  {
    id: "pdf",
    icon: "FileText",
    tools: [
      "pdf-to-word",
      "word-to-pdf",
      "compress-pdf",
      "merge-pdf",
      "split-pdf",
    ],
  },
  {
    id: "image",
    icon: "Image",
    tools: [
      "compress-image",
      "resize-image",
      "convert-image",
      "remove-background",
      "adjust-image",
    ],
  },
  {
    id: "finance",
    icon: "DollarSign",
    tools: ["compound-interest", "loan-simulator", "percentage-calculator"],
  },
  {
    id: "social",
    icon: "Share2",
    tools: ["bio-generator", "hashtag-generator", "character-counter"],
  },
  {
    id: "utilities",
    icon: "Wrench",
    tools: [
      "qr-generator",
      "password-generator",
      "age-calculator",
      "unit-converter",
    ],
  },
];
