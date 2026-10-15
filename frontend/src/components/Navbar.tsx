export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="brand">
          <img src="/src/assets/logo.webp" alt="Find a Teacher" className="brand-logo" />
        </a>

        <nav className="nav-links">
          <a
            href="https://kingoflanguages.com.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Início
          </a>

          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-trigger">
              Cursos
              <svg
                className="nav-caret"
                width="10"
                height="6"
                viewBox="0 0 10 6"
                aria-hidden="true"
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="nav-dropdown-menu">
              <a
                href="https://kingoflanguages.com.br/cursos/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Todos os cursos
              </a>
              <a
                href="https://kingoflanguages.com.br/cursos/#aulas-particulares"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aulas Particulares
              </a>
            </div>
          </div>

          <a
            href="https://kingoflanguages.com.br/sobre-nos/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sobre nós
          </a>

          <a
            href="https://kingoflanguages.com.br/conteudos/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conteúdos
          </a>

          <a
            href="https://kingoflanguages.com.br/teste-seu-nivel/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Teste seu nível
          </a>
        </nav>

        <a
          href="https://kingoflanguages.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          Saiba Mais
        </a>
      </div>
    </header>
  );
}