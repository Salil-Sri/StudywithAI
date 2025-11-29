import {extractPDFText} from "../utils/pdfParser.js"
import { model } from "../utils/geminiClient.js"
import Notes from "../models/Notes.js"

export const generateNotes = async (req,res) =>{
    try{
        const fileBuffer = req.file.buffer;

        const text = await extractPDFText(fileBuffer);
         const prompt = `
      You are a study assistant.
      Analyze the following text and generate:
      1. A clean summary
      2. 5 Flashcards (Q&A)
      3. 5 MCQs with answer
      4. List of important keywords only 20 keywords

      TEXT STARTS NOW:
      ${text}
    `;

     const result = await model.generateContent(prompt);
     const output = result.response.text();

     const note = await  Notes.create({
        userId: req.user.id,
        title: req.file.originalname,
        content: output
     });

     res.json({
        success : true,
        data : note
     });

    }catch(error){
        res.status(500).json({
            success:false,
            error: error.message
        });
    }

}

export const getMyNotes = async (req, res) => {
  const notes = await Notes.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    notes
  });
};
