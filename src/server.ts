import App from "./app"

const portURI = process.env.PORT || 5000
const runServer = async () => {
  try {
    App.listen(portURI, () => {
      console.log(`Servidor online, ouvindo a porta: ${portURI}`)
    })
  } catch (error) {
    console.log("Houve um erro: ", error)
    process.exit(1)
  }
}
runServer()