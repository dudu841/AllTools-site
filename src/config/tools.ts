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
  | "social-resizer"
  | "meme-generator"
  | "banner-thumbnail-creator"
  | "compound-interest"
  | "loan-simulator"
  | "percentage-calculator"
  | "bmi-calculator"
  | "calorie-calculator"
  | "mortgage-calculator"
  | "net-gross-salary"
  | "discount-margin-markup"
  | "travel-time-calculator"
  | "apr-monthly-converter"
  | "stock-simulator"
  | "investment-simulator"
  | "bio-generator"
  | "hashtag-generator"
  | "character-counter"
  | "word-counter"
  | "qr-generator"
  | "text-case-converter"
  | "password-generator"
  | "password-strength-checker"
  | "encrypt-decrypt"
  | "age-calculator"
  | "unit-converter"
  | "base-converter"
  | "scientific-calculator"
  | "currency-converter"
  | "cm-inch-converter"
  | "kg-lbs-converter"
  | "sqm-sqft-converter"
  | "backlink-counter"
  | "rank-checker"
  | "meta-tags-checker"
  | "html-css-validator"
  | "site-speed-checker";

export const toolPaths: Record<ToolId, { en: string; pt: string; es: string }> = {
  "pdf-to-word": { en: "pdf-to-word-converter", pt: "converter-pdf-para-word", es: "convertidor-pdf-a-word" },
  "word-to-pdf": { en: "word-to-pdf-converter", pt: "converter-word-para-pdf", es: "convertidor-word-a-pdf" },
  "compress-pdf": { en: "compress-pdf", pt: "compactar-pdf", es: "comprimir-pdf" },
  "merge-pdf": { en: "merge-pdf", pt: "unir-pdf", es: "unir-pdf" },
  "split-pdf": { en: "split-pdf", pt: "dividir-pdf", es: "dividir-pdf" },
  "compress-image": { en: "image-compressor", pt: "compressor-de-imagem", es: "compresor-de-imagen" },
  "resize-image": { en: "resize-image", pt: "redimensionar-imagem", es: "redimensionar-imagen" },
  "convert-image": { en: "convert-jpg-png", pt: "converter-jpg-png", es: "convertir-jpg-png" },
  "remove-background": { en: "background-remover", pt: "removedor-de-fundo", es: "eliminador-de-fondo" },
  "adjust-image": { en: "adjust-image", pt: "ajustar-imagem", es: "ajustar-imagen" },
  "social-resizer": { en: "social-media-resizer", pt: "redimensionar-para-redes", es: "redimensionar-para-redes" },
  "meme-generator": { en: "meme-generator", pt: "gerador-de-memes", es: "generador-de-memes" },
  "banner-thumbnail-creator": { en: "banner-thumbnail-creator", pt: "criador-de-banners-miniaturas", es: "creador-de-banners-miniaturas" },
  "compound-interest": { en: "compound-interest-calculator", pt: "calculadora-de-juros-compostos", es: "calculadora-de-interes-compuesto" },
  "loan-simulator": { en: "loan-simulator", pt: "simulador-de-emprestimo", es: "simulador-de-prestamo" },
  "percentage-calculator": { en: "percentage-calculator", pt: "calculadora-de-porcentagem", es: "calculadora-de-porcentajes" },
  "bmi-calculator": { en: "bmi-calculator", pt: "calculadora-de-imc", es: "calculadora-de-imc" },
  "calorie-calculator": { en: "calorie-calculator", pt: "calculadora-de-calorias", es: "calculadora-de-calorias" },
  "mortgage-calculator": { en: "mortgage-calculator", pt: "calculadora-de-hipoteca", es: "calculadora-de-hipoteca" },
  "net-gross-salary": { en: "net-gross-salary", pt: "salario-liquido-bruto", es: "salario-neto-bruto" },
  "discount-margin-markup": { en: "discount-margin-markup", pt: "calculadora-de-desconto-margem-markup", es: "calculadora-descuento-margen-markup" },
  "travel-time-calculator": { en: "travel-time-calculator", pt: "calculadora-de-tempo-de-viagem", es: "calculadora-de-tiempo-de-viaje" },
  "apr-monthly-converter": { en: "apr-monthly-converter", pt: "conversor-apr-mensal", es: "conversor-apr-mensual" },
  "stock-simulator": { en: "stock-simulator", pt: "simulador-de-acoes", es: "simulador-de-acciones" },
  "investment-simulator": { en: "investment-simulator", pt: "simulador-de-investimentos", es: "simulador-de-inversiones" },
  "bio-generator": { en: "bio-generator", pt: "gerador-de-bio", es: "generador-de-bio" },
  "hashtag-generator": { en: "hashtag-generator", pt: "gerador-de-hashtags", es: "generador-de-hashtags" },
  "character-counter": { en: "character-counter", pt: "contador-de-caracteres", es: "contador-de-caracteres" },
  "word-counter": { en: "word-counter", pt: "contador-de-palavras", es: "contador-de-palabras" },
  "qr-generator": { en: "qr-code-generator", pt: "gerador-de-qr-code", es: "generador-de-codigo-qr" },
  "text-case-converter": { en: "text-case-converter", pt: "conversor-de-texto", es: "conversor-de-texto" },
  "password-generator": { en: "password-generator", pt: "gerador-de-senha", es: "generador-de-contrasenas" },
  "password-strength-checker": { en: "password-strength-checker", pt: "verificador-de-forca-da-senha", es: "verificador-de-fuerza-de-contrasena" },
  "encrypt-decrypt": { en: "encrypt-decrypt-online", pt: "criptografia-descriptografia-online", es: "encriptar-desencriptar-online" },
  "age-calculator": { en: "age-calculator", pt: "calculadora-de-idade", es: "calculadora-de-edad" },
  "unit-converter": { en: "unit-converter", pt: "conversor-de-medidas", es: "conversor-de-unidades" },
  "base-converter": { en: "base-converter", pt: "conversor-de-base-numerica", es: "conversor-de-base-numerica" },
  "scientific-calculator": { en: "scientific-calculator", pt: "calculadora-cientifica-online", es: "calculadora-cientifica-online" },
  "currency-converter": { en: "currency-converter", pt: "conversor-de-moedas", es: "conversor-de-monedas" },
  "cm-inch-converter": { en: "cm-inch-converter", pt: "conversor-cm-para-inch", es: "conversor-cm-a-inch" },
  "kg-lbs-converter": { en: "kg-lbs-converter", pt: "conversor-kg-para-lbs", es: "conversor-kg-a-lbs" },
  "sqm-sqft-converter": { en: "sqm-sqft-converter", pt: "conversor-m2-para-ft2", es: "conversor-m2-a-ft2" },
  "backlink-counter": { en: "backlink-counter", pt: "contador-de-backlinks", es: "contador-de-backlinks" },
  "rank-checker": { en: "rank-checker", pt: "verificador-de-rank", es: "verificador-de-rank" },
  "meta-tags-checker": { en: "meta-tags-checker", pt: "verificador-de-meta-tags", es: "verificador-de-meta-tags" },
  "html-css-validator": { en: "html-css-validator", pt: "validador-html-css", es: "validador-html-css" },
  "site-speed-checker": { en: "site-speed-checker", pt: "velocidade-do-site", es: "velocidad-del-sitio" },
};

