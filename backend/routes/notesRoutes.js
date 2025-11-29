import express from "express";
import multer from "multer";
import { generateNotes, getMyNotes } from "../controllers/notescontroller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer();

router.post("/generate",auth, upload.single("pdf"), generateNotes);
router.get("/my-notes", auth, async (req,res)=>{
  const notes = await Notes.find({userId: req.user.id});
  res.json(notes);
});
router.get("/my-notes", auth, getMyNotes);



export default router;
