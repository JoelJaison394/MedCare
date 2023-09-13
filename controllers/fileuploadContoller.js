import { vault, audit, PangeaErrors } from "../pangeaConfig.js";
import { prisma } from "../prismaConfig.js";
import logger from "../logger.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const MedicalRecord = mongoose.model("MedicalRecord", {
  title: String,
  description: String,
  pdfFile: { type: mongoose.Schema.Types.ObjectId, ref: "PdfFile" }, // Reference to PdfFile
  hospitalName: String,
  doctorName: String,
  doctorLicense: String,
  hospitalLicense: String,
  uploadedDate: { type: Date, default: Date.now },
  consultationDate: Date,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PdfFile = mongoose.model("PdfFile", {
  fileName: String,
  fileData: Buffer,
  medicalRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalRecord",
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const fileuploadController = {
  uploadMedicalRecord: async (req, res) => {
    try {
      mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      upload.single("file")(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ message: "File upload failed" });
        }
        const token = req.cookies.jwtToken;
        if (!token) {
          return res.status(401).json({ message: "Token not provided" });
        }

        const {
          title,
          description,
          hospitalName,
          doctorName,
          doctorLicense,
          hospitalLicense,
          consultationDate,
          patientId,
        } = req.body;
        console.log(title, description);

        const checkTokenResponse = await vault.jwtVerify(
          token,
          process.env.PANGEA_USERAUTH_JWTSECRECT
        );

        if (!checkTokenResponse.result.valid_signature) {
          return res.status(401).json({ message: "Invalid token signature" });
        }

        const Jwk = await vault.jwkGet(process.env.PANGEA_USERAUTH_JWTSECRECT);

        const publicKey = {
          alg: Jwk.result.keys[0].alg,
          crv: Jwk.result.keys[0].crv,
          kid: Jwk.result.keys[0].kid,
          x: Jwk.result.keys[0].x,
          y: Jwk.result.keys[0].y,
        };

        const decodedToken = jwt.decode(token, publicKey);

        const userId = decodedToken.userID;

        const pdfFileData = req.file.buffer;
        console.log(pdfFileData);

        const pdfFile = new PdfFile({
          fileName: req.file.originalname,
          fileData: pdfFileData,
        });

        await pdfFile.save();

        const medicalRecord = new MedicalRecord({
          title,
          description,
          pdfFiles: [pdfFile._id],
          hospitalName,
          doctorName,
          doctorLicense,
          hospitalLicense,
          consultationDate,
          patientId,
          uploadedBy: userId,
        });

        await medicalRecord.save();

        // const patient = await prisma.user.findUnique({
        //   where: { id: patientId },
        // });

        // console.log("before adding medical records", patient);

        // if (!patient) {
        //   return res.status(404).json({ message: "Patient not found" });
        // }

        // if (!patient.medicalRecords || patient.medicalRecords === null) {
        //    console.log("inside")
        //   patient.medicalRecords = [{ id: medicalRecord.id }];
        // } else {
        //   console.log("outside")
        //   patient.medicalRecords.push({ id: medicalRecord.id });
        // }

        // console.log("returned");

        // await prisma.user.update({
        //   where: { id: patientId },
        //   data: { medicalRecords: { set: patient.medicalRecords } },
        // });
        // console.log("updated");
        // const patient1 = await prisma.user.findUnique({
        //   where: { id: patientId },
        // });

        // console.log("after adding medical records", patient1);
        mongoose.connection.close();

        res
          .status(201)
          .json({ message: "Medical record uploaded successfully" });
      });
    } catch (error) {
      console.log(error);
      logger.error("Error while uploading medical record:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPdf: async (req, res) => {
    try {
      const pdfId = req.params.id;
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(pdfId);
      const pdfFile = await PdfFile.findById(pdfId);
      console.log(pdfFile);

      if (!pdfFile) {
        return res.status(404).json({ message: "PDF file not found" });
      }
      res.set({
        "Content-Type": "application/pdf", 
        "Content-Disposition": `inline; filename="${pdfFile.fileName}"`, 
      });
      res.send(pdfFile.fileData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getRecords: async (req , res) => {
    try {
      const userId = req.params.id; 
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const medicalRecords = await MedicalRecord.find({ patientId: userId });
      
      if (!medicalRecords) {
        return res.status(404).json({ message: "No medical records found for this user" });
      }
  
      // You can choose to send the list of medical records as a response
      res.status(200).json(medicalRecords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default fileuploadController;
