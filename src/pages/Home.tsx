import { Link, useParams } from "react-router-dom"
import SEO from "../components/SEO"

const pdfTools = [
  { slug: "converter-pdf-para-word", label: "Converter PDF para Word" },
  { slug: "compactar-pdf", label: "Compactar PDF" },
  { slug: "unir-pdf", label: "Unir PDF" },
  { slug: "dividir-pdf", label: "Dividir PDF" },
]

const imageTools = [
  { slug: "compressor-de-imagem", label: "Compressor de Imagem" },
  { slug: "redimensionar-imagem", label: "Redimensionar Imagem" },
  { slug: "converter-jpg-png", label: "Converter JPG para PNG" },
  { slug: "removedor-de-fundo", label: "Removedor de Fundo" },
]

const financeTools = [
  { slug: "calculadora-de-juros-compostos", label: "Calculadora de Juros Compostos" },
  { slug: "simulador-de-emprestimo", label: "Simulador de Empréstimo" },
  { slug: "calculadora-de-porcentagem", label: "Calculadora de Porcentagem" },
]

const highlights = [
  "Ferramentas 100% online",
  "Sem necessidade de cadastro",
  "Compatível com celular, tablet e computador",
  "Processamento rápido",
  "Privacidade e segurança dos arquivos",
]

type ToolItem = { slug: string; label: string }

function ToolCard({ title, tools, lang }: { title: string; tools: ToolItem[]; lang: string }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">{title}</h2>
      <ul className="space-y-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              to={`/${lang}/${tool.slug}`}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800 hover:underline sm:text-base"
            >
              {tool.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  const { lang = "pt" } = useParams<{ lang: string }>()

  return (
    <>
      <SEO
        title="Toolss – Ferramentas Online Gratuitas"
        description="Use ferramentas online gratuitas para converter PDF, compactar arquivos, editar imagens e muito mais."
      />

      <div className="space-y-6 sm:space-y-8">
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 sm:text-sm">
              Sem cadastro
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 sm:text-sm">
              100% online
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:mt-4 sm:text-4xl">
            Toolss - Sua Caixa de Ferramentas Online Gratuita
          </h1>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-gray-700 sm:mt-4 sm:text-lg">
            A Toolss é uma plataforma completa de ferramentas online gratuitas desenvolvidas para facilitar sua
            vida digital. Aqui você pode converter PDF, compactar arquivos, editar imagens, utilizar calculadoras
            financeiras e muito mais — tudo direto no navegador, sem instalação e sem cadastro.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <ToolCard title="Ferramentas para PDF" tools={pdfTools} lang={lang} />
          <ToolCard title="Ferramentas para Imagem" tools={imageTools} lang={lang} />
          <ToolCard title="Calculadoras Online" tools={financeTools} lang={lang} />
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">Por que escolher a Toolss?</h2>
          <ul className="grid list-disc gap-2 pl-5 text-sm text-gray-700 sm:pl-6 sm:text-base md:grid-cols-2">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl">Segurança e Privacidade</h2>
          <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
            Na Toolss, levamos sua privacidade a sério. Os arquivos enviados são processados de forma segura e não
            são armazenados permanentemente. Nosso objetivo é oferecer uma experiência simples, rápida e confiável.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">Perguntas Frequentes</h2>
          <div className="space-y-4 text-sm text-gray-700 sm:text-base">
            <div>
              <h3 className="text-base font-semibold text-gray-900 sm:text-lg">As ferramentas da Toolss são gratuitas?</h3>
              <p>Sim, todas as ferramentas disponíveis são gratuitas para uso online.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Preciso criar uma conta?</h3>
              <p>Não. Você pode usar as ferramentas sem cadastro.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Funciona no celular?</h3>
              <p>Sim, a Toolss é totalmente responsiva e funciona em qualquer dispositivo.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
