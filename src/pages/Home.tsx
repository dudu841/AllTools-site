import { Link } from "react-router-dom"
import SEO from "../components/SEO"

const pdfTools = [
  { href: "/pt/converter-pdf-para-word", label: "Converter PDF para Word" },
  { href: "/pt/compactar-pdf", label: "Compactar PDF" },
  { href: "/pt/unir-pdf", label: "Unir PDF" },
  { href: "/pt/dividir-pdf", label: "Dividir PDF" },
]

const imageTools = [
  { href: "/pt/compressor-de-imagem", label: "Compressor de Imagem" },
  { href: "/pt/redimensionar-imagem", label: "Redimensionar Imagem" },
  { href: "/pt/converter-jpg-png", label: "Converter JPG para PNG" },
  { href: "/pt/removedor-de-fundo", label: "Removedor de Fundo" },
]

const financeTools = [
  { href: "/pt/calculadora-de-juros-compostos", label: "Calculadora de Juros Compostos" },
  { href: "/pt/simulador-de-emprestimo", label: "Simulador de Empréstimo" },
  { href: "/pt/calculadora-de-porcentagem", label: "Calculadora de Porcentagem" },
]

const highlights = [
  "Ferramentas 100% online",
  "Sem necessidade de cadastro",
  "Compatível com celular, tablet e computador",
  "Processamento rápido",
  "Privacidade e segurança dos arquivos",
]

function ToolCard({ title, tools }: { title: string; tools: { href: string; label: string }[] }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
      <ul className="space-y-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              to={tool.href}
              className="font-medium text-emerald-700 transition-colors hover:text-emerald-600 hover:underline"
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
  return (
    <>
      <SEO
        title="Toolss – Ferramentas Online Gratuitas"
        description="Use ferramentas online gratuitas para converter PDF, compactar arquivos, editar imagens e muito mais."
      />

      <div className="space-y-8">
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Toolss - Sua Caixa de Ferramentas Online Gratuita
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-gray-700">
            A Toolss é uma plataforma completa de ferramentas online gratuitas desenvolvidas para facilitar sua
            vida digital. Aqui você pode converter PDF, compactar arquivos, editar imagens, utilizar calculadoras
            financeiras e muito mais — tudo direto no navegador, sem instalação e sem cadastro.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ToolCard title="Ferramentas para PDF" tools={pdfTools} />
          <ToolCard title="Ferramentas para Imagem" tools={imageTools} />
          <ToolCard title="Calculadoras Online" tools={financeTools} />
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Por que escolher a Toolss?</h2>
          <ul className="grid list-disc gap-2 pl-6 text-gray-700 md:grid-cols-2">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Segurança e Privacidade</h2>
          <p className="text-gray-700">
            Na Toolss, levamos sua privacidade a sério. Os arquivos enviados são processados de forma segura e não
            são armazenados permanentemente. Nosso objetivo é oferecer uma experiência simples, rápida e confiável.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">As ferramentas da Toolss são gratuitas?</h3>
              <p>Sim, todas as ferramentas disponíveis são gratuitas para uso online.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Preciso criar uma conta?</h3>
              <p>Não. Você pode usar as ferramentas sem cadastro.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Funciona no celular?</h3>
              <p>Sim, a Toolss é totalmente responsiva e funciona em qualquer dispositivo.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
