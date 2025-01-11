import multer from "multer"
import path from "path"
import { Request} from "express"
import fs from "fs"

const pathDir = path.resolve(__dirname, "../Uploads")
console.log(pathDir)
if (!fs.existsSync(pathDir))
{
  fs.mkdirSync(pathDir, {recursive: true})
  console.log("Criada com sucesso")
}

const storage = multer.diskStorage({
    destination: (req:Request, file:any, cb:any) =>{
        cb(null, pathDir)
    },
    filename: (req: Request, file:any, cb:any)=>
    {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
})

const fileFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Arquivo inválido. Apenas imagens são permitidas."), false);
    }
  };
  
  export const upload = multer({ storage, fileFilter });