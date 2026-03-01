import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Toolss - Ferramentas Online Gratuitas para PDF, Imagens, Calculadoras e Mais"
        description="Use ferramentas online gratuitas para PDF, imagens, calculadoras financeiras e utilitários digitais. Rápido, seguro e sem cadastro."
      />

      <div className="container">

        <h1>Toolss - Sua Caixa de Ferramentas Online Gratuita</h1>

        <p>
          A Toolss é uma plataforma completa de ferramentas online gratuitas
          desenvolvidas para facilitar sua vida digital. Aqui você pode
          converter PDF, compactar arquivos, editar imagens, utilizar
          calculadoras financeiras e muito mais — tudo direto no navegador,
          sem instalação e sem cadastro.
        </p>

        <h2>Ferramentas para PDF</h2>
        <ul>
          <li><a href="/pt/converter-pdf-para-word">Converter PDF para Word</a></li>
          <li><a href="/pt/compactar-pdf">Compactar PDF</a></li>
          <li><a href="/pt/unir-pdf">Unir PDF</a></li>
          <li><a href="/pt/dividir-pdf">Dividir PDF</a></li>
        </ul>

        <h2>Ferramentas para Imagem</h2>
        <ul>
          <li><a href="/pt/compressor-de-imagem">Compressor de Imagem</a></li>
          <li><a href="/pt/redimensionar-imagem">Redimensionar Imagem</a></li>
          <li><a href="/pt/converter-jpg-png">Converter JPG para PNG</a></li>
          <li><a href="/pt/removedor-de-fundo">Removedor de Fundo</a></li>
        </ul>

        <h2>Calculadoras Online</h2>
        <ul>
          <li><a href="/pt/calculadora-de-juros-compostos">Calculadora de Juros Compostos</a></li>
          <li><a href="/pt/simulador-de-emprestimo">Simulador de Empréstimo</a></li>
          <li><a href="/pt/calculadora-de-porcentagem">Calculadora de Porcentagem</a></li>
        </ul>

        <h2>Por que escolher a Toolss?</h2>
        <ul>
          <li>Ferramentas 100% online</li>
          <li>Sem necessidade de cadastro</li>
          <li>Compatível com celular, tablet e computador</li>
          <li>Processamento rápido</li>
          <li>Privacidade e segurança dos arquivos</li>
        </ul>

        <h2>Segurança e Privacidade</h2>
        <p>
          Na Toolss, levamos sua privacidade a sério. Os arquivos enviados
          são processados de forma segura e não são armazenados permanentemente.
          Nosso objetivo é oferecer uma experiência simples, rápida e confiável.
        </p>

        <h2>Perguntas Frequentes</h2>

        <h3>As ferramentas da Toolss são gratuitas?</h3>
        <p>Sim, todas as ferramentas disponíveis são gratuitas para uso online.</p>

        <h3>Preciso criar uma conta?</h3>
        <p>Não. Você pode usar as ferramentas sem cadastro.</p>

        <h3>Funciona no celular?</h3>
        <p>Sim, a Toolss é totalmente responsiva e funciona em qualquer dispositivo.</p>

      </div>
    </>
  );
}
