import { Link } from "react-router-dom"

type PropsLinkTo={
  to: string
  children: React.ReactNode
}

export const LinkTo:React.FC<PropsLinkTo> = ({to, children}) => {
  const goToTop = () => {
    window.scrollTo(0,0)
  }
  return <Link to={to} onClick={() => goToTop()}>{children}</Link>
}