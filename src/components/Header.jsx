import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
  const fetching = useIsFetching() //number = 0 if is not fetching and >0 if is fetching
  return (
    <>
      <div id="main-header-loading">
       {fetching && <progress />} 
      </div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
