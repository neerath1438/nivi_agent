import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './Layout.css'

const Layout = ({ children, searchQuery, setSearchQuery }) => {
  return (
    <div className="wui-shell">
      <div className="wui-spirit">Wersel Components</div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="wui-theater">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

