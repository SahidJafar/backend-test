import multer, { type Multer } from "multer"
import path from "path"
import { type Request } from "express"

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, "../public/uploads"))
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload: Multer = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      throw new Error("Only images are allowed")
    } else {
      cb(null, true)
    }
  },
})

export default upload
