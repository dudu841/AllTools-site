import { Helmet } from "react-helmet"

interface SEOProps {
  title: string
  description: string
}

export default function SEO({ title, description }: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}