export const categories = [
  {
    id: "pdf",
    icon: "FileText",
    tools: ["pdf-to-word", "word-to-pdf", "compress-pdf", "merge-pdf", "split-pdf"],
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
      "social-resizer",
      "meme-generator",
      "banner-thumbnail-creator",
    ],
  },
  {
    id: "finance",
    icon: "DollarSign",
    tools: [
      "compound-interest",
      "loan-simulator",
      "percentage-calculator",
      "bmi-calculator",
      "calorie-calculator",
      "mortgage-calculator",
      "net-gross-salary",
      "discount-margin-markup",
      "travel-time-calculator",
      "apr-monthly-converter",
      "stock-simulator",
      "investment-simulator",
    ],
  },
  {
    id: "social",
    icon: "Share2",
    tools: ["bio-generator", "hashtag-generator", "character-counter", "word-counter"],
  },
  {
    id: "utilities",
    icon: "Wrench",
    tools: [
      "qr-generator",
      "text-case-converter",
      "password-generator",
      "password-strength-checker",
      "encrypt-decrypt",
      "age-calculator",
      "unit-converter",
      "base-converter",
      "scientific-calculator",
      "currency-converter",
      "cm-inch-converter",
      "kg-lbs-converter",
      "sqm-sqft-converter",
      "backlink-counter",
      "rank-checker",
      "meta-tags-checker",
      "html-css-validator",
      "site-speed-checker",
    ],
  },
] as const;
