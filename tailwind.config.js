/** @type {import('tailwindcss').Config} */
export default {
  // O 'content' diz ao Tailwind onde procurar as classes que você usa
  // Ele vai escanear todos os arquivos .html e todos os arquivos .js, .ts, .jsx, .tsx dentro da pasta src/
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Você pode estender o tema padrão do Tailwind aqui
      // Por exemplo, adicionar novas cores, fontes, etc.
    },
  },
  plugins: [], // Plugins adicionais do Tailwind podem ser configurados aqui
}
