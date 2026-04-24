// Must be rendered in <head> of the root layout to prevent theme FOUC.
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");if(t!=="light"){d.classList.add("dark")}}catch(e){d.classList.add("dark")}})()`,
      }}
    />
  );
}
