import App from "./app"


const portURI = process.env.PORT_URI_SERVER || 5000
const runServer = async () => {
  try {
    App.listen(portURI, () => {
      console.log(`Servidor online, ouvindo a porta: ${portURI}`)
    })
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error)
    process.exit(1)
  }
}
runServer()
